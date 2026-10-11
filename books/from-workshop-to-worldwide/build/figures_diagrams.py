"""Instructional diagrams for From Workshop to Worldwide."""
import math
from svglib import *

FIGS = {}


def fig(name):
    def deco(fn):
        FIGS[name] = fn
        return fn
    return deco


def card(x, y, w, h, fill=WHITE, stroke=LGRAY, r=14, sw=2):
    return rect(x, y, w, h, r, fill, stroke, sw)


@fig("fig-book-map")
def book_map():
    W, H = 1000, 330
    parts = [("Foundations", "seedling"), ("Making It Real", "store"), ("Ready to Sell", "camera"),
             ("Customers & Marketing", "megaphone"), ("Running & Growing", "trend"), ("The Toolkit", "toolbox")]
    b = path("M70 150 C200 60 300 240 420 150 C540 60 640 240 760 150 C840 90 900 120 940 150", stroke=TAN, sw=14)
    b += path("M70 150 C200 60 300 240 420 150 C540 60 640 240 760 150 C840 90 900 120 940 150", stroke=WOOD, sw=2, extra='stroke-dasharray="2 14"')
    xs = [80, 254, 422, 590, 760, 930]
    ys = [150, 166, 150, 166, 150, 150]
    for i, ((lab, ic), x, y) in enumerate(zip(parts, xs, ys)):
        x = min(max(x, 80), 920)
        b += circle(x, y, 50, WHITE, G, 4) + icon(ic, x, y, 54, G, 7)
        b += badge(x + 36, y - 40, i + 1, 16, COPPER)
        t, _ = mtext(x, y + 84, lab, 19, 150, 1.2, "middle", 700, INK)
        b += t
    b += text(500, 40, "YOUR PATH THROUGH THIS BOOK", 18, 700, COPPER, "middle", ls=3)
    return svg(W, H, b)


@fig("fig-sweet-spot")
def sweet_spot():
    W, H = 1000, 640
    b = ""
    r = 190
    c1, c2, c3 = (380, 250), (620, 250), (500, 440)
    b += circle(*c1, r, SAGE, extra='fill-opacity="0.55"') + circle(*c2, r, TAN, extra='fill-opacity="0.6"') + circle(*c3, r, LSAGE, extra='fill-opacity="0.75"')
    b += circle(*c1, r, "none", G, 3) + circle(*c2, r, "none", WOOD, 3) + circle(*c3, r, "none", G2, 3)
    b += text(300, 175, "WHAT YOU", 20, 800, G, "middle") + text(300, 201, "ENJOY", 20, 800, G, "middle")
    b += text(694, 175, "WHAT CUSTOMERS", 20, 800, DWOOD, "middle") + text(694, 201, "WILL PAY FOR", 20, 800, DWOOD, "middle")
    b += text(500, 522, "WHAT YOU CAN", 20, 800, G2, "middle") + text(500, 548, "DELIVER CONSISTENTLY", 20, 800, G2, "middle")
    b += text(500, 196, "Frustration", 17, 600, INK, "middle", italic=True)
    b += text(500, 216, "(can't deliver)", 13, 500, GRAY, "middle")
    b += text(405, 382, "A Hobby", 17, 600, INK, "middle", italic=True)
    b += text(405, 402, "(no buyers)", 13, 500, GRAY, "middle")
    b += text(595, 382, "Burnout", 17, 600, INK, "middle", italic=True)
    b += text(595, 402, "(no joy)", 13, 500, GRAY, "middle")
    b += circle(500, 318, 62, G, WHITE, 4)
    b += text(500, 312, "YOUR", 18, 800, WHITE, "middle") + text(500, 336, "BUSINESS", 18, 800, WHITE, "middle")
    return svg(W, H, b)


@fig("fig-product-service")
def product_service():
    W, H = 1000, 500
    cols = [
        ("PRODUCTS", "box", G, ["Make once, sell anywhere", "Sell while you sleep", "Ships nationwide", "Needs materials & stock"], "Signs, candles, jewelry, soap, prints"),
        ("HYBRID", "repeat", COPPER, ["Two ways to buy", "Smooths seasonal swings", "Higher customer value", "More to manage"], "Signs + installation, photos + prints"),
        ("SERVICES", "wrench", G2, ["Start this week", "Low startup cost", "High margins", "Income tied to hours"], "Repairs, cleaning, tutoring, design"),
    ]
    b = ""
    for i, (title, ic, col, pts, ex) in enumerate(cols):
        x = 30 + i * 320
        b += card(x, 20, 300, 460, WHITE, col, 16, 3)
        b += rect(x, 20, 300, 120, 16, col) + rect(x, 100, 300, 40, 0, col)
        b += icon(ic, x + 150, 66, 56, WHITE, 7)
        b += text(x + 150, 126, title, 22, 800, WHITE, "middle", ls=2)
        for j, p in enumerate(pts):
            yy = 182 + j * 52
            neg = j == 3
            b += icon("x" if neg else "check", x + 34, yy - 7, 26, COPPER if neg else col, 9)
            b += text(x + 58, yy, p, 17, 600 if not neg else 500, INK if not neg else GRAY)
        b += line(x + 24, 384, x + 276, 384, LGRAY, 2)
        b += text(x + 24, 414, "EXAMPLES", 13, 700, col, ls=2)
        t, _ = mtext(x + 24, 440, ex, 16, 252, 1.3, weight=500, fill=GRAY)
        b += t
    return svg(W, H, b)


@fig("fig-validation")
def validation():
    W, H = 1000, 560
    rungs = [("Interest", "People say they like it", "Weak"), ("Search", "People look for it online", ""),
             ("Competition", "Others sell it successfully", ""), ("Commitment", "People give contact info or time", ""),
             ("Money", "People pay, pre-order, or place a deposit", "Proof")]
    b = ""
    b += line(250, 30, 250, 530, WOOD, 14) + line(470, 30, 470, 530, WOOD, 14)
    for i, (t1, t2, tag) in enumerate(rungs):
        y = 480 - i * 100
        b += line(250, y, 470, y, DWOOD, 12)
        shade = [LSAGE, LSAGE, SAGE, SAGE, G][i]
        fg = WHITE if i == 4 else INK
        b += rect(510, y - 38, 400, 76, 12, shade)
        b += badge(545, y, i + 1, 20, COPPER)
        b += text(580, y - 6, t1.upper(), 20, 800, fg, ls=1)
        b += text(580, y + 20, t2, 16, 500, fg)
    b += arrow(150, 500, 150, 60, G, 4)
    b += f'<text x="128" y="280" font-family="{FONT}" font-size="16" font-weight="700" fill="{G}" text-anchor="middle" letter-spacing="2" transform="rotate(-90 128 280)">STRONGER EVIDENCE</text>'
    return svg(W, H, b)


@fig("fig-price-stack")
def price_stack():
    W, H = 1000, 620
    segs = [("Materials", 14.0, TAN), ("Packaging", 4.0, LSAGE), ("Marketplace & payment fees", 9.0, LGRAY),
            ("Overhead", 3.0, SAGE), ("Your labor (1.5 hrs × $25)", 37.5, G2), ("Business profit", 22.5, COPPER)]
    total = sum(s[1] for s in segs)
    x0, y0, bw, bh = 300, 40, 200, 540
    y = y0 + bh
    b = ""
    labels = []
    for name, v, col in segs:
        h = bh * v / total
        y -= h
        b += rect(x0, y + 1, bw, h - 2, 4, col)
        labels.append((name, v, y + h / 2, col))
    # label column with leader lines, spread to avoid collisions
    min_gap = 58
    # place from bottom up
    placed = []
    for i, (name, v, cy, col) in enumerate(labels):
        yy = cy
        if placed and placed[-1] - yy < min_gap:
            yy = placed[-1] - min_gap
        placed.append(yy)
    for (name, v, cy, col), yy in zip(labels, placed):
        b += path(f"M{x0 + bw + 6} {cy:.1f} L{x0 + bw + 40} {cy:.1f} L{x0 + bw + 70} {yy:.1f} L{x0 + bw + 90} {yy:.1f}", stroke=GRAY, sw=2)
        b += circle(x0 + bw + 6, cy, 4, GRAY)
        b += text(x0 + bw + 100, yy - 4, name, 19, 700, INK)
        b += text(x0 + bw + 100, yy + 20, f"${v:,.2f}  ·  {v / total * 100:.0f}%", 17, 500, GRAY)
    b += text(150, 300, "$90", 64, 800, G, "middle")
    b += text(150, 336, "MAYA'S PRICE", 15, 700, GRAY, "middle", ls=2)
    b += text(150, 362, "PER SIGN", 15, 700, GRAY, "middle", ls=2)
    return svg(W, H, b)


@fig("fig-service-pricing")
def service_pricing():
    W, H = 1000, 420
    models = [("Hourly", "clock", "Pay for time", "Unpredictable jobs"), ("Per Project", "clipboard", "Set price, set result", "Defined jobs"),
              ("Packages", "layers", "Good / Better / Best", "Easy choices"), ("Recurring", "cycle", "Monthly or seasonal", "Stable income")]
    b = ""
    for i, (t, ic, s1, s2) in enumerate(models):
        x = 20 + i * 245
        col = [SAGE, G2, G, COPPER][i]
        b += card(x, 20, 225, 300, WHITE, col, 16, 3)
        b += icon_disc(ic, x + 112, 92, 46, col)
        b += text(x + 112, 180, t.upper(), 20, 800, INK, "middle", ls=1)
        b += text(x + 112, 220, s1, 17, 600, G, "middle")
        b += text(x + 112, 250, "Best for:", 14, 600, GRAY, "middle")
        b += text(x + 112, 276, s2, 16, 600, INK, "middle")
        if i < 3:
            b += path(f"M{x + 228} 170 L{x + 240} 170", stroke=GRAY, sw=3)
    b += arrow(60, 370, 940, 370, COPPER, 5)
    b += text(500, 404, "MORE PREDICTABLE INCOME  ·  EASIER TO SCALE", 16, 700, COPPER, "middle", ls=2)
    return svg(W, H, b)


@fig("fig-break-even")
def break_even():
    W, H = 1000, 560
    L, R, T, B = 120, 940, 40, 460
    xmax, ymin, ymax = 20, -300, 300
    X = lambda n: L + (R - L) * n / xmax
    Y = lambda v: T + (B - T) * (ymax - v) / (ymax - ymin)
    b = ""
    # regions
    b += rect(L, Y(0), X(10) - L, B - Y(0), 0, "#F3E3D6")
    b += rect(X(10), T, R - X(10), Y(0) - T, 0, LSAGE)
    for v in range(-300, 301, 100):
        b += line(L, Y(v), R, Y(v), LGRAY if v else GRAY, 1.5 if v else 2.5, cap="butt")
        b += text(L - 14, Y(v) + 6, ("−$" if v < 0 else "$") + str(abs(v)), 16, 500, GRAY, "end")
    for n in range(0, 21, 2):
        b += text(X(n), B + 30, str(n), 16, 500, GRAY, "middle")
    b += text((L + R) / 2, B + 70, "Sales per month", 18, 600, INK, "middle")
    b += f'<text x="40" y="{(T + B) / 2}" font-family="{FONT}" font-size="18" font-weight="600" fill="{INK}" text-anchor="middle" transform="rotate(-90 40 {(T + B) / 2})">Monthly profit</text>'
    b += line(X(0), Y(-300), X(20), Y(300), G, 4)
    b += circle(X(10), Y(0), 10, COPPER, WHITE, 3)
    b += text(X(10) + 18, Y(0) + 34, "Break-even: 10 sales", 18, 700, COPPER)
    b += text(X(3), Y(-200) + 70, "LOSS", 22, 800, COPPER, "middle", ls=3)
    b += text(X(17.5), Y(70), "PROFIT", 22, 800, G, "middle", ls=3)
    b += text(X(10) + 18, Y(0) + 58, "$300 fixed costs ÷ $30 profit per sale", 15, 500, GRAY)
    return svg(W, H, b)


@fig("fig-setup-path")
def setup_path():
    W, H = 1000, 560
    steps = [("Choose a structure", "doc"), ("Register your name", "tag"), ("Get a free EIN", "key"),
             ("Licenses & permits", "clipboard"), ("Sales tax setup", "dollar"), ("Business bank account", "bank"),
             ("Insurance", "shield"), ("Written policies", "doc"), ("Tax savings plan", "chart")]
    b = ""
    pos = []
    for i in range(9):
        row, col = divmod(i, 3)
        if row == 1:
            col = 2 - col
        pos.append((180 + col * 320, 90 + row * 180))
    d = "M" + " L".join(f"{x} {y}" for x, y in pos)
    b += path(d, stroke=TAN, sw=12)
    for i, ((lab, ic), (x, y)) in enumerate(zip(steps, pos)):
        b += circle(x, y, 44, WHITE, G, 4) + icon(ic, x, y, 48, G, 7)
        b += badge(x - 36, y - 34, i + 1, 16)
        tw = len(lab) * 18 * 0.6
        b += rect(x - tw / 2 - 8, y + 54, tw + 16, 26, 6, WHITE)
        b += text(x, y + 72, lab, 18, 700, INK, "middle")
    return svg(W, H, b)


@fig("fig-brand-touchpoints")
def brand_touchpoints():
    W, H = 1000, 640
    cx, cy = 500, 320
    items = [("Name & logo", "tag"), ("Photos", "camera"), ("Listings", "doc"), ("Packaging", "box"),
             ("Communication", "chat"), ("Quality", "star"), ("On-time delivery", "clock"), ("Problem solving", "wrench"),
             ("Reviews", "people")]
    b = circle(cx, cy, 228, "none", LGRAY, 3, 'stroke-dasharray="6 10"')
    b += circle(cx, cy, 104, G) + text(cx, cy - 6, "YOUR", 24, 800, WHITE, "middle", ls=2) + text(cx, cy + 24, "BRAND", 24, 800, WHITE, "middle", ls=2)
    for i, (lab, ic) in enumerate(items):
        a = -math.pi / 2 + i * 2 * math.pi / len(items)
        x, y = cx + 228 * math.cos(a), cy + 228 * math.sin(a)
        b += line(cx + 106 * math.cos(a), cy + 106 * math.sin(a), x - 44 * math.cos(a), y - 44 * math.sin(a), SAGE, 2)
        b += circle(x, y, 42, WHITE, COPPER if i % 2 else G2, 4) + icon(ic, x, y, 44, COPPER if i % 2 else G2, 7)
        tx = x + (60 if math.cos(a) > 0.3 else -60 if math.cos(a) < -0.3 else 0)
        anchor = "start" if math.cos(a) > 0.3 else "end" if math.cos(a) < -0.3 else "middle"
        ty = y + 7 if anchor != "middle" else (y - 56 if math.sin(a) < 0 else y + 68)
        b += text(tx, ty, lab, 19, 700, INK, anchor)
    return svg(W, H, b)


@fig("fig-batch")
def batch():
    W, H = 1000, 470
    tasks = [("Cut", TAN), ("Sand", LSAGE), ("Finish", SAGE), ("Pack", G2)]
    b = text(30, 40, "ONE AT A TIME", 18, 800, COPPER, ls=2) + text(300, 40, "4 setups for every unit · 20 setups for 5 units", 16, 500, GRAY)
    x = 30
    for u in range(5):
        for t, c in tasks:
            b += rect(x, 60, 42, 60, 6, c) + path(f"M{x + 2} 60 L{x + 2} 120", stroke=COPPER, sw=4)
            x += 46
        x += 8
    b += text(30, 150, "Each small copper mark = one tool setup, cleanup, and switch.", 15, 500, GRAY)
    b += line(30, 190, 970, 190, LGRAY, 2)
    b += text(30, 240, "BATCHED", 18, 800, G, ls=2) + text(160, 240, "4 setups total · faster hands · more consistent results", 16, 500, GRAY)
    x = 30
    for t, c in tasks:
        b += path(f"M{x + 2} 260 L{x + 2} 320", stroke=COPPER, sw=4)
        for u in range(5):
            b += rect(x + 6 + u * 44, 260, 40, 60, 6, c)
        b += text(x + 6 + 110, 350, t.upper() + " ×5", 16, 700, INK, "middle")
        x += 240
    b += rect(30, 380, 940, 70, 12, LSAGE)
    b += icon("clock", 76, 415, 40, G, 8)
    b += text(110, 410, "Same five products — far less setup time.", 19, 700, G)
    b += text(110, 436, "Batching often cuts production time by a third or more.", 16, 500, INK)
    return svg(W, H, b)


@fig("fig-service-blueprint")
def service_blueprint():
    W, H = 1000, 360
    groups = [("BEFORE", G2, ["Answer inquiry", "Give quote", "Book & confirm", "Send reminder"]),
              ("DURING", G, ["Arrive on time", "Do the work", "Clean up & review"]),
              ("AFTER", COPPER, ["Collect payment", "Thank & ask review", "Follow up"])]
    b = ""
    x = 20
    n = 1
    for g, col, steps in groups:
        gw = len(steps) * 96
        b += rect(x, 20, gw - 6, 44, 10, col) + text(x + (gw - 6) / 2, 50, g, 18, 800, WHITE, "middle", ls=3)
        for s in steps:
            b += card(x, 80, 90, 170, WHITE, col, 12, 3)
            b += badge(x + 45, 120, n, 22, col)
            t, _ = mtext(x + 45, 190, s, 16, 80, 1.25, "middle", 700, INK)
            b += t
            n += 1
            x += 96
        x += 0
    b += arrow(30, 290, 970, 290, GRAY, 3)
    b += text(500, 332, "Same steps, every job → predictable quality → reputation", 17, 600, G, "middle")
    return svg(W, H, b)


@fig("fig-channels")
def channels():
    W, H = 1000, 420
    ch = [("Marketplaces", "store", "Etsy · Amazon Handmade · eBay"), ("Social", "phone", "Instagram · Facebook · TikTok"),
          ("Local", "pin", "Markets · shops · Google Business"), ("Your website", "laptop", "Shopify · Squarespace · Wix"),
          ("Your list", "mail", "Email · text · past customers")]
    b = ""
    for i, (t, ic, s) in enumerate(ch):
        x = 100 + i * 200
        col = [SAGE, SAGE, G2, G, G][i]
        b += circle(x, 120, 62, col) + icon(ic, x, 120, 64, WHITE, 7)
        b += text(x, 220, t, 20, 800, INK, "middle")
        t2, _ = mtext(x, 250, s, 15, 170, 1.3, "middle", 500, GRAY)
        b += t2
    b += rect(40, 330, 920, 14, 7, LGRAY)
    b += f'<defs><linearGradient id="gch" x1="0" x2="1"><stop offset="0" stop-color="{SAGE}"/><stop offset="1" stop-color="{G}"/></linearGradient></defs>'
    b += rect(40, 330, 920, 14, 7, "url(#gch)")
    b += text(40, 380, "BORROWED AUDIENCE", 15, 800, GRAY, ls=2) + text(40, 402, "Built-in traffic, rules you don't control", 14, 500, GRAY)
    b += text(960, 380, "OWNED AUDIENCE", 15, 800, G, "end", ls=2) + text(960, 402, "Slower to build, yours to keep", 14, 500, GRAY, "end")
    return svg(W, H, b)


@fig("fig-photo-setup")
def photo_setup():
    W, H = 1000, 620
    b = rect(0, 0, W, H, 18, CREAM)
    # window
    b += rect(40, 110, 36, 360, 4, LSAGE, G, 4)
    for yy in (200, 290, 380):
        b += line(40, yy, 76, yy, G, 3)
    b += text(58, 96, "WINDOW", 15, 800, G, "middle", ls=2)
    b += text(58, 500, "soft, indirect", 14, 500, GRAY, "middle")
    b += text(58, 518, "daylight", 14, 500, GRAY, "middle")
    for i, yy in enumerate(range(150, 460, 50)):
        b += line(96, yy, 330, 230 + i * 14, TAN, 3, "8 8")
    # table + sweep
    b += rect(330, 170, 320, 260, 16, WOOD) + rect(345, 185, 290, 230, 10, WHITE)
    b += text(490, 205, "WHITE SWEEP", 13, 800, GRAY, "middle", ls=2)
    # product (sign)
    b += rect(430, 270, 120, 70, 8, TAN, DWOOD, 4) + text(490, 315, "42", 30, 800, DWOOD, "middle")
    b += text(490, 365, "PRODUCT", 14, 800, INK, "middle", ls=2)
    # reflector
    b += rect(700, 150, 26, 300, 4, WHITE, GRAY, 3)
    b += text(713, 132, "WHITE FOAM BOARD", 14, 800, INK, "middle", ls=1)
    b += text(713, 478, "bounces light into", 14, 500, GRAY, "middle")
    b += text(713, 496, "the shadows", 14, 500, GRAY, "middle")
    for i in range(4):
        b += arrow(694, 220 + i * 40, 590, 260 + i * 16, COPPER, 2.5, "6 6")
    # phone + tripod
    b += rect(460, 520, 60, 34, 6, INK) + circle(490, 537, 8, GRAY)
    b += line(490, 554, 450, 600, GRAY, 4) + line(490, 554, 530, 600, GRAY, 4) + line(490, 554, 490, 604, GRAY, 4)
    b += arrow(490, 512, 490, 440, G, 3, "4 6")
    b += text(560, 548, "PHONE ON TRIPOD", 15, 800, INK, ls=1)
    b += text(560, 570, "grid on · tap to focus · no zoom", 14, 500, GRAY)
    b += text(110, 590, "OFF: overhead lights", 15, 700, COPPER)
    b += icon("x", 92, 585, 20, COPPER, 10)
    b += text(500, 50, "TOP-DOWN VIEW", 16, 800, G, "middle", ls=3)
    return svg(W, H, b)


def sign_thumb(cx, cy, w=110, h=64, label="42"):
    return rect(cx - w / 2, cy - h / 2, w, h, 8, TAN, DWOOD, 4) + text(cx, cy + 12, label, 30, 800, DWOOD, "middle")


@fig("fig-shot-list")
def shot_list():
    W, H = 1000, 600
    tiles = ["Hero", "Angles", "Details", "Scale", "Lifestyle", "Variations", "Packaging"]
    b = ""
    tw, th = 228, 220
    for i, t in enumerate(tiles):
        row, col = divmod(i, 4)
        x = 20 + col * 244 + (122 if row == 1 else 0)
        y = 20 + row * 296
        b += card(x, y, tw, th, CREAM if i else LSAGE, LGRAY, 14)
        cx, cy = x + tw / 2, y + th / 2
        if t == "Hero":
            b += sign_thumb(cx, cy, 150, 86)
        elif t == "Angles":
            b += path(f"M{cx - 60} {cy - 30} L{cx + 30} {cy - 40} L{cx + 30} {cy + 40} L{cx - 60} {cy + 30} Z", TAN, DWOOD, 4)
            b += path(f"M{cx + 30} {cy - 40} L{cx + 46} {cy - 34} L{cx + 46} {cy + 46} L{cx + 30} {cy + 40}", WOOD, DWOOD, 4)
        elif t == "Details":
            b += circle(cx - 10, cy - 6, 62, TAN, DWOOD, 4)
            for k in range(5):
                b += path(f"M{cx - 60} {cy - 30 + k * 14} C{cx - 30} {cy - 40 + k * 14} {cx + 10} {cy - 20 + k * 14} {cx + 40} {cy - 32 + k * 14}", stroke=WOOD, sw=3)
            b += line(cx + 34, cy + 38, cx + 80, cy + 84, DWOOD, 10)
        elif t == "Scale":
            b += sign_thumb(cx + 20, cy - 10, 100, 58)
            b += path(f"M{cx - 90} {cy + 70} L{cx - 50} {cy + 10} C{cx - 40} {cy - 4} {cx - 20} {cy} {cx - 26} {cy + 16} L{cx - 40} {cy + 70} Z", "#E9C9A8", DWOOD, 3)
            b += line(cx - 30, cy + 54, cx + 70, cy + 54, GRAY, 2, "4 4") + text(cx + 20, cy + 76, "12 in", 14, 700, GRAY, "middle")
        elif t == "Lifestyle":
            b += rect(cx - 70, cy - 80, 70, 150, 4, G2) + circle(cx - 14, cy, 5, TAN)
            b += sign_thumb(cx + 50, cy - 20, 80, 46)
            b += rect(cx - 90, cy + 70, 180, 10, 2, WOOD)
        elif t == "Variations":
            for k, c in enumerate([TAN, WOOD, G2]):
                b += rect(cx - 90 + k * 64, cy - 26, 52, 52, 6, c, DWOOD, 3)
        elif t == "Packaging":
            b += rect(cx - 70, cy - 30, 140, 80, 6, "#D9B98C", DWOOD, 4) + path(f"M{cx - 70} {cy - 30} L{cx - 50} {cy - 60} L{cx + 90} {cy - 60} L{cx + 70} {cy - 30}", "#E8CFA8", DWOOD, 4)
            b += rect(cx - 20, cy - 4, 50, 30, 3, WHITE, GRAY, 2) + text(cx + 5, cy + 16, "thanks!", 11, 700, G, "middle")
        b += badge(x + 22, y + 22, i + 1, 16)
        b += text(cx, y + th + 36, t.upper(), 18, 800, INK, "middle", ls=2)
    return svg(W, H, b)


@fig("fig-listing-anatomy")
def listing_anatomy():
    W, H = 1000, 680
    b = card(250, 20, 500, 640, WHITE, GRAY, 16, 2)
    b += rect(270, 40, 220, 200, 10, CREAM) + sign_thumb(380, 140, 150, 86)
    for k in range(3):
        b += rect(270 + k * 76, 250, 68, 50, 6, LSAGE)
    b += text(510, 64, "Personalized Cedar", 18, 800, INK) + text(510, 88, "Address Sign — Outdoor", 18, 800, INK) + text(510, 112, "House Number Plaque", 18, 800, INK)
    b += text(510, 150, "★★★★★  (128)", 16, 600, COPPER)
    b += text(510, 190, "$89.00", 28, 800, G)
    b += text(510, 220, "Free shipping", 14, 600, GRAY)
    b += rect(270, 320, 460, 56, 8, LSAGE) + text(285, 343, "Gives your home instant curb appeal and helps", 14, 600, INK) + text(285, 364, "guests and deliveries find you the first time.", 14, 600, INK)
    for k in range(3):
        b += circle(282, 404 + k * 28, 4, G) + rect(296, 398 + k * 28, 360 - k * 50, 12, 4, LGRAY)
    b += rect(270, 490, 460, 60, 8, CREAM)
    for k in range(2):
        b += rect(285, 504 + k * 20, 400 - k * 120, 10, 4, TAN)
    b += rect(270, 570, 460, 64, 12, G) + text(500, 610, "Add to cart", 20, 800, WHITE, "middle")
    callouts = [(1, "Searchable title", 750, 88, 830, 88, "start"), (2, "Hero photo", 250, 140, 170, 140, "end"),
                (3, "Outcome-first opening", 750, 348, 830, 300, "start"), (4, "Benefits & details", 250, 430, 170, 430, "end"),
                (5, "Trust: reviews & story", 750, 160, 830, 200, "start"), (6, "Your story & guarantee", 750, 520, 830, 520, "start"),
                (7, "Clear call to action", 250, 602, 170, 602, "end")]
    for n, lab, x1, y1, x2, y2, anc in callouts:
        b += line(x1, y1, x2, y2, COPPER, 2.5)
        b += badge(x2, y2, n, 16)
        tx = x2 + 26 if anc == "start" else x2 - 26
        t, _ = mtext(tx, y2 + 6, lab, 16, 140, 1.25, anc, 700, INK, valign="middle")
        b += t
    return svg(W, H, b)


@fig("fig-circles")
def circles():
    W, H = 1000, 600
    rings = [("Strangers online", LGRAY, 290), ("Local community", LSAGE, 230), ("Your network", SAGE, 175), ("Friends & family", G2, 125)]
    cx, cy = 500, 310
    b = ""
    for lab, col, r in rings:
        b += circle(cx, cy, r, col, WHITE, 3)
    b += circle(cx, cy, 46, G) + text(cx, cy + 8, "YOU", 22, 800, WHITE, "middle", ls=2)
    inner = [230, 175, 125, 46]
    for (lab, col, r), rin in zip(rings, inner):
        fg = WHITE if col in (G2,) else INK
        b += text(cx, cy - (r + rin) / 2 + 6, lab.upper(), 14, 800, fg, "middle", ls=1.5)
    b += arrow(cx + 50, cy + 30, cx + 270, cy + 140, COPPER, 4)
    b += text(830, 520, "Each circle opens the next", 16, 700, COPPER, "middle")
    return svg(W, H, b)


@fig("fig-content-pillars")
def content_pillars():
    W, H = 1000, 520
    b = path("M60 120 L500 30 L940 120 Z", G) + text(500, 100, "CONSISTENT MARKETING", 22, 800, WHITE, "middle", ls=3)
    b += rect(60, 124, 880, 18, 4, G2)
    pillars = [("SHOW", "star", "Finished work, before & after"), ("PROCESS", "hammer", "Behind the scenes, how it's made"),
               ("TEACH", "bulb", "Tips, care, how-to advice"), ("CONNECT", "heart", "Your story, customers, milestones")]
    for i, (t, ic, s) in enumerate(pillars):
        x = 110 + i * 210
        b += rect(x, 150, 150, 290, 6, CREAM, LGRAY, 2)
        for k in range(3):
            b += line(x + 30 + k * 45, 160, x + 30 + k * 45, 430, LGRAY, 2)
        b += icon_disc(ic, x + 75, 205, 38, [SAGE, COPPER, G2, G][i])
        b += text(x + 75, 278, t, 20, 800, INK, "middle", ls=2)
        tt, _ = mtext(x + 75, 312, s, 15, 130, 1.3, "middle", 500, INK)
        b += tt
    b += rect(60, 440, 880, 24, 4, WOOD) + rect(40, 464, 920, 24, 4, DWOOD)
    return svg(W, H, b)


@fig("fig-journey")
def journey():
    W, H = 1000, 420
    st = [("Discover", "search"), ("Browse / Inquire", "chat"), ("Buy / Book", "tag"), ("Wait", "clock"),
          ("Receive / Service", "box"), ("After the sale", "mail"), ("Review & Refer", "star")]
    b = path("M70 170 L930 170", stroke=TAN, sw=12)
    for i, (lab, ic) in enumerate(st):
        x = 70 + i * (860 / 6)
        b += circle(x, 170, 46, WHITE, G if i % 2 == 0 else COPPER, 4) + icon(ic, x, 170, 46, G if i % 2 == 0 else COPPER, 7)
        t, _ = mtext(x, 250, lab, 16, 120, 1.25, "middle", 700, INK)
        b += t
    b += path("M930 120 C930 30 70 30 70 120", stroke=COPPER, sw=3, extra='stroke-dasharray="8 8" marker-end="url(#ahc)"')
    b += text(500, 100, "REPEAT CUSTOMERS & REFERRALS", 16, 800, COPPER, "middle", ls=2)
    b += rect(70, 320, 860, 70, 12, LSAGE)
    b += text(500, 352, "Every stage is a chance to earn trust — or lose it.", 18, 700, G, "middle")
    b += text(500, 376, "Communicate at each step so the customer never has to ask.", 15, 500, INK, "middle")
    return svg(W, H, b)


@fig("fig-packaging")
def packaging():
    W, H = 1000, 520
    b = ""
    layers = [("1", "Sturdy box", "#D9B98C", 60, 60, 540, 420), ("2", "2 in. of cushioning on every side", "#EFE6D2", 100, 100, 460, 340),
              ("3", "Product wrapped in tissue or kraft paper", LSAGE, 160, 160, 340, 220), ("4", "Thank-you note, care card & business card", WHITE, 200, 196, 260, 160)]
    for n, lab, col, x, y, w, h in layers:
        b += rect(x, y, w, h, 10, col, DWOOD if n == "1" else GRAY, 4 if n == "1" else 2, 'stroke-dasharray="0"' if n != "2" else 'stroke-dasharray="10 6"')
    for k in range(10):
        b += circle(115 + (k % 5) * 100, 125 if k < 5 else 445, 12, "none", GRAY, 2)
    b += sign_thumb(330, 262, 180, 90)
    b += text(330, 340, "Thank you!", 18, 700, G, "middle", family=SERIF, italic=True)
    ys = [80, 160, 240, 320]
    for (n, lab, *_), yy, tx in zip(layers, ys, [600, 560, 500, 450]):
        b += line(tx, yy + 20 if n != "1" else yy, 680, yy, COPPER, 2.5)
        b += badge(700, yy, n, 16)
        t, _ = mtext(726, yy + 6, lab, 17, 250, 1.25, "start", 700, INK, valign="middle")
        b += t
    b += rect(680, 400, 300, 90, 12, LSAGE)
    b += text(700, 434, "THE SHAKE TEST", 16, 800, G, ls=2)
    b += text(700, 462, "If anything moves, add more", 15, 500, INK) + text(700, 482, "cushioning.", 15, 500, INK)
    return svg(W, H, b)


@fig("fig-money-flow")
def money_flow():
    W, H = 1000, 500
    b = rect(330, 20, 340, 100, 16, G) + icon("dollar", 390, 70, 56, WHITE, 7)
    b += text(430, 64, "INCOME ACCOUNT", 20, 800, WHITE) + text(430, 92, "All revenue arrives here", 16, 500, WHITE)
    accts = [("Operating", "Materials, fees, bills", "gear", G2), ("Taxes", "Untouched until due", "bank", COPPER),
             ("Owner's Pay", "Your regular paycheck", "person", SAGE), ("Profit & Reserve", "Emergencies & growth", "shield", G)]
    for i, (t, s, ic, col) in enumerate(accts):
        x = 20 + i * 245
        b += path(f"M500 120 C500 190 {x + 112} 180 {x + 112} 250", stroke=col, sw=5, extra='marker-end="url(#ah)"')
        b += card(x, 260, 225, 210, WHITE, col, 16, 4)
        b += icon_disc(ic, x + 112, 320, 38, col)
        b += text(x + 112, 400, t.upper(), 18, 800, INK, "middle", ls=1)
        b += text(x + 112, 432, s, 15, 500, GRAY, "middle")
    return svg(W, H, b)


@fig("fig-systems-cycle")
def systems_cycle():
    W, H = 1000, 560
    cx, cy, R = 500, 290, 190
    st = [("DO IT", "hammer", "Perform the task and notice every step"), ("DOCUMENT IT", "doc", "Write a checklist, take photos or video"),
          ("SIMPLIFY IT", "scissors", "Remove steps, batch, use templates"), ("AUTOMATE IT", "gear", "Let tools handle repetition"),
          ("DELEGATE IT", "people", "Hand it off with your SOP")]
    b = circle(cx, cy, R, "none", TAN, 10)
    b += circle(cx, cy, 86, LSAGE) + text(cx, cy - 4, "IMPROVE", 18, 800, G, "middle", ls=2) + text(cx, cy + 20, "& REPEAT", 18, 800, G, "middle", ls=2)
    for i, (t, ic, s) in enumerate(st):
        a = -math.pi / 2 + i * 2 * math.pi / 5
        x, y = cx + R * math.cos(a), cy + R * math.sin(a)
        a2 = a + math.pi / 5
        b += path(f"M{cx + R * math.cos(a2 - 0.12):.1f} {cy + R * math.sin(a2 - 0.12):.1f} L{cx + R * math.cos(a2 + 0.04):.1f} {cy + R * math.sin(a2 + 0.04):.1f}", stroke=COPPER, sw=6, extra='marker-end="url(#ahc)"')
        b += circle(x, y, 46, G, WHITE, 4) + icon(ic, x, y, 48, WHITE, 7)
        right = math.cos(a) >= -0.01
        if abs(math.cos(a)) < 0.2:
            b += text(x, y - 62, t, 17, 800, INK, "middle", ls=1)
        else:
            tx = x + (62 if right else -62)
            anc = "start" if right else "end"
            b += text(tx, y - 4, t, 17, 800, INK, anc, ls=1)
            tt, _ = mtext(tx, y + 20, s, 14, 170, 1.25, anc, 500, GRAY)
            b += tt
    return svg(W, H, b)


@fig("fig-growth-levers")
def growth_levers():
    W, H = 1000, 400
    lv = [("More customers", "people"), ("Buy more often", "repeat"), ("Bigger orders", "box"), ("Better margins", "dollar")]
    b = ""
    for i, (t, ic) in enumerate(lv):
        x = 100 + i * 190
        b += circle(x, 140, 64, [SAGE, G2, G, COPPER][i]) + icon(ic, x, 140, 66, WHITE, 7)
        b += text(x, 240, t, 18, 800, INK, "middle")
        if i < 3:
            b += text(x + 95, 154, "×", 40, 700, GRAY, "middle")
    b += text(818, 154, "=", 44, 700, GRAY, "middle")
    b += circle(900, 140, 74, G) + icon("trend", 900, 118, 60, WHITE, 7) + text(900, 182, "GROWTH", 16, 800, WHITE, "middle", ls=2)
    b += rect(40, 300, 920, 76, 12, LSAGE)
    b += text(500, 332, "A 10% improvement in each lever ≈ 46% more profit potential.", 18, 700, G, "middle")
    b += text(500, 358, "Small gains multiply. Growth doesn't always require new customers.", 15, 500, INK, "middle")
    return svg(W, H, b)


@fig("fig-mistakes")
def mistakes():
    W, H = 1000, 720
    pairs = [("Underpricing", "Price for time, overhead & profit"), ("Poor communication", "Templates + reply within a day"),
             ("Ignoring feedback", "Read every review; track themes"), ("Too many offers at once", "Master one offer first"),
             ("Waiting for perfection", "Launch at the minimum standard"), ("Mixing personal & business money", "Separate business account"),
             ("Not saving for taxes", "Set aside a % of every payment"), ("Skipping protection", "Insurance, policies, agreements"),
             ("Inconsistent marketing", "A simple weekly rhythm"), ("Doing everything alone", "Document, then delegate")]
    b = text(255, 34, "THE MISTAKE", 16, 800, COPPER, "middle", ls=3) + text(745, 34, "THE HABIT THAT PREVENTS IT", 16, 800, G, "middle", ls=3)
    for i, (m, f) in enumerate(pairs):
        y = 56 + i * 66
        b += rect(20, y, 470, 56, 10, "#F6E7DB") + icon("x", 50, y + 28, 30, COPPER, 9) + text(76, y + 35, m, 17, 700, INK)
        b += arrow(494, y + 28, 516, y + 28, GRAY, 3)
        b += rect(520, y, 460, 56, 10, LSAGE) + icon("check", 550, y + 28, 30, G, 9) + text(576, y + 35, f, 17, 600, INK)
    return svg(W, H, b)


@fig("fig-transition")
def transition():
    W, H = 1000, 460
    st = [("Side hustle", "Nights & weekends"), ("Steady profit", "6–12 months of evidence"), ("Runway saved", "6+ months of expenses"),
          ("Step down", "Part-time job or set trigger"), ("Full time", "On your own terms")]
    b = ""
    for i, (t, s) in enumerate(st):
        x = 30 + i * 190
        h = 70 + i * 60
        y = 400 - h
        col = [LSAGE, SAGE, G2, G, COPPER][i]
        b += rect(x, y, 180, h, 8, col)
        fg = WHITE if i >= 2 else INK
        b += text(x + 90, y + 34, t.upper(), 16, 800, fg, "middle", ls=1)
        tt, _ = mtext(x + 90, y + 58, s, 14, 160, 1.25, "middle", 500, fg)
        b += tt
    b += icon("person", 30 + 4 * 190 + 90, 400 - 310 - 40, 56, COPPER, 8)
    b += line(20, 402, 980, 402, INK, 3)
    b += text(500, 444, "Build evidence and savings first — then make the leap a step.", 17, 700, G, "middle")
    return svg(W, H, b)


@fig("fig-30day")
def thirty_day():
    W, H = 1000, 360
    wk = [("WEEK 1", "Validate", "Ideas, research, prototype, feedback", SAGE), ("WEEK 2", "Build", "Refine, produce, document, supplies", G2),
          ("WEEK 3", "Set Up", "Name, brand, register, store, photos", G), ("WEEK 4", "Launch", "Publish, announce, outreach, review", COPPER)]
    b = ""
    for i, (w, t, s, col) in enumerate(wk):
        x = 20 + i * 245
        b += path(f"M{x} 30 L{x + 210} 30 L{x + 236} 90 L{x + 210} 150 L{x} 150 L{x + 26 if i else x} 90 Z", col)
        b += text(x + (124 if i else 110), 80, w, 15, 800, WHITE, "middle", ls=3)
        b += text(x + (124 if i else 110), 112, t.upper(), 24, 800, WHITE, "middle", ls=1)
        nd = 9 if i == 3 else 7
        sp = 24.5 if i == 3 else 30
        for d in range(nd):
            n = i * 7 + d + 1
            cx = x + 22 + d * sp
            rr, fs = (10, 9.5) if i == 3 else (11.5, 11)
            b += circle(cx, 190, rr, CREAM, col, 2) + text(cx, 190 + fs * 0.36, str(n), fs, 700, INK, "middle")
        tt, _ = mtext(x + 112, 244, s, 15, 200, 1.3, "middle", 500, INK)
        b += tt
    b += text(500, 336, "One clear task per day · about one to two hours each", 16, 700, G, "middle")
    return svg(W, H, b)


@fig("fig-year")
def year():
    W, H = 1000, 440
    ms = ["Launch", "First reviews", "25 sales", "Improve quality", "2nd offer", "100 sales", "Bundles", "Repeat buyers",
          "Simple ads", "Systems", "Busy season", "Evaluate"]
    b = line(50, 210, 950, 210, TAN, 10)
    for i, m in enumerate(ms):
        x = 50 + i * (900 / 11)
        up = i % 2 == 0
        col = G if i not in (5, 11) else COPPER
        b += circle(x, 210, 22, col, WHITE, 3) + text(x, 217, str(i + 1), 17, 800, WHITE, "middle")
        y = 150 if up else 270
        b += line(x, 188 if up else 232, x, y + (10 if up else -10), GRAY, 2)
        t, _ = mtext(x, y - 8 if up else y + 14, m, 15, 100, 1.2, "middle", 700, INK, valign="middle")
        b += t
    b += text(50, 60, "MONTH", 14, 800, GRAY, ls=3)
    b += rect(50, 360, 900, 56, 12, LSAGE) + text(500, 395, "One focus per month. Copper = major milestones.", 16, 700, G, "middle")
    return svg(W, H, b)
