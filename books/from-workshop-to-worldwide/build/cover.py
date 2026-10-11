"""Generate the KDP covers: paperback full wrap (back + spine + front with bleed) and the eBook front cover.

usage: python3 cover.py <interior_page_count>
Writes HTML files that render_covers.js turns into PDF / JPG with Chromium.
"""
import json
import math
import os
import sys

from manuscript import BOOK
from svglib import G, G2, SAGE, LSAGE, CREAM, COPPER, TAN, WOOD, DWOOD, INK

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "fonts")
DEEP = "#163829"
NIGHT = "#10291E"

BLEED = 0.125
TRIM_W, TRIM_H = 8.5, 11.0
PAPER = {"bw": 0.002252, "color": 0.002347}   # inches per page (KDP white paper / color)


def cover_art(w=1000, h=760):
    """Horizon scene: a small workshop whose road (carrying parcels) leads to the wider world."""
    b = []
    # rays / glow
    for k, r in enumerate([190, 168, 150]):
        b.append(f'<circle cx="690" cy="300" r="{r}" fill="{TAN}" fill-opacity="{0.08 + k * 0.07:.2f}"/>')
    b.append(f'<circle cx="690" cy="300" r="132" fill="#F3D9A2"/>')
    # globe
    cx, cy, R = 690, 300, 112
    b.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="#CFE3E8" stroke="{DEEP}" stroke-width="5"/>')
    b.append(f'<clipPath id="gclip"><circle cx="{cx}" cy="{cy}" r="{R - 3}"/></clipPath><g clip-path="url(#gclip)">')
    b.append(f'<path d="M{cx - 95} {cy - 70} C{cx - 40} {cy - 105} {cx + 5} {cy - 50} {cx - 15} {cy - 15} C{cx - 40} {cy + 15} {cx - 70} {cy - 10} {cx - 95} {cy - 70} Z" fill="{SAGE}"/>')
    b.append(f'<path d="M{cx + 18} {cy + 8} C{cx + 60} {cy - 15} {cx + 95} {cy + 25} {cx + 70} {cy + 70} C{cx + 45} {cy + 95} {cx + 10} {cy + 60} {cx + 18} {cy + 8} Z" fill="{SAGE}"/>')
    b.append(f'<path d="M{cx + 30} {cy - 92} C{cx + 60} {cy - 98} {cx + 90} {cy - 60} {cx + 62} {cy - 42} Z" fill="{SAGE}"/>')
    b.append(f'<path d="M{cx - 70} {cy + 40} C{cx - 40} {cy + 30} {cx - 30} {cy + 70} {cx - 55} {cy + 85} Z" fill="{SAGE}"/>')
    for d in (f"M{cx - R} {cy} L{cx + R} {cy}", f"M{cx} {cy - R} C{cx - 70} {cy - 45} {cx - 70} {cy + 45} {cx} {cy + R}",
              f"M{cx} {cy - R} C{cx + 70} {cy - 45} {cx + 70} {cy + 45} {cx} {cy + R}", f"M{cx - R + 15} {cy - 55} L{cx + R - 15} {cy - 55}",
              f"M{cx - R + 15} {cy + 55} L{cx + R - 15} {cy + 55}"):
        b.append(f'<path d="{d}" fill="none" stroke="{DEEP}" stroke-width="2" stroke-opacity="0.35"/>')
    b.append('</g>')
    # map pins on the globe
    for (px, py) in ((cx - 40, cy - 45), (cx + 50, cy + 25), (cx + 55, cy - 70)):
        b.append(f'<path d="M{px} {py} c-11 -14 -16 -21 -16 -28 a16 16 0 1 1 32 0 c0 7 -5 14 -16 28 z" fill="{COPPER}" stroke="{DEEP}" stroke-width="2.5"/><circle cx="{px}" cy="{py - 29}" r="6" fill="{CREAM}"/>')
    # hills
    b.append(f'<path d="M0 420 C160 360 330 400 500 392 C680 384 820 350 1000 362 L1000 {h} L0 {h} Z" fill="{SAGE}"/>')
    b.append(f'<path d="M0 500 C200 450 420 500 620 476 C780 458 900 470 1000 480 L1000 {h} L0 {h} Z" fill="{G2}"/>')
    b.append(f'<path d="M0 600 C220 560 460 610 700 590 C840 578 940 590 1000 596 L1000 {h} L0 {h} Z" fill="{DEEP}"/>')
    # road
    road = "M300 760 C330 680 380 640 470 600 C560 560 600 520 640 470 C660 445 670 425 680 412"
    b.append(f'<path d="{road}" fill="none" stroke="{TAN}" stroke-width="54" stroke-linecap="round"/>')
    b.append(f'<path d="{road}" fill="none" stroke="{CREAM}" stroke-width="4" stroke-dasharray="18 20" stroke-linecap="round"/>')
    # parcels travelling the road (smaller as they go)
    for (x, y, s) in ((468, 580, 1.0), (585, 512, 0.72), (650, 452, 0.5)):
        w2, h2 = 46 * s, 34 * s
        b.append(f'<g transform="translate({x - w2 / 2},{y - h2})"><rect width="{w2}" height="{h2}" rx="{3 * s}" fill="#D9B98C" stroke="{DWOOD}" stroke-width="{2.5 * s}"/>'
                 f'<rect x="{w2 / 2 - 4 * s}" width="{8 * s}" height="{h2}" fill="#C9A574"/></g>')
    # trees
    for (x, y, s) in ((90, 520, 1.0), (150, 545, 0.8), (880, 470, 0.9), (930, 488, 0.7), (820, 520, 0.6)):
        b.append(f'<rect x="{x - 4 * s}" y="{y}" width="{8 * s}" height="{30 * s}" fill="{DWOOD}"/><path d="M{x} {y - 70 * s} L{x + 30 * s} {y + 8 * s} L{x - 30 * s} {y + 8 * s} Z" fill="{G}"/>')
    # workshop
    b.append(f'<g transform="translate(150,500)">'
             f'<rect x="0" y="60" width="210" height="140" fill="{COPPER}" stroke="{DWOOD}" stroke-width="5"/>'
             f'<path d="M-18 66 L105 -24 L228 66 Z" fill="{G}" stroke="{NIGHT}" stroke-width="5" stroke-linejoin="round"/>'
             f'<rect x="80" y="118" width="54" height="82" fill="{DWOOD}"/><circle cx="124" cy="160" r="4" fill="{TAN}"/>'
             f'<rect x="20" y="92" width="42" height="40" fill="#F7DFA6" stroke="{DWOOD}" stroke-width="4"/><rect x="152" y="92" width="42" height="40" fill="#F7DFA6" stroke="{DWOOD}" stroke-width="4"/>'
             f'<line x1="41" y1="92" x2="41" y2="132" stroke="{DWOOD}" stroke-width="3"/><line x1="173" y1="92" x2="173" y2="132" stroke="{DWOOD}" stroke-width="3"/>'
             f'<rect x="58" y="36" width="94" height="22" rx="3" fill="{TAN}" stroke="{DWOOD}" stroke-width="3"/>'
             f'<text x="105" y="53" font-family="Montserrat" font-weight="800" font-size="13" fill="{DWOOD}" text-anchor="middle" letter-spacing="1.5">WORKSHOP</text>'
             f'<rect x="150" y="-10" width="22" height="46" fill="{DWOOD}"/></g>')
    # stars / sparkles in sky
    for (x, y, s) in ((120, 230, 1), (330, 260, 0.7), (440, 300, 0.6), (930, 240, 0.8), (880, 330, 0.5)):
        b.append(f'<path d="M{x} {y - 14 * s} C{x + 2 * s} {y - 4 * s} {x + 4 * s} {y - 2 * s} {x + 14 * s} {y} C{x + 4 * s} {y + 2 * s} {x + 2 * s} {y + 4 * s} {x} {y + 14 * s} C{x - 2 * s} {y + 4 * s} {x - 4 * s} {y + 2 * s} {x - 14 * s} {y} C{x - 4 * s} {y - 2 * s} {x - 2 * s} {y - 4 * s} {x} {y - 14 * s} Z" fill="{TAN}" fill-opacity="0.8"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 105 {w} {h - 105}" preserveAspectRatio="xMidYMax slice">{"".join(b)}</svg>'


def grain_svg():
    """Subtle wood-grain / contour texture for the dark green background."""
    lines = []
    for i in range(26):
        y = 20 + i * 40
        amp = 10 + (i % 5) * 4
        d = f"M-20 {y} " + " ".join(f"C{x + 60} {y - amp} {x + 120} {y + amp} {x + 180} {y}" for x in range(-20, 1100, 180))
        lines.append(f'<path d="{d}" fill="none" stroke="#FFFFFF" stroke-opacity="0.035" stroke-width="2"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1060" preserveAspectRatio="none">{"".join(lines)}</svg>'


FACES = "".join(
    f'@font-face{{font-family:"Montserrat";src:url("file://{FONTS}/Montserrat-{n}.ttf");font-weight:{w}}}'
    for n, w in [("Regular", 400), ("Medium", 500), ("SemiBold", 600), ("Bold", 700), ("ExtraBold", 800), ("Black", 900)]
) + "".join(
    f'@font-face{{font-family:"Source Serif 4";src:url("file://{FONTS}/SourceSerif4-{n}.ttf");font-weight:{w};font-style:{s}}}'
    for n, w, s in [("Regular", 400, "normal"), ("Italic", 400, "italic"), ("SemiBold", 600, "normal"), ("Bold", 700, "normal"), ("SemiBoldItalic", 600, "italic")]
)


def front_html():
    return f"""
<div class="front">
  <div class="tex">{grain_svg()}</div>
  <div class="art">{cover_art()}</div>
  <div class="band"><div class="author">The Skill Junky</div></div>
  <div class="head">
    <div class="kicker">The Step-by-Step Guide for Makers &amp; Service Providers</div>
    <div class="title"><span class="fit l1" data-w="0.36">From</span><span class="fit l2" data-w="0.86">Workshop</span><span class="fit l3" data-w="0.86"><em>to</em> Worldwide</span></div>
    <div class="rule"></div>
    <div class="sub">Build a Profitable Business From the Things You Make<br/>and the Services You Provide</div>
  </div>
  <div class="seal"><div><b>33</b> worksheets</div><div><b>10</b> templates</div><div><b>30</b>-day plan</div></div>
</div>"""


FIT_JS = """<script>
document.fonts.ready.then(() => {
  document.querySelectorAll('.fit').forEach(el => {
    const box = el.closest('.head').clientWidth * parseFloat(el.dataset.w);
    el.style.display = 'inline-block'; el.style.fontSize = '100px';
    const w = el.getBoundingClientRect().width;
    el.style.fontSize = (100 * box / w) + 'px'; el.style.display = 'block';
  });
  document.body.dataset.ready = '1';
});
</script>"""

FRONT_CSS = f"""
.front {{ position:absolute; overflow:hidden; background:{G}; color:{CREAM}; font-family:"Montserrat"; }}
.front .tex {{ position:absolute; inset:0; }}
.front .tex svg {{ width:100%; height:100%; }}
.front .art {{ position:absolute; left:0; right:0; }}
.front .art svg {{ width:100%; height:100%; display:block; }}
.front .band {{ position:absolute; left:0; right:0; bottom:0; background:{NIGHT}; display:flex; align-items:center; justify-content:center; border-top:solid {COPPER}; }}
.front .author {{ font-weight:800; text-transform:uppercase; color:{CREAM}; }}
.front .head {{ position:absolute; text-align:center; }}
.front .kicker {{ font-weight:700; text-transform:uppercase; color:{TAN}; }}
.front .title {{ font-weight:900; text-transform:uppercase; line-height:0.9; color:#FFFDF6; }}
.front .title .fit {{ display:block; white-space:nowrap; margin:0 auto; }}
.front .title .l1 {{ letter-spacing:0.12em; color:{TAN}; font-weight:800; }}
.front .title em {{ font-family:"Source Serif 4"; font-style:italic; font-weight:600; text-transform:lowercase; color:{TAN}; letter-spacing:0; }}
.front .rule {{ background:{COPPER}; margin-left:auto; margin-right:auto; }}
.front .sub {{ font-family:"Source Serif 4"; font-style:italic; color:{CREAM}; }}
.front .seal {{ position:absolute; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; background:{COPPER}; color:{CREAM}; border-radius:50%; font-weight:700; text-transform:uppercase; transform:rotate(-8deg); line-height:1.3; }}
.front .seal b {{ font-weight:900; color:white; }}
"""


def front_geometry(W, H, unit, ot=0.0, orr=0.0, ob=0.0):
    """Size the front cover for a W x H trim (unit in or px); o* = bleed offsets."""
    u = lambda v: f"{v:.4f}{unit}"
    k = W / 8.5
    tall = H / W > 1.45
    band = (1.05 if not tall else 1.25) * k
    art_h = (W + orr) / 1.54 if not tall else H * 0.47
    return f"""
.front .head {{ top:{u(ot + (0.75 if not tall else 1.15) * k)}; left:{u(0.55 * k)}; right:{u(0.55 * k + orr)}; }}
.front .kicker {{ font-size:{u(0.155 * k)}; letter-spacing:{u(0.035 * k)}; margin-bottom:{u(0.28 * k)}; }}
.front .title .l1 {{ margin-bottom:{u(0.04 * k)}; }}
.front .rule {{ width:{u(1.3 * k)}; height:{u(0.06 * k)}; margin-top:{u(0.3 * k)}; margin-bottom:{u(0.26 * k)}; }}
.front .sub {{ font-size:{u(0.245 * k)}; line-height:1.4; }}
.front .band {{ height:{u(band + ob)}; padding-bottom:{u(ob)}; box-sizing:border-box; border-top-width:{u(0.05 * k)}; }}
.front .author {{ font-size:{u(0.36 * k)}; letter-spacing:{u(0.14 * k)}; }}
.front .art {{ bottom:{u(band + ob)}; height:{u(art_h)}; }}
.front .seal {{ width:{u(1.32 * k)}; height:{u(1.32 * k)}; left:{u(0.55 * k)}; bottom:{u(band + ob + art_h * 0.58)}; font-size:{u(0.098 * k)}; letter-spacing:{u(0.008 * k)}; }}
.front .seal b {{ font-size:{u(0.19 * k)}; }}
"""


def back_html():
    bullets = [
        "Choose the right product or service — and prove people will pay for it",
        "Price for real profit with step-by-step calculators",
        "Set up your business legally: structure, EIN, licenses, sales tax & insurance",
        "Take photos and write listings that sell",
        "Find your first customers and market consistently",
        "Manage money, build systems, and grow toward full time",
    ]
    lis = "".join(f"<li>{b}</li>" for b in bullets)
    return f"""
<div class="back">
  <div class="tex">{grain_svg()}</div>
  <div class="bk-kicker">Small Business · Entrepreneurship</div>
  <div class="bk-head">Turn what you make — and what you know — into a real business.</div>
  <p class="bk-p">A woodworker can sell to customers across the country. A neighbor who can fix anything can fill a calendar with paying clients. Today, anyone with a skill and the willingness to learn can build a business — without a storefront, a big budget, or a business degree.</p>
  <p class="bk-p"><i>From Workshop to Worldwide</i> is the practical, step-by-step guide to doing exactly that. Follow two example entrepreneurs — Maya the maker and Marcus the service provider — as you learn how to:</p>
  <ul class="bk-list">{lis}</ul>
  <div class="bk-box"><b>A true working book.</b> 33 worksheets, 10 ready-to-use customer templates, a 30-day launch plan, and a first-year success plan turn every chapter into action.</div>
  <div class="bk-author"><b>The Skill Junky</b> is a lifelong learner, maker, and entrepreneur who writes practical, no-nonsense guides that help everyday people turn their skills into real income.</div>
  <div class="bk-pub"><span class="leaf"></span>Verdant Life LLC</div>
</div>"""


BACK_CSS = f"""
.back {{ position:absolute; overflow:hidden; background:{G}; color:{CREAM}; font-family:"Source Serif 4"; }}
.back .tex {{ position:absolute; inset:0; }}
.back .tex svg {{ width:100%; height:100%; }}
.back > *:not(.tex) {{ position:relative; }}
.bk-kicker {{ font:700 0.13in "Montserrat"; letter-spacing:0.04in; text-transform:uppercase; color:{TAN}; margin:0 0 0.22in; }}
.bk-head {{ font:900 0.4in/1.12 "Montserrat"; color:white; margin:0 0 0.28in; }}
.bk-p {{ font-size:0.158in; line-height:1.5; margin:0 0 0.16in; }}
.bk-list {{ list-style:none; padding:0; margin:0.06in 0 0.22in; }}
.bk-list li {{ font:600 0.142in/1.4 "Montserrat"; padding-left:0.34in; margin-bottom:0.1in; position:relative; }}
.bk-list li::before {{ content:""; position:absolute; left:0; top:0.01in; width:0.17in; height:0.17in; border-radius:50%; background:{COPPER}; }}
.bk-list li::after {{ content:""; position:absolute; left:0.055in; top:0.05in; width:0.05in; height:0.085in; border:solid white; border-width:0 0.022in 0.022in 0; transform:rotate(45deg); }}
.bk-box {{ background:{DEEP}; border-left:0.06in solid {COPPER}; padding:0.16in 0.2in; font-size:0.15in; line-height:1.5; margin-bottom:0.24in; }}
.bk-box b {{ font-family:"Montserrat"; font-weight:800; color:{TAN}; }}
.bk-author {{ font-size:0.14in; line-height:1.5; color:{LSAGE}; width:4.2in; }}
.bk-author b {{ font-family:"Montserrat"; color:white; }}
.bk-pub {{ position:absolute !important; font:800 0.13in "Montserrat"; letter-spacing:0.05in; text-transform:uppercase; color:{CREAM}; display:flex; align-items:center; gap:0.1in; }}
.bk-pub .leaf {{ width:0.16in; height:0.16in; background:{SAGE}; border-radius:0 0.16in 0 0.16in; display:inline-block; }}
"""


def spine_html(spine):
    if spine < 0.25:
        return '<div class="spine"></div>'
    fs = min(0.15, spine * 0.42)
    return f"""<div class="spine"><div class="sp-in" style="font-size:{fs:.3f}in">
<span class="sp-t">From Workshop <em>to</em> Worldwide</span><span class="sp-dot"></span><span class="sp-a">The Skill Junky</span>
</div></div>"""


SPINE_CSS = f"""
.spine {{ position:absolute; background:{DEEP}; overflow:hidden; }}
.sp-in {{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) rotate(90deg); white-space:nowrap; display:flex; align-items:center; gap:0.22in; font-family:"Montserrat"; text-transform:uppercase; color:{CREAM}; }}
.sp-t {{ font-weight:900; letter-spacing:0.02in; }}
.sp-t em {{ font-family:"Source Serif 4"; font-style:italic; font-weight:600; text-transform:lowercase; color:{TAN}; }}
.sp-a {{ font-weight:700; letter-spacing:0.03in; color:{TAN}; font-size:0.8em; }}
.sp-dot {{ width:0.06in; height:0.06in; border-radius:50%; background:{COPPER}; }}
"""


def paperback(pages, ink):
    spine = round(pages * PAPER[ink], 4)
    W = BLEED * 2 + TRIM_W * 2 + spine
    H = TRIM_H + BLEED * 2
    fx = BLEED + TRIM_W + spine  # front panel left edge (trim)
    html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
{FACES}
@page {{ size:{W:.4f}in {H:.4f}in; margin:0; }}
html,body {{ margin:0; padding:0; width:{W:.4f}in; height:{H:.4f}in; background:{G}; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
.sheet {{ position:relative; width:{W:.4f}in; height:{H:.4f}in; overflow:hidden; }}
{FRONT_CSS}{BACK_CSS}{SPINE_CSS}
.front {{ left:{fx:.4f}in; top:0; width:{TRIM_W + BLEED:.4f}in; height:{H:.4f}in; }}
{front_geometry(TRIM_W, TRIM_H, 'in', BLEED, BLEED, BLEED)}
.back {{ left:0; top:0; width:{BLEED + TRIM_W:.4f}in; height:{H:.4f}in; box-sizing:border-box; padding:{BLEED + 0.75:.3f}in 0.7in 0 {BLEED + 0.7:.3f}in; }}
.bk-pub {{ left:{BLEED + 0.7:.3f}in; bottom:{BLEED + 0.62:.3f}in; }}
.spine {{ left:{BLEED + TRIM_W:.4f}in; top:0; width:{spine:.4f}in; height:{H:.4f}in; }}
</style></head><body><div class="sheet">{back_html()}{spine_html(spine)}{front_html()}</div>{FIT_JS}</body></html>"""
    return html, {"spine_in": spine, "width_in": round(W, 4), "height_in": H, "pages": pages, "ink": ink}


def ebook(wpx=1600, hpx=2560):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
{FACES}
html,body {{ margin:0; padding:0; width:{wpx}px; height:{hpx}px; background:{G}; }}
{FRONT_CSS}
.front {{ left:0; top:0; width:{wpx}px; height:{hpx}px; }}
{front_geometry(wpx, hpx, 'px')}
</style></head><body>{front_html()}{FIT_JS}</body></html>"""


def guides_overlay(meta):
    """Debug overlay showing trim, spine, safe zones and the barcode area."""
    W, H, s = meta["width_in"], meta["height_in"], meta["spine_in"]
    r = lambda x, y, w, h, c, dash="": f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{c}" stroke-width="0.012" {dash}/>'
    g = [r(BLEED, BLEED, W - 2 * BLEED, H - 2 * BLEED, "#ff00ff"),
         r(BLEED + TRIM_W, 0, s, H, "#ff00ff"),
         r(BLEED + 0.25, BLEED + 0.25, TRIM_W - 0.5, TRIM_H - 0.5, "#00ffff", 'stroke-dasharray="0.05 0.05"'),
         r(BLEED + TRIM_W + s + 0.25, BLEED + 0.25, TRIM_W - 0.5, TRIM_H - 0.5, "#00ffff", 'stroke-dasharray="0.05 0.05"'),
         f'<rect x="{BLEED + TRIM_W - 0.25 - 2.0}" y="{BLEED + TRIM_H - 0.25 - 1.2}" width="2" height="1.2" fill="#ffff00" fill-opacity="0.5"/>']
    return f'<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0;width:{W}in;height:{H}in;z-index:99" viewBox="0 0 {W} {H}">{"".join(g)}</svg>'


if __name__ == "__main__":
    pages = int(sys.argv[1])
    out = {}
    for ink in ("bw", "color"):
        html, meta = paperback(pages, ink)
        open(os.path.join(HERE, f"_cover-{ink}.html"), "w").write(html)
        open(os.path.join(HERE, f"_cover-{ink}-guides.html"), "w").write(html.replace('</div><script>', guides_overlay(meta) + '</div><script>'))
        out[ink] = meta
    open(os.path.join(HERE, "_ebook-cover.html"), "w").write(ebook())
    json.dump(out, open(os.path.join(HERE, "_cover-meta.json"), "w"), indent=1)
    print(json.dumps(out))
