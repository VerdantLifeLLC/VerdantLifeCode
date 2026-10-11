"""Build the Kindle / KDP eBook as EPUB 3 (with EPUB 2 NCX for older readers)."""
import datetime
import html
import os
import uuid
import zipfile

from manuscript import BOOK, load
from render_html import inline, render_block, section_id, split_sections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "output", "eBook-From-Workshop-to-Worldwide.epub")
PNG = os.path.join(HERE, "_png_epub")
COVER = os.path.join(ROOT, "output", "Cover-eBook-1600x2560.jpg")
BOOK_ID = "urn:uuid:" + str(uuid.uuid5(uuid.NAMESPACE_URL, "verdantlife/from-workshop-to-worldwide"))

CSS = """
@charset "utf-8";
body { font-family: serif; line-height: 1.5; margin: 0 2%; color: #26302B; }
p { margin: 0 0 0.7em 0; text-indent: 0; }
h1, h2, h3 { font-family: sans-serif; color: #1F4D3A; line-height: 1.25; page-break-after: avoid; }
h1 { font-size: 1.7em; margin: 0.4em 0 0.2em; }
h2 { font-size: 1.3em; margin: 1.4em 0 0.5em; }
h3 { font-size: 1.08em; margin: 1.1em 0 0.4em; color: #2F6B4F; }
.chap-num { font-family: sans-serif; font-size: 0.8em; letter-spacing: 0.2em; text-transform: uppercase; color: #C0703A; margin: 1.5em 0 0; font-weight: bold; }
.chap-num b { display: block; font-size: 2.6em; letter-spacing: 0; color: #E8C48A; line-height: 1.1; }
.rule { border-top: 3px solid #C0703A; width: 3em; margin: 0.6em 0 1.2em; }
.lead { font-size: 1.12em; color: #1F4D3A; }
.part { text-align: center; margin-top: 3em; }
.part .part-num { font-family: sans-serif; letter-spacing: 0.3em; color: #C0703A; font-weight: bold; text-transform: uppercase; }
.part h1 { font-size: 2.1em; text-transform: uppercase; }
.part .rule { margin: 0.6em auto 1em; }
.part .part-tag { font-style: italic; }
.part img { width: 85%; margin-top: 1.5em; }
img { max-width: 100%; }
.chap-fig { width: 100%; margin-bottom: 1em; }
figure.fig { margin: 1.4em 0; text-align: center; page-break-inside: avoid; }
figure.fig img { width: 100%; }
figcaption { font-size: 0.85em; font-style: italic; color: #6E7A73; text-align: left; margin-top: 0.4em; border-left: 3px solid #C0703A; padding-left: 0.6em; }
.fignum { font-family: sans-serif; font-style: normal; font-weight: bold; font-size: 0.8em; letter-spacing: 0.1em; text-transform: uppercase; color: #1F4D3A; }
blockquote.pull { margin: 1.5em 1em; padding-left: 1em; border-left: 4px solid #C0703A; }
blockquote.pull p { font-size: 1.2em; font-style: italic; font-weight: bold; color: #1F4D3A; }
aside.box { display: block; margin: 1.2em 0; padding: 0.8em 1em 0.3em; background-color: #F7F1E3; border-left: 5px solid #C0703A; page-break-inside: avoid; }
aside.box-example, aside.box-service { background-color: #EEF5EE; border-left-color: #2F6B4F; }
.box-label { font-family: sans-serif; font-size: 0.7em; letter-spacing: 0.18em; text-transform: uppercase; color: #C0703A; font-weight: bold; margin-bottom: 0.2em; }
aside.box-example .box-label { color: #2F6B4F; }
.box-title { font-family: sans-serif; font-weight: bold; color: #1F4D3A; }
section.actions { margin: 1.6em 0; padding: 0.8em 1em; border: 2px solid #1F4D3A; }
.actions-title { font-family: sans-serif; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase; color: #1F4D3A; }
ul.checklist { list-style: none; padding-left: 0.2em; margin-left: 0; }
ul.checklist li { margin-bottom: 0.4em; }
.cb { display: inline-block; width: 0.8em; height: 0.8em; border: 2px solid #1F4D3A; margin-right: 0.5em; vertical-align: -0.1em; }
section.worksheet { margin: 2em 0; page-break-before: always; }
.ws-head { background-color: #1F4D3A; color: #FFFFFF; padding: 0.7em 1em; border-bottom: 4px solid #C0703A; }
.ws-label { font-family: sans-serif; font-size: 0.7em; letter-spacing: 0.24em; text-transform: uppercase; color: #E8C48A; margin: 0; font-weight: bold; }
h3.ws-title { color: #FFFFFF; margin: 0.15em 0; font-size: 1.15em; }
.ws-sub { font-style: italic; color: #DCEBDD; margin: 0; }
.ws-epub-note { font-size: 0.85em; font-style: italic; color: #6E7A73; margin-top: 0.6em; }
p.field { font-family: sans-serif; font-size: 0.92em; }
p.check { font-family: sans-serif; font-size: 0.92em; }
table.ws-table { border-collapse: collapse; width: 100%; margin: 0.6em 0 1.2em; font-family: sans-serif; font-size: 0.78em; }
table.ws-table th { background-color: #DCEBDD; color: #1F4D3A; text-align: left; padding: 0.3em; border: 1px solid #9AA59F; }
table.ws-table td { border: 1px solid #9AA59F; padding: 0.3em; height: 1.4em; }
td.lab { font-weight: bold; background-color: #FAF7EF; }
.day { margin: 0 0 0.9em; padding-bottom: 0.6em; border-bottom: 1px solid #E4E7E2; page-break-inside: avoid; }
.day-n { font-family: sans-serif; font-weight: bold; color: #FFFFFF; background-color: #1F4D3A; display: inline-block; padding: 0.15em 0.6em; margin-bottom: 0.3em; }
.month .day-n { background-color: #C0703A; }
.day-n span { font-size: 0.75em; letter-spacing: 0.15em; text-transform: uppercase; margin-right: 0.4em; }
.day-task { font-weight: bold; margin: 0 0 0.2em; }
.day-goal { color: #2F6B4F; font-size: 0.92em; margin: 0; }
.day-ref { color: #6E7A73; font-style: italic; }
section.template { margin: 1.3em 0; padding: 0.7em 1em 0.2em; border: 1px solid #8DB596; background-color: #FCFAF5; page-break-inside: avoid; }
.tpl-label { font-family: sans-serif; font-size: 0.68em; letter-spacing: 0.2em; text-transform: uppercase; color: #C0703A; margin: 0; font-weight: bold; }
h3.tpl-title { margin: 0.1em 0 0.5em; }
.tpl-body p { font-size: 0.95em; }
.pagebreak { page-break-before: always; }
.center { text-align: center; }
.titlepage { text-align: center; margin-top: 2em; }
.titlepage .t1 { font-family: sans-serif; font-size: 2.2em; font-weight: bold; text-transform: uppercase; color: #1F4D3A; line-height: 1.1; }
.titlepage .sub { font-style: italic; font-size: 1.1em; }
.titlepage .auth { font-family: sans-serif; letter-spacing: 0.15em; text-transform: uppercase; font-weight: bold; color: #1F4D3A; margin-top: 1.5em; }
.titlepage .pub { font-family: sans-serif; font-size: 0.8em; letter-spacing: 0.2em; text-transform: uppercase; color: #6E7A73; margin-top: 2em; }
.copyright p { font-size: 0.82em; }
.dedication { text-align: center; font-style: italic; margin-top: 4em; color: #1F4D3A; font-size: 1.1em; }
nav#toc ol { list-style: none; padding-left: 0; }
nav#toc li { margin: 0.3em 0; }
nav#toc li.p { margin-top: 1em; font-family: sans-serif; font-weight: bold; color: #C0703A; text-transform: uppercase; font-size: 0.85em; letter-spacing: 0.08em; }
nav#toc a { text-decoration: none; color: #26302B; }
nav#toc li.p a { color: #C0703A; }
"""


def xhtml(title, body, epub_type=""):
    et = f' epub:type="{epub_type}"' if epub_type else ""
    return (f'<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
            f'<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">'
            f'<head><meta charset="utf-8"/><title>{html.escape(title)}</title><link rel="stylesheet" type="text/css" href="../css/book.css"/></head>'
            f'<body{et}>{body}</body></html>')


def fix_void(s):
    """Make HTML fragments XHTML-safe."""
    return s.replace("<br/>", "<br />").replace("&#160;", "&#160;")


def main():
    blocks = load()
    secs = split_sections(blocks)
    figs_used = set()

    def fig_src(fid):
        figs_used.add(fid)
        return f"../images/{fid}.png"

    files = []  # (id, filename, title, xhtml, nav_class)
    b = BOOK
    files.append(("cover", "cover.xhtml", "Cover", xhtml("Cover", '<div class="center"><img src="../images/cover.jpg" alt="Cover of From Workshop to Worldwide by The Skill Junky" style="max-width:100%;height:auto"/></div>', "cover"), None))
    figs_used.add("fig-final")
    files.append(("titlepage", "title.xhtml", "Title Page", xhtml("Title Page", f'<section class="titlepage" epub:type="titlepage"><p class="t1">From Workshop<br />to Worldwide</p><div class="rule" style="margin:0.8em auto"></div><p class="sub">{b["subtitle"]}</p><p><img src="../images/fig-final.png" alt="A small workshop with a road leading to the world" style="width:80%"/></p><p class="auth">{b["author"]}</p><p class="pub">{b["publisher"]}</p></section>'), None))
    copyright_body = f"""<section class="copyright" epub:type="copyright-page"><p><strong>{b['title']}</strong></p><p>{b['subtitle']}</p>
<p>Copyright © {b['year']} by {b['author']}. All rights reserved.</p><p>Published by {b['publisher']}.</p>
<p>No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means — electronic, mechanical, photocopying, recording, or otherwise — without prior written permission from the publisher, except for brief quotations in reviews. Purchasers may reproduce the worksheets and templates for use in their own business.</p>
<p><strong>Disclaimer:</strong> This book is designed to provide general information and practical guidance about starting and running a small business. It is sold with the understanding that the author and publisher are not providing legal, tax, accounting, or financial advice. Laws, regulations, platform policies, and fees vary by location and change over time; consult qualified professionals and official sources for advice specific to your situation. Results vary, and no particular level of income is promised. The example entrepreneurs in this book, Maya and Marcus, are illustrative composites, not real individuals.</p>
<p>Product and company names mentioned in this book are the trademarks of their respective owners. Their mention does not imply endorsement by, or affiliation with, the author or publisher.</p>
<p>Illustrations created for this book.</p><p>First Edition, {b['year']}</p></section>"""
    files.append(("copyright", "copyright.xhtml", "Copyright", xhtml("Copyright", copyright_body), None))
    files.append(("dedication", "dedication.xhtml", "Dedication", xhtml("Dedication", '<section class="dedication" epub:type="dedication"><p>For everyone who has ever been told,<br />“You should sell these,”<br />or “You should charge for that” —<br />and is finally ready to do it.</p></section>'), None))

    toc_items = []
    for s in secs:
        h = s["head"]
        if h["t"] == "unnumbered" and h["title"] == "Notes":
            continue  # writing page is for the paperback only
        sid = section_id(h)
        ctx = {"mode": "epub", "fig_n": 0, "chap_label": "", "fig_src": fig_src}
        if h["t"] == "part":
            img = f'<img src="{fig_src(h["fig"])}" alt="Part {h["num"]} illustration"/>' if h.get("fig") else ""
            body = (f'<section class="part" epub:type="part" id="{sid}"><p class="part-num">Part {h["num"]}</p><h1>{inline(h["title"])}</h1>'
                    f'<div class="rule"></div><p class="part-tag">{inline(h["tagline"])}</p>{img}</section>')
            title = f'Part {h["num"]}: {h["title"]}'
            files.append((sid, sid + ".xhtml", title, xhtml(title, body), "p"))
            continue
        if h["t"] == "chapter":
            ctx["chap_label"] = h["num"] + "."
            head = f'<p class="chap-num"><b>{h["num"]}</b>Chapter</p><h1>{inline(h["title"])}</h1><div class="rule"></div>'
            title = f'Chapter {h["num"]}: {h["title"]}'
        else:
            fig = f'<img class="chap-fig" src="{fig_src(h["fig"])}" alt=""/>' if h.get("fig") else ""
            head = f'<h1>{inline(h["title"])}</h1><div class="rule"></div>{fig}'
            title = h["title"]
        parts, lead = [], True
        for blk in s["body"]:
            if lead and blk["t"] == "p":
                parts.append(f'<p class="lead">{inline(blk["text"])}</p>')
            else:
                parts.append(render_block(blk, ctx))
            lead = False
        body = f'<section epub:type="chapter" id="{sid}">{head}{"".join(parts)}</section>'
        files.append((sid, sid + ".xhtml", title, xhtml(title, fix_void(body)), "c" if h["t"] == "chapter" else "u"))

    # navigation document (also used as the in-book table of contents)
    lis = []
    for fid, fn, title, _, cls in files:
        if cls:
            lis.append(f'<li class="{cls}"><a href="{fn}">{html.escape(title)}</a></li>')
    nav = xhtml("Contents", f'<nav epub:type="toc" id="toc"><h1>Contents</h1><ol>{"".join(lis)}</ol></nav>'
                f'<nav epub:type="landmarks" hidden=""><ol><li><a epub:type="cover" href="cover.xhtml">Cover</a></li>'
                f'<li><a epub:type="toc" href="nav.xhtml">Contents</a></li><li><a epub:type="bodymatter" href="introduction.xhtml">Start Reading</a></li></ol></nav>')
    files.insert(4, ("nav", "nav.xhtml", "Contents", nav, None))

    # NCX
    np = []
    order = 0
    for fid, fn, title, _, cls in files:
        if cls or fid in ("nav",):
            order += 1
            np.append(f'<navPoint id="np{order}" playOrder="{order}"><navLabel><text>{html.escape(title)}</text></navLabel><content src="text/{fn}"/></navPoint>')
    ncx = (f'<?xml version="1.0" encoding="utf-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head>'
           f'<meta name="dtb:uid" content="{BOOK_ID}"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head>'
           f'<docTitle><text>{html.escape(b["title"])}</text></docTitle><navMap>{"".join(np)}</navMap></ncx>')

    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    manifest = ['<item id="css" href="css/book.css" media-type="text/css"/>', '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
                '<item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>']
    for fid in sorted(figs_used):
        manifest.append(f'<item id="img-{fid}" href="images/{fid}.png" media-type="image/png"/>')
    spine = []
    for fid, fn, title, _, cls in files:
        props = ' properties="nav"' if fid == "nav" else ""
        manifest.append(f'<item id="{fid}" href="text/{fn}" media-type="application/xhtml+xml"{props}/>')
        spine.append(f'<itemref idref="{fid}"{" linear=\"yes\"" if fid != "cover" else ""}/>')
    desc = ("A practical, step-by-step guide to turning the products you make and the services you provide into a profitable business — "
            "with worksheets, templates, a 30-day launch plan, and a first-year success plan.")
    opf = (f'<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="en">'
           f'<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="bookid">{BOOK_ID}</dc:identifier>'
           f'<dc:title>{html.escape(b["title"])}</dc:title><dc:creator id="author">{html.escape(b["author"])}</dc:creator>'
           f'<dc:publisher>{html.escape(b["publisher"])}</dc:publisher><dc:language>en</dc:language><dc:date>{b["year"]}</dc:date>'
           f'<dc:description>{html.escape(desc)}</dc:description><dc:subject>Business &amp; Economics / Small Business</dc:subject>'
           f'<dc:subject>Business &amp; Economics / Entrepreneurship</dc:subject><dc:rights>Copyright © {b["year"]} {html.escape(b["author"])}</dc:rights>'
           f'<meta property="dcterms:modified">{now}</meta><meta name="cover" content="cover-image"/></metadata>'
           f'<manifest>{"".join(manifest)}</manifest><spine toc="ncx">{"".join(spine)}</spine>'
           f'<guide><reference type="cover" title="Cover" href="text/cover.xhtml"/><reference type="toc" title="Contents" href="text/nav.xhtml"/>'
           f'<reference type="text" title="Start Reading" href="text/introduction.xhtml"/></guide></package>')
    container = ('<?xml version="1.0" encoding="utf-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">'
                 '<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
    with zipfile.ZipFile(OUT, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", container, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/content.opf", opf, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/toc.ncx", ncx, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/css/book.css", CSS, compress_type=zipfile.ZIP_DEFLATED)
        z.write(COVER, "OEBPS/images/cover.jpg", compress_type=zipfile.ZIP_STORED)
        for fid in sorted(figs_used):
            z.write(os.path.join(PNG, fid + ".png"), f"OEBPS/images/{fid}.png", compress_type=zipfile.ZIP_STORED)
        for fid, fn, title, x, cls in files:
            z.writestr(f"OEBPS/text/{fn}", x, compress_type=zipfile.ZIP_DEFLATED)
    print("wrote", OUT, f"{os.path.getsize(OUT) / 1e6:.1f} MB", len(files), "files")


if __name__ == "__main__":
    main()
