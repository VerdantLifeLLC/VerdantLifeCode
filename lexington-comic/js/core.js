/* Lexington: The Turnaround — drawing core.
   Shared palette, small SVG helpers, global pattern defs and comic lettering
   (speech balloons, captions, sound effects). Everything returns SVG strings. */
(function () {
  "use strict";
  const C = (window.Comic = window.Comic || {});

  C.INK = "#1f1a2b";
  C.SW = 3;
  C.PAPER = "#fffaf0";
  C.FONTS = {
    letter: "'Comic Neue', 'Comic Sans MS', 'Chalkboard SE', sans-serif",
    title: "'Bangers', 'Impact', 'Arial Black', sans-serif",
    hand: "'Patrick Hand', 'Comic Neue', 'Comic Sans MS', cursive",
    verse: "'Lora', Georgia, 'Times New Roman', serif",
  };

  // Lexington's look can be changed from the reader toolbar.
  C.SKINS = {
    deep: { skin: "#5b3a27", shade: "#472c1d", label: "Deep" },
    brown: { skin: "#8a5a3c", shade: "#6e452d", label: "Brown" },
    tan: { skin: "#c48d61", shade: "#a6714b", label: "Tan" },
    light: { skin: "#eec3a0", shade: "#d6a37e", label: "Light" },
    fair: { skin: "#f7dccb", shade: "#e6bba3", label: "Fair" },
  };
  C.HAIRS = {
    black: { hair: "#231815", label: "Black" },
    brown: { hair: "#5a3620", label: "Brown" },
    auburn: { hair: "#8c3f22", label: "Auburn" },
    blond: { hair: "#c99a4b", label: "Blond" },
  };
  // Two editions share all the artwork. The page sets window.COMIC_EDITION before this file loads.
  C.EDITIONS = {
    original: { skin: "brown", hair: "black", texture: "curly" },
    caucasian: { skin: "light", hair: "brown", texture: "straight" },
  };
  C.edition = C.EDITIONS[window.COMIC_EDITION] ? window.COMIC_EDITION : "original";
  C.family = Object.assign({}, C.EDITIONS[C.edition]);
  C.straight = () => C.family.texture === "straight";
  C.famSkin = () => C.SKINS[C.family.skin] || C.SKINS.brown;
  C.famHair = () => (C.HAIRS[C.family.hair] || C.HAIRS.black).hair;

  // ---------- number + path helpers ----------
  const n = (v) => Math.round(v * 10) / 10;
  C.n = n;
  C.pt = (p) => n(p[0]) + " " + n(p[1]);
  C.esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // Seeded random so drawings look hand-made but stay identical every render.
  C.rng = function (seed) {
    let s = (seed * 9301 + 49297) % 233280 || 1;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  };

  C.path = (d, fill, o = {}) =>
    `<path d="${d}" fill="${fill || "none"}" stroke="${o.stroke || C.INK}" stroke-width="${
      o.sw ?? C.SW
    }" stroke-linejoin="round" stroke-linecap="round"${o.op != null ? ` opacity="${o.op}"` : ""}${
      o.dash ? ` stroke-dasharray="${o.dash}"` : ""
    }${o.extra || ""}/>`;
  C.fillPath = (d, fill, op) =>
    `<path d="${d}" fill="${fill}" stroke="none"${op != null ? ` opacity="${op}"` : ""}/>`;
  C.rect = (x, y, w, h, fill, o = {}) =>
    `<rect x="${n(x)}" y="${n(y)}" width="${n(Math.max(0, w))}" height="${n(Math.max(0, h))}" rx="${o.r || 0}" fill="${fill || "none"}" stroke="${
      o.stroke || C.INK
    }" stroke-width="${o.sw ?? C.SW}" stroke-linejoin="round"${o.op != null ? ` opacity="${o.op}"` : ""}${
      o.dash ? ` stroke-dasharray="${o.dash}"` : ""
    }/>`;
  C.frect = (x, y, w, h, fill, op, r) =>
    `<rect x="${n(x)}" y="${n(y)}" width="${n(Math.max(0, w))}" height="${n(Math.max(0, h))}"${r ? ` rx="${r}"` : ""} fill="${fill}"${
      op != null ? ` opacity="${op}"` : ""
    }/>`;
  C.circle = (x, y, r, fill, o = {}) =>
    `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill || "none"}" stroke="${o.stroke || C.INK}" stroke-width="${
      o.sw ?? C.SW
    }"${o.op != null ? ` opacity="${o.op}"` : ""}/>`;
  C.fcircle = (x, y, r, fill, op) =>
    `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill}"${op != null ? ` opacity="${op}"` : ""}/>`;
  C.ellipse = (x, y, rx, ry, fill, o = {}) =>
    `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill || "none"}" stroke="${
      o.stroke || C.INK
    }" stroke-width="${o.sw ?? C.SW}"${o.op != null ? ` opacity="${o.op}"` : ""}${
      o.rot ? ` transform="rotate(${o.rot} ${n(x)} ${n(y)})"` : ""
    }/>`;
  C.fellipse = (x, y, rx, ry, fill, op, rot) =>
    `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}"${op != null ? ` opacity="${op}"` : ""}${
      rot ? ` transform="rotate(${rot} ${n(x)} ${n(y)})"` : ""
    }/>`;
  C.line = (x1, y1, x2, y2, o = {}) =>
    `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${o.stroke || C.INK}" stroke-width="${
      o.sw ?? C.SW
    }" stroke-linecap="round"${o.op != null ? ` opacity="${o.op}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
  C.poly = (pts, fill, o = {}) => C.path("M" + pts.map(C.pt).join(" L") + " Z", fill, o);
  // shift a piece of artwork only when there is somewhere to move it (keeps default output unchanged)
  C.mv = (inner, dx, dy) => (dx || dy ? `<g transform="translate(${n(dx || 0)} ${n(dy || 0)})">${inner}</g>` : inner);
  C.g = (inner, tf, extra) => `<g${tf ? ` transform="${tf}"` : ""}${extra || ""}>${inner}</g>`;
  C.text = (x, y, str, o = {}) => {
    const size = o.size || 20;
    const fam = C.FONTS[o.font || "letter"] || o.font;
    const attrs = [
      `x="${n(x)}"`,
      `y="${n(y)}"`,
      `font-family="${fam.replace(/"/g, "'")}"`,
      `font-size="${size}"`,
      `font-weight="${o.weight || 700}"`,
      `fill="${o.fill || C.INK}"`,
      `text-anchor="${o.anchor || "middle"}"`,
    ];
    if (o.italic) attrs.push('font-style="italic"');
    if (o.ls) attrs.push(`letter-spacing="${o.ls}"`);
    if (o.stroke) attrs.push(`stroke="${o.stroke}" stroke-width="${o.sw || 4}" paint-order="stroke" stroke-linejoin="round"`);
    if (o.rot) attrs.push(`transform="rotate(${o.rot} ${n(x)} ${n(y)})"`);
    if (o.op != null) attrs.push(`opacity="${o.op}"`);
    const lines = String(str).split("\n");
    if (lines.length === 1) return `<text ${attrs.join(" ")}>${C.esc(str)}</text>`;
    const lh = o.lh || size * 1.15;
    return `<text ${attrs.join(" ")}>${lines
      .map((l, i) => `<tspan x="${n(x)}" dy="${i === 0 ? 0 : lh}">${C.esc(l)}</tspan>`)
      .join("")}</text>`;
  };

  // Shade a hex colour: amt < 0 darkens, amt > 0 lightens.
  C.shade = function (hex, amt) {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16),
      g = parseInt(h.slice(2, 4), 16),
      b = parseInt(h.slice(4, 6), 16);
    const f = (c) => {
      const v = amt < 0 ? c * (1 + amt) : c + (255 - c) * amt;
      return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
    };
    return "#" + f(r) + f(g) + f(b);
  };

  // ---------- global defs (patterns, gradients) ----------
  C.defs = function () {
    return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
      <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.7" fill="${C.INK}" opacity=".28"/></pattern>
      <pattern id="dotsFine" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.1" fill="${C.INK}" opacity=".22"/></pattern>
      <pattern id="dotsWhite" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.8" fill="#fff" opacity=".35"/></pattern>
      <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="${C.INK}" stroke-width="1.6" opacity=".22"/></pattern>
      <pattern id="tiles" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#cfe6ec"/><rect x="1" y="1" width="38" height="38" fill="#dff0f3"/></pattern>
      <pattern id="planks" width="160" height="34" patternUnits="userSpaceOnUse"><rect width="160" height="34" fill="#b9814f"/><line x1="0" y1="33" x2="160" y2="33" stroke="#8d5d36" stroke-width="2"/><line x1="70" y1="0" x2="70" y2="33" stroke="#8d5d36" stroke-width="2"/></pattern>
      <pattern id="carpet" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#7d8fb3"/><circle cx="3" cy="3" r="1.2" fill="#6b7da1"/><circle cx="9" cy="9" r="1.2" fill="#6b7da1"/></pattern>
      <pattern id="brick" width="60" height="30" patternUnits="userSpaceOnUse"><rect width="60" height="30" fill="#b5543f"/><path d="M0 15 H60 M30 0 V15 M0 15 V30 M60 15 V30" stroke="#8e3d2c" stroke-width="2"/></pattern>
      <pattern id="siding" width="40" height="22" patternUnits="userSpaceOnUse"><rect width="40" height="22" fill="#e9dcc2"/><line x1="0" y1="21" x2="40" y2="21" stroke="#c9b897" stroke-width="2"/></pattern>
      <pattern id="grass" width="24" height="16" patternUnits="userSpaceOnUse"><rect width="24" height="16" fill="#69a94f"/><path d="M4 16 l2 -6 l2 6 M14 16 l2 -7 l2 7" stroke="#57913f" stroke-width="2" fill="none"/></pattern>
      <pattern id="pegboard" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#c9a77a"/><circle cx="8" cy="8" r="1.8" fill="#8a6a43"/></pattern>
      <pattern id="lined" width="200" height="22" patternUnits="userSpaceOnUse"><rect width="200" height="22" fill="#fffdf4"/><line x1="0" y1="21" x2="200" y2="21" stroke="#9fc3e6" stroke-width="1.4"/></pattern>
      <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb8ec"/><stop offset="1" stop-color="#cfeaf9"/></linearGradient>
      <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3a74"/><stop offset=".6" stop-color="#b8607a"/><stop offset="1" stop-color="#f3a768"/></linearGradient>
      <linearGradient id="skySunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a5a"/><stop offset=".55" stop-color="#ffcf6e"/><stop offset="1" stop-color="#fff0b8"/></linearGradient>
      <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1638"/><stop offset="1" stop-color="#2b3a73"/></linearGradient>
      <linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb9e8"/><stop offset=".7" stop-color="#ffd9a8"/><stop offset="1" stop-color="#ffefd2"/></linearGradient>
      <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6c8" stop-opacity=".95"/><stop offset=".55" stop-color="#ffe58a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd84a" stop-opacity="0"/></radialGradient>
      <radialGradient id="moonGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e8f0ff" stop-opacity=".85"/><stop offset="1" stop-color="#b9c9ff" stop-opacity="0"/></radialGradient>
      <radialGradient id="lampGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffd760" stop-opacity="0"/></radialGradient>
      <radialGradient id="screenGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#9fe8ff" stop-opacity=".75"/><stop offset="1" stop-color="#4fc3ff" stop-opacity="0"/></radialGradient>
      <filter id="desat"><feColorMatrix type="saturate" values="0.12"/></filter>
      <filter id="sepia"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0.04  0.35 0.69 0.17 0 0.02  0.27 0.53 0.13 0 0  0 0 0 1 0"/></filter>
      <radialGradient id="vignette" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
    </defs></svg>`;
  };

  // ---------- lettering ----------
  let ctx = null;
  function measure(str, size, weight, fam, italic) {
    if (!ctx) ctx = document.createElement("canvas").getContext("2d");
    ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${fam}`;
    return ctx.measureText(str).width;
  }
  C.measure = measure;

  // Greedy word wrap. Text may carry **emphasis** markers; widths are measured
  // without them and a marker split across lines is closed and reopened.
  function wrap(str, maxW, size, weight, fam, italic) {
    const out = [];
    String(str)
      .split("\n")
      .forEach((para) => {
        const words = para.split(" ");
        let line = "";
        words.forEach((w) => {
          const t = line ? line + " " + w : w;
          if (measure(plain(t), size, weight, fam, italic) > maxW && line) {
            out.push(line);
            line = w;
          } else line = t;
        });
        out.push(line);
      });
    let open = false;
    return out.map((l) => {
      let s = (open ? "**" : "") + l;
      const odd = ((l.match(/\*\*/g) || []).length % 2) === 1;
      if (odd) open = !open;
      if (open) s += "**";
      return s.replace(/\*\*\*\*/g, "");
    });
  }

  // Rich-ish text: **bold** spans are rendered in the accent colour.
  function tspans(line, accent) {
    const parts = line.split(/(\*\*[^*]+\*\*)/);
    return parts
      .map((p) =>
        p.startsWith("**") ? `<tspan fill="${accent}">${C.esc(p.slice(2, -2))}</tspan>` : C.esc(p)
      )
      .join("");
  }
  const plain = (s) => s.replace(/\*\*/g, "");

  function roundBox(x, y, w, h, r) {
    r = Math.min(r, h / 2, w / 2);
    return `M${n(x + r)} ${n(y)} H${n(x + w - r)} Q${n(x + w)} ${n(y)} ${n(x + w)} ${n(y + r)} V${n(y + h - r)} Q${n(
      x + w
    )} ${n(y + h)} ${n(x + w - r)} ${n(y + h)} H${n(x + r)} Q${n(x)} ${n(y + h)} ${n(x)} ${n(y + h - r)} V${n(
      y + r
    )} Q${n(x)} ${n(y)} ${n(x + r)} ${n(y)} Z`;
  }
  // Oval-ish balloon: superellipse sampled as a smooth closed path.
  function ovalPath(cx, cy, rx, ry, k = 2.6, wobble = 0) {
    const pts = [];
    const N = 48;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const c = Math.cos(t),
        s = Math.sin(t);
      const w = 1 + wobble * Math.sin(t * 5);
      pts.push([
        cx + rx * w * Math.sign(c) * Math.pow(Math.abs(c), 2 / k),
        cy + ry * w * Math.sign(s) * Math.pow(Math.abs(s), 2 / k),
      ]);
    }
    return "M" + pts.map(C.pt).join(" L") + " Z";
  }

  function tailPath(cx, cy, tx, ty, base, curve) {
    const dx = tx - cx,
      dy = ty - cy;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len,
      uy = dy / len;
    const px = -uy,
      py = ux;
    const b1 = [cx + px * base, cy + py * base];
    const b2 = [cx - px * base, cy - py * base];
    const m = [cx + dx * 0.55 + px * curve, cy + dy * 0.55 + py * curve];
    return `M${C.pt(b1)} Q${C.pt(m)} ${n(tx)} ${n(ty)} Q${C.pt([m[0] - px * base * 0.5, m[1] - py * base * 0.5])} ${C.pt(b2)} Z`;
  }

  function burstPath(cx, cy, rx, ry, spikes, seed) {
    const r = C.rng(seed || 7);
    const pts = [];
    const N = spikes * 2;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const out = i % 2 === 0 ? 1.18 + r() * 0.16 : 0.92;
      pts.push([cx + Math.cos(t) * rx * out, cy + Math.sin(t) * ry * out]);
    }
    return "M" + pts.map(C.pt).join(" L") + " Z";
  }

  function cloudPath(cx, cy, rx, ry, bumps) {
    let d = "";
    const N = bumps;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      pts.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]);
    }
    d = "M" + C.pt(pts[0]);
    for (let i = 0; i < N; i++) {
      const a = pts[i],
        b = pts[(i + 1) % N];
      const mx = (a[0] + b[0]) / 2,
        my = (a[1] + b[1]) / 2;
      const ox = mx - cx,
        oy = my - cy;
      const ol = Math.hypot(ox, oy) || 1;
      const bulge = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.55;
      d += ` Q${n(mx + (ox / ol) * bulge)} ${n(my + (oy / ol) * bulge)} ${C.pt(b)}`;
    }
    return d + " Z";
  }

  /* Balloon spec:
     { t: text, x, y (centre), w: max text width, k: kind, tail: [x,y] | [[x,y],...],
       size, align, rot, color, bg, tl: true (x,y = top-left, captions) }
     kinds: say, shout, think, whisper, cap (caption), verse, pray, sfx, sign, off (radio) */
  C.balloon = function (b) {
    const kind = b.k || "say";
    if (kind === "sfx") return sfx(b);
    const isCap = kind === "cap" || kind === "verse" || kind === "note";
    const fam =
      kind === "verse" ? C.FONTS.verse : kind === "note" ? C.FONTS.hand : b.font ? C.FONTS[b.font] : C.FONTS.letter;
    const size = b.size || (kind === "verse" ? 19 : kind === "note" ? 22 : kind === "shout" ? 23 : 19);
    const weight = kind === "verse" ? 500 : kind === "note" ? 400 : 700;
    const italic = kind === "verse" && !b.upright;
    const upper = !isCap && kind !== "pray" && !b.lower;
    const raw = upper ? b.t.toUpperCase() : b.t;
    const maxW = b.w || (isCap ? 300 : 210);
    const marked = wrap(raw, maxW, size, weight, fam, italic);
    const lines = marked.map(plain);
    const lh = size * (kind === "verse" ? 1.3 : 1.12);
    const tw = Math.max(b.minW || 0, ...lines.map((l) => measure(l, size, weight, fam, italic)));
    const th = Math.max(b.minH || 0, lines.length * lh);
    const accent = b.accent || "#c2362b";
    let out = "";

    if (isCap) {
      const padX = kind === "verse" ? 18 : 14,
        padY = kind === "verse" ? 14 : 10;
      const w = (b.fixedW || tw) + padX * 2,
        h = th + padY * 2;
      const x = b.tl ? b.x : b.x - w / 2,
        y = b.tl ? b.y : b.y - h / 2;
      const bg = b.bg || (kind === "verse" ? "#fbf1d6" : kind === "note" ? "#fff8b8" : "#ffd95e");
      out += `<rect x="${n(x + 5)}" y="${n(y + 5)}" width="${n(w)}" height="${n(h)}" fill="${C.INK}" opacity=".9"/>`;
      out += C.rect(x, y, w, h, bg, { sw: 3 });
      if (kind === "verse") {
        out += C.rect(x + 6, y + 6, w - 12, h - 12, "none", { sw: 1.2, stroke: "#b08d4a" });
      }
      const anchor = b.align === "center" ? "middle" : "start";
      const tx = b.align === "center" ? x + w / 2 : x + padX;
      out += `<text font-family="${fam.replace(/"/g, "'")}" font-size="${size}" font-weight="${weight}"${
        italic ? ' font-style="italic"' : ""
      } fill="${b.color || C.INK}" text-anchor="${anchor}">`;
      marked.forEach((l, i) => {
        out += `<tspan x="${n(tx)}" y="${n(y + padY + size * 0.85 + i * lh)}">${tspans(l, accent)}</tspan>`;
      });
      out += `</text>`;
      return b.rot ? `<g transform="rotate(${b.rot} ${n(x + w / 2)} ${n(y + h / 2)})">${out}</g>` : out;
    }

    const padX = kind === "shout" ? 26 : kind === "think" ? 26 : 18;
    const padY = kind === "shout" ? 20 : kind === "think" ? 20 : 13;
    const rx = tw / 2 + padX,
      ry = th / 2 + padY;
    const cx = b.x,
      cy = b.y;
    const tails = !b.tail ? [] : Array.isArray(b.tail[0]) ? b.tail : [b.tail];
    const fill = b.bg || (kind === "pray" ? "#fff6d6" : "#ffffff");
    let shape;
    if (kind === "shout") shape = burstPath(cx, cy, rx * 1.12, ry * 1.18, Math.max(12, Math.round(rx / 11)), b.seed || 3);
    else if (kind === "think") shape = cloudPath(cx, cy, rx * 1.04, ry * 1.06, Math.max(9, Math.round((rx + ry) / 17)));
    else shape = ovalPath(cx, cy, rx * 1.06, ry * 1.1, lines.length > 2 ? 2.4 : 2.9, kind === "pray" ? 0 : 0);

    let tailsOut = "",
      tailsFill = "";
    tails.forEach((t) => {
      if (kind === "think") {
        const dx = t[0] - cx,
          dy = t[1] - cy;
        [0.62, 0.78, 0.92].forEach((f, i) => {
          tailsOut += C.circle(cx + dx * f, cy + dy * f, 11 - i * 3.3, fill, { sw: 2.6 });
        });
      } else {
        const base = kind === "shout" ? 12 : 10;
        const tp = tailPath(cx, cy, t[0], t[1], base, kind === "shout" ? 0 : (b.curve ?? 14));
        tailsOut += `<path d="${tp}" fill="${C.INK}" stroke="${C.INK}" stroke-width="6" stroke-linejoin="round"/>`;
        tailsFill += `<path d="${tp}" fill="${fill}"/>`;
      }
    });
    const dash = kind === "whisper" ? ' stroke-dasharray="7 6"' : "";
    if (kind === "pray") {
      out += `<path d="${shape}" fill="#ffe7a0" opacity=".55" transform="translate(${n(cx)} ${n(cy)}) scale(1.08) translate(${n(
        -cx
      )} ${n(-cy)})"/>`;
    }
    if (kind === "whisper") {
      out += tailsFill.replace(/fill="[^"]+"/g, `fill="${fill}" stroke="${C.INK}" stroke-width="2.4" stroke-dasharray="7 6"`);
      out += `<path d="${shape}" fill="${fill}" stroke="${C.INK}" stroke-width="2.6"${dash}/>`;
      out += tailsFill;
    } else if (kind === "think") {
      out += tailsOut;
      out += `<path d="${shape}" fill="${fill}" stroke="${C.INK}" stroke-width="3"/>`;
    } else {
      out += tailsOut;
      out += `<path d="${shape}" fill="${C.INK}" stroke="${C.INK}" stroke-width="6" stroke-linejoin="round"/>`;
      out += tailsFill;
      out += `<path d="${shape}" fill="${fill}"/>`;
    }
    out += `<text font-family="${fam.replace(/"/g, "'")}" font-size="${size}" font-weight="${weight}" fill="${
      b.color || C.INK
    }" text-anchor="middle">`;
    marked.forEach((l, i) => {
      out += `<tspan x="${n(cx)}" y="${n(cy - th / 2 + size * 0.86 + i * lh)}">${tspans(l, accent)}</tspan>`;
    });
    out += `</text>`;
    return out;
  };

  function sfx(b) {
    const size = b.size || 54;
    const fill = b.color || "#ffd23f";
    const stroke = b.stroke || C.INK;
    const rot = b.rot || -8;
    const fam = b.font ? C.FONTS[b.font] : C.FONTS.title;
    return `<g transform="rotate(${rot} ${n(b.x)} ${n(b.y)})"><text x="${n(b.x + 4)}" y="${n(b.y + 5)}" font-family="${fam.replace(
      /"/g,
      "'"
    )}" font-size="${size}" fill="${C.INK}" text-anchor="middle" letter-spacing="2" stroke="${C.INK}" stroke-width="${
      size / 6
    }" stroke-linejoin="round">${C.esc(b.t)}</text><text x="${n(b.x)}" y="${n(b.y)}" font-family="${fam.replace(
      /"/g,
      "'"
    )}" font-size="${size}" fill="${fill}" text-anchor="middle" letter-spacing="2" stroke="${stroke}" stroke-width="${
      size / 9
    }" paint-order="stroke" stroke-linejoin="round">${C.esc(b.t)}</text></g>`;
  }
})();
