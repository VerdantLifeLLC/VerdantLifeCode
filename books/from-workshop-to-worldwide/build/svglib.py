"""Small SVG drawing helpers shared by the book's illustrations."""
import math
import re
from xml.sax.saxutils import escape

# Brand palette (Verdant Life greens, cedar copper, warm neutrals)
G = "#1F4D3A"       # forest green (primary)
G2 = "#2F6B4F"      # mid green
SAGE = "#8DB596"    # sage
LSAGE = "#DCEBDD"   # pale sage
CREAM = "#F7F1E3"   # cream paper
COPPER = "#C0703A"  # cedar copper (accent)
TAN = "#E8C48A"     # light wood
WOOD = "#B9824F"    # wood mid
DWOOD = "#7A4E2D"   # dark wood
INK = "#26302B"     # text
GRAY = "#6E7A73"    # secondary text
LGRAY = "#E4E7E2"   # rules / light fills
WHITE = "#FFFFFF"

FONT = "Montserrat, Arial, sans-serif"
SERIF = "'Source Serif 4', Georgia, serif"


def svg(w, h, body, bg=None):
    bgrect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f'<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path d="M0,0 L10,5 L0,10 z" fill="{G}"/></marker>'
            f'<marker id="ahc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path d="M0,0 L10,5 L0,10 z" fill="{COPPER}"/></marker></defs>'
            f'{bgrect}{body}</svg>')


def text(x, y, s, size=20, weight=500, fill=INK, anchor="start", family=FONT, italic=False, ls=None):
    st = ' font-style="italic"' if italic else ""
    lsp = f' letter-spacing="{ls}"' if ls is not None else ""
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}"{st}{lsp}>{escape(s)}</text>')


def wrap_lines(s, size, width, cw=0.56):
    maxc = max(4, int(width / (size * cw)))
    words, lines, cur = s.split(), [], ""
    for wd in words:
        if len(cur) + len(wd) + (1 if cur else 0) <= maxc:
            cur = f"{cur} {wd}" if cur else wd
        else:
            if cur:
                lines.append(cur)
            cur = wd
    if cur:
        lines.append(cur)
    return lines


def mtext(x, y, s, size=18, width=200, lh=1.3, anchor="start", weight=500, fill=INK, family=FONT, valign="top", cw=0.56):
    lines = wrap_lines(s, size, width, cw)
    if valign == "middle":
        y = y - (len(lines) - 1) * size * lh / 2
    return "".join(text(x, y + i * size * lh, ln, size, weight, fill, anchor, family) for i, ln in enumerate(lines)), len(lines)


def rect(x, y, w, h, r=0, fill="none", stroke="none", sw=0, extra=""):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def circle(cx, cy, r, fill="none", stroke="none", sw=0, extra=""):
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def line(x1, y1, x2, y2, stroke=G, sw=3, dash=None, cap="round", marker=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = f' marker-end="url(#{marker})"' if marker else ""
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="{cap}"{d}{m}/>'


def path(d, fill="none", stroke="none", sw=0, extra=""):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'


def arrow(x1, y1, x2, y2, color=G, sw=3, dash=None):
    return line(x1, y1, x2, y2, color, sw, dash, marker="ahc" if color == COPPER else "ah")


def badge(cx, cy, n, r=18, fill=COPPER, fg=WHITE, size=None):
    size = size or int(r * 1.05)
    return circle(cx, cy, r, fill) + text(cx, cy + size * 0.36, str(n), size, 700, fg, "middle")


# ---------- line icons drawn in a 100x100 box ----------
ICONS = {
    "bulb": ["M50 12 C30 12 20 28 22 42 C24 55 34 60 36 70 L64 70 C66 60 76 55 78 42 C80 28 70 12 50 12 Z",
             "M38 80 L62 80", "M42 89 L58 89", "M44 52 L50 60 L56 52"],
    "hammer": ["M20 30 L56 30 L62 22 L74 22 L74 46 L62 46 L56 38 L20 38 Z", "M58 46 L58 88 L66 88 L66 46"],
    "wrench": ["M30 86 L62 54 C72 58 84 52 86 40 L74 44 L66 36 L70 24 C58 24 50 34 54 46 L22 78 Z"],
    "heart": ["M50 84 C20 62 12 46 16 32 C20 18 40 14 50 30 C60 14 80 18 84 32 C88 46 80 62 50 84 Z"],
    "eye": ["M10 50 C26 26 74 26 90 50 C74 74 26 74 10 50 Z", "M50 36 A14 14 0 1 1 49.9 36 Z"],
    "book": ["M14 24 C30 20 42 22 50 30 C58 22 70 20 86 24 L86 80 C70 76 58 78 50 86 C42 78 30 76 14 80 Z", "M50 30 L50 86"],
    "box": ["M50 12 L86 30 L86 70 L50 88 L14 70 L14 30 Z", "M14 30 L50 48 L86 30", "M50 48 L50 88", "M32 21 L68 39"],
    "camera": ["M12 32 L32 32 L38 22 L62 22 L68 32 L88 32 L88 80 L12 80 Z", "M50 40 A16 16 0 1 1 49.9 40 Z"],
    "phone": ["M30 8 L70 8 Q76 8 76 14 L76 86 Q76 92 70 92 L30 92 Q24 92 24 86 L24 14 Q24 8 30 8 Z", "M44 82 L56 82"],
    "laptop": ["M20 22 L80 22 L80 64 L20 64 Z", "M8 74 L92 74 L86 82 L14 82 Z"],
    "house": ["M14 48 L50 18 L86 48", "M24 40 L24 86 L76 86 L76 40", "M42 86 L42 62 L58 62 L58 86"],
    "truck": ["M8 28 L60 28 L60 72 L8 72 Z", "M60 42 L80 42 L92 58 L92 72 L60 72", "M28 72 A9 9 0 1 1 27.9 72", "M76 72 A9 9 0 1 1 75.9 72"],
    "star": ["M50 10 L61 37 L90 39 L67 57 L75 86 L50 70 L25 86 L33 57 L10 39 L39 37 Z"],
    "chat": ["M12 18 L88 18 L88 66 L46 66 L26 84 L28 66 L12 66 Z", "M28 36 L72 36", "M28 50 L60 50"],
    "dollar": ["M50 8 A42 42 0 1 1 49.9 8 Z", "M62 34 C58 28 42 26 38 34 C34 44 62 46 62 58 C62 68 42 72 36 62", "M50 20 L50 80"],
    "chart": ["M12 88 L88 88", "M20 88 L20 64 L32 64 L32 88", "M42 88 L42 50 L54 50 L54 88", "M64 88 L64 34 L76 34 L76 88", "M16 46 L40 30 L56 38 L84 12", "M70 12 L84 12 L84 26"],
    "calendar": ["M12 20 L88 20 L88 88 L12 88 Z", "M12 38 L88 38", "M30 10 L30 28", "M70 10 L70 28", "M26 54 L36 54", "M46 54 L56 54", "M66 54 L76 54", "M26 70 L36 70", "M46 70 L56 70"],
    "check": ["M50 8 A42 42 0 1 1 49.9 8 Z", "M30 52 L44 66 L72 36"],
    "x": ["M50 8 A42 42 0 1 1 49.9 8 Z", "M34 34 L66 66", "M66 34 L34 66"],
    "people": ["M34 22 A12 12 0 1 1 33.9 22 Z", "M12 80 C12 58 56 58 56 80", "M68 28 A10 10 0 1 1 67.9 28 Z", "M60 56 C76 52 90 60 90 78"],
    "person": ["M50 14 A16 16 0 1 1 49.9 14 Z", "M20 90 C20 56 80 56 80 90"],
    "megaphone": ["M14 40 L30 40 L72 18 L72 82 L30 60 L14 60 Z", "M30 60 L36 84 L46 84 L42 62", "M82 38 C88 44 88 56 82 62"],
    "gear": ["M50 32 A18 18 0 1 1 49.9 32 Z", "M50 8 L50 20", "M50 80 L50 92", "M8 50 L20 50", "M80 50 L92 50", "M20 20 L29 29", "M71 71 L80 80", "M80 20 L71 29", "M29 71 L20 80", "M50 22 A28 28 0 1 1 49.9 22 Z"],
    "doc": ["M22 8 L62 8 L80 26 L80 92 L22 92 Z", "M62 8 L62 26 L80 26", "M34 44 L68 44", "M34 58 L68 58", "M34 72 L56 72"],
    "store": ["M12 38 L18 14 L82 14 L88 38", "M12 38 C12 48 28 48 30 38 C32 48 48 48 50 38 C52 48 68 48 70 38 C72 48 88 48 88 38", "M18 46 L18 88 L82 88 L82 46", "M40 88 L40 64 L60 64 L60 88"],
    "seedling": ["M50 90 L50 46", "M50 58 C50 40 34 30 16 32 C16 50 30 60 50 58", "M50 46 C50 26 64 14 86 14 C86 36 72 48 50 46", "M28 90 L72 90"],
    "globe": ["M50 8 A42 42 0 1 1 49.9 8 Z", "M8 50 L92 50", "M50 8 C30 30 30 70 50 92", "M50 8 C70 30 70 70 50 92", "M16 28 L84 28", "M16 72 L84 72"],
    "tag": ["M12 50 L48 14 L86 14 L86 52 L50 88 Z", "M70 30 A5 5 0 1 1 69.9 30 Z"],
    "clock": ["M50 8 A42 42 0 1 1 49.9 8 Z", "M50 24 L50 50 L68 62"],
    "clipboard": ["M24 16 L76 16 L76 92 L24 92 Z", "M38 8 L62 8 L62 22 L38 22 Z", "M34 46 L40 52 L50 40", "M56 48 L68 48", "M34 70 L40 76 L50 64", "M56 72 L68 72"],
    "layers": ["M50 14 L88 34 L50 54 L12 34 Z", "M12 50 L50 70 L88 50", "M12 66 L50 86 L88 66"],
    "cycle": ["M80 40 C74 22 56 12 38 18 C24 22 14 34 14 50", "M20 60 C26 78 44 88 62 82 C76 78 86 66 86 50", "M80 22 L80 40 L62 40", "M20 78 L20 60 L38 60"],
    "mail": ["M10 22 L90 22 L90 78 L10 78 Z", "M10 22 L50 54 L90 22"],
    "shield": ["M50 8 L86 22 C86 56 72 78 50 92 C28 78 14 56 14 22 Z", "M34 50 L46 62 L68 38"],
    "bank": ["M10 36 L50 12 L90 36 Z", "M18 42 L18 78", "M38 42 L38 78", "M62 42 L62 78", "M82 42 L82 78", "M10 86 L90 86"],
    "search": ["M42 12 A28 28 0 1 1 41.9 12 Z", "M62 62 L88 88"],
    "pin": ["M50 92 C30 64 18 50 18 36 C18 18 32 8 50 8 C68 8 82 18 82 36 C82 50 70 64 50 92 Z", "M50 24 A12 12 0 1 1 49.9 24 Z"],
    "sun": ["M50 30 A20 20 0 1 1 49.9 30 Z", "M50 6 L50 16", "M50 84 L50 94", "M6 50 L16 50", "M84 50 L94 50", "M19 19 L26 26", "M74 74 L81 81", "M81 19 L74 26", "M26 74 L19 81"],
    "toolbox": ["M10 40 L90 40 L90 86 L10 86 Z", "M36 40 L36 26 L64 26 L64 40", "M10 58 L90 58", "M44 52 L56 52 L56 64 L44 64 Z"],
    "scissors": ["M28 22 A12 12 0 1 1 27.9 22 Z", "M28 78 A12 12 0 1 0 27.9 78 Z", "M38 40 L88 76", "M38 60 L88 24"],
    "sparkle": ["M50 10 C54 38 62 46 90 50 C62 54 54 62 50 90 C46 62 38 54 10 50 C38 46 46 38 50 10 Z"],
    "key": ["M30 30 A20 20 0 1 1 29.9 30 Z", "M44 64 L84 24", "M70 38 L80 48", "M62 46 L70 54"],
    "repeat": ["M20 40 L74 40", "M62 28 L74 40 L62 52", "M80 62 L26 62", "M38 50 L26 62 L38 74"],
    "plus": ["M50 16 L50 84", "M16 50 L84 50"],
    "trend": ["M10 80 L36 54 L54 66 L88 24", "M68 24 L88 24 L88 44"],
}


def icon(name, cx, cy, size=60, color=G, sw=6, fill="none"):
    s = size / 100.0
    parts = "".join(path(d, fill=fill if i == 0 and fill != "none" else "none", stroke=color, sw=sw) for i, d in enumerate(ICONS[name]))
    return f'<g transform="translate({cx - size / 2:.1f},{cy - size / 2:.1f}) scale({s:.4f})">{parts}</g>'


def icon_disc(name, cx, cy, r=36, bg=G, fg=WHITE, sw=7):
    return circle(cx, cy, r, bg) + icon(name, cx, cy, r * 1.15, fg, sw)


def to_gray(svg_str):
    """Convert every #RRGGBB color to a luminance-matched gray (for black & white print)."""
    def conv(m):
        h = m.group(1)
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        y = round(0.299 * r + 0.587 * g + 0.114 * b)
        return "#%02X%02X%02X" % (y, y, y)
    return re.sub(r"#([0-9A-Fa-f]{6})\b", conv, svg_str)
