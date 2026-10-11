"""Build the KDP 8.5 x 11 in paperback interior PDF (color and black & white) with WeasyPrint.

usage: python3 build_print.py [color|bw|both]
"""
import os
import sys

from weasyprint import HTML

from manuscript import BOOK, load
from render_html import inline, render_block, section_id, split_sections
from svglib import to_gray

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FONTS = os.path.join(ROOT, "fonts")
ILL = os.path.join(ROOT, "illustrations")
OUT = os.path.join(ROOT, "output")

CSS = r"""
@font-face { font-family: "SS4"; src: url("FONTS/SourceSerif4-Regular.ttf"); font-weight: 400; font-style: normal; }
@font-face { font-family: "SS4"; src: url("FONTS/SourceSerif4-Italic.ttf"); font-weight: 400; font-style: italic; }
@font-face { font-family: "SS4"; src: url("FONTS/SourceSerif4-SemiBold.ttf"); font-weight: 600; font-style: normal; }
@font-face { font-family: "SS4"; src: url("FONTS/SourceSerif4-Bold.ttf"); font-weight: 700; font-style: normal; }
@font-face { font-family: "SS4"; src: url("FONTS/SourceSerif4-BoldItalic.ttf"); font-weight: 700; font-style: italic; }
@font-face { font-family: "MS"; src: url("FONTS/Montserrat-Regular.ttf"); font-weight: 400; }
@font-face { font-family: "Montserrat"; src: url("FONTS/Montserrat-Regular.ttf"); font-weight: 400; }
@font-face { font-family: "Montserrat"; src: url("FONTS/Montserrat-Medium.ttf"); font-weight: 500; }
@font-face { font-family: "Montserrat"; src: url("FONTS/Montserrat-SemiBold.ttf"); font-weight: 600; }
@font-face { font-family: "Montserrat"; src: url("FONTS/Montserrat-Bold.ttf"); font-weight: 700; }
@font-face { font-family: "Montserrat"; src: url("FONTS/Montserrat-ExtraBold.ttf"); font-weight: 800; }
@font-face { font-family: "Montserrat"; src: url("FONTS/Montserrat-Black.ttf"); font-weight: 900; }
@font-face { font-family: "Source Serif 4"; src: url("FONTS/SourceSerif4-Regular.ttf"); font-weight: 400; }
@font-face { font-family: "Source Serif 4"; src: url("FONTS/SourceSerif4-Italic.ttf"); font-weight: 400; font-style: italic; }
@font-face { font-family: "Source Serif 4"; src: url("FONTS/SourceSerif4-Bold.ttf"); font-weight: 700; }
@font-face { font-family: "Source Serif 4"; src: url("FONTS/SourceSerif4-BoldItalic.ttf"); font-weight: 700; font-style: italic; }
@font-face { font-family: "MS"; src: url("FONTS/Montserrat-Medium.ttf"); font-weight: 500; }
@font-face { font-family: "MS"; src: url("FONTS/Montserrat-SemiBold.ttf"); font-weight: 600; }
@font-face { font-family: "MS"; src: url("FONTS/Montserrat-Bold.ttf"); font-weight: 700; }
@font-face { font-family: "MS"; src: url("FONTS/Montserrat-ExtraBold.ttf"); font-weight: 800; }
@font-face { font-family: "MS"; src: url("FONTS/Montserrat-Black.ttf"); font-weight: 900; }

@page {
  size: 8.5in 11in;
  margin: 0.85in 0.75in 0.85in 0.875in;
  @bottom-center { content: none; }
}
@page :left {
  margin-left: 0.75in; margin-right: 0.875in;
  @top-left { content: string(booktitle, first-except); font: 600 7.5pt "MS"; letter-spacing: 0.14em; text-transform: uppercase; color: #6E7A73; vertical-align: bottom; padding-bottom: 0.18in; }
  @bottom-left { content: counter(page); font: 600 9pt "MS"; color: #1F4D3A; vertical-align: top; padding-top: 0.2in; }
}
@page :right {
  margin-left: 0.875in; margin-right: 0.75in;
  @top-right { content: string(chap, first-except); font: 600 7.5pt "MS"; letter-spacing: 0.14em; text-transform: uppercase; color: #6E7A73; vertical-align: bottom; padding-bottom: 0.18in; }
  @bottom-right { content: counter(page); font: 600 9pt "MS"; color: #1F4D3A; vertical-align: top; padding-top: 0.2in; }
}
@page :first { counter-reset: page PAGERESET; }
@page front:left { @top-left { content: none; } @bottom-left { content: none; } }
@page front:right { @top-right { content: none; } @bottom-right { content: none; } }
@page nonum:left { @top-left { content: none; } @bottom-left { content: none; } }
@page nonum:right { @top-right { content: none; } @bottom-right { content: none; } }
@page partpage:left { @top-left { content: none; } @bottom-left { content: none; } }
@page partpage:right { @top-right { content: none; } @bottom-right { content: none; } }
@page :blank { @top-left { content: none; } @top-right { content: none; } @bottom-left { content: none; } @bottom-right { content: none; } }

html { font-family: "SS4"; font-size: 11pt; line-height: 1.52; color: #26302B; }
body { margin: 0; }
p { margin: 0 0 0.62em 0; orphans: 2; widows: 2; hyphens: none; }
strong { font-weight: 700; }
h1, h2, h3, .ws-title, .tpl-title { font-family: "MS"; color: #1F4D3A; break-after: avoid; }
h2 { font-size: 15pt; font-weight: 800; margin: 1.35em 0 0.5em; line-height: 1.25; }
h3 { font-size: 11.5pt; font-weight: 700; margin: 1.1em 0 0.35em; color: #2F6B4F; }
ul, ol { margin: 0.2em 0 0.85em 0; padding-left: 1.5em; }
li { margin: 0 0 0.3em 0; }
ul li::marker { color: #C0703A; }
ol li::marker { color: #C0703A; font-family: "MS"; font-weight: 700; font-size: 10pt; }

/* ---------- front matter ---------- */
.halftitle, .titlepage, .copyright, .dedication { page: nonum; break-before: right; }
.copyright { break-before: left; }
.halftitle { padding-top: 2.6in; text-align: center; }
.halftitle .t { font: 800 26pt "MS"; color: #1F4D3A; letter-spacing: 0.02em; text-transform: uppercase; }
.halftitle .rule { width: 1.2in; height: 3px; background: #C0703A; margin: 0.25in auto; }
.titlepage { text-align: center; padding-top: 1.1in; height: 8.9in; position: relative; }
.titlepage .t1 { font: 900 40pt/1.02 "MS"; color: #1F4D3A; text-transform: uppercase; letter-spacing: 0.01em; margin: 0; }
.titlepage .rule { width: 1.4in; height: 4px; background: #C0703A; margin: 0.32in auto; }
.titlepage .sub { font: italic 400 15pt/1.4 "SS4"; color: #26302B; max-width: 5.4in; margin: 0 auto; }
.titlepage .art { width: 4.6in; margin: 0.45in auto 0; display: block; }
.titlepage .auth { font: 800 15pt "MS"; color: #1F4D3A; letter-spacing: 0.16em; text-transform: uppercase; margin-top: 0.4in; }
.titlepage .pub { position: absolute; bottom: 0; left: 0; right: 0; font: 700 9pt "MS"; color: #6E7A73; letter-spacing: 0.24em; text-transform: uppercase; }
.titlepage .pub .leaf { color: #2F6B4F; }
.copyright { font-size: 8.6pt; line-height: 1.5; padding-top: 4.1in; color: #26302B; }
.copyright p { margin-bottom: 0.75em; }
.copyright .ct { font: 700 9.5pt "MS"; color: #1F4D3A; }
.dedication { padding-top: 3in; text-align: center; font: italic 400 14pt/1.6 "SS4"; color: #1F4D3A; }
.dedication .orn { font: 400 18pt "MS"; color: #C0703A; margin-top: 0.3in; }

/* ---------- table of contents ---------- */
nav.toc { page: front; break-before: right; }
nav.toc h1 { font: 900 26pt "MS"; text-transform: uppercase; color: #1F4D3A; margin: 0.3in 0 0.08in; letter-spacing: 0.02em; }
nav.toc .rule { width: 1in; height: 3px; background: #C0703A; margin-bottom: 0.3in; }
nav.toc ol { list-style: none; padding: 0; margin: 0; }
nav.toc li { margin: 0; }
nav.toc a { color: inherit; text-decoration: none; }
nav.toc li.t-part { font: 800 9pt "MS"; letter-spacing: 0.14em; text-transform: uppercase; color: #C0703A; margin: 0.2in 0 0.05in; }
nav.toc li.t-part a::after { content: leader(" ") target-counter(attr(href), page); color: #C0703A; }
nav.toc li.t-chap, nav.toc li.t-un { font: 400 11pt "SS4"; padding: 0.035in 0; }
nav.toc li.t-chap a::after, nav.toc li.t-un a::after { content: leader(".") target-counter(attr(href), page); font-family: "MS"; font-size: 9.5pt; font-weight: 600; color: #1F4D3A; }
nav.toc .cn { display: inline-block; width: 0.36in; font: 700 9.5pt "MS"; color: #2F6B4F; }
nav.toc li.t-un { font-style: italic; }

/* ---------- main matter ---------- */
section.part { page: partpage; break-before: right; text-align: center; padding-top: 0.9in; }
section.part .part-num { font: 800 11pt "MS"; letter-spacing: 0.3em; text-transform: uppercase; color: #C0703A; }
section.part h1 { font: 900 38pt/1.05 "MS"; text-transform: uppercase; margin: 0.15in 0 0.18in; string-set: chap content(), booktitle "From Workshop to Worldwide"; }
section.part .rule { width: 1.1in; height: 4px; background: #C0703A; margin: 0 auto 0.25in; }
section.part .part-tag { font: italic 400 14pt/1.5 "SS4"; max-width: 5in; margin: 0 auto; color: #26302B; }
section.part img { width: 5.4in; margin-top: 0.45in; }
section.part .part-contents { margin: 0.35in auto 0; width: 4.2in; text-align: left; font: 600 10pt "MS"; color: #2F6B4F; border-top: 1px solid #DCEBDD; padding-top: 0.12in; }
section.part .part-contents div { padding: 0.03in 0; }
section.part .part-contents span { color: #C0703A; display: inline-block; width: 0.95in; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; font-size: 8.5pt; }

section.chapter, section.unnumbered { break-before: page; }
section.unnumbered.recto { break-before: right; }
.chap-head { margin: 0.15in 0 0.32in; }
.chap-head .chap-num { font: 800 10pt "MS"; letter-spacing: 0.3em; text-transform: uppercase; color: #C0703A; margin: 0 0 0.06in; }
.chap-head .chap-num b { font: 900 54pt/1 "MS"; letter-spacing: 0; color: #E8C48A; display: block; margin-bottom: 0.02in; }
.chap-head h1 { font: 900 26pt/1.12 "MS"; margin: 0; color: #1F4D3A; string-set: chap content(), booktitle "From Workshop to Worldwide"; }
.chap-head .rule { width: 0.9in; height: 4px; background: #C0703A; margin-top: 0.18in; }
.chap-head + p, .chap-fig + p { font-size: 12.5pt; line-height: 1.5; color: #1F4D3A; }
.chap-fig { width: 100%; margin: 0 0 0.25in; }

figure.fig { margin: 0.25in 0 0.3in; break-inside: avoid; text-align: center; }
figure.fig img { max-width: 100%; max-height: 3.7in; }
figure.fig figcaption { font: italic 400 9.5pt/1.4 "SS4"; color: #6E7A73; margin-top: 0.1in; text-align: left; border-left: 3px solid #C0703A; padding-left: 0.12in; }
figure.fig .fignum { font: 700 8pt "MS"; font-style: normal; letter-spacing: 0.12em; text-transform: uppercase; color: #1F4D3A; margin-right: 0.06in; }

blockquote.pull { margin: 0.3in 0.3in; padding: 0.12in 0 0.12in 0.25in; border-left: 5px solid #C0703A; break-inside: avoid; }
blockquote.pull p { font: italic 600 15pt/1.4 "SS4"; color: #1F4D3A; margin: 0; }

aside.box { margin: 0.2in 0 0.25in; padding: 0.16in 0.22in 0.08in; border-radius: 6pt; break-inside: avoid; background: #F7F1E3; border-left: 5px solid #C0703A; }
aside.box p { font-size: 10.3pt; line-height: 1.5; }
aside.box .box-label { font: 800 7.5pt "MS"; letter-spacing: 0.2em; text-transform: uppercase; color: #C0703A; margin: 0 0 0.03in; }
aside.box .box-title { font: 800 11.5pt "MS"; color: #1F4D3A; margin: 0 0 0.08in; }
aside.box-example { background: #EEF5EE; border-left-color: #2F6B4F; }
aside.box-example .box-label { color: #2F6B4F; }
aside.box-warning { background: #FBF3EC; border-left-color: #C0703A; }
aside.box-service { background: #EEF5EE; border-left-color: #1F4D3A; }

section.actions { margin: 0.35in 0 0.1in; padding: 0.18in 0.24in 0.1in; border: 2px solid #1F4D3A; border-radius: 6pt; break-inside: avoid; }
.actions-title { font: 800 11pt "MS"; letter-spacing: 0.14em; text-transform: uppercase; color: #1F4D3A; margin-bottom: 0.1in !important; }
ul.checklist { list-style: none; padding: 0; margin: 0 0 0.05in; }
ul.checklist li { padding-left: 0.32in; position: relative; margin-bottom: 0.08in; font-size: 10.5pt; }
.cb { display: inline-block; width: 0.15in; height: 0.15in; border: 1.4pt solid #1F4D3A; border-radius: 2pt; vertical-align: -0.02in; margin-right: 0.12in; }
ul.checklist li .cb { position: absolute; left: 0; top: 0.03in; }

/* ---------- worksheets ---------- */
section.worksheet { break-before: page; string-set: chap "Worksheet"; }
.ws-head { background: #1F4D3A; color: white; padding: 0.14in 0.24in 0.12in; border-radius: 6pt 6pt 0 0; margin-bottom: 0.14in; border-bottom: 5px solid #C0703A; }
.ws-label { font: 800 7.5pt "MS"; letter-spacing: 0.26em; text-transform: uppercase; color: #E8C48A; margin: 0 0 0.02in; }
section.worksheet h3.ws-title { color: white; text-transform: none; letter-spacing: 0; border: none; padding: 0; font-size: 16pt; font-weight: 800; margin: 0 0 0.04in; }
.ws-sub { font: italic 400 10pt "SS4"; color: #DCEBDD; margin: 0; }
section.worksheet h3 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.08em; color: #2F6B4F; margin: 0.16in 0 0.05in; border-bottom: 1px solid #DCEBDD; padding-bottom: 0.03in; }
section.worksheet > p { font-size: 10.3pt; }
.field { display: flex; align-items: flex-end; margin: 0 0 0.07in; min-height: 0.27in; }
.field .fl { font: 600 9.5pt "MS"; color: #26302B; white-space: nowrap; margin-right: 0.08in; }
.field .fv { flex: 1; border-bottom: 1px solid #6E7A73; font: 600 9.5pt "MS"; color: #6E7A73; padding-left: 0.04in; min-height: 0.22in; }
.fieldrow { display: flex; gap: 0.25in; }
.fieldrow .field { flex: 1; }
.lines .wl { height: 0.34in; border-bottom: 1px solid #9AA59F; }
.lines { margin-bottom: 0.15in; }
p.check { font: 500 10pt "MS"; margin: 0 0 0.11in; }
table.ws-table { width: 100%; border-collapse: collapse; margin: 0.06in 0 0.2in; font: 500 8.8pt "MS"; }
table.ws-table th { background: #DCEBDD; color: #1F4D3A; font-weight: 800; text-align: left; padding: 0.06in 0.07in; border: 1px solid #9AA59F; font-size: 8pt; letter-spacing: 0.04em; text-transform: uppercase; vertical-align: bottom; }
table.ws-table td { border: 1px solid #9AA59F; height: 0.29in; padding: 0.02in 0.07in; vertical-align: middle; }
table.ws-table td.lab { font-weight: 600; color: #26302B; background: #FAF7EF; }
table.ws-table.numbered td:first-child { width: 0.36in; text-align: center; color: #6E7A73; font-weight: 700; background: #FAF7EF; }
table.ws-table.cols2 td.lab { width: 55%; }
table.ws-table thead { display: table-header-group; }
table.ws-table.long td { height: 0.245in; padding-top: 0; padding-bottom: 0; }
.chapmark { height: 0; margin: 0; padding: 0; string-set: chap attr(data-t); }
table.ws-table tr { break-inside: avoid; }

/* ---------- toolkit ---------- */
.day { display: flex; gap: 0.18in; margin: 0 0 0.12in; padding: 0 0 0.1in; border-bottom: 1px solid #E4E7E2; break-inside: avoid; }
.day-n { flex: 0 0 0.62in; height: 0.56in; background: #1F4D3A; color: white; border-radius: 5pt; text-align: center; font: 900 17pt/1 "MS"; padding-top: 0.07in; }
.day-n span { display: block; font: 700 6.5pt "MS"; letter-spacing: 0.2em; text-transform: uppercase; color: #E8C48A; margin-bottom: 0.03in; }
.month .day-n { background: #C0703A; }
.month .day-n span { color: #F7F1E3; }
.day-body p { margin: 0; }
.day-task { font-weight: 600; font-size: 10.6pt; line-height: 1.4; }
.day-goal { font-size: 9.6pt; color: #2F6B4F; margin-top: 0.03in !important; }
.day-ref { color: #6E7A73; font-style: italic; }
section.template { margin: 0.22in 0 0.3in; border: 1.5px solid #8DB596; border-radius: 6pt; padding: 0.14in 0.24in 0.06in; break-inside: avoid; background: #FCFAF5; }
.tpl-label { font: 800 7pt "MS"; letter-spacing: 0.24em; text-transform: uppercase; color: #C0703A; margin: 0 !important; }
h3.tpl-title { font-size: 12pt; margin: 0.02in 0 0.1in; color: #1F4D3A; text-transform: none; letter-spacing: 0; border: none; }
.tpl-body p { font-size: 10pt; line-height: 1.45; margin-bottom: 0.55em; }
.pagebreak { break-before: page; }
"""


def toc_html(secs):
    items = []
    for s in secs:
        h = s["head"]
        sid = section_id(h)
        if h["t"] == "part":
            items.append(f'<li class="t-part"><a href="#{sid}">Part {h["num"]} · {inline(h["title"])}</a></li>')
        elif h["t"] == "chapter":
            items.append(f'<li class="t-chap"><a href="#{sid}"><span class="cn">{h["num"]}</span>{inline(h["title"])}</a></li>')
        else:
            items.append(f'<li class="t-un"><a href="#{sid}">{inline(h["title"])}</a></li>')
    return '<nav class="toc"><h1>Contents</h1><div class="rule"></div><ol>' + "".join(items) + "</ol></nav>"


def front_matter(fig_src):
    b = BOOK
    return f"""
<section class="halftitle"><div class="t">{b['title']}</div><div class="rule"></div></section>
<section class="titlepage">
  <p class="t1">From Workshop<br/>to Worldwide</p>
  <div class="rule"></div>
  <p class="sub">{b['subtitle']}</p>
  <img class="art" src="{fig_src('fig-final')}" alt=""/>
  <p class="auth">{b['author']}</p>
  <p class="pub"><span class="leaf">&#9679;</span>&#160; {b['publisher']} &#160;<span class="leaf">&#9679;</span></p>
</section>
<section class="copyright">
  <p class="ct">{b['title']}</p>
  <p>{b['subtitle']}</p>
  <p>Copyright &#169; {b['year']} by {b['author']}. All rights reserved.</p>
  <p>Published by {b['publisher']}.</p>
  <p>No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means — electronic, mechanical, photocopying, recording, or otherwise — without prior written permission from the publisher, except for brief quotations in reviews. Purchasers of this book may photocopy the worksheets and templates for use in their own business.</p>
  <p><strong>Disclaimer:</strong> This book is designed to provide general information and practical guidance about starting and running a small business. It is sold with the understanding that the author and publisher are not providing legal, tax, accounting, or financial advice. Laws, regulations, platform policies, and fees vary by location and change over time; consult qualified professionals and official sources for advice specific to your situation. Results vary, and no particular level of income is promised. The example entrepreneurs in this book, Maya and Marcus, are illustrative composites, not real individuals.</p>
  <p>Product and company names mentioned in this book are the trademarks of their respective owners. Their mention does not imply endorsement by, or affiliation with, the author or publisher.</p>
  <p>Illustrations created for this book.</p>
  <p>First Edition, {b['year']}</p>
</section>
<section class="dedication">
  <p>For everyone who has ever been told,<br/><em>"You should sell these,"</em><br/>or <em>"You should charge for that"</em> —<br/>and is finally ready to do it.</p>
  <p class="orn">&#10022;</p>
</section>
"""


def build_html(variant, page_reset=1):
    blocks = load()
    secs = split_sections(blocks)
    figdir = "svg-gray" if variant == "bw" else "svg-color"
    fig_src = lambda fid: "file://" + os.path.join(ILL, figdir, fid + ".svg")
    ctx = {"mode": "print", "fig_n": 0, "chap_label": "", "fig_src": fig_src}
    parts_children = {}
    cur_part = None
    for s in secs:
        if s["head"]["t"] == "part":
            cur_part = s["head"]["num"]
            parts_children[cur_part] = []
        elif s["head"]["t"] == "chapter" and cur_part:
            parts_children[cur_part].append(s["head"])
    body = []
    first_main = True
    for s in secs:
        h = s["head"]
        sid = section_id(h)
        start = ' mainstart' if first_main else ''
        first_main = False
        ctx["fig_n"] = 0
        if h["t"] == "part":
            kids = "".join(f'<div><span>Chapter {c["num"]}</span>{inline(c["title"])}</div>' for c in parts_children[h["num"]])
            img = f'<img src="{fig_src(h["fig"])}" alt=""/>' if h.get("fig") else ""
            body.append(f'<section class="part{start}" id="{sid}"><p class="part-num">Part {h["num"]}</p><h1>{inline(h["title"])}</h1>'
                        f'<div class="rule"></div><p class="part-tag">{inline(h["tagline"])}</p>{img}</section>')
            continue
        ctx["chap_title"] = h["title"]
        if h["t"] == "chapter":
            ctx["chap_label"] = h["num"] + "."
            head = f'<header class="chap-head"><p class="chap-num"><b>{h["num"]}</b>Chapter</p><h1>{inline(h["title"])}</h1><div class="rule"></div></header>'
            cls = "chapter"
        else:
            ctx["chap_label"] = ""
            fig = f'<img class="chap-fig" src="{fig_src(h["fig"])}" alt=""/>' if h.get("fig") else ""
            head = f'<header class="chap-head"><h1>{inline(h["title"])}</h1><div class="rule"></div></header>{fig}'
            cls = "unnumbered recto" if h["title"] in ("Introduction", "Final Thoughts") else "unnumbered"
        inner = "".join(render_block(b, ctx) for b in s["body"])
        body.append(f'<section class="{cls}{start}" id="{sid}">{head}{inner}</section>')
    css = CSS.replace("FONTS", "file://" + FONTS).replace("PAGERESET", str(page_reset))
    if variant == "bw":
        css = to_gray(css)
    doc = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{BOOK["title"]}</title>'
           f'<meta name="author" content="{BOOK["author"]}"><style>{css}</style></head><body>'
           f'{front_matter(fig_src)}{toc_html(secs)}{"".join(body)}</body></html>')
    if variant == "bw":
        doc = doc.replace(fig_src("fig-final"), fig_src("fig-final"))
    return doc


def main():
    which = sys.argv[1] if len(sys.argv) > 1 else "both"
    os.makedirs(OUT, exist_ok=True)
    for v in (["color", "bw"] if which == "both" else [which]):
        # pass 1 finds where the Introduction lands so it can be numbered page 1
        doc = HTML(string=build_html(v), base_url=HERE).render()
        k = next(i for i, pg in enumerate(doc.pages) if "introduction" in pg.anchors) + 1
        html_doc = build_html(v, 2 - k)
        open(os.path.join(HERE, f"_interior-{v}.html"), "w").write(html_doc)
        name = "Interior-Paperback-8.5x11-BlackWhite.pdf" if v == "bw" else "Interior-Paperback-8.5x11-Color.pdf"
        doc = HTML(string=html_doc, base_url=HERE).render()
        doc.metadata.title = BOOK["title"]
        doc.metadata.authors = [BOOK["author"]]
        doc.write_pdf(os.path.join(OUT, name))
        print(v, len(doc.pages), "pages ->", name)


if __name__ == "__main__":
    main()
