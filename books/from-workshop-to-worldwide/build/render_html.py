"""Render parsed blocks to HTML for the print PDF (WeasyPrint) and the EPUB."""
import html
import re

from manuscript import BOOK


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", s)
    s = s.replace('\\"', '"')
    return s


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def norm_label(l):
    l = l.strip()
    dollar = ""
    if l.endswith("$"):
        dollar, l = "$", l[:-1].rstrip()
    l = l.rstrip(":").rstrip()
    return l + ":", dollar


BOX_LABEL = {"tip": "Pro Tip", "example": "Example", "warning": "Important", "action": "Try This",
             "service": "For Service Providers", "product": "For Makers", "note": "Note"}


def render_block(b, ctx):
    t = b["t"]
    mode = ctx["mode"]  # "print" or "epub"
    if t == "p":
        return f"<p>{inline(b['text'])}</p>"
    if t == "h2":
        return f"<h2>{inline(b['text'])}</h2>"
    if t == "h3":
        return f"<h3>{inline(b['text'])}</h3>"
    if t == "ul":
        return "<ul>" + "".join(f"<li>{inline(i)}</li>" for i in b["items"]) + "</ul>"
    if t == "ol":
        return "<ol>" + "".join(f"<li>{inline(i)}</li>" for i in b["items"]) + "</ol>"
    if t == "quote":
        return f'<blockquote class="pull"><p>{inline(b["text"])}</p></blockquote>'
    if t == "figure":
        ctx["fig_n"] += 1
        src = ctx["fig_src"](b["id"])
        alt = html.escape(b["caption"] or b["id"])
        return (f'<figure class="fig" id="{b["id"]}"><img src="{src}" alt="{alt}"/>'
                f'<figcaption><span class="fignum">Figure {ctx["chap_label"]}{ctx["fig_n"]}</span> {inline(b["caption"])}</figcaption></figure>')
    if t == "box":
        label = BOX_LABEL.get(b["kind"], "Note")
        inner = "".join(render_block(c, ctx) for c in b["children"])
        title = f'<p class="box-title">{inline(b["title"])}</p>' if b["title"] else ""
        return f'<aside class="box box-{b["kind"]}"><p class="box-label">{label}</p>{title}{inner}</aside>'
    if t == "actions":
        items = "".join(f'<li><span class="cb"></span>{inline(i)}</li>' for i in b["items"])
        return f'<section class="actions"><p class="actions-title">Your Action Steps</p><ul class="checklist">{items}</ul></section>'
    if t == "worksheet":
        inner = "".join(render_block(c, ctx) for c in b["children"])
        sub = f'<p class="ws-sub">{inline(b["sub"])}</p>' if b["sub"] else ""
        note = ""
        if mode == "epub":
            note = '<p class="ws-epub-note">Copy this worksheet into your business notebook and complete it there.</p>'
        mark = f'<div class="chapmark" data-t="{html.escape(ctx.get("chap_title", ""))}"></div>' if mode == "print" else ""
        return (f'<section class="worksheet"><div class="ws-head"><p class="ws-label">Worksheet</p>'
                f'<h3 class="ws-title">{inline(b["title"])}</h3>{sub}</div>{note}{inner}</section>' + mark)
    if t == "field":
        lab, dollar = norm_label(b["label"])
        if mode == "epub":
            return f'<p class="field">{inline(lab)} {dollar}________________</p>'
        return f'<div class="field"><span class="fl">{inline(lab)}</span><span class="fv">{dollar}</span></div>'
    if t == "fieldrow":
        labs = [norm_label(l) for l in b["labels"]]
        if mode == "epub":
            return "".join(f'<p class="field">{inline(l)} {d}________________</p>' for l, d in labs)
        cells = "".join(f'<div class="field"><span class="fl">{inline(l)}</span><span class="fv">{d}</span></div>' for l, d in labs)
        return f'<div class="fieldrow n{len(labs)}">{cells}</div>'
    if t == "lines":
        if mode == "epub":
            return ""
        return '<div class="lines">' + '<div class="wl"></div>' * b["n"] + "</div>"
    if t == "check":
        return f'<p class="check"><span class="cb"></span>{inline(b["text"])}</p>'
    if t == "table":
        hdr = "".join(f"<th>{inline(h)}</th>" for h in b["headers"])
        body = ""
        rows = b["rows"]
        if mode == "epub" and not any(r[0] for r in rows):
            rows = rows[:3]
        for r in rows:
            first_is_label = bool(r[0])
            cells = "".join(f'<td class="{"lab" if (i == 0 and first_is_label) else ""}">{inline(c)}</td>' for i, c in enumerate(r))
            body += f"<tr>{cells}</tr>"
        cls = ("ws-table numbered" if b["numbered"] else "ws-table") + (" long" if len(rows) > 18 else "")
        ncol = len(b["headers"])
        return f'<table class="{cls} cols{ncol}"><thead><tr>{hdr}</tr></thead><tbody>{body}</tbody></table>'
    if t == "day":
        return (f'<div class="day"><div class="day-n"><span>Day</span>{b["n"]}</div><div class="day-body">'
                f'<p class="day-task">{inline(b["task"])}</p><p class="day-goal"><strong>Goal:</strong> {inline(b["goal"])}'
                f'{" <span class=\"day-ref\">· " + inline(b["ref"]) + "</span>" if b["ref"] else ""}</p></div></div>')
    if t == "month":
        return (f'<div class="day month"><div class="day-n"><span>Month</span>{b["n"]}</div><div class="day-body">'
                f'<p class="day-task">{inline(b["focus"])}</p><p class="day-goal">{inline(b["detail"])}</p></div></div>')
    if t == "template":
        paras, cur = [], []
        for ln in b["lines"] + [""]:
            if ln.strip():
                cur.append(inline(ln.strip()))
            elif cur:
                paras.append("<br/>".join(cur)); cur = []
        body = "".join(f"<p>{p}</p>" for p in paras)
        return f'<section class="template"><p class="tpl-label">Template</p><h3 class="tpl-title">{inline(b["title"])}</h3><div class="tpl-body">{body}</div></section>'
    if t == "pagebreak":
        return '<div class="pagebreak"></div>'
    raise ValueError(t)


def split_sections(blocks):
    """Group blocks into sections: each part/chapter/unnumbered heading starts a new one."""
    secs, cur = [], None
    for b in blocks:
        if b["t"] in ("part", "chapter", "unnumbered"):
            cur = {"head": b, "body": []}
            secs.append(cur)
        else:
            cur["body"].append(b)
    return secs


def section_id(head):
    if head["t"] == "part":
        return "part-" + slug(head["num"])
    if head["t"] == "chapter":
        return "chapter-" + head["num"]
    return slug(head["title"])
