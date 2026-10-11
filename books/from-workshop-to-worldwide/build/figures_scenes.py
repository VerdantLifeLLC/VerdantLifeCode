"""Flat scene illustrations (part openers, introduction, closing)."""
from svglib import *

SCENES = {}


def scene(name):
    def deco(fn):
        SCENES[name] = fn
        return fn
    return deco


def shadow(cx, cy, rx, ry=None, op=0.15):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry or rx * 0.12}" fill="{INK}" fill-opacity="{op}"/>'


def backdrop(W, H, cx=None, cy=None, r=None):
    cx = cx or W / 2
    cy = cy or H / 2
    r = r or H * 0.46
    return circle(cx, cy, r, LSAGE) + circle(cx, cy, r - 18, "none", WHITE, 3, 'stroke-dasharray="2 12"')


def hammer_g(x, y, s=1.0, rot=0):
    return (f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">'
            + rect(-6, -10, 12, 120, 5, WOOD, DWOOD, 3) + rect(-38, -34, 76, 28, 6, GRAY, INK, 3) + rect(30, -34, 14, 28, 3, INK) + '</g>')


def wrench_g(x, y, s=1.0, rot=0):
    return (f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">'
            + rect(-8, 0, 16, 110, 8, GRAY, INK, 3) + circle(0, -6, 22, GRAY, INK, 3) + rect(-8, -34, 16, 26, 2, LSAGE) + '</g>')


def saw_g(x, y, s=1.0, rot=0):
    teeth = "".join(f"L{-60 + k * 10} 46 L{-55 + k * 10} 52 " for k in range(13))
    return (f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">'
            + path(f"M-60 0 L70 0 L70 46 {teeth} L-60 46 Z", LGRAY, INK, 3) + rect(-100, -6, 46, 56, 14, COPPER, DWOOD, 3) + rect(-88, 8, 22, 26, 8, CREAM) + '</g>')


def sign_g(x, y, w=180, h=100, label="42", sub=None):
    b = rect(x - w / 2, y - h / 2, w, h, 12, TAN, DWOOD, 4)
    for k in range(4):
        yy = y - h / 2 + 18 + k * (h - 30) / 3
        b += path(f"M{x - w / 2 + 12} {yy} C{x - w / 6} {yy - 6} {x + w / 6} {yy + 6} {x + w / 2 - 12} {yy}", stroke=WOOD, sw=2, extra='stroke-opacity="0.6"')
    b += text(x, y + (h * 0.18 if not sub else h * 0.05), label, int(h * 0.46), 800, DWOOD, "middle")
    if sub:
        b += text(x, y + h * 0.33, sub, int(h * 0.14), 700, DWOOD, "middle", ls=2)
    return b


def box_g(x, y, w=120, h=80):
    b = rect(x - w / 2, y - h / 2, w, h, 6, "#D9B98C", DWOOD, 3)
    b += path(f"M{x - w / 2} {y - h / 2} L{x - w / 2 + 16} {y - h / 2 - 22} L{x + w / 2 + 16} {y - h / 2 - 22} L{x + w / 2} {y - h / 2} Z", "#E8CFA8", DWOOD, 3)
    b += path(f"M{x + w / 2} {y - h / 2} L{x + w / 2 + 16} {y - h / 2 - 22} L{x + w / 2 + 16} {y + h / 2 - 22} L{x + w / 2} {y + h / 2} Z", "#C9A574", DWOOD, 3)
    b += rect(x - 10, y - h / 2, 20, h, 0, "#C9A574")
    return b


def plant_g(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            + path("M0 0 C-4 -40 -40 -60 -60 -52 C-56 -30 -30 -10 0 -14", G2) + path("M0 -10 C6 -60 40 -80 66 -72 C60 -44 30 -24 0 -24", SAGE)
            + path("M0 0 L0 -30", stroke=G, sw=5) + path("M-30 0 L30 0 L22 50 L-22 50 Z", COPPER, DWOOD, 3) + '</g>')


def globe_g(cx, cy, r):
    b = circle(cx, cy, r, "#CFE3E8", G, 4)
    b += path(f"M{cx - r * .6} {cy - r * .55} C{cx - r * .2} {cy - r * .75} {cx + r * .05} {cy - r * .4} {cx - r * .1} {cy - r * .15} C{cx - r * .3} {cy + r * .05} {cx - r * .5} {cy - r * .1} {cx - r * .6} {cy - r * .55} Z", SAGE)
    b += path(f"M{cx + r * .15} {cy + r * .05} C{cx + r * .5} {cy - r * .1} {cx + r * .75} {cy + r * .2} {cx + r * .55} {cy + r * .55} C{cx + r * .35} {cy + r * .75} {cx + r * .1} {cy + r * .45} {cx + r * .15} {cy + r * .05} Z", SAGE)
    b += path(f"M{cx + r * .25} {cy - r * .7} C{cx + r * .5} {cy - r * .75} {cx + r * .7} {cy - r * .5} {cx + r * .5} {cy - r * .35} Z", SAGE)
    b += path(f"M{cx - r} {cy} L{cx + r} {cy}", stroke=G, sw=2, extra='stroke-opacity="0.35"')
    b += path(f"M{cx} {cy - r} C{cx - r * .6} {cy - r * .4} {cx - r * .6} {cy + r * .4} {cx} {cy + r}", stroke=G, sw=2, extra='stroke-opacity="0.35"')
    b += path(f"M{cx} {cy - r} C{cx + r * .6} {cy - r * .4} {cx + r * .6} {cy + r * .4} {cx} {cy + r}", stroke=G, sw=2, extra='stroke-opacity="0.35"')
    return b


def laptop_g(x, y, w=240, screen=""):
    h = w * 0.62
    b = rect(x - w / 2, y - h, w, h, 10, INK) + rect(x - w / 2 + 10, y - h + 10, w - 20, h - 20, 4, WHITE)
    b += path(f"M{x - w / 2 - 30} {y} L{x + w / 2 + 30} {y} L{x + w / 2 + 14} {y + 16} L{x - w / 2 - 14} {y + 16} Z", GRAY, INK, 3)
    return b + screen


def person_g(x, y, shirt=G2, skin="#E2B48C", hair=DWOOD, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            + path("M-44 120 C-44 60 44 60 44 120 Z", shirt) + circle(0, 26, 28, skin) + path("M-28 22 C-30 -6 30 -8 28 20 C18 6 -14 8 -28 22 Z", hair) + '</g>')


@scene("fig-scene-workshop")
def scene_workshop():
    W, H = 1000, 560
    b = rect(0, 0, W, H, 24, CREAM)
    # window with globe
    b += rect(620, 50, 300, 230, 12, "#CFE3E8", DWOOD, 6)
    b += globe_g(770, 168, 82) + path("M690 260 L850 260", stroke=WHITE, sw=0)
    b += line(770, 50, 770, 280, DWOOD, 6) + line(620, 165, 920, 165, DWOOD, 6, cap="butt")
    b = b.replace("", "")
    # pegboard
    b += rect(70, 50, 480, 250, 12, "#E9D7B7", WOOD, 4)
    for r in range(6):
        for c in range(14):
            b += circle(100 + c * 33, 72 + r * 40, 3, WOOD, extra='fill-opacity="0.6"')
    b += hammer_g(150, 120, 0.9, -10) + wrench_g(260, 120, 0.85, 8) + saw_g(430, 120, 0.9, 0)
    b += rect(470, 220, 60, 40, 4, G2) + rect(480, 210, 40, 12, 3, G)
    # bench
    b += rect(40, 360, 920, 34, 6, WOOD, DWOOD, 4) + rect(70, 394, 30, 150, 4, DWOOD) + rect(900, 394, 30, 150, 4, DWOOD)
    b += rect(100, 470, 800, 16, 4, DWOOD)
    # items on bench
    b += shadow(240, 360, 130) + sign_g(240, 300, 220, 110, "Made by Hand", None).replace('font-size="50"', 'font-size="26"')
    b += shadow(560, 362, 160) + laptop_g(560, 346, 230, rect(462, 218, 196, 40, 4, LSAGE) + rect(470, 266, 80, 60, 4, TAN) + rect(560, 266, 90, 12, 3, LGRAY) + rect(560, 286, 70, 12, 3, LGRAY) + rect(560, 306, 50, 14, 4, COPPER))
    b += shadow(830, 362, 80) + box_g(820, 322, 110, 70)
    b += rect(780, 300, 50, 26, 3, WHITE, GRAY, 2)
    # shavings
    for k, (sx, sy) in enumerate([(120, 354), (360, 352), (700, 354), (420, 356)]):
        b += path(f"M{sx} {sy} c8 -10 18 -6 14 4 c-4 8 -14 4 -10 -2", stroke=TAN, sw=3)
    return svg(W, H, b)


@scene("fig-part-foundations")
def part_foundations():
    W, H = 1000, 700
    b = backdrop(W, H, 500, 340, 310)
    # lightbulb with seedling
    b += path("M500 110 C400 110 340 190 350 270 C358 340 410 370 420 430 L580 430 C590 370 642 340 650 270 C660 190 600 110 500 110 Z", WHITE, G, 8)
    b += rect(430, 440, 140, 26, 8, GRAY) + rect(440, 472, 120, 24, 8, GRAY) + rect(462, 502, 76, 20, 10, INK)
    b += path("M500 430 L500 300", stroke=G, sw=8)
    b += path("M500 340 C500 300 460 270 420 276 C420 316 456 340 500 340 Z", G2)
    b += path("M500 310 C500 250 540 220 590 224 C590 276 548 312 500 310 Z", SAGE)
    b += path("M440 430 C450 410 550 410 560 430 Z", WOOD)
    for a in range(-60, 61, 30):
        import math
        r1, r2 = 200, 240
        ang = math.radians(a - 90)
        b += line(500 + r1 * math.cos(ang), 270 + r1 * math.sin(ang), 500 + r2 * math.cos(ang), 270 + r2 * math.sin(ang), COPPER, 7)
    # tools lying on ground
    b += shadow(500, 600, 330, 18)
    b += rect(200, 570, 220, 22, 6, TAN, DWOOD, 3)
    for k in range(10):
        b += line(212 + k * 20, 570, 212 + k * 20, 580 if k % 2 else 584, DWOOD, 2)
    b += path("M600 590 L780 560 L790 572 L610 600 Z", "#F2C14E", DWOOD, 3) + path("M780 560 L810 562 L790 572 Z", INK)
    return svg(W, H, b)


@scene("fig-part-real")
def part_real():
    W, H = 1000, 700
    b = backdrop(W, H, 500, 340, 310)
    b += shadow(470, 600, 300, 20)
    b += rect(250, 250, 440, 350, 6, CREAM, DWOOD, 5)
    # awning stripes
    for k in range(8):
        col = G if k % 2 == 0 else WHITE
        x = 230 + k * 60
        b += path(f"M{x} 190 L{x + 60} 190 L{x + 60} 260 C{x + 45} 280 {x + 15} 280 {x} 260 Z", col, G, 3)
    b += rect(220, 150, 500, 44, 8, G2) + text(470, 182, "OPEN FOR BUSINESS", 24, 800, WHITE, "middle", ls=3)
    b += rect(290, 330, 180, 160, 6, "#CFE3E8", DWOOD, 5) + sign_g(380, 420, 120, 60, "42")
    b += rect(520, 330, 120, 270, 6, G2, DWOOD, 5) + circle(620, 470, 7, TAN)
    b += rect(530, 360, 100, 40, 4, WHITE) + text(580, 387, "OPEN", 18, 800, G, "middle", ls=2)
    b += plant_g(250, 560, 0.7)
    # clipboard checklist
    b += f'<g transform="translate(720,330) rotate(8)">' + rect(0, 0, 170, 220, 10, WOOD, DWOOD, 4) + rect(14, 20, 142, 186, 4, WHITE) + rect(50, -12, 70, 28, 6, GRAY)
    for k in range(4):
        b += icon("check", 38, 52 + k * 42, 26, G, 10) + rect(58, 46 + k * 42, 80, 10, 4, LGRAY)
    b += '</g>'
    return svg(W, H, b)


@scene("fig-part-sell")
def part_sell():
    W, H = 1000, 700
    b = backdrop(W, H, 500, 340, 310)
    b += shadow(520, 600, 330, 18)
    # table
    b += rect(170, 560, 660, 26, 6, WOOD, DWOOD, 4)
    # product sign on stand
    b += sign_g(330, 470, 200, 110, "42") + rect(320, 525, 20, 36, 2, DWOOD)
    # tripod + phone
    b += line(640, 420, 590, 560, GRAY, 6) + line(640, 420, 690, 560, GRAY, 6) + line(640, 420, 640, 560, GRAY, 6)
    b += rect(570, 300, 140, 120, 14, INK) + rect(580, 310, 120, 100, 6, LSAGE) + sign_g(640, 360, 80, 44, "42")
    b += circle(700, 300, 0)
    # light rays from window corner
    b += rect(250, 120, 150, 190, 8, "#CFE3E8", DWOOD, 6) + line(325, 120, 325, 310, DWOOD, 5) + line(250, 215, 400, 215, DWOOD, 5)
    for k in range(4):
        b += line(300 + k * 22, 320, 290 + k * 30, 405, TAN, 4, "10 10")
    # price tag
    b += f'<g transform="translate(720,140) rotate(18)">' + path("M0 60 L60 0 L170 0 L170 120 L60 120 Z", COPPER, DWOOD, 4) + circle(45, 60, 10, CREAM) + text(110, 76, "$89", 40, 800, WHITE, "middle") + '</g>'
    b += icon("sparkle", 830, 360, 40, COPPER, 5, fill=COPPER) + icon("sparkle", 480, 240, 28, G, 5, fill=G)
    return svg(W, H, b)


@scene("fig-part-customers")
def part_customers():
    W, H = 1000, 700
    b = backdrop(W, H, 500, 340, 310)
    b += shadow(500, 610, 330, 18)
    # megaphone
    b += f'<g transform="translate(250,330) rotate(-14)">' + path("M0 -40 L60 -40 L210 -120 L210 120 L60 40 L0 40 Z", COPPER, DWOOD, 5) + rect(-30, -34, 36, 68, 8, G) + path("M70 40 L90 110 L130 110 L112 52", G2, DWOOD, 4) + '</g>'
    # sound waves
    for k in range(3):
        r = 70 + k * 40
        b += path(f"M{520 + k * 10} {230 - k * 20} C{560 + k * 30} {270 - k * 10} {560 + k * 30} {350 + k * 10} {520 + k * 10} {390 + k * 20}", stroke=G, sw=6)
    # people with hearts and stars
    b += person_g(690, 400, G2, s=1.0) + person_g(800, 420, COPPER, "#C98F65", INK, 0.9) + person_g(600, 450, SAGE, "#F0C9A4", "#3B2A1E", 0.85)
    b += circle(740, 210, 50, WHITE, G, 4) + icon("heart", 740, 212, 54, COPPER, 7, fill=COPPER)
    b += circle(860, 300, 40, WHITE, G, 4) + icon("star", 860, 300, 48, "#E3A93B", 6, fill="#E3A93B")
    b += path("M600 280 L700 280 L700 340 L640 340 L620 360 L622 340 L600 340 Z", WHITE, G, 4) + text(650, 318, "Love it!", 15, 800, G, "middle")
    return svg(W, H, b)


@scene("fig-part-grow")
def part_grow():
    W, H = 1000, 700
    b = backdrop(W, H, 500, 340, 310)
    b += circle(760, 170, 60, "#F2C14E")
    b += shadow(500, 600, 340, 18)
    # rising bars
    for k, h in enumerate([90, 150, 220, 300]):
        x = 260 + k * 110
        b += rect(x, 590 - h, 80, h, 8, [LSAGE, SAGE, G2, G][k], G, 3)
    b += path("M260 470 L370 410 L480 350 L590 270 L700 190", stroke=COPPER, sw=8) + path("M660 186 L706 186 L706 232", stroke=COPPER, sw=8)
    # plant growing from coins
    for k in range(5):
        b += f'<ellipse cx="770" cy="{585 - k * 18}" rx="60" ry="16" fill="#E3A93B" stroke="{DWOOD}" stroke-width="3"/>'
    b += path("M770 500 L770 370", stroke=G, sw=8)
    b += path("M770 440 C770 400 730 380 690 386 C694 424 730 444 770 440 Z", G2)
    b += path("M770 400 C770 350 810 330 850 334 C846 380 810 404 770 400 Z", SAGE)
    b += path("M770 372 C760 340 776 312 800 300 C808 330 796 360 770 372 Z", G)
    return svg(W, H, b)


@scene("fig-part-toolkit")
def part_toolkit():
    W, H = 1000, 700
    b = backdrop(W, H, 500, 340, 310)
    b += shadow(500, 612, 330, 18)
    # tools sticking out
    b += hammer_g(380, 300, 1.2, -18) + wrench_g(520, 290, 1.1, 12)
    b += rect(590, 230, 26, 200, 4, "#F2C14E", DWOOD, 3)
    for k in range(9):
        b += line(590, 250 + k * 20, 602 if k % 2 else 606, 250 + k * 20, DWOOD, 2)
    # toolbox
    b += path("M230 400 L770 400 L750 600 L250 600 Z", G, INK, 5) + rect(220, 380, 560, 50, 8, G2, INK, 5)
    b += rect(420, 340, 160, 22, 10, "none", INK, 10)
    b += rect(470, 420, 60, 34, 6, TAN, DWOOD, 3)
    b += text(500, 530, "TOOLKIT", 36, 800, WHITE, "middle", ls=6)
    # calendar & checklist
    b += f'<g transform="translate(110,180) rotate(-8)">' + rect(0, 0, 150, 150, 10, WHITE, G, 4) + rect(0, 0, 150, 38, 10, COPPER) + text(75, 104, "30", 52, 800, G, "middle") + text(75, 132, "DAYS", 14, 800, GRAY, "middle", ls=3) + '</g>'
    b += f'<g transform="translate(760,170) rotate(9)">' + rect(0, 0, 140, 180, 10, WHITE, G, 4)
    for k in range(4):
        b += icon("check", 30, 34 + k * 38, 24, G, 10) + rect(50, 28 + k * 38, 70, 10, 4, LGRAY)
    b += '</g>'
    return svg(W, H, b)


@scene("fig-final")
def final_scene():
    W, H = 1000, 520
    b = rect(0, 0, W, H, 24, CREAM)
    b += circle(760, 250, 150, "#F7DFA6")
    b += globe_g(760, 250, 110)
    # hills
    b += path("M0 360 C200 300 380 340 560 330 C740 320 880 290 1000 300 L1000 520 L0 520 Z", SAGE)
    b += path("M0 420 C220 380 420 420 640 400 C800 386 920 400 1000 410 L1000 520 L0 520 Z", G2)
    # path
    b += path("M210 520 C260 470 360 450 420 420 C500 380 600 370 680 340", stroke=TAN, sw=26)
    b += path("M210 520 C260 470 360 450 420 420 C500 380 600 370 680 340", stroke=WHITE, sw=3, extra='stroke-dasharray="14 16"')
    # workshop
    b += rect(80, 300, 170, 120, 4, COPPER, DWOOD, 4) + path("M66 304 L165 230 L264 304 Z", G, INK, 4)
    b += rect(140, 350, 50, 70, 3, DWOOD) + rect(98, 330, 30, 30, 3, "#F7DFA6", DWOOD, 3) + rect(205, 330, 30, 30, 3, "#F7DFA6", DWOOD, 3)
    b += rect(120, 284, 90, 18, 3, TAN) + text(165, 298, "WORKSHOP", 11, 800, DWOOD, "middle", ls=1)
    b += plant_g(290, 410, 0.45)
    return svg(W, H, b)
