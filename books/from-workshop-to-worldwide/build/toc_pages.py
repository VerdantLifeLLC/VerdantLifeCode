"""Read printed page numbers for each heading from a LibreOffice render of the docx (for the static Word TOC)."""
import json, re, subprocess, sys
from manuscript import load

pdf, out = sys.argv[1], sys.argv[2]
n = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout).group(1))
pages = []
for i in range(1, n + 1):
    t = subprocess.run(["pdftotext", "-f", str(i), "-l", str(i), "-layout", pdf, "-"], capture_output=True, text=True).stdout
    lines = [l.strip() for l in t.split("\n") if l.strip()]
    num = int(lines[-1]) if lines and lines[-1].isdigit() else None
    pages.append((re.sub(r"\s+", " ", " ".join(lines)), num))
# fill unnumbered pages (part openers) from the following page
for i in range(len(pages) - 2, -1, -1):
    if pages[i][1] is None and pages[i + 1][1] is not None:
        pages[i] = (pages[i][0], pages[i + 1][1] - 1)
norm = lambda s: re.sub(r"\s+", "", s.replace("’", "'"))
res, start = {}, 6
for b in load():
    if b["t"] == "part":
        key, pat = "p" + b["num"], "PART " + b["num"].upper() + " " + b["title"].upper()
    elif b["t"] == "chapter":
        key, pat = "c" + b["num"], "CHAPTER " + norm(b["title"])
    elif b["t"] == "unnumbered":
        key, pat = "u" + b["title"], norm(b["title"])
    else:
        continue
    for i in range(start, len(pages)):
        if norm(pages[i][0]).find(norm(pat)) != -1 and pages[i][1] is not None:
            res[key] = pages[i][1]; start = i; break
    else:
        print("not found", key)
json.dump(res, open(out, "w"), indent=1)
print(res)
