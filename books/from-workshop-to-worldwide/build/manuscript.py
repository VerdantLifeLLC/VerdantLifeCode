"""Parse the book's lightweight manuscript markup into a list of block dicts.

Markup summary (one directive per line):
  @part N | Title | Tagline | figure-id      @chapter N | Title       @unnumbered Title | figure-id
  ## H2   ### H3   - bullet   1. numbered    @figure id | caption     @quote text
  @box kind | Title ... @end                 @actions ... @end (one item per line)
  @worksheet Title | instructions ... @end   (inside: @field, @fieldrow a ; b, @lines n, @check, @table)
  @table H1 | H2 ; N [; numbered]   or   @table H1 | H2 ; rows: a / b / c
  @day n | task | goal | ref    @month n | focus | detail    @template Title ... @end
"""
import glob
import os
import re

BOOK = {
    "title": "From Workshop to Worldwide",
    "subtitle": "A Step-by-Step Guide to Building a Profitable Business From the Things You Make and the Services You Provide",
    "author": "The Skill Junky",
    "publisher": "Verdant Life LLC",
    "year": "2026",
}


def parse_table(spec):
    parts = [p.strip() for p in spec.split(";")]
    headers = [h.strip() for h in parts[0].split("|")]
    rows, numbered = [], False
    for p in parts[1:]:
        if p.startswith("rows:"):
            for lab in p[5:].split("/"):
                rows.append([lab.strip()] + [""] * (len(headers) - 1))
        elif p == "numbered":
            numbered = True
        elif p.isdigit():
            n = int(p)
            rows = [[""] * len(headers) for _ in range(n)]
    if numbered:
        for i, r in enumerate(rows):
            r[0] = str(i + 1)
    return {"t": "table", "headers": headers, "rows": rows, "numbered": numbered}


def parse_inner(lines):
    """Parse body lines (used for top level and inside boxes/worksheets)."""
    out, para = [], []

    def flush():
        if para:
            out.append({"t": "p", "text": " ".join(para)})
            para.clear()

    i = 0
    while i < len(lines):
        ln = lines[i].rstrip()
        s = ln.strip()
        if not s:
            flush()
            i += 1
            continue
        if s.startswith("@") and not s.startswith("@end"):
            flush()
            m = re.match(r"@(\w+)\s*(.*)", s)
            kind, rest = m.group(1), m.group(2)
            args = [a.strip() for a in rest.split("|")] if rest else []
            if kind in ("box", "worksheet", "actions", "template"):
                depth, j, body = 1, i + 1, []
                while j < len(lines):
                    t = lines[j].strip()
                    if re.match(r"@(box|worksheet|actions|template)\b", t):
                        depth += 1
                    if t == "@end":
                        depth -= 1
                        if depth == 0:
                            break
                    body.append(lines[j])
                    j += 1
                i = j + 1
                if kind == "box":
                    out.append({"t": "box", "kind": args[0], "title": args[1] if len(args) > 1 else "", "children": parse_inner(body)})
                elif kind == "worksheet":
                    out.append({"t": "worksheet", "title": args[0], "sub": args[1] if len(args) > 1 else "", "children": parse_inner(body)})
                elif kind == "actions":
                    out.append({"t": "actions", "items": [b.strip() for b in body if b.strip()]})
                else:
                    out.append({"t": "template", "title": rest.strip(), "lines": [b.rstrip() for b in body]})
                continue
            if kind == "part":
                out.append({"t": "part", "num": args[0], "title": args[1], "tagline": args[2], "fig": args[3] if len(args) > 3 else None})
            elif kind == "chapter":
                out.append({"t": "chapter", "num": args[0], "title": args[1]})
            elif kind == "unnumbered":
                out.append({"t": "unnumbered", "title": args[0], "fig": args[1] if len(args) > 1 else None})
            elif kind == "figure":
                out.append({"t": "figure", "id": args[0], "caption": args[1] if len(args) > 1 else ""})
            elif kind == "quote":
                out.append({"t": "quote", "text": rest})
            elif kind == "field":
                out.append({"t": "field", "label": rest})
            elif kind == "fieldrow":
                out.append({"t": "fieldrow", "labels": [x.strip() for x in rest.split(";")]})
            elif kind == "lines":
                out.append({"t": "lines", "n": int(rest)})
            elif kind == "check":
                out.append({"t": "check", "text": rest})
            elif kind == "table":
                out.append(parse_table(rest))
            elif kind == "day":
                out.append({"t": "day", "n": args[0], "task": args[1], "goal": args[2], "ref": args[3] if len(args) > 3 else ""})
            elif kind == "month":
                out.append({"t": "month", "n": args[0], "focus": args[1], "detail": args[2]})
            elif kind == "pagebreak":
                out.append({"t": "pagebreak"})
            else:
                raise ValueError("unknown directive " + kind)
            i += 1
            continue
        if s.startswith("### "):
            flush(); out.append({"t": "h3", "text": s[4:]}); i += 1; continue
        if s.startswith("## "):
            flush(); out.append({"t": "h2", "text": s[3:]}); i += 1; continue
        if s.startswith("- "):
            flush()
            items = []
            while i < len(lines) and lines[i].strip().startswith("- "):
                items.append(lines[i].strip()[2:]); i += 1
            out.append({"t": "ul", "items": items}); continue
        if re.match(r"\d+\. ", s):
            flush()
            items = []
            while i < len(lines) and (re.match(r"\d+\. ", lines[i].strip()) or (lines[i].strip() == "" and i + 1 < len(lines) and re.match(r"\d+\. ", lines[i + 1].strip()))):
                if lines[i].strip():
                    items.append(re.sub(r"^\d+\. ", "", lines[i].strip()))
                i += 1
            out.append({"t": "ol", "items": items}); continue
        para.append(s)
        i += 1
    flush()
    return out


def reorder_actions(blocks):
    """Within each chapter, move the action-step checklist ahead of the worksheets."""
    out, i = [], 0
    while i < len(blocks):
        b = blocks[i]
        if b["t"] == "worksheet":
            j = i
            ws = []
            while j < len(blocks) and blocks[j]["t"] == "worksheet":
                ws.append(blocks[j]); j += 1
            if j < len(blocks) and blocks[j]["t"] == "actions":
                out.append(blocks[j]); j += 1
            out.extend(ws)
            i = j
            continue
        out.append(b)
        i += 1
    return out


def load(mdir=None):
    mdir = mdir or os.path.join(os.path.dirname(__file__), "..", "manuscript")
    lines = []
    for f in sorted(glob.glob(os.path.join(mdir, "*.txt"))):
        lines += open(f, encoding="utf-8").read().split("\n") + [""]
    return reorder_actions(parse_inner(lines))


if __name__ == "__main__":
    import json, collections
    bl = load()
    print(collections.Counter(b["t"] for b in bl))
    print(sum(1 for b in bl if b["t"] == "worksheet"), "worksheets")
