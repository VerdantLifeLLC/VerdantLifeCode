#!/usr/bin/env python3
"""Covers for The Lattice Chronicles.

For each book this writes:
  output/covers/<file>-KDP-Paperback-Cover.pdf   full wrap (back + spine + front), 0.125 in bleed
  output/covers/<file>-KDP-Paperback-Cover.png   300 dpi preview of the wrap
  output/covers/<file>-Front-Cover.jpg           front only, 6 x 9 trim, 300 dpi (2.5:3.75 ratio)
  output/covers/<file>-Kindle-Cover.jpg          ebook cover, 1600 x 2560

Usage: python3 covers.py [book1|book2] [--paper white|cream]
The spine width is computed from the interior PDF's page count, so build the
interiors first (python3 build.py).
"""
import math
import os
import random
import subprocess
import sys

from PIL import Image
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Frame, Paragraph

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "output", "covers")

SERIES = "The Lattice Chronicles"
AUTHOR = "VerdantLife LLC"
TRIM_W, TRIM_H = 6 * inch, 9 * inch
BLEED = 0.125 * inch
SAFE = 0.375 * inch          # keep live text this far inside the trim
PAPER = {"white": 0.002252, "cream": 0.0025}   # KDP spine inches per page

BOOKS = {
    "book1": {
        "file": "The-Sorcerers-Reckoning",
        "pre": "THE SORCERER'S", "main": "RECKONING", "number": "BOOK ONE",
        "sky": ("#05060f", "#120a1e", "#3b1206"), "glow": "#ff9a3c", "accent": "#f3c873",
        "tagline": "Every Ceiling can be broken.",
        "blurb": [
            "Lex Harrow was Kindled a Smith. Common grade. Ceiling twenty-four. The Lattice, the silver net that "
            "gives every soul in Caldor a class, a level and a limit, decided what he would be at fourteen, and "
            "nobody ever asked him.",
            "Then a stranger walks into the Ashbourne forge, the seal on Lex's power cracks in a storm of gold "
            "fire, and a voice wakes up in his head. His class was a mask. His blood is the Root of the Lattice "
            "itself. And the father he thought was dead hid it there on purpose.",
            "Now the Wardens of the Order want him chained, a Pale Warden is spreading the Gloam across the land, "
            "and the only person who can help him is the brother he hasn't seen in eight years: the mad warlock "
            "of the Greyspine, holding a breach in the world shut with his own mind.",
            "Two estranged brothers. One broken System. A father's secret that could free every soul in the "
            "world, or end it.",
        ],
        "kicker": "The epic LitRPG saga begins.",
    },
    "book2": {
        "file": "The-Sorcerers-Legacy",
        "pre": "THE SORCERER'S", "main": "LEGACY", "number": "BOOK TWO",
        "sky": ("#04070d", "#0b1424", "#1d0f2b"), "glow": "#ffc35c", "accent": "#f6d48a",
        "tagline": "Leave a light on.",
        "blurb": [
            "Three years after Duskhold, the Ceilings are breaking all over Caldor. Lex Vey teaches at a forge "
            "with twenty anvils. His brother Antho keeps a mountain hung with eleven hundred lanterns. The world "
            "is finally, cautiously free.",
            "Then people start disappearing. Not killed. Unwritten. Cut out of the Lattice so completely that "
            "their own families forget they were ever born. And the man doing it carries one piece of an ancient "
            "key, forged nine hundred years ago from a Founder's own shadow.",
            "To stop him, Lex must cross a desert of glass, enter the four elemental Wellworlds and forge "
            "something that has never been made, while Antho crosses a grey river that takes the one memory "
            "you'd least want to lose. Because on the far side of the darkness, someone has been holding a door "
            "shut for eleven years.",
            "And she's their mother.",
        ],
        "kicker": "The Lattice Chronicles continue.",
    },
}


def register_fonts():
    f = lambda n: os.path.join(FONTS, n)
    pdfmetrics.registerFont(TTFont("Cinzel", f("Cinzel-400.ttf")))
    pdfmetrics.registerFont(TTFont("Cinzel-Bold", f("Cinzel-700.ttf")))
    pdfmetrics.registerFont(TTFont("Garamond", f("EBGaramond-400-normal.ttf")))
    pdfmetrics.registerFont(TTFont("Garamond-Italic", f("EBGaramond-400-italic.ttf")))
    pdfmetrics.registerFont(TTFont("Garamond-Semi", f("EBGaramond-600-normal.ttf")))


def page_count(key):
    pdf = os.path.join(HERE, "output", "%s-KDP-6x9-Interior.pdf" % BOOKS[key]["file"])
    out = subprocess.run(["pdfinfo", pdf], capture_output=True, text=True, check=True).stdout
    return int([l for l in out.splitlines() if l.startswith("Pages:")][0].split()[1])


def rgba(hexstr, a=1.0):
    c = HexColor(hexstr)
    return Color(c.red, c.green, c.blue, alpha=a)


# ---------------------------------------------------------------- art pieces
def sky(c, W, H, cols):
    top, mid, bot = cols
    c.linearGradient(0, H, 0, 0, (HexColor(top), HexColor(mid), HexColor(bot)), (0, 0.55, 1), extend=True)


def glow(c, x, y, r, hexcol, strength=0.85, steps=70):
    """Soft radial light: stacked translucent discs (PDF gradients can't fade to transparent)."""
    c.saveState()
    a = 1 - (1 - min(strength, 0.97)) ** (1.0 / steps)
    col = HexColor(hexcol)
    c.setFillColor(Color(col.red, col.green, col.blue, alpha=a))
    for k in range(steps):
        f = 1 - k / steps
        c.circle(x, y, r * f ** 1.35, stroke=0, fill=1)
    c.restoreState()


def stars(c, x0, y0, w, h, n, rnd, ymin_frac=0.35):
    for _ in range(n):
        x = x0 + rnd.random() * w
        y = y0 + h * (ymin_frac + (1 - ymin_frac) * rnd.random() ** 0.7)
        r = rnd.choice([0.35, 0.45, 0.6, 0.6, 0.8, 1.1])
        c.setFillColor(Color(1, 0.97, 0.9, alpha=0.25 + 0.65 * rnd.random()))
        c.circle(x, y, r, stroke=0, fill=1)
        if r > 1:
            c.setStrokeColor(Color(1, 0.95, 0.85, alpha=0.35))
            c.setLineWidth(0.3)
            c.line(x - 4, y, x + 4, y)
            c.line(x, y - 4, x, y + 4)


def lattice(c, cx, cy, w, h, spacing, alpha, rnd, gold_from=None):
    """A diamond net (the Lattice) bowed slightly like a dome, fading at the edges."""
    c.saveState()
    c.setLineWidth(0.45)
    rows = int(h / spacing) + 4
    cols = int(w / spacing) + 4
    def pt(i, j):
        u = (i - cols / 2) * spacing
        v = (j - rows / 2) * spacing
        bow = (u / (w / 2)) ** 2
        return cx + u, cy + v - bow * spacing * 1.6
    for j in range(rows):
        for i in range(cols):
            x1, y1 = pt(i, j)
            for (di, dj) in ((1, 1), (1, -1)):
                x2, y2 = pt(i + di, j + dj)
                mx, my = (x1 + x2) / 2, (y1 + y2) / 2
                fade = max(0.0, 1 - (abs(mx - cx) / (w / 2)) ** 2) * max(0.0, 1 - (abs(my - cy) / (h / 2)) ** 2)
                if fade <= 0.02:
                    continue
                a = alpha * fade
                col = Color(0.82, 0.86, 0.95, alpha=a)
                if gold_from:
                    gx, gy, gr = gold_from
                    d = math.hypot(mx - gx, my - gy)
                    if d < gr:
                        t = 1 - d / gr
                        col = Color(1, 0.78, 0.36, alpha=min(1, a + 0.55 * t))
                c.setStrokeColor(col)
                c.line(x1, y1, x2, y2)
                if rnd.random() < 0.08:
                    c.setFillColor(Color(0.9, 0.93, 1, alpha=a * 1.6))
                    c.circle(x1, y1, 0.9, stroke=0, fill=1)
    c.restoreState()


def mountains(c, x0, w, base, peaks, color_hex, alpha, rnd, jag=0.18):
    c.saveState()
    c.setFillColor(rgba(color_hex, alpha))
    p = c.beginPath()
    p.moveTo(x0 - 20, -2 * BLEED)
    p.lineTo(x0 - 20, base)
    n = len(peaks)
    step = (w + 40) / (n * 2)
    x = x0 - 20
    for ph in peaks:
        x += step
        p.lineTo(x, base + ph)
        x += step * (0.5 + rnd.random() * 0.4)
        p.lineTo(x, base + ph * (jag + rnd.random() * 0.3))
    p.lineTo(x0 + w + 20, base)
    p.lineTo(x0 + w + 20, -2 * BLEED)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


def sparks(c, cx, cy, spread, height, n, rnd, hexcol):
    for _ in range(n):
        t = rnd.random() ** 1.6
        y = cy + t * height
        x = cx + (rnd.random() - 0.5) * spread * (0.3 + t * 1.6) + math.sin(t * 9 + rnd.random()) * 12
        r = 0.5 + (1 - t) * 1.6 * rnd.random()
        c.setFillColor(rgba(hexcol, (1 - t) * 0.9 + 0.08))
        c.circle(x, y, r, stroke=0, fill=1)


def anvil(c, cx, base, s):
    """Anvil silhouette with a molten top edge, and a hammer resting against it."""
    c.saveState()
    c.setFillColor(HexColor("#07060a"))
    p = c.beginPath()
    # base block
    p.moveTo(cx - 0.62 * s, base)
    p.lineTo(cx + 0.62 * s, base)
    p.lineTo(cx + 0.46 * s, base + 0.16 * s)
    p.lineTo(cx + 0.26 * s, base + 0.22 * s)
    # waist
    p.curveTo(cx + 0.2 * s, base + 0.38 * s, cx + 0.28 * s, base + 0.5 * s, cx + 0.46 * s, base + 0.56 * s)
    # face, heel
    p.lineTo(cx + 0.66 * s, base + 0.6 * s)
    p.lineTo(cx + 0.66 * s, base + 0.74 * s)
    # top face
    p.lineTo(cx - 0.52 * s, base + 0.74 * s)
    # horn
    p.curveTo(cx - 0.82 * s, base + 0.73 * s, cx - 1.12 * s, base + 0.66 * s, cx - 1.32 * s, base + 0.6 * s)
    p.curveTo(cx - 1.05 * s, base + 0.6 * s, cx - 0.7 * s, base + 0.54 * s, cx - 0.48 * s, base + 0.52 * s)
    p.curveTo(cx - 0.3 * s, base + 0.46 * s, cx - 0.22 * s, base + 0.36 * s, cx - 0.26 * s, base + 0.22 * s)
    p.lineTo(cx - 0.46 * s, base + 0.16 * s)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    # molten edge on the face
    c.setStrokeColor(Color(1, 0.72, 0.3, alpha=0.95))
    c.setLineWidth(1.4)
    c.line(cx - 0.52 * s, base + 0.74 * s, cx + 0.66 * s, base + 0.74 * s)
    c.setStrokeColor(Color(1, 0.55, 0.2, alpha=0.5))
    c.setLineWidth(0.8)
    pe = c.beginPath()
    pe.moveTo(cx - 0.52 * s, base + 0.74 * s)
    pe.curveTo(cx - 0.82 * s, base + 0.73 * s, cx - 1.12 * s, base + 0.66 * s, cx - 1.32 * s, base + 0.6 * s)
    c.drawPath(pe, stroke=1, fill=0)
    # glowing bar on the face
    c.setFillColor(Color(1, 0.86, 0.5, alpha=1))
    c.roundRect(cx - 0.18 * s, base + 0.74 * s, 0.46 * s, 0.05 * s, 0.02 * s, stroke=0, fill=1)
    # hammer leaning on the base
    c.translate(cx + 0.78 * s, base)
    c.rotate(14)
    c.setFillColor(HexColor("#07060a"))
    c.rect(-0.03 * s, 0, 0.06 * s, 0.62 * s, stroke=0, fill=1)
    c.roundRect(-0.15 * s, 0.6 * s, 0.3 * s, 0.13 * s, 0.02 * s, stroke=0, fill=1)
    c.setStrokeColor(Color(1, 0.7, 0.3, alpha=0.6))
    c.setLineWidth(0.6)
    c.line(-0.15 * s, 0.73 * s, 0.15 * s, 0.73 * s)
    c.restoreState()


def key_of_shadows(c, cx, cy, s, angle):
    """The Key of Shadows: bow, blade and bit, black with a gold rim."""
    c.saveState()
    c.translate(cx, cy)
    c.rotate(angle)
    for pass_, (col, lw) in enumerate(((Color(1, 0.82, 0.45, alpha=0.18), 9), (Color(1, 0.8, 0.42, alpha=0.9), 1.6), (None, 0))):
        p = c.beginPath()
        # blade
        p.rect(-0.04 * s, -0.55 * s, 0.08 * s, 1.0 * s)
        # bow (ring)
        p.circle(0, 0.62 * s, 0.2 * s)
        # bit: jagged teeth
        p.moveTo(0.04 * s, -0.55 * s)
        teeth = [(0.16, -0.55), (0.16, -0.48), (0.24, -0.48), (0.24, -0.4), (0.12, -0.4), (0.12, -0.33),
                 (0.22, -0.33), (0.22, -0.25), (0.04, -0.25)]
        for tx, ty in teeth:
            p.lineTo(tx * s, ty * s)
        p.close()
        if col is not None:
            c.setStrokeColor(col)
            c.setLineWidth(lw)
            c.drawPath(p, stroke=1, fill=0)
        else:
            c.setFillColor(HexColor("#020205"))
            c.drawPath(p, stroke=0, fill=1)
    # hole in the bow
    c.setFillColor(Color(1, 0.84, 0.5, alpha=0.95))
    c.circle(0, 0.62 * s, 0.1 * s, stroke=0, fill=1)
    c.setFillColor(HexColor("#140c06"))
    c.circle(0, 0.62 * s, 0.085 * s, stroke=0, fill=1)
    c.restoreState()


def door_and_lamp(c, cx, base, w, h, rnd, glowcol):
    """The sealed black-glass door at the bottom of the Hollowmaw, a crack of light, Seren's lamp."""
    c.saveState()
    # arch
    p = c.beginPath()
    p.moveTo(cx - w / 2, base)
    p.lineTo(cx - w / 2, base + h - w / 2)
    p.arcTo(cx - w / 2, base + h - w, cx + w / 2, base + h, 180, -180)
    p.lineTo(cx + w / 2, base)
    p.close()
    c.setFillColor(HexColor("#030308"))
    c.setStrokeColor(Color(1, 0.8, 0.45, alpha=0.55))
    c.setLineWidth(1.2)
    c.drawPath(p, stroke=1, fill=1)
    # glassy sheen
    c.setStrokeColor(Color(0.7, 0.75, 0.95, alpha=0.12))
    c.setLineWidth(0.6)
    for k in range(5):
        x = cx - w * 0.35 + k * w * 0.07
        c.line(x, base + h * 0.15, x + w * 0.08, base + h * 0.75)
    # crack of light
    c.setStrokeColor(Color(1, 0.85, 0.5, alpha=0.95))
    c.setLineWidth(1.0)
    x, y = cx + w * 0.02, base + h * 0.92
    pts = [(x, y)]
    while y > base + h * 0.06:
        y -= h * (0.05 + rnd.random() * 0.06)
        x += (rnd.random() - 0.5) * w * 0.14
        pts.append((x, y))
    cp = c.beginPath()
    cp.moveTo(*pts[0])
    for q in pts[1:]:
        cp.lineTo(*q)
    c.drawPath(cp, stroke=1, fill=0)
    c.setStrokeColor(Color(1, 0.8, 0.4, alpha=0.25))
    c.setLineWidth(4)
    c.drawPath(cp, stroke=1, fill=0)
    c.restoreState()
    # the clay lamp
    lx, ly = cx - w * 0.82, base + h * 0.08
    glow(c, lx, ly + 12, 70, glowcol, 0.7)
    c.saveState()
    c.setFillColor(HexColor("#2b1a10"))
    c.ellipse(lx - 14, ly - 3, lx + 14, ly + 9, stroke=0, fill=1)
    c.setFillColor(HexColor("#3a2414"))
    c.ellipse(lx + 8, ly + 2, lx + 22, ly + 7, stroke=0, fill=1)
    c.setFillColor(Color(1, 0.9, 0.55, alpha=1))
    p = c.beginPath()
    p.moveTo(lx + 19, ly + 7)
    p.curveTo(lx + 15, ly + 13, lx + 19, ly + 20, lx + 21, ly + 26)
    p.curveTo(lx + 24, ly + 19, lx + 26, ly + 12, lx + 21, ly + 7)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


def lantern_field(c, x0, y0, w, h, n, rnd, hexcol, avoid=None):
    """Tiny lit lanterns scattered over cave walls."""
    for _ in range(n):
        x = x0 + rnd.random() * w
        y = y0 + rnd.random() * h
        if avoid and avoid(x, y):
            continue
        a = 0.4 + rnd.random() * 0.6
        r = 0.9 + rnd.random() * 1.2
        glow(c, x, y, r * 5, hexcol, a * 0.35, steps=8)
        c.setFillColor(rgba(hexcol, a))
        c.circle(x, y, r, stroke=0, fill=1)
        c.setStrokeColor(Color(0, 0, 0, alpha=0.5))
        c.setLineWidth(0.3)
        c.line(x, y + r, x, y + r + 5)


# ---------------------------------------------------------------- typography
def spaced(c, text, x, y, font, size, fill, tracking=0.0, center=True, shadow=True):
    w = pdfmetrics.stringWidth(text, font, size) + tracking * (len(text) - 1)
    sx = x - w / 2 if center else x
    if shadow:
        c.setFillColor(Color(0, 0, 0, alpha=0.55))
        _draw_tracked(c, text, sx + 1.2, y - 1.4, font, size, tracking)
    c.setFillColor(fill)
    _draw_tracked(c, text, sx, y, font, size, tracking)
    return w


def _draw_tracked(c, text, x, y, font, size, tracking):
    c.saveState()
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setCharSpace(tracking)
    t.textOut(text)
    c.drawText(t)
    c.restoreState()


def fit_size(text, font, max_w, start, tracking_ratio=0.06):
    size = start
    while size > 8:
        w = pdfmetrics.stringWidth(text, font, size) + size * tracking_ratio * (len(text) - 1)
        if w <= max_w:
            return size
        size -= 0.5
    return size


def front_type(c, b, x0, W, H, accent):
    """Series line, title block, author: the same layout on paperback and ebook fronts."""
    gold = HexColor(accent)
    cx = x0 + W / 2
    spaced(c, "%s  ·  %s" % (b["number"], SERIES.upper()), cx, H - SAFE - 0.32 * inch,
           "Cinzel", 9.5 * W / TRIM_W, Color(0.92, 0.9, 0.85, alpha=0.9), tracking=2.2 * W / TRIM_W)
    # title
    pre_size = 19 * W / TRIM_W
    spaced(c, b["pre"], cx, H - 1.35 * inch * H / TRIM_H, "Cinzel", pre_size, gold, tracking=pre_size * 0.18)
    main_size = fit_size(b["main"], "Cinzel-Bold", W - 2 * SAFE - 0.2 * inch, 62 * W / TRIM_W, 0.08)
    y = H - 1.35 * inch * H / TRIM_H - main_size * 1.08
    # soft glow behind the title
    c.saveState()
    c.setFillColor(Color(0, 0, 0, alpha=0.35))
    spaced(c, b["main"], cx + 2, y - 2.5, "Cinzel-Bold", main_size, Color(0, 0, 0, alpha=0.6),
           tracking=main_size * 0.08, shadow=False)
    c.restoreState()
    spaced(c, b["main"], cx, y, "Cinzel-Bold", main_size, gold, tracking=main_size * 0.08, shadow=False)
    # thin rules with a diamond
    ry = y - main_size * 0.42
    c.setStrokeColor(Color(gold.red, gold.green, gold.blue, alpha=0.8))
    c.setLineWidth(0.7)
    c.line(cx - 1.5 * inch, ry, cx - 0.14 * inch, ry)
    c.line(cx + 0.14 * inch, ry, cx + 1.5 * inch, ry)
    c.setFillColor(gold)
    d = 0.06 * inch
    p = c.beginPath()
    p.moveTo(cx, ry + d); p.lineTo(cx + d, ry); p.lineTo(cx, ry - d); p.lineTo(cx - d, ry); p.close()
    c.drawPath(p, stroke=0, fill=1)
    # tagline + author
    spaced(c, b["tagline"], cx, ry - 0.36 * inch, "Garamond-Italic", 14 * W / TRIM_W,
           Color(0.95, 0.93, 0.88, alpha=0.92))
    spaced(c, AUTHOR.upper(), cx, SAFE + 0.22 * inch, "Cinzel-Bold", 15 * W / TRIM_W,
           Color(0.96, 0.94, 0.88, alpha=0.96), tracking=3.2 * W / TRIM_W)


# ---------------------------------------------------------------- front art
def front_art(c, key, b, x0, W, H, seed):
    rnd = random.Random(seed)
    if key == "book1":
        # the crack in the net where gold breaks through
        lattice(c, x0 + W / 2, H * 0.66, W * 1.15, H * 0.62, 26 * W / TRIM_W, 0.32, rnd,
                gold_from=(x0 + W * 0.5, H * 0.42, W * 0.42))
        glow(c, x0 + W * 0.5, H * 0.3, W * 0.62, b["glow"], 0.8)
        mountains(c, x0, W, H * 0.26, [H * 0.2, H * 0.28, H * 0.17, H * 0.24], "#0b0710", 0.9, rnd)
        glow(c, x0 + W * 0.5, H * 0.25, W * 0.32, "#ffb35a", 0.9)
        mountains(c, x0, W, H * 0.12, [H * 0.09, H * 0.13, H * 0.08, H * 0.11, H * 0.07], "#050307", 1.0, rnd)
        sparks(c, x0 + W * 0.47, H * 0.255, W * 0.12, H * 0.5, 420, rnd, "#ffd27a")
        anvil(c, x0 + W * 0.53, H * 0.155, W * 0.3)
        # ground
        c.setFillColor(HexColor("#050307"))
        c.rect(x0 - BLEED, -BLEED, W + 2 * BLEED, H * 0.16 + BLEED, stroke=0, fill=1)
    else:
        # cave walls hung with lanterns, the sealed door, the Key above
        lattice(c, x0 + W / 2, H * 0.7, W * 1.15, H * 0.55, 26 * W / TRIM_W, 0.22, rnd,
                gold_from=(x0 + W * 0.5, H * 0.56, W * 0.3))
        glow(c, x0 + W * 0.5, H * 0.52, W * 0.55, b["glow"], 0.55)
        # cave mouth: dark walls left and right
        c.saveState()
        c.setFillColor(HexColor("#020306"))
        for side in (-1, 1):
            p = c.beginPath()
            edge = x0 + (0 if side < 0 else W)
            out = edge + side * BLEED * 2
            p.moveTo(out, -BLEED)
            p.lineTo(out, H + BLEED)
            p.lineTo(edge - side * W * 0.04, H + BLEED)
            p.curveTo(edge - side * W * 0.34, H * 0.78, edge - side * W * 0.22, H * 0.42, edge - side * W * 0.3, H * 0.14)
            p.lineTo(edge - side * W * 0.34, -BLEED)
            p.close()
            c.drawPath(p, stroke=0, fill=1)
        c.restoreState()
        lantern_field(c, x0, H * 0.1, W * 0.28, H * 0.78, 70, rnd, b["glow"])
        lantern_field(c, x0 + W * 0.72, H * 0.1, W * 0.28, H * 0.78, 70, rnd, b["glow"])
        key_of_shadows(c, x0 + W * 0.5, H * 0.47, W * 0.23, -18)
        door_and_lamp(c, x0 + W * 0.52, H * 0.12, W * 0.28, H * 0.22, rnd, b["glow"])
        c.setFillColor(HexColor("#020306"))
        c.rect(x0 - BLEED, -BLEED, W + 2 * BLEED, H * 0.12 + BLEED, stroke=0, fill=1)


# ---------------------------------------------------------------- back + spine
def back_panel(c, b, x0, W, H):
    gold = HexColor(b["accent"])
    cx = x0 + W / 2
    spaced(c, b["tagline"].upper(), cx, H - SAFE - 0.55 * inch, "Cinzel-Bold", 15,
           gold, tracking=2.4)
    st = ParagraphStyle("blurb", fontName="Garamond", fontSize=11.6, leading=16, alignment=TA_JUSTIFY,
                        textColor=Color(0.94, 0.92, 0.88), spaceAfter=8, firstLineIndent=0)
    last = ParagraphStyle("last", parent=st, fontName="Garamond-Semi", alignment=TA_CENTER,
                          textColor=gold, fontSize=12.5, spaceBefore=4)
    kick = ParagraphStyle("kick", parent=st, fontName="Garamond-Italic", alignment=TA_CENTER, fontSize=12.5)
    fw = W - 2 * (SAFE + 0.3 * inch)
    paras = [Paragraph(t, st) for t in b["blurb"][:-1]] + [Paragraph(b["blurb"][-1], last)]
    paras += [Paragraph(b["kicker"], kick)]
    # dark veil so the text reads over the art
    top = H - SAFE - 0.85 * inch
    used = 0
    for para in paras:
        _, h = para.wrap(fw, H)
        used += h + para.getSpaceBefore() + para.getSpaceAfter()
    bottom = max(SAFE + 1.75 * inch, top - used - 0.1 * inch)
    c.saveState()
    c.setFillColor(Color(0, 0, 0, alpha=0.38))
    c.roundRect(x0 + SAFE + 0.1 * inch, bottom - 0.1 * inch, W - 2 * SAFE - 0.2 * inch, top - bottom + 0.2 * inch,
                8, stroke=0, fill=1)
    c.restoreState()
    f = Frame(x0 + SAFE + 0.3 * inch, bottom, fw, top - bottom, leftPadding=0, rightPadding=0,
              topPadding=0, bottomPadding=0, showBoundary=0)
    f.addFromList(paras, c)
    # genre + series line, bottom-left (barcode area is kept clear at bottom-right)
    c.setFillColor(Color(0.9, 0.88, 0.82, alpha=0.85))
    c.setFont("Cinzel", 8.5)
    c.drawString(x0 + SAFE + 0.1 * inch, SAFE + 0.62 * inch, "EPIC FANTASY  ·  LITRPG")
    c.setFont("Garamond-Italic", 10)
    c.drawString(x0 + SAFE + 0.1 * inch, SAFE + 0.4 * inch, "%s of %s" % (b["number"].title(), SERIES))
    c.setFont("Cinzel", 8.5)
    c.drawString(x0 + SAFE + 0.1 * inch, SAFE + 0.18 * inch, AUTHOR.upper())


def spine(c, b, sx, sw, H):
    gold = HexColor(b["accent"])
    c.saveState()
    c.setFillColor(Color(0, 0, 0, alpha=0.35))
    c.rect(sx, -BLEED, sw, H + 2 * BLEED, stroke=0, fill=1)
    c.setStrokeColor(Color(gold.red, gold.green, gold.blue, alpha=0.6))
    c.setLineWidth(0.5)
    margin = 0.0625 * inch
    c.line(sx + margin * 1.5, H * 0.08, sx + margin * 1.5, H * 0.92)
    c.line(sx + sw - margin * 1.5, H * 0.08, sx + sw - margin * 1.5, H * 0.92)
    # text runs top to bottom (US convention); in rotated space x runs down the spine
    c.translate(sx + sw / 2, H)
    c.rotate(-90)
    cap = (sw - 4 * margin)
    num = {"BOOK ONE": "I", "BOOK TWO": "II"}[b["number"]]
    c.setFillColor(gold)
    c.setFont("Cinzel-Bold", cap * 0.5)
    c.drawCentredString(0.75 * inch, -cap * 0.18, num)
    small = min(cap * 0.36, 13)
    auth_w = pdfmetrics.stringWidth(AUTHOR.upper(), "Cinzel", small) + small * 0.12 * (len(AUTHOR) - 1)
    c.setFillColor(Color(0.95, 0.93, 0.88))
    t = c.beginText(H - 0.6 * inch - auth_w, -small * 0.35)
    t.setFont("Cinzel", small); t.setCharSpace(small * 0.12); t.textOut(AUTHOR.upper())
    c.drawText(t)
    title = "%s %s" % (b["pre"], b["main"])
    lo, hi = 1.3 * inch, H - 0.9 * inch - auth_w
    size = fit_size(title, "Cinzel-Bold", (hi - lo) - 0.3 * inch, min(cap * 0.62, 30), 0.06)
    tw = pdfmetrics.stringWidth(title, "Cinzel-Bold", size) + size * 0.06 * (len(title) - 1)
    t = c.beginText((lo + hi) / 2 - tw / 2, -size * 0.35)
    t.setFont("Cinzel-Bold", size); t.setCharSpace(size * 0.06); t.setFillColor(gold); t.textOut(title)
    c.drawText(t)
    c.restoreState()


# ---------------------------------------------------------------- outputs
def paperback(key, paper):
    b = BOOKS[key]
    pages = page_count(key)
    sw = pages * PAPER[paper] * inch
    total_w = BLEED + TRIM_W + sw + TRIM_W + BLEED
    total_h = BLEED + TRIM_H + BLEED
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, "%s-KDP-Paperback-Cover.pdf" % b["file"])
    c = Canvas(path, pagesize=(total_w, total_h))
    c.setTitle("%s %s — paperback cover" % (b["pre"].title(), b["main"].title()))
    c.setAuthor(AUTHOR)
    c.translate(BLEED, BLEED)        # origin at the trim's bottom-left of the back cover
    W, H = TRIM_W, TRIM_H
    back_x, spine_x, front_x = 0, TRIM_W, TRIM_W + sw
    full_w = 2 * TRIM_W + sw
    c.saveState()
    p = c.beginPath(); p.rect(-BLEED, -BLEED, full_w + 2 * BLEED, H + 2 * BLEED); c.clipPath(p, stroke=0)
    c.translate(-BLEED, -BLEED)
    sky(c, full_w + 2 * BLEED, H + 2 * BLEED, b["sky"])
    c.translate(BLEED, BLEED)
    rnd = random.Random(7 if key == "book1" else 11)
    stars(c, -BLEED, 0, full_w + 2 * BLEED, H + BLEED, 900, rnd, 0.25)
    # back art: faint net, low glow and mountains so it feels like the same night
    lattice(c, back_x + W / 2, H * 0.7, W * 1.1, H * 0.5, 26, 0.12, rnd)
    glow(c, back_x + W * 0.5, H * 0.05, W * 0.7, b["glow"], 0.35)
    mountains(c, back_x - BLEED, W + sw, H * 0.09, [H * 0.06, H * 0.09, H * 0.05, H * 0.08], "#050307", 1.0, rnd)
    front_art(c, key, b, front_x, W, H, 21 if key == "book1" else 33)
    c.restoreState()
    back_panel(c, b, back_x, W, H)
    spine(c, b, spine_x, sw, H)
    front_type(c, b, front_x, W, H, b["accent"])
    c.showPage()
    c.save()
    png = path[:-4] + ".png"
    subprocess.run(["pdftoppm", "-r", "300", "-singlefile", "-png", path, png[:-4]], check=True)
    print("%s: %d pages, %s paper, spine %.4f in, cover %.4f x %.4f in -> %s" % (
        b["main"].title(), pages, paper, sw / inch, total_w / inch, total_h / inch, os.path.relpath(path, HERE)))
    return sw


def ebook_front(key, w_in, h_in, px_w, px_h, name):
    """Front cover alone at an arbitrary trim (no bleed)."""
    b = BOOKS[key]
    W, H = w_in * inch, h_in * inch
    tmp = os.path.join(OUT, "_%s_%s.pdf" % (b["file"], name))
    c = Canvas(tmp, pagesize=(W, H))
    c.saveState()
    sky(c, W, H, b["sky"])
    rnd = random.Random(5)
    stars(c, 0, 0, W, H, int(450 * (W * H) / (TRIM_W * TRIM_H)), rnd, 0.3)
    # scale the 6x9 art into this trim, centred on width
    sx, sy = W / TRIM_W, H / TRIM_H
    c.scale(sx, sy)
    front_art(c, key, b, 0, TRIM_W, TRIM_H, 21 if key == "book1" else 33)
    c.restoreState()
    front_type(c, b, 0, W, H, b["accent"])
    c.showPage()
    c.save()
    base = tmp[:-4]
    subprocess.run(["pdftoppm", "-singlefile", "-png", "-scale-to-x", str(px_w), "-scale-to-y", str(px_h),
                    tmp, base], check=True)
    out = os.path.join(OUT, "%s-%s.jpg" % (b["file"], name))
    Image.open(base + ".png").convert("RGB").save(out, quality=94, dpi=(300, 300))
    os.remove(base + ".png")
    os.remove(tmp)
    print("  %s -> %s (%dx%d)" % (name, os.path.relpath(out, HERE), px_w, px_h))


def main():
    args = sys.argv[1:]
    paper = "white"
    if "--paper" in args:
        paper = args[args.index("--paper") + 1]
        args = [a for a in args if a not in ("--paper", paper)]
    register_fonts()
    for key in (args or ["book1", "book2"]):
        paperback(key, paper)
        ebook_front(key, 6, 9, 1800, 2700, "Front-Cover")
        ebook_front(key, 6, 9.6, 1600, 2560, "Kindle-Cover")


if __name__ == "__main__":
    main()
