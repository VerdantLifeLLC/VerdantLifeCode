"""Renders a 2-minute animated origin-story video: an ordinary person on a
city rooftop gets hit by a glowing meteor, absorbs its power, transforms
into a caped hero, blasts a second meteor with heat vision and flies up
through the clouds into the sunrise.

Everything (frames and soundtrack) is generated procedurally.

    pip install pillow numpy imageio-ffmpeg
    python make_video.py            # writes hero_origin.mp4
"""
import math
import os
import subprocess
import sys
import wave
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

W, H = 1280, 720
FPS = 24
DURATION = 120.0
N_FRAMES = int(FPS * DURATION)
SR = 44100
G = 4  # glow layer downscale factor

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "hero_origin.mp4")
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

# Key story beats (seconds)
T_METEOR_START, T_IMPACT = 24.0, 32.0
T_ABSORB, T_TRANSFORM = 40.0, 60.0
T_ROCK2_START, T_BEAM_START, T_BLAST = 71.0, 75.5, 77.5
T_LIFTOFF = 83.0
FIG_X, ROOF_Y, FIG_H = 600, 520, 150
CRYSTAL = (735, 512)

CAPTIONS = [
    (9.5, 16.5, "Just another quiet night in the city..."),
    (18.5, 23.5, "...until the sky cracked open."),
    (42.0, 48.0, "Something is changing."),
    (50.0, 56.5, "The power is flowing into you."),
    (63.5, 69.0, "You feel... unstoppable."),
    (70.0, 74.5, "Then - danger from above."),
    (85.0, 90.5, "Time to fly."),
    (105.0, 112.0, "Stronger than steel. Faster than light."),
]


# ---------------------------------------------------------------- helpers
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def prog(t, a, b):
    return ease((t - a) / (b - a))


def lerp(a, b, k):
    return a + (b - a) * k


def lerp_col(c1, c2, k):
    return tuple(int(lerp(a, b, k)) for a, b in zip(c1, c2))


def fade_window(t, a, b, f=0.6):
    """1 inside [a, b] with f-second fades at both ends, else 0."""
    if t < a or t > b:
        return 0.0
    return clamp(min((t - a) / f, (b - t) / f))


def gradient(top, bottom):
    k = np.linspace(0, 1, H)[:, None, None]
    arr = np.array(top)[None, None, :] * (1 - k) + np.array(bottom)[None, None, :] * k
    return np.broadcast_to(arr, (H, W, 3)).astype(np.float32)


# ---------------------------------------------------------------- static assets
rng0 = np.random.default_rng(7)
SKY_NIGHT = gradient((4, 6, 22), (28, 32, 66))
SKY_HIGH = gradient((8, 20, 70), (60, 90, 160))
SKY_SUNRISE = gradient((40, 80, 160), (255, 170, 95))

STARS = [(rng0.uniform(0, W), rng0.uniform(0, H * 0.75), rng0.uniform(0.5, 1.8),
          rng0.uniform(0, 6.28), rng0.uniform(0.5, 2.5)) for _ in range(260)]


def build_city():
    img = Image.new("RGBA", (W, 420), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    rng = np.random.default_rng(3)
    base = 420
    # far layer
    x = -20
    while x < W:
        w = int(rng.integers(50, 110))
        h = int(rng.integers(120, 320))
        d.rectangle([x, base - h, x + w, base], fill=(20, 24, 44, 255))
        x += w + int(rng.integers(0, 10))
    # near layer with lit windows
    x = -30
    while x < W:
        w = int(rng.integers(70, 150))
        h = int(rng.integers(90, 240))
        if x < FIG_X + 230 and x + w > FIG_X - 140:  # keep space for hero's roof
            x = FIG_X + 230
            continue
        d.rectangle([x, base - h, x + w, base], fill=(11, 13, 24, 255))
        for wy in range(base - h + 12, base - 10, 18):
            for wx in range(x + 8, x + w - 10, 16):
                if rng.random() < 0.35:
                    c = (255, 214, 120, 255) if rng.random() < 0.8 else (170, 210, 255, 255)
                    d.rectangle([wx, wy, wx + 6, wy + 9], fill=c)
        x += w + int(rng.integers(4, 20))
    # hero's rooftop
    top = ROOF_Y - (H - base)
    d.rectangle([FIG_X - 130, top, FIG_X + 220, base], fill=(16, 18, 30, 255))
    d.rectangle([FIG_X - 136, top - 6, FIG_X + 226, top + 2], fill=(34, 38, 58, 255))
    d.rectangle([FIG_X + 150, top - 50, FIG_X + 156, top - 6], fill=(34, 38, 58, 255))  # antenna
    for wy in range(top + 30, base - 10, 26):
        for wx in range(FIG_X - 115, FIG_X + 205, 22):
            if rng.random() < 0.25:
                d.rectangle([wx, wy, wx + 8, wy + 12], fill=(255, 205, 110, 255))
    return img


CITY = build_city()


def build_cloud(seed, w=440, h=240):
    rng = np.random.default_rng(seed)
    img = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(img)
    for _ in range(14):
        cx = rng.uniform(0.3, 0.7) * w
        cy = rng.uniform(0.45, 0.58) * h
        r = rng.uniform(0.1, 0.17) * w
        d.ellipse([cx - r, cy - r * 0.6, cx + r, cy + r * 0.6], fill=255)
    return img.filter(ImageFilter.GaussianBlur(12))


CLOUD_SPRITES = [build_cloud(s) for s in range(5)]
FLY_CLOUDS = [(float(rng0.uniform(-150, W - 150)), float(rng0.uniform(88, 99.5)),
               float(rng0.uniform(0.6, 1.8)), int(rng0.integers(0, 5)), bool(rng0.random() < 0.35))
              for _ in range(26)]
SEA_CLOUDS = [(float(rng0.uniform(-200, W)), float(rng0.uniform(-30, 160)),
               float(rng0.uniform(0.8, 1.8)), int(rng0.integers(0, 5))) for _ in range(40)]
SEA_CLOUDS.sort(key=lambda c: c[1])

_yy, _xx = np.mgrid[0:H, 0:W]
_vr = np.sqrt(((_xx - W / 2) / (W / 2)) ** 2 + ((_yy - H / 2) / (H / 2)) ** 2)
VIGNETTE = Image.fromarray((np.clip(1.08 - 0.38 * _vr ** 2, 0, 1)[..., None].repeat(3, 2) * 255).astype(np.uint8))

FONTS = {}


def font(size, bold=True):
    key = (size, bold)
    if key not in FONTS:
        FONTS[key] = ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)
    return FONTS[key]


# ---------------------------------------------------------------- the hero
CIVILIAN = dict(skin=(150, 118, 98), hair=(20, 16, 14), top=(62, 68, 86), legs=(36, 46, 78),
                boots=(28, 26, 26), cape=None, emblem=False, belt=None)
HERO = dict(skin=(232, 190, 158), hair=(18, 14, 12), top=(28, 72, 205), legs=(28, 72, 205),
            boots=(200, 20, 34), cape=(205, 22, 36), emblem=True, belt=(250, 205, 40))

POSES = {  # (elbow, hand) offsets in units of u, per arm (left, right)
    "stand": [((-1.35, -5.2), (-1.45, -3.7)), ((1.35, -5.2), (1.45, -3.7))],
    "hips": [((-2.0, -5.4), (-0.85, -4.3)), ((2.0, -5.4), (0.85, -4.3))],
    "fist_up": [((-1.35, -5.2), (-1.45, -3.7)), ((1.0, -8.2), (0.75, -9.8))],
    "brace": [((-1.9, -5.9), (-2.4, -4.9)), ((1.9, -5.9), (2.4, -4.9))],
}


def blend_pose(a, b, k):
    pa, pb = POSES[a], POSES[b]
    return [tuple((lerp(pa[i][j][0], pb[i][j][0], k), lerp(pa[i][j][1], pb[i][j][1], k))
                  for j in range(2)) for i in range(2)]


def draw_hero(d, cx, fy, h, pal, pose, t, s=1.0, mono=None, cape_len=1.0):
    """Draw the figure with feet at (cx, fy). s scales coordinates (for glow layer);
    mono paints everything a single colour (for halos)."""
    u = h / 8.0 * s
    cx, fy = cx * s, fy * s
    P = lambda x, y: (cx + x * u, fy + y * u)
    col = (lambda c: mono) if mono else (lambda c: c)
    lw = max(1, int(0.5 * u))

    if pal["cape"]:
        pts_l, pts_r = [], []
        n = 8
        for i in range(n + 1):
            k = i / n
            y = -6.6 + k * 6.4 * cape_len
            wave = math.sin(t * 5 + k * 4) * 0.5 * k
            half = 1.0 + 0.9 * k
            pts_l.append(P(-half + wave, y))
            pts_r.append(P(half + wave * 1.2, y + math.sin(t * 6 + k * 3) * 0.3 * k))
        d.polygon(pts_l + pts_r[::-1], fill=col(pal["cape"]))

    # legs
    for sx in (-1, 1):
        hip, knee, foot = P(0.38 * sx, -3.9), P(0.45 * sx, -2.0), P(0.5 * sx, -0.1)
        d.line([hip, knee, foot], fill=col(pal["legs"]), width=int(lw * 1.25), joint="curve")
        d.line([P(0.47 * sx, -1.3), foot], fill=col(pal["boots"]), width=int(lw * 1.3))
    # torso
    d.polygon([P(-1.1, -6.6), P(1.1, -6.6), P(0.7, -4.2), P(0.8, -3.7), P(-0.8, -3.7), P(-0.7, -4.2)],
              fill=col(pal["top"]))
    if pal["belt"]:
        d.rectangle([P(-0.75, -4.1), P(0.75, -3.8)], fill=col(pal["belt"]))
        d.polygon([P(-0.8, -3.85), P(0.8, -3.85), P(0.55, -3.3), P(-0.55, -3.3)], fill=col(pal["boots"]))
    if pal["emblem"]:
        d.polygon([P(0, -6.3), P(0.62, -5.75), P(0, -5.0), P(-0.62, -5.75)], fill=col((250, 205, 40)))
        d.polygon([P(0.12, -6.05), P(-0.22, -5.65), P(0.05, -5.65), P(-0.12, -5.2),
                   P(0.25, -5.75), P(-0.02, -5.75)], fill=col((205, 22, 36)))
    # arms
    shoulders = [P(-1.0, -6.4), P(1.0, -6.4)]
    for (elb, hand), sh in zip(pose, shoulders):
        e, hd = P(*elb), P(*hand)
        d.line([sh, e, hd], fill=col(pal["top"]), width=lw, joint="curve")
        r = 0.32 * u
        d.ellipse([hd[0] - r, hd[1] - r, hd[0] + r, hd[1] + r], fill=col(pal["skin"]))
    # neck + head
    d.line([P(0, -6.7), P(0, -7.0)], fill=col(pal["skin"]), width=int(lw * 0.9))
    hx, hy = P(0, -7.55)
    r = 0.55 * u
    d.ellipse([hx - r * 0.85, hy - r, hx + r * 0.85, hy + r], fill=col(pal["skin"]))
    d.chord([hx - r * 0.9, hy - r * 1.08, hx + r * 0.9, hy + r * 0.5], 180, 360, fill=col(pal["hair"]))


def eye_pos(cx, fy, h):
    u = h / 8.0
    return [(cx - 0.2 * u, fy - 7.55 * u), (cx + 0.2 * u, fy - 7.55 * u)]


def chest_pos(cx, fy, h):
    return (cx, fy - 5.7 * h / 8.0)


# ---------------------------------------------------------------- drawing utils
class Glow:
    def __init__(self):
        self.img = Image.new("RGB", (W // G, H // G), 0)
        self.d = ImageDraw.Draw(self.img)

    def circle(self, x, y, r, c):
        x, y, r = x / G, y / G, max(r / G, 0.6)
        self.d.ellipse([x - r, y - r, x + r, y + r], fill=c)

    def line(self, pts, c, w):
        self.d.line([(x / G, y / G) for x, y in pts], fill=c, width=max(1, int(w / G)))

    def apply(self, frame, blur=4):
        g = self.img.filter(ImageFilter.GaussianBlur(blur)).resize((W, H), Image.BILINEAR)
        return ImageChops.add(frame, g)


def lightning(rng, a, b, segs=9, jitter=18):
    pts = [a]
    for i in range(1, segs):
        k = i / segs
        pts.append((lerp(a[0], b[0], k) + rng.normal(0, jitter), lerp(a[1], b[1], k) + rng.normal(0, jitter)))
    pts.append(b)
    return pts


def text_center(frame, txt, y, size, alpha, bold=True, color=(255, 255, 255), box=False):
    if alpha <= 0:
        return frame
    f = font(size, bold)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    w = d.textlength(txt, font=f)
    a = int(255 * alpha)
    if box:
        pad = 18
        d.rounded_rectangle([(W - w) / 2 - pad, y - 10, (W + w) / 2 + pad, y + size + 14], 12,
                            fill=(0, 0, 0, int(a * 0.55)))
    d.text(((W - w) / 2 + 2, y + 2), txt, font=f, fill=(0, 0, 0, int(a * 0.8)))
    d.text(((W - w) / 2, y), txt, font=f, fill=color + (a,))
    return Image.alpha_composite(frame.convert("RGBA"), layer).convert("RGB")


def paste_cloud(frame, idx, x, y, scale, alpha, tint=(255, 255, 255)):
    spr = CLOUD_SPRITES[idx]
    if scale != 1.0:
        spr = spr.resize((int(spr.width * scale), int(spr.height * scale)), Image.BILINEAR)
    if x > W or y > H or x + spr.width < 0 or y + spr.height < 0:
        return
    mask = spr.point(lambda v: int(v * alpha))
    frame.paste(Image.new("RGB", spr.size, tint), (int(x), int(y)), mask)


# ---------------------------------------------------------------- frame renderer
def meteor_pos(t):
    k = clamp((t - T_METEOR_START) / (T_IMPACT - T_METEOR_START))
    k = k ** 1.6
    return (lerp(W + 250, CRYSTAL[0], k), lerp(-260, CRYSTAL[1], k))


def rock2_pos(t):
    k = clamp((t - T_ROCK2_START) / (T_BLAST - T_ROCK2_START))
    return (lerp(-80, 330, k), lerp(170, 300, k))


def render(i):
    t = i / FPS
    rng = np.random.default_rng(i)
    glow = Glow()

    # ---- camera / hero state
    city_off = 0.0 if t < T_LIFTOFF + 1 else 12 * (t - T_LIFTOFF - 1) ** 2
    lift = prog(t, T_LIFTOFF, T_LIFTOFF + 5)
    hover = prog(t, 102, 106)
    fig_x = FIG_X
    fig_fy = lerp(ROOF_Y, 440, lift) + math.sin(t * 1.6) * 6 * hover
    suited = t >= T_TRANSFORM + 0.25
    if t < T_ABSORB:
        pose = POSES["stand"]
    elif t < T_TRANSFORM:
        pose = blend_pose("stand", "brace", prog(t, T_ABSORB, T_ABSORB + 4))
    elif t < 70:
        pose = blend_pose("brace", "hips", prog(t, T_TRANSFORM + 1, T_TRANSFORM + 3))
    elif t < T_LIFTOFF:
        pose = blend_pose("hips", "stand", prog(t, 72, 73.5))
    elif t < 102:
        pose = blend_pose("stand", "fist_up", prog(t, T_LIFTOFF, T_LIFTOFF + 1.5))
    else:
        pose = blend_pose("fist_up", "hips", hover)

    # ---- sky
    k1 = prog(t, 87, 96)
    k2 = prog(t, 96, 102)
    sky = SKY_NIGHT * (1 - k1) + SKY_HIGH * k1
    sky = sky * (1 - k2) + SKY_SUNRISE * k2
    frame = Image.fromarray(sky.astype(np.uint8))
    d = ImageDraw.Draw(frame)

    # stars
    star_a = 1 - k1
    if star_a > 0:
        for sx, sy, sr, ph, sp in STARS:
            yy = sy + city_off * 0.05
            if yy > H:
                continue
            b = int(255 * star_a * (0.55 + 0.45 * math.sin(t * sp + ph)))
            d.ellipse([sx - sr, yy - sr, sx + sr, yy + sr], fill=(b, b, min(255, b + 20)))
        # moon
        mx, my = 190, 120 + city_off * 0.08
        if my < H + 60:
            glow.circle(mx, my, 70, lerp_col((0, 0, 0), (60, 60, 80), star_a))
            d.ellipse([mx - 38, my - 38, mx + 38, my + 38], fill=lerp_col((20, 24, 50), (235, 235, 215), star_a))

    # sunrise sun + cloud sea
    sea_y = lerp(260, 560, prog(t, 99.5, 104))
    if k2 > 0:
        sun = (930, sea_y + 20)
        glow.circle(*sun, 260 * k2, lerp_col((0, 0, 0), (140, 80, 20), k2))
        glow.circle(*sun, 130 * k2, lerp_col((0, 0, 0), (255, 200, 90), k2))
        d.ellipse([sun[0] - 70, sun[1] - 70, sun[0] + 70, sun[1] + 70], fill=lerp_col((255, 170, 95), (255, 244, 205), k2))
        # light rays
        if t > 104:
            ra = prog(t, 104, 108)
            for j in range(12):
                ang = j * math.pi / 6 + t * 0.05
                glow.line([sun, (sun[0] + math.cos(ang) * 900, sun[1] + math.sin(ang) * 900)],
                          lerp_col((0, 0, 0), (70, 45, 15), ra), 30)
        d.rectangle([0, sea_y + 70, W, H], fill=lerp_col((255, 170, 95), (250, 225, 210), k2))
        for cx, cy, sc, idx in SEA_CLOUDS:
            paste_cloud(frame, idx, cx, sea_y + cy - 40 * sc, sc, 0.95 * k2, (255, 236, 222))

    # city
    if city_off < 440:
        frame.paste(CITY, (0, int(H - 420 + city_off)), CITY)

    # ---- meteor 1
    if T_METEOR_START <= t < T_IMPACT:
        mx, my = meteor_pos(t)
        for j in range(18):
            px, py = meteor_pos(t - j * 0.06)
            r = 16 * (1 - j / 18)
            glow.circle(px, py, r * 2.2, (255, 140, 40))
            d.ellipse([px - r, py - r, px + r, py + r], fill=lerp_col((255, 250, 220), (255, 120, 20), j / 18))
        glow.circle(mx, my, 60, (120, 220, 255))
    if t >= T_IMPACT and t < T_LIFTOFF + 1:
        # crystal on the roof
        cx, cy = CRYSTAL
        cy += city_off
        pulse = 0.7 + 0.3 * math.sin(t * 4)
        fade = 1 - prog(t, T_TRANSFORM - 1, T_TRANSFORM + 1) * 0.8
        d.polygon([(cx, cy - 34), (cx + 12, cy - 8), (cx + 6, cy + 8), (cx - 8, cy + 8), (cx - 13, cy - 10)],
                  fill=lerp_col((40, 60, 80), (150, 250, 255), fade))
        glow.circle(cx, cy - 12, 55 * pulse * fade + 10, (60, 200, 255))
        # smoke/embers
        for j in range(10):
            ph = (t * 0.4 + j * 0.1) % 1
            ex = cx + math.sin(j * 7 + t) * 25 * ph
            ey = cy - 30 - ph * 160
            glow.circle(ex, ey, 6 * (1 - ph), (255, 150, 60))

    # ---- light beam crystal -> hero (34-40), particles (40-60)
    chest = chest_pos(fig_x, fig_fy, FIG_H)
    if 34 <= t < T_TRANSFORM:
        a = prog(t, 34, 37)
        cxy = (CRYSTAL[0], CRYSTAL[1] - 12)
        glow.line([cxy, chest], lerp_col((0, 0, 0), (40, 160, 220), a), 18)
        d.line([cxy, chest], fill=lerp_col((20, 30, 50), (190, 245, 255), a), width=2)
    if T_ABSORB <= t < T_TRANSFORM:
        intensity = prog(t, T_ABSORB, T_TRANSFORM - 2)
        n = int(40 + 140 * intensity)
        for j in range(n):
            ph = (t * (0.5 + 0.9 * intensity) + j / n * 3.7) % 1
            ang = j * 2.39996 + t * (1.5 + 3 * intensity)
            rad = (1 - ph) * (320 - 120 * intensity) + 6
            px = chest[0] + math.cos(ang) * rad
            py = chest[1] + math.sin(ang) * rad * 0.8
            c = (120, 230, 255) if j % 3 else (255, 215, 90)
            rr = 2 + 2 * ph
            d.ellipse([px - rr, py - rr, px + rr, py + rr], fill=c)
            glow.circle(px, py, rr * 3, c)
        # expanding energy rings
        for j in range(3):
            ph = (t * 0.8 + j / 3) % 1
            rr = 20 + ph * 260
            col = lerp_col((150, 230, 255), (0, 0, 0), ph)
            col = tuple(int(c * intensity) for c in col)
            d.ellipse([chest[0] - rr, chest[1] - rr * 0.35 + 90, chest[0] + rr, chest[1] + rr * 0.35 + 90],
                      outline=col, width=3)
        # lightning arcs
        if intensity > 0.3:
            for _ in range(int(1 + 4 * intensity)):
                ang = rng.uniform(0, 6.28)
                end = (chest[0] + math.cos(ang) * rng.uniform(80, 220), chest[1] + math.sin(ang) * rng.uniform(60, 200))
                pts = lightning(rng, chest, end)
                d.line(pts, fill=(220, 245, 255), width=2)
                glow.line(pts, (80, 170, 255), 14)
        # halo around the body
        halo = lerp_col((0, 0, 0), (90, 200, 255), intensity)
        draw_hero(glow.d, fig_x, fig_fy, FIG_H * 1.08, CIVILIAN, pose, t, s=1 / G, mono=halo)

    # ---- the hero
    pal = HERO if suited else CIVILIAN
    draw_hero(d, fig_x, fig_fy, FIG_H, pal, pose, t, cape_len=1.0 + 0.35 * lift * (1 - hover))
    if suited:
        aura = 0.35 + 0.65 * (1 - prog(t, T_TRANSFORM, T_TRANSFORM + 6))
        if 74 <= t < 80:
            aura = max(aura, 0.6)
        if T_LIFTOFF <= t < 102:
            aura = max(aura, 0.5 * (1 - hover))
        draw_hero(glow.d, fig_x, fig_fy, FIG_H * 1.05, HERO, pose, t, s=1 / G,
                  mono=lerp_col((0, 0, 0), (70, 120, 255), aura))
    if not suited and t < T_ABSORB:
        # rim light from the city
        draw_hero(glow.d, fig_x, fig_fy, FIG_H, CIVILIAN, pose, t, s=1 / G, mono=(18, 20, 40))

    # ---- rock 2 + heat vision
    if T_ROCK2_START <= t < T_BLAST:
        rx, ry = rock2_pos(t)
        for j in range(12):
            px, py = rock2_pos(t - j * 0.07)
            r = 11 * (1 - j / 12)
            glow.circle(px, py, r * 2.5, (255, 90, 30))
            d.ellipse([px - r, py - r, px + r, py + r], fill=lerp_col((255, 220, 180), (200, 60, 20), j / 12))
    eyes = eye_pos(fig_x, fig_fy, FIG_H)
    if 73.5 <= t < T_BLAST + 0.3:
        eg = prog(t, 73.5, 75)
        for e in eyes:
            glow.circle(*e, 14 * eg, (255, 40, 30))
            d.ellipse([e[0] - 2, e[1] - 2, e[0] + 2, e[1] + 2], fill=(255, 120, 100))
    if T_BEAM_START <= t < T_BLAST:
        tgt = rock2_pos(t)
        for e in eyes:
            wob = (rng.normal(0, 2), rng.normal(0, 2))
            end = (tgt[0] + wob[0], tgt[1] + wob[1])
            glow.line([e, end], (255, 50, 30), 22)
            d.line([e, end], fill=(255, 235, 220), width=3)
    if T_BLAST <= t < T_BLAST + 3:
        k = (t - T_BLAST) / 3
        bx, by = rock2_pos(T_BLAST)
        glow.circle(bx, by, 40 + 260 * k, lerp_col((255, 170, 70), (0, 0, 0), k))
        d.ellipse([bx - 200 * k, by - 200 * k, bx + 200 * k, by + 200 * k],
                  outline=lerp_col((255, 230, 180), (30, 30, 60), k), width=4)
        frag = np.random.default_rng(99)
        for _ in range(40):
            ang, sp = frag.uniform(0, 6.28), frag.uniform(150, 520)
            px, py = bx + math.cos(ang) * sp * k, by + math.sin(ang) * sp * k + 120 * k * k
            r = 3 * (1 - k) + 1
            d.ellipse([px - r, py - r, px + r, py + r], fill=lerp_col((255, 220, 120), (60, 40, 40), k))
            glow.circle(px, py, r * 4, lerp_col((255, 120, 40), (0, 0, 0), k))

    # ---- liftoff burst + flight effects
    if T_LIFTOFF <= t < T_LIFTOFF + 2.5:
        k = (t - T_LIFTOFF) / 2.5
        rr = 30 + 380 * k
        yy = ROOF_Y + city_off
        d.ellipse([fig_x - rr, yy - rr * 0.18, fig_x + rr, yy + rr * 0.18],
                  outline=lerp_col((230, 240, 255), (30, 34, 60), k), width=3)
        glow.circle(fig_x, yy, 120 * (1 - k), (120, 160, 255))
    if 86 <= t < 101:
        sa = fade_window(t, 86, 101, 1.5)
        for j in range(30):
            x = (j * 97 + 13) % W
            y = ((t * 1400 + j * 211) % (H + 400)) - 300
            c = int(200 * sa)
            d.line([(x, y), (x, y + 140)], fill=lerp_col(sky[min(H - 1, max(0, int(y)))][x].astype(int), (c, c, c + 30), 0.5), width=1)
    for cx, t0, sc, idx, front in FLY_CLOUDS:
        if front:
            continue
        cy = -250 + (t - t0) * 700 * sc
        if -300 < cy < H:
            paste_cloud(frame, idx, cx, cy, sc, 0.85, lerp_col((170, 180, 210), (255, 240, 230), k2))

    frame = glow.apply(frame)
    d = ImageDraw.Draw(frame)

    # foreground clouds (in front of the hero)
    for cx, t0, sc, idx, front in FLY_CLOUDS:
        if not front:
            continue
        cy = -250 + (t - t0) * 900 * sc
        if -300 < cy < H:
            paste_cloud(frame, idx, cx, cy, sc * 1.3, 0.9, lerp_col((180, 190, 220), (255, 240, 230), k2))
    fog = fade_window(t, 98.3, 100.6, 1.0)
    if fog > 0:
        frame = Image.blend(frame, Image.new("RGB", (W, H), (240, 238, 245)), 0.85 * fog)

    # ---- flashes
    flash = 0.0
    if T_IMPACT <= t < T_IMPACT + 1.5:
        flash = 1 - (t - T_IMPACT) / 1.5
    if T_TRANSFORM - 0.4 <= t < T_TRANSFORM + 2:
        flash = max(flash, 1 - abs(t - T_TRANSFORM - 0.2) / (1.8 if t > T_TRANSFORM else 0.6))
    if T_BLAST <= t < T_BLAST + 0.8:
        flash = max(flash, 0.6 * (1 - (t - T_BLAST) / 0.8))
    if flash > 0:
        tint = (255, 255, 255) if abs(t - T_TRANSFORM) < 3 else (255, 235, 200)
        frame = Image.blend(frame, Image.new("RGB", (W, H), tint), clamp(flash))

    frame = ImageChops.multiply(frame, VIGNETTE)

    # ---- screen shake
    shake = 0.0
    if T_IMPACT <= t < T_IMPACT + 1.2:
        shake = 16 * (1 - (t - T_IMPACT) / 1.2)
    if T_ABSORB <= t < T_TRANSFORM + 0.5:
        shake = max(shake, 7 * prog(t, T_ABSORB + 6, T_TRANSFORM))
    if T_BLAST <= t < T_BLAST + 0.8:
        shake = max(shake, 8)
    if T_LIFTOFF <= t < T_LIFTOFF + 1:
        shake = max(shake, 10 * (1 - (t - T_LIFTOFF)))
    if shake > 0:
        frame = ImageChops.offset(frame, int(rng.normal(0, shake)), int(rng.normal(0, shake)))

    # ---- titles & captions
    if t < 8.5:
        a = fade_window(t, 0.5, 8.0, 1.2)
        frame = Image.blend(frame, Image.new("RGB", (W, H), 0), 0.65 * fade_window(t, 0, 8.5, 1.5))
        frame = text_center(frame, "ORIGIN", 250, 120, a, color=(240, 245, 255))
        frame = text_center(frame, "the day you got your power", 400, 34, fade_window(t, 1.5, 8.0, 1.2), bold=False)
    for a0, a1, txt in CAPTIONS:
        a = fade_window(t, a0, a1)
        if a > 0:
            frame = text_center(frame, txt, 630, 32, a, bold=False, box=True)
    if t >= 113:
        frame = text_center(frame, "A HERO IS BORN", 110, 96, fade_window(t, 113.5, 125, 1.5), color=(255, 225, 120))
    # fades in/out
    black = max(1 - clamp(t / 1.0), prog(t, 118.3, 119.9))
    if black > 0:
        frame = Image.blend(frame, Image.new("RGB", (W, H), 0), black)
    return frame.tobytes()


# ---------------------------------------------------------------- soundtrack
def env(tt, a, b, fin=0.5, fout=0.5):
    return np.clip(np.minimum((tt - a) / fin, (b - tt) / fout), 0, 1)


def boom(tt, at, freq=45, decay=1.2, amp=1.0):
    x = tt - at
    m = x >= 0
    out = np.zeros_like(tt)
    xs = x[m]
    out[m] = amp * np.exp(-xs / decay) * np.sin(2 * np.pi * (freq * xs + 20 * np.exp(-xs * 8) / 8))
    return out


def smooth(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


def make_audio(path):
    n = int(SR * DURATION)
    tt = np.arange(n) / SR
    rng = np.random.default_rng(1)
    noise = rng.normal(0, 1, n)
    out = np.zeros(n)

    def pad(freqs, a, b, amp, fin=3, fout=3):
        e = env(tt, a, b, fin, fout)
        s = sum(np.sin(2 * np.pi * f * tt + j) * (1 + 0.3 * np.sin(2 * np.pi * 0.1 * tt + j))
                for j, f in enumerate(freqs))
        return amp * e * s / len(freqs)

    # mysterious minor pad -> tension -> triumphant major
    out += pad([110, 130.8, 164.8, 220], 0, 41, 0.22, 4, 3)
    out += pad([98, 116.5, 146.8, 196, 233], 38, 61, 0.25, 3, 1)
    out += pad([110, 138.6, 164.8, 220, 277.2, 329.6], 60, 84, 0.26, 0.5, 3)
    out += pad([146.8, 185, 220, 293.7, 370], 82, 104, 0.24, 2, 3)
    out += pad([110, 138.6, 164.8, 220, 277.2, 329.6, 440, 554.4], 101, 120, 0.3, 3, 2.5)

    # meteor rumble + impact
    rumble = smooth(noise, 60) * 6
    out += rumble * env(tt, T_METEOR_START, T_IMPACT, 7, 0.05) * np.clip((tt - T_METEOR_START) / 8, 0, 1)
    out += boom(tt, T_IMPACT, 40, 1.5, 0.9) + smooth(noise, 8) * 1.5 * np.exp(-np.clip(tt - T_IMPACT, 0, None) * 3) * (tt >= T_IMPACT)

    # heartbeat that speeds up during absorption
    beat_t = 36.0
    while beat_t < T_TRANSFORM - 0.3:
        out += boom(tt, beat_t, 55, 0.12, 0.6) + boom(tt, beat_t + 0.22, 50, 0.12, 0.4)
        beat_t += lerp(1.2, 0.35, clamp((beat_t - 36) / 22))

    # rising energy sweep
    m = (tt >= T_ABSORB) & (tt < T_TRANSFORM)
    x = (tt[m] - T_ABSORB) / (T_TRANSFORM - T_ABSORB)
    phase = 2 * np.pi * np.cumsum(180 + 1100 * x ** 2) / SR
    out[m] += 0.18 * x * np.sin(phase) + 0.25 * x * smooth(noise, 3)[m]

    # transformation boom + shimmer
    out += boom(tt, T_TRANSFORM, 38, 2.0, 1.0)
    sh = env(tt, T_TRANSFORM, T_TRANSFORM + 5, 0.05, 4)
    out += 0.12 * sh * (np.sin(2 * np.pi * 880 * tt) + np.sin(2 * np.pi * 1318.5 * tt) + np.sin(2 * np.pi * 1760 * tt)) / 3

    # rock 2 whistle, heat vision buzz, explosion
    m = (tt >= T_ROCK2_START) & (tt < T_BLAST)
    x = (tt[m] - T_ROCK2_START) / (T_BLAST - T_ROCK2_START)
    out[m] += 0.12 * x * np.sin(2 * np.pi * np.cumsum(1400 - 800 * x) / SR)
    m = (tt >= T_BEAM_START) & (tt < T_BLAST)
    out[m] += 0.14 * np.sign(np.sin(2 * np.pi * 110 * tt[m])) * (0.6 + 0.4 * np.sin(2 * np.pi * 30 * tt[m]))
    out += boom(tt, T_BLAST, 42, 1.2, 0.8)

    # liftoff + wind
    out += boom(tt, T_LIFTOFF, 50, 0.8, 0.7)
    wind = smooth(noise, 25) * 4
    out += wind * env(tt, T_LIFTOFF, 101, 3, 2) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.3 * tt))

    out *= env(tt, 0, DURATION, 1.0, 2.0)
    out = out / np.max(np.abs(out)) * 0.85
    pcm = (out * 32767).astype(np.int16)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())


# ---------------------------------------------------------------- main
def main():
    import imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    if len(sys.argv) > 1:  # preview single frames: python make_video.py 720 1440
        for a in sys.argv[1:]:
            Image.frombytes("RGB", (W, H), render(int(a))).save(os.path.join(HERE, f"frame_{a}.png"))
        return
    wav = os.path.join(HERE, "_soundtrack.wav")
    make_audio(wav)
    frames = range(N_FRAMES)
    cmd = [ffmpeg, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-", "-i", wav, "-c:v", "libx264", "-preset", "medium", "-crf", "23",
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", OUT]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with Pool() as pool:
        for n, buf in enumerate(pool.imap(render, frames, chunksize=8)):
            proc.stdin.write(buf)
            if n % (FPS * 10) == 0:
                print(f"{n / FPS:5.0f}s / {DURATION:.0f}s", flush=True)
    proc.stdin.close()
    proc.wait()
    os.remove(wav)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
