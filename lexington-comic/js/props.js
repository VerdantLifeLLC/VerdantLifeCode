/* Lexington: The Turnaround — props and effects.
   Floor props take (x, y) at their bottom-centre; wall props take (x, y) at top-left. */
(function () {
  "use strict";
  const C = window.Comic;
  const { n, pt, path, rect, circle, ellipse, line, poly, text, g, INK, shade, fcircle, fellipse, frect, fillPath } = C;
  const T = (x, y, s, inner, extra) => `<g transform="translate(${n(x)} ${n(y)}) scale(${n(s || 1)})"${extra || ""}>${inner}</g>`;
  C.T = T;
  const P = (C.prop = {});
  const fx = (C.fx = {});

  // ---------- effects ----------
  fx.stink = (x, y, s, color) => {
    const c = color || "#7fa84a";
    let o = "";
    // rises off the shoulders and sides, never across the face
    [-92, -70, 70, 92].forEach((dx, i) => {
      const sx = x + dx * s,
        sy = y + (i === 0 || i === 3 ? 30 : -10) * s;
      o += `<path d="M${n(sx)} ${n(sy)} q${n(10 * s)} ${n(-14 * s)} 0 ${n(-28 * s)} t0 ${n(-28 * s)} t0 ${n(-28 * s)}" fill="none" stroke="${c}" stroke-width="${n(5 * s)}" stroke-linecap="round" opacity=".85"/>`;
    });
    return o;
  };
  fx.flies = (x, y, s, count) => {
    let o = "";
    const spots = [
      [-70, -30],
      [60, -60],
      [80, 20],
      [-50, 40],
      [10, -95],
    ];
    for (let i = 0; i < (count || 3); i++) {
      const [dx, dy] = spots[i % spots.length];
      const fx2 = x + dx * s,
        fy = y + dy * s;
      o += `<path d="M${n(fx2 - 30 * s)} ${n(fy + 10 * s)} q${n(10 * s)} ${n(-25 * s)} ${n(22 * s)} ${n(-6 * s)} t${n(10 * s)} ${n(4 * s)}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="3 4" opacity=".7"/>`;
      o += fellipse(fx2 - 3 * s, fy - 5 * s, 5 * s, 3.4 * s, "#dfeefa", 0.9, -30) + fellipse(fx2 + 3 * s, fy - 5 * s, 5 * s, 3.4 * s, "#dfeefa", 0.9, 30);
      o += fcircle(fx2, fy, 3.6 * s, INK);
    }
    return o;
  };
  fx.sparkle = (x, y, r, color) =>
    `<path d="M${n(x)} ${n(y - r)} Q${n(x + r * 0.18)} ${n(y - r * 0.18)} ${n(x + r)} ${n(y)} Q${n(x + r * 0.18)} ${n(y + r * 0.18)} ${n(x)} ${n(y + r)} Q${n(x - r * 0.18)} ${n(y + r * 0.18)} ${n(x - r)} ${n(y)} Q${n(x - r * 0.18)} ${n(y - r * 0.18)} ${n(x)} ${n(y - r)} Z" fill="${color || "#fff6b0"}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`;
  fx.sparkles = (x, y, s) => {
    let o = "";
    [
      [-75, -60, 14],
      [70, -95, 11],
      [85, 10, 15],
      [-80, 40, 10],
      [40, -150, 9],
    ].forEach(([dx, dy, r]) => (o += fx.sparkle(x + dx * s, y + dy * s, r * s)));
    return o;
  };
  fx.sweat = (x, y, s) => `<path d="M${n(x)} ${n(y)} q${n(-7 * s)} ${n(12 * s)} 0 ${n(15 * s)} q${n(7 * s)} ${n(-3 * s)} 0 ${n(-15 * s)} Z" fill="#a9dcff" stroke="${INK}" stroke-width="1.8"/>`;
  fx.vein = (x, y, s) =>
    `<g transform="translate(${n(x)} ${n(y)}) scale(${n(s)})" fill="none" stroke="#d8352a" stroke-width="3.4" stroke-linecap="round"><path d="M-9 -3 q4 0 5 -6 M3 -9 q0 5 6 6 M9 3 q-5 0 -6 6 M-3 9 q0 -5 -6 -6"/></g>`;
  fx.zz = (x, y, s) => text(x, y, "Z", { size: 26 * s, font: "title", fill: "#5b6fb3", stroke: "#fff", sw: 3 }) + text(x + 18 * s, y - 20 * s, "z", { size: 20 * s, font: "title", fill: "#5b6fb3", stroke: "#fff", sw: 3 }) + text(x + 32 * s, y - 36 * s, "z", { size: 15 * s, font: "title", fill: "#5b6fb3", stroke: "#fff", sw: 3 });
  fx.heart = (x, y, r, color) => `<path d="M${n(x)} ${n(y + r * 0.9)} C${n(x - r * 1.6)} ${n(y - r * 0.2)} ${n(x - r * 0.8)} ${n(y - r * 1.3)} ${n(x)} ${n(y - r * 0.45)} C${n(x + r * 0.8)} ${n(y - r * 1.3)} ${n(x + r * 1.6)} ${n(y - r * 0.2)} ${n(x)} ${n(y + r * 0.9)} Z" fill="${color || "#e8536b"}" stroke="${INK}" stroke-width="2.2"/>`;
  fx.mark = (x, y, s, ch, color) => text(x, y, ch, { size: 40 * s, font: "title", fill: color || "#ffd23f", stroke: INK, sw: 5, rot: 8 });
  fx.bulb = (x, y, s) =>
    T(x, y, s, `<g>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => line(Math.cos((a * Math.PI) / 180) * 34, Math.sin((a * Math.PI) / 180) * 34 - 6, Math.cos((a * Math.PI) / 180) * 48, Math.sin((a * Math.PI) / 180) * 48 - 6, { sw: 4, stroke: "#f4c542" })).join("")}${path("M-18 -10 Q-22 -40 0 -42 Q22 -40 18 -10 Q12 0 10 10 L-10 10 Q-12 0 -18 -10 Z", "#fff3a0", { sw: 3 })}${rect(-10, 10, 20, 12, "#b9b9c9", { sw: 2.6, r: 3 })}${path("M-6 -2 Q0 -14 6 -2", "none", { sw: 2, stroke: "#c99a2f" })}</g>`);
  fx.speedLines = (w, h, dir, color, count) => {
    let o = "";
    const r = C.rng(9);
    for (let i = 0; i < (count || 14); i++) {
      const y = r() * h,
        len = 60 + r() * 140,
        x = r() * w;
      o += line(x, y, x + len * (dir || 1), y, { sw: 2 + r() * 3, stroke: color || "#ffffff", op: 0.7 });
    }
    return o;
  };
  fx.focus = (w, h, cx, cy, color, count, inner) => {
    let o = "";
    const r = C.rng(5);
    const N = count || 60;
    const R = Math.hypot(w, h);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + r() * 0.05;
      const r0 = (inner || Math.min(w, h) * 0.32) * (0.85 + r() * 0.4);
      const wdt = 0.012 + r() * 0.02;
      o += `<path d="M${n(cx + Math.cos(a) * r0)} ${n(cy + Math.sin(a) * r0)} L${n(cx + Math.cos(a - wdt) * R)} ${n(cy + Math.sin(a - wdt) * R)} L${n(cx + Math.cos(a + wdt) * R)} ${n(cy + Math.sin(a + wdt) * R)} Z" fill="${color || INK}" opacity=".85"/>`;
    }
    return o;
  };
  fx.rays = (cx, cy, R, color, count, op) => {
    let o = "";
    const N = count || 16;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const w = Math.PI / N / 1.4;
      o += `<path d="M${n(cx)} ${n(cy)} L${n(cx + Math.cos(a - w) * R)} ${n(cy + Math.sin(a - w) * R)} L${n(cx + Math.cos(a + w) * R)} ${n(cy + Math.sin(a + w) * R)} Z" fill="${color || "#fff3b8"}" opacity="${op || 0.5}"/>`;
    }
    return o;
  };
  fx.motion = (x, y, s, dir) => {
    let o = "";
    [-24, 0, 24].forEach((dy, i) => (o += line(x - dir * (10 + i * 8) * s, y + dy * s, x - dir * (70 + i * 14) * s, y + dy * s, { sw: 3 * s })));
    return o;
  };
  fx.dust = (x, y, s) => {
    let o = "";
    [
      [-30, -10, 14],
      [-5, -20, 18],
      [25, -8, 15],
      [10, 5, 11],
      [-22, 8, 10],
    ].forEach(([dx, dy, r]) => (o += circle(x + dx * s, y + dy * s, r * s, "#e8e2d4", { sw: 2, op: 0.9 })));
    return o;
  };
  fx.steam = (x, y, s) => {
    let o = "";
    [-30, 0, 30].forEach((dx) => (o += `<path d="M${n(x + dx * s)} ${n(y)} q${n(14 * s)} ${n(-20 * s)} 0 ${n(-40 * s)} t0 ${n(-40 * s)}" fill="none" stroke="#ffffff" stroke-width="${n(9 * s)}" stroke-linecap="round" opacity=".75"/>`));
    return o;
  };
  fx.notes = (x, y, s) => text(x, y, "♪", { size: 34 * s, fill: "#2a8f86", stroke: "#fff", sw: 3 }) + text(x + 26 * s, y - 24 * s, "♫", { size: 30 * s, fill: "#c9473c", stroke: "#fff", sw: 3 });

  // ---------- small hand-held items: (x, y, s, f) ----------
  const H = (C.held = {});
  // brush handle sticks out from the fist toward the viewer's side; foam at the mouth
  H.toothbrush = (x, y, s, f) => T(x, y, s, `<g transform="scale(${f} 1)">${rect(-26, -4, 44, 8, "#4fb3e8", { sw: 2, r: 4 })}${circle(-26, -6, 5, "#ffffff", { sw: 1.8 })}${circle(-32, -10, 4, "#ffffff", { sw: 1.6 })}${circle(-20, -12, 3.4, "#ffffff", { sw: 1.4 })}</g>`);
  H.spray = (x, y, s, f) => T(x, y, s, `${rect(-11, -46, 22, 50, "#3d3d5c", { sw: 2.6, r: 5 })}${rect(-8, -56, 16, 11, "#c9c9d6", { sw: 2.2 })}${rect(-9, -32, 18, 18, "#f4c542", { sw: 1.6 })}${path("M2 -30 L-4 -22 L1 -22 L-3 -15", "none", { sw: 2, stroke: "#c9473c" })}`);
  H.controller = (x, y, s, f) => T(x, y, s, `${path("M-30 -6 Q-34 14 -22 16 Q-14 16 -10 6 L10 6 Q14 16 22 16 Q34 14 30 -6 Q26 -16 0 -14 Q-26 -16 -30 -6 Z", "#2e2e3e", { sw: 2.6 })}${fcircle(16, -6, 3, "#e8536b")}${fcircle(22, -1, 3, "#4fb3e8")}${path("M-22 -6 h10 M-17 -11 v10", "none", { sw: 2.4, stroke: "#9a9ab0" })}`);
  H.phone = (x, y, s, f) => T(x, y, s, `${rect(-10, -18, 20, 34, "#1f1f2e", { sw: 2.4, r: 4 })}${frect(-7, -14, 14, 24, "#7fd3ff")}`);
  H.tablet = (x, y, s, f) => T(x, y, s, `${rect(-36, -26, 72, 50, "#22222f", { sw: 2.6, r: 6 })}${frect(-30, -20, 60, 38, "#7fd3ff")}${path("M-22 10 L-10 -4 L0 6 L10 -10 L22 8", "none", { sw: 2.4, stroke: "#ffffff" })}`);
  H.bible = (x, y, s, f) => T(x, y, s, `${rect(-24, -32, 48, 62, "#5a2a1f", { sw: 2.8, r: 4 })}${rect(-20, -28, 4, 54, "#3e1c14", { sw: 0 })}${path("M2 -20 V8 M-8 -10 H12", "none", { sw: 3.4, stroke: "#e2b955" })}${line(24, -30, 26, 28, { sw: 2, stroke: "#f6efe0" })}`);
  H.bookOpen = (x, y, s, f) => T(x, y, s, `${path("M-46 -14 Q-24 -24 0 -14 Q24 -24 46 -14 L46 22 Q24 12 0 22 Q-24 12 -46 22 Z", "#fffbec", { sw: 2.6 })}${line(0, -14, 0, 22, { sw: 2 })}${[-6, 0, 6].map((d) => line(-38, d, -8, d - 2, { sw: 1.4, stroke: "#9a8f7a" }) + line(8, d - 2, 38, d, { sw: 1.4, stroke: "#9a8f7a" })).join("")}${path("M-50 -10 L-50 26 Q-24 16 0 26 Q24 16 50 26 L50 -10", "none", { sw: 2.4, stroke: "#5a2a1f" })}`);
  H.trashBag = (x, y, s, f) => T(x, y, s, `${path("M-6 -6 Q-30 0 -34 40 Q-30 70 0 72 Q30 70 34 40 Q30 0 6 -6 Z", "#2d2d3a", { sw: 2.8 })}${path("M-8 -6 L0 -16 L8 -6", "none", { sw: 2.6 })}${path("M-14 20 q6 10 0 24 M14 26 q-4 10 2 20", "none", { sw: 2, stroke: "#5a5a72" })}`);
  H.plate = (x, y, s, f) => T(x, y, s, `${ellipse(0, 0, 30, 9, "#ffffff", { sw: 2.4 })}${ellipse(0, -5, 30, 9, "#ffffff", { sw: 2.4 })}${ellipse(0, -10, 30, 9, "#ffffff", { sw: 2.4 })}`);
  H.sneaker = (x, y, s, f) => T(x, y, s, `<g transform="scale(${f} 1)">${path("M-30 6 Q-32 -16 -18 -18 L0 -16 Q14 -4 30 -2 Q40 0 38 8 Z", "#ffffff", { sw: 2.6 })}${path("M-31 4 L38 4 L38 10 L-31 10 Z", "#d8402f", { sw: 2.2 })}${path("M-6 -14 l6 8 M2 -12 l6 8", "none", { sw: 1.6 })}</g>`);
  H.sneakerDirty = (x, y, s, f) => T(x, y, s, `<g transform="scale(${f} 1)">${path("M-30 6 Q-32 -16 -18 -18 L0 -16 Q14 -4 30 -2 Q40 0 38 8 Z", "#b9a98a", { sw: 2.6 })}${fellipse(-10, -6, 9, 5, "#7a6a4a", 0.7)}${fellipse(18, 0, 7, 4, "#6a5a3a", 0.7)}${path("M-31 4 L38 4 L38 10 L-31 10 Z", "#8a7a5a", { sw: 2.2 })}</g>`);
  H.brushTool = (x, y, s, f) => T(x, y, s, `<g transform="rotate(${f * -30})">${rect(-6, -40, 12, 32, "#b5843c", { sw: 2.2, r: 4 })}${rect(-10, -8, 20, 10, "#4a4a5a", { sw: 2.2 })}${[-7, -3, 1, 5].map((d) => line(d, 2, d, 12, { sw: 2 })).join("")}</g>`);
  H.wrench = (x, y, s, f) => T(x, y, s, `<g transform="rotate(${f * -40})">${rect(-4, -40, 8, 46, "#a9b3c4", { sw: 2.2, r: 3 })}${path("M-10 -40 Q-12 -56 0 -58 Q12 -56 10 -40 L4 -44 L4 -52 L-4 -52 L-4 -44 Z", "#a9b3c4", { sw: 2.2 })}</g>`);
  H.money = (x, y, s, f) => T(x, y, s, `${rect(-26, -12, 52, 24, "#8fcf7a", { sw: 2.4, r: 2 })}${rect(-22, -16, 52, 24, "#a5dc8f", { sw: 2.4, r: 2 })}${circle(4, -4, 7, "none", { sw: 1.8, stroke: "#4a8a3a" })}${text(4, 1, "$", { size: 12, fill: "#2f6a2a" })}`);
  H.envelope = (x, y, s, f) => T(x, y, s, `${rect(-22, -14, 44, 28, "#fff6dc", { sw: 2.4 })}${path("M-22 -14 L0 4 L22 -14", "none", { sw: 2 })}${fx.heart(0, -2, 5, "#e8536b")}`);
  H.pencil = (x, y, s, f) => T(x, y, s, `<g transform="rotate(${f * 35})">${rect(-3, -40, 6, 34, "#f4c542", { sw: 2 })}${path("M-3 -6 L0 4 L3 -6 Z", "#f1d3a8", { sw: 1.8 })}${rect(-3, -46, 6, 6, "#e8536b", { sw: 1.8 })}</g>`);
  H.mic = (x, y, s, f) => T(x, y, s, `${rect(-4, -10, 8, 30, "#3a3a4a", { sw: 2.2, r: 3 })}${circle(0, -16, 9, "#9aa3b5", { sw: 2.4 })}`);
  H.spatula = (x, y, s, f) => T(x, y, s, `<g transform="rotate(${f * -30})">${rect(-3, -36, 6, 36, "#3a3a4a", { sw: 2 })}${rect(-10, -54, 20, 20, "#c9c9d6", { sw: 2.2, r: 3 })}</g>`);
  H.basket = (x, y, s, f) => T(x, y + 20 * s, s, `${path("M-52 -36 L52 -36 L44 24 L-44 24 Z", "#d9c18f", { sw: 2.8 })}${[-30, -10, 10, 30].map((d) => line(d, -32, d * 0.85, 20, { sw: 1.6, stroke: "#a88b5c" })).join("")}${path("M-46 -36 Q-36 -58 -16 -46 Q0 -64 18 -48 Q36 -60 48 -36", "#c9473c", { sw: 2.4 })}${path("M-20 -44 Q-4 -54 10 -44", "#6f8fd6", { sw: 2 })}`);
  H.sandTimer = (x, y, s, f) => T(x, y, s, `${rect(-14, -44, 28, 5, "#8a5a3c", { sw: 2 })}${rect(-14, 0, 28, 5, "#8a5a3c", { sw: 2 })}${path("M-10 -39 L10 -39 L1 -19 L10 0 L-10 0 L-1 -19 Z", "#e8f6ff", { sw: 2 })}${path("M-6 -34 L6 -34 L1 -22 L-1 -22 Z", "#f4c542")}${path("M-7 0 L0 -8 L7 0 Z", "#f4c542")}`);
  H.flyer = (x, y, s, f) => T(x, y, s, `${rect(-26, -34, 52, 68, "#ffffff", { sw: 2.4 })}${frect(-22, -30, 44, 12, "#2a8f86")}${[0, 8, 16].map((d) => line(-18, -8 + d, 18, -8 + d, { sw: 2, stroke: "#9a9ab0" })).join("")}`);
  H.towel = (x, y, s, f) => T(x, y, s, `${path("M-14 -10 L14 -10 L18 40 L-18 40 Z", "#ffffff", { sw: 2.4 })}${line(-16, 30, 16, 30, { sw: 3, stroke: "#4fb3e8" })}`);
  H.deodorant = (x, y, s, f) => T(x, y, s, `${rect(-9, -30, 18, 40, "#4fb3e8", { sw: 2.4, r: 5 })}${rect(-9, -40, 18, 12, "#ffffff", { sw: 2.2, r: 4 })}`);
  H.fork = (x, y, s, f) => T(x, y, s, `${line(0, -30, 0, 6, { sw: 3, stroke: "#a9b3c4" })}${path("M-5 -40 V-28 M0 -40 V-28 M5 -40 V-28 M-5 -28 Q0 -22 5 -28", "none", { sw: 2, stroke: "#a9b3c4" })}`);
  H.clipboard = (x, y, s, f) => T(x, y, s, `${rect(-24, -34, 48, 64, "#b5843c", { sw: 2.4, r: 4 })}${rect(-19, -26, 38, 52, "#ffffff", { sw: 1.8 })}${rect(-8, -38, 16, 9, "#a9b3c4", { sw: 2 })}${[0, 1, 2, 3].map((i) => path(`M-14 ${-16 + i * 11} l3 3 l5 -6`, "none", { sw: 2, stroke: "#2a8f86" }) + line(-3, -14 + i * 11, 14, -14 + i * 11, { sw: 1.6, stroke: "#9a9ab0" })).join("")}`);
  H.dishes = (x, y, s, f) => T(x, y, s, `${ellipse(0, 0, 26, 7, "#ffffff", { sw: 2.2 })}${ellipse(0, -6, 26, 7, "#ffffff", { sw: 2.2 })}${ellipse(0, -12, 26, 7, "#e8f6ff", { sw: 2.2 })}${fx.sparkle(22, -24, 7)}`);
  H.trophy = (x, y, s, f) => T(x, y, s, `${path("M-14 -36 L14 -36 Q14 -10 0 -6 Q-14 -10 -14 -36 Z", "#f4c542", { sw: 2.4 })}${rect(-4, -6, 8, 10, "#e0a93a", { sw: 2 })}${rect(-12, 4, 24, 7, "#8a5a3c", { sw: 2 })}`);

  // ---------- furniture & room props ----------
  P.bed = (x, y, s, o = {}) => {
    // side-on bed, headboard on the left. x,y = bottom-centre. width 300.
    const blanket = o.blanket || "#3f6fb5";
    let i = "";
    i += rect(-160, -170, 26, 170, "#8a5a3c", { sw: 3, r: 6 });
    i += rect(150, -90, 14, 90, "#8a5a3c", { sw: 3, r: 4 });
    i += rect(-140, -78, 300, 30, "#8a5a3c", { sw: 3 });
    i += rect(-140, -104, 296, 30, "#f6f1e6", { sw: 3, r: 8 });
    if (o.messy) {
      i += path("M-90 -104 Q-60 -150 -10 -126 Q30 -160 70 -118 Q110 -140 158 -100 L150 -50 Q110 -30 60 -60 Q10 -40 -40 -60 Q-70 -40 -96 -70 Z", blanket, { sw: 3 });
      i += path("M-40 -110 q20 -16 40 0 M40 -100 q22 -12 40 4", "none", { sw: 2, stroke: shade(blanket, -0.3) });
      i += path("M-134 -110 Q-120 -140 -90 -128 Q-80 -110 -100 -100 Z", "#ffffff", { sw: 2.6 });
      i += fellipse(30, -84, 12, 6, "#c9a227", 0.7);
    } else {
      i += path("M-70 -108 L156 -108 L156 -54 Q40 -46 -70 -54 Z", blanket, { sw: 3 });
      i += path("M-70 -108 L156 -108 L156 -96 L-70 -96 Z", "#ffffff", { sw: 2.4 });
      i += path("M-134 -106 Q-136 -134 -110 -134 L-84 -134 Q-70 -132 -74 -106 Z", "#ffffff", { sw: 2.6 });
      i += line(-40, -80, 140, -80, { sw: 2, stroke: shade(blanket, 0.25) });
    }
    return T(x, y, s, i);
  };
  P.bedFront = (x, y, s, o = {}) => {
    // bed seen from the foot end (for the prayer scene). width ~360
    const blanket = o.blanket || "#3f6fb5";
    let i = "";
    i += rect(-185, -230, 370, 150, "#8a5a3c", { sw: 3, r: 10 });
    i += rect(-170, -215, 340, 30, shade("#8a5a3c", 0.15), { sw: 2, r: 6 });
    i += path("M-180 -100 Q-180 -130 -150 -130 L150 -130 Q180 -130 180 -100 L180 -20 L-180 -20 Z", "#f6f1e6", { sw: 3 });
    i += path("M-188 -96 Q-120 -118 0 -112 Q120 -118 188 -96 L190 0 L-190 0 Z", blanket, { sw: 3 });
    i += path("M-150 -80 q40 10 80 0 M30 -70 q50 12 110 -4", "none", { sw: 2.2, stroke: shade(blanket, -0.25) });
    return T(x, y, s, i);
  };
  P.desk = (x, y, s, o = {}) => {
    let i = "";
    i += rect(-110, -112, 220, 16, "#b07a4a", { sw: 3, r: 3 });
    i += rect(-100, -96, 16, 96, "#8a5a3c", { sw: 3 });
    i += rect(30, -96, 74, 96, "#9a6a40", { sw: 3 });
    i += rect(38, -86, 58, 26, "#b07a4a", { sw: 2.2 }) + rect(38, -54, 58, 26, "#b07a4a", { sw: 2.2 });
    i += line(58, -73, 76, -73, { sw: 3 }) + line(58, -41, 76, -41, { sw: 3 });
    return T(x, y, s, i);
  };
  P.chair = (x, y, s, o = {}) => {
    const c = o.color || "#c9473c";
    return T(x, y, s, `${rect(-30, -150, 60, 70, c, { sw: 3, r: 10 })}${rect(-34, -78, 68, 14, c, { sw: 3, r: 5 })}${line(0, -64, 0, -16, { sw: 6 })}${path("M-30 -6 L30 -6 M0 -16 L-30 -4 M0 -16 L30 -4", "none", { sw: 4 })}${fcircle(-30, -2, 5, INK)}${fcircle(30, -2, 5, INK)}`);
  };
  P.lamp = (x, y, s, o = {}) => {
    let i = "";
    if (o.on) i += `<circle cx="0" cy="-60" r="110" fill="url(#lampGlow)"/>`;
    i += rect(-20, -6, 40, 8, "#3a3a4a", { sw: 2.6, r: 3 });
    i += path("M0 -6 L-10 -56 L18 -80", "none", { sw: 5 });
    i += path("M6 -96 L40 -86 L30 -58 L-4 -70 Z", o.color || "#2a8f86", { sw: 2.8 });
    return T(x, y, s, i);
  };
  P.floorLamp = (x, y, s, o = {}) => {
    let i = "";
    if (o.on) i += `<circle cx="0" cy="-250" r="150" fill="url(#lampGlow)"/>`;
    i += ellipse(0, -4, 34, 8, "#3a3a4a", { sw: 2.6 }) + line(0, -6, 0, -230, { sw: 6 });
    i += path("M-40 -224 L40 -224 L26 -290 L-26 -290 Z", o.color || "#e8c35a", { sw: 3 });
    i += path("M-30 -236 L30 -236", "none", { sw: 1.6, stroke: "#c99a2f" });
    return T(x, y, s, i);
  };
  P.monitor = (x, y, s, o = {}) => {
    let i = "";
    i += rect(-12, -22, 24, 22, "#3a3a4a", { sw: 2.6 });
    i += rect(-30, -4, 60, 6, "#3a3a4a", { sw: 2.4 });
    i += rect(-62, -96, 124, 78, "#22222f", { sw: 3, r: 5 });
    i += frect(-55, -89, 110, 64, o.screen || "#103248");
    if (o.code) {
      for (let k = 0; k < 6; k++) i += line(-48 + (k % 2) * 10, -80 + k * 9, -48 + (k % 2) * 10 + 30 + ((k * 23) % 50), -80 + k * 9, { sw: 3, stroke: ["#7fd3ff", "#f4c542", "#8fcf7a"][k % 3] });
    }
    if (o.game) {
      i += frect(-55, -40, 110, 15, "#3f8f5a") + path("M-40 -40 l10 -16 l10 16 Z", "#d8402f", { sw: 2 }) + fcircle(20, -58, 8, "#f4c542");
      i += text(0, -72, "LEVEL 99", { size: 12, font: "title", fill: "#fff" });
    }
    if (o.flyer) {
      i += frect(-50, -84, 100, 54, "#ffffff") + frect(-50, -84, 100, 14, "#2a8f86") + text(0, -73, "LEX'S FRESH KICKS", { size: 9, fill: "#fff" });
      i += [0, 8, 16].map((d) => line(-40, -60 + d, 40, -60 + d, { sw: 2, stroke: "#9a9ab0" })).join("");
    }
    return T(x, y, s, i);
  };
  P.laptop = (x, y, s, o = {}) => {
    let i = "";
    i += path("M-56 0 L56 0 L48 -8 L-48 -8 Z", "#b9bfcc", { sw: 2.6 });
    i += rect(-46, -70, 92, 62, "#2a2f3f", { sw: 2.8, r: 4 });
    i += frect(-40, -64, 80, 50, o.screen || "#7fd3ff");
    if (o.chart) i += path("M-34 -22 L-18 -30 L-4 -28 L10 -42 L32 -56", "none", { sw: 3.4, stroke: "#2a8f86" }) + fcircle(32, -56, 4, "#2a8f86");
    if (o.flyer) i += frect(-34, -60, 68, 42, "#ffffff") + frect(-34, -60, 68, 10, "#2a8f86") + line(-28, -40, 28, -40, { sw: 2, stroke: "#9a9ab0" }) + line(-28, -32, 18, -32, { sw: 2, stroke: "#9a9ab0" });
    return T(x, y, s, i);
  };
  P.window = (x, y, w, h, o = {}) => {
    const time = o.time || "day";
    const sky = { day: "url(#skyDay)", night: "url(#skyNight)", dusk: "url(#skyDusk)", dawn: "url(#skyDawn)", sunset: "url(#skySunset)" }[time];
    let i = rect(x - 10, y - 10, w + 20, h + 20, "#f6f1e6", { sw: 3, r: 4 });
    i += rect(x, y, w, h, sky, { sw: 3 });
    if (time === "night") {
      i += `<circle cx="${n(x + w * 0.7)}" cy="${n(y + h * 0.3)}" r="${n(w * 0.45)}" fill="url(#moonGlow)"/>`;
      i += circle(x + w * 0.7, y + h * 0.3, w * 0.13, "#fff8dc", { sw: 2 });
      i += fcircle(x + w * 0.66, y + h * 0.28, w * 0.025, "#e6dcb8") + fcircle(x + w * 0.74, y + h * 0.34, w * 0.02, "#e6dcb8");
      [[0.2, 0.2], [0.35, 0.55], [0.15, 0.75], [0.85, 0.7], [0.5, 0.15]].forEach(([a, b]) => (i += fx.sparkle(x + w * a, y + h * b, 5, "#fff8dc")));
    } else if (time === "day" || time === "dawn") {
      i += fellipse(x + w * 0.3, y + h * 0.35, w * 0.18, h * 0.06, "#ffffff", 0.9) + fellipse(x + w * 0.42, y + h * 0.31, w * 0.14, h * 0.06, "#ffffff", 0.9);
      i += fellipse(x + w * 0.5, y + h * 1.0, w * 0.6, h * 0.25, "#69a94f");
      if (time === "dawn") i += circle(x + w * 0.75, y + h * 0.78, w * 0.12, "#ffd76a", { sw: 2 });
    } else {
      i += circle(x + w * 0.5, y + h * 0.75, w * 0.16, "#ffe28a", { sw: 2 });
    }
    i += line(x + w / 2, y, x + w / 2, y + h, { sw: 5, stroke: "#f6f1e6" }) + line(x, y + h / 2, x + w, y + h / 2, { sw: 5, stroke: "#f6f1e6" });
    i += rect(x, y, w, h, "none", { sw: 3 });
    if (o.curtains) {
      const cc = o.curtains;
      i += path(`M${n(x - 22)} ${n(y - 18)} L${n(x + w * 0.22)} ${n(y - 18)} Q${n(x + w * 0.1)} ${n(y + h * 0.5)} ${n(x + w * 0.04)} ${n(y + h + 14)} L${n(x - 22)} ${n(y + h + 14)} Z`, cc, { sw: 3 });
      i += path(`M${n(x + w + 22)} ${n(y - 18)} L${n(x + w * 0.78)} ${n(y - 18)} Q${n(x + w * 0.9)} ${n(y + h * 0.5)} ${n(x + w * 0.96)} ${n(y + h + 14)} L${n(x + w + 22)} ${n(y + h + 14)} Z`, cc, { sw: 3 });
      i += rect(x - 30, y - 26, w + 60, 9, "#8a5a3c", { sw: 2.4, r: 4 });
    }
    return i;
  };
  P.poster = (x, y, w, h, kind, rot) => {
    let i = rect(x, y, w, h, "#fff", { sw: 2.6 });
    if (kind === "robot") {
      i += frect(x + 4, y + 4, w - 8, h - 8, "#203a5a");
      const cx = x + w / 2,
        cy = y + h * 0.5;
      i += rect(cx - w * 0.18, cy - h * 0.2, w * 0.36, h * 0.28, "#c9d3e0", { sw: 2, r: 4 }) + fcircle(cx - w * 0.07, cy - h * 0.08, 4, "#4fd3ff") + fcircle(cx + w * 0.07, cy - h * 0.08, 4, "#4fd3ff");
      i += rect(cx - w * 0.22, cy + h * 0.1, w * 0.44, h * 0.25, "#c9d3e0", { sw: 2, r: 4 });
      i += text(cx, y + h - 10, "BUILD IT", { size: Math.min(16, w / 6), font: "title", fill: "#f4c542" });
    } else if (kind === "space") {
      i += frect(x + 4, y + 4, w - 8, h - 8, "#1b1f4a");
      i += circle(x + w * 0.6, y + h * 0.4, w * 0.22, "#e07a3a", { sw: 2 }) + ellipse(x + w * 0.6, y + h * 0.4, w * 0.36, w * 0.07, "none", { sw: 2, stroke: "#f4c542", rot: -15 });
      i += fx.sparkle(x + w * 0.25, y + h * 0.25, 5, "#fff") + fx.sparkle(x + w * 0.3, y + h * 0.7, 4, "#fff");
      i += text(x + w / 2, y + h - 10, "EXPLORE", { size: Math.min(15, w / 6), font: "title", fill: "#fff" });
    } else if (kind === "game") {
      i += frect(x + 4, y + 4, w - 8, h - 8, "#8a2a6a");
      i += text(x + w / 2, y + h * 0.45, "GAME", { size: w / 4, font: "title", fill: "#f4c542", stroke: INK, sw: 3 }) + text(x + w / 2, y + h * 0.7, "ON", { size: w / 4, font: "title", fill: "#4fd3ff", stroke: INK, sw: 3 });
    } else if (kind === "verse") {
      i += frect(x + 4, y + 4, w - 8, h - 8, "#fbf1d6");
      i += text(x + w / 2, y + h * 0.36, "I can do", { size: w / 7, font: "hand" }) + text(x + w / 2, y + h * 0.52, "all things", { size: w / 7, font: "hand" }) + text(x + w / 2, y + h * 0.68, "through Christ", { size: w / 8, font: "hand" }) + text(x + w / 2, y + h * 0.86, "Phil 4:13", { size: w / 10, font: "hand", fill: "#8a5a3c" });
    } else if (kind === "family") {
      i += frect(x + 4, y + 4, w - 8, h - 8, "#bfe0f0");
      [0.28, 0.5, 0.72].forEach((fx2, k) => {
        const r = w * (k === 1 ? 0.09 : 0.11);
        i += fcircle(x + w * fx2, y + h * (k === 1 ? 0.58 : 0.45), r, C.famSkin().skin) + fellipse(x + w * fx2, y + h * 0.9, r * 1.5, h * 0.25, ["#e09a3e", "#c9473c", "#8db3d8"][k]);
      });
    } else if (kind === "cross") {
      i += frect(x + 4, y + 4, w - 8, h - 8, "#f6efe0");
      i += path(`M${n(x + w / 2 - 5)} ${n(y + h * 0.15)} h10 v${n(h * 0.2)} h${n(w * 0.18)} v10 h${n(-w * 0.18)} v${n(h * 0.45)} h-10 v${n(-h * 0.45)} h${n(-w * 0.18)} v-10 h${n(w * 0.18)} Z`, "#8a5a3c", { sw: 2 });
    } else {
      i += frect(x + 4, y + 4, w - 8, h - 8, "#2a8f86");
    }
    return rot ? `<g transform="rotate(${rot} ${n(x + w / 2)} ${n(y + h / 2)})">${i}</g>` : i;
  };
  P.frame = (x, y, w, h, kind) => {
    let i = rect(x, y, w, h, "#8a5a3c", { sw: 2.6 }) + rect(x + 6, y + 6, w - 12, h - 12, "#dfeef7", { sw: 1.8 });
    if (kind === "cross") i = rect(x, y, w, h, "#f6efe0", { sw: 2.6 }) + path(`M${n(x + w / 2 - 4)} ${n(y + 10)} h8 v${n(h * 0.25)} h${n(w * 0.22)} v8 h${n(-w * 0.22)} v${n(h * 0.45)} h-8 v${n(-h * 0.45)} h${n(-w * 0.22)} v-8 h${n(w * 0.22)} Z`, "#b5843c", { sw: 2 });
    else if (kind === "family") {
      [0.3, 0.5, 0.7].forEach((fx2, k) => (i += fcircle(x + w * fx2, y + h * (k === 1 ? 0.55 : 0.45), w * 0.09, C.famSkin().skin) + fellipse(x + w * fx2, y + h * 0.88, w * 0.12, h * 0.2, ["#e09a3e", "#c9473c", "#8db3d8"][k])));
    } else if (kind === "verse") {
      i = rect(x, y, w, h, "#f6efe0", { sw: 2.6 }) + text(x + w / 2, y + h * 0.45, "As for me & my house,", { size: w / 11, font: "hand" }) + text(x + w / 2, y + h * 0.7, "we will serve the LORD", { size: w / 11, font: "hand" });
    }
    return i;
  };
  P.shelf = (x, y, w, o = {}) => {
    let i = rect(x, y, w, 10, "#8a5a3c", { sw: 2.6 });
    let bx = x + 8;
    const r = C.rng(o.seed || 4);
    const cols = ["#c9473c", "#2a8f86", "#f4c542", "#5b7fb5", "#8a5a3c", "#7cc35a", "#9b59b6"];
    const n2 = o.books ?? Math.floor(w / 22);
    for (let k = 0; k < n2; k++) {
      const bw = 12 + r() * 8,
        bh = 34 + r() * 22;
      if (bx + bw > x + w - (o.trophy ? 40 : 6)) break;
      const lean = o.messy && k % 3 === 2 ? 14 : 0;
      i += `<g transform="rotate(${lean} ${n(bx)} ${n(y)})">${rect(bx, y - bh, bw, bh, cols[k % cols.length], { sw: 2.2 })}${line(bx + 3, y - bh + 8, bx + bw - 3, y - bh + 8, { sw: 1.4, stroke: "#fff", op: 0.6 })}</g>`;
      bx += bw + (lean ? 10 : 1);
    }
    if (o.trophy) i += C.held.trophy(x + w - 22, y - 11, 1, 1);
    return i;
  };
  P.robot = (x, y, s, o = {}) => {
    // Lexington's vacuum-cleaner robot
    let i = "";
    i += ellipse(0, -8, 54, 12, "#5a5a6e", { sw: 3 });
    i += rect(-46, -64, 92, 56, "#d64545", { sw: 3, r: 14 });
    i += rect(-30, -56, 60, 22, "#2a2f3f", { sw: 2.4, r: 6 });
    i += fcircle(-14, -45, 6, o.eyes || "#4fd3ff") + fcircle(14, -45, 6, o.eyes || "#4fd3ff");
    i += path("M-12 -36 Q0 -30 12 -36", "none", { sw: 2, stroke: "#4fd3ff" });
    i += line(0, -64, 0, -94, { sw: 3 }) + circle(0, -98, 6, "#f4c542", { sw: 2.4 });
    i += path("M46 -40 L80 -50 L92 -30", "none", { sw: 6 }) + path("M-46 -40 L-76 -24 L-84 -40", "none", { sw: 6 });
    i += circle(92, -30, 7, "#a9b3c4", { sw: 2.4 }) + circle(-84, -40, 7, "#a9b3c4", { sw: 2.4 });
    i += text(0, -14, "VAC-BOT 3000", { size: 9, fill: "#fff" });
    if (o.sparks) i += fx.sparkle(70, -70, 12, "#ffd23f") + fx.sparkle(-60, -76, 9, "#ffd23f");
    return T(x, y, s, i);
  };
  P.clothesPile = (x, y, s, o = {}) => {
    const cols = o.colors || ["#c9473c", "#5b7fb5", "#f4c542", "#7cc35a", "#ffffff"];
    let i = "";
    i += path("M-70 0 Q-80 -30 -50 -40 Q-30 -70 0 -52 Q30 -76 54 -44 Q82 -36 74 0 Z", cols[0], { sw: 3 });
    i += path("M-40 -30 Q-10 -60 20 -36 Q10 -14 -20 -12 Z", cols[1], { sw: 2.6 });
    i += path("M14 -20 Q40 -48 64 -24 L60 -4 Q36 -12 14 -20 Z", cols[2], { sw: 2.6 });
    i += path("M-62 -10 L-80 4 L-56 6 Z", cols[3], { sw: 2.4 });
    i += path("M-10 -48 q10 -26 30 -20 l-4 10 q-14 -4 -20 14 Z", cols[4], { sw: 2.4 });
    i += path("M30 -40 q16 -20 28 -6", "none", { sw: 2, stroke: shade(cols[2], -0.3) });
    return T(x, y, s, i);
  };
  P.sock = (x, y, s, rot) => T(x, y, s, `<g transform="rotate(${rot || 0})">${path("M-6 -30 L8 -30 L8 0 Q8 10 22 10 L22 20 Q-6 22 -6 4 Z", "#ffffff", { sw: 2.4 })}${line(-6, -22, 8, -22, { sw: 3, stroke: "#c9473c" })}${fellipse(10, 14, 6, 3, "#8a7a5a", 0.7)}</g>`);
  P.pizzaBox = (x, y, s, o = {}) => {
    let i = path("M-50 0 L50 0 L50 -12 L-50 -12 Z", "#e2c18f", { sw: 2.6 });
    i += path("M-50 -12 L-30 -60 L66 -52 L50 -12 Z", "#ecd2a5", { sw: 2.6 });
    i += path("M-36 -14 L0 -14 L-18 -2 Z", "#f4c542", { sw: 1.6 }) + fcircle(-20, -10, 2.5, "#c9473c");
    i += text(14, -32, "PIZZA", { size: 11, font: "title", fill: "#c9473c", rot: -8 });
    return T(x, y, s, i);
  };
  P.can = (x, y, s, rot) => T(x, y, s, `<g transform="rotate(${rot || 0})">${rect(-8, -26, 16, 26, "#d64545", { sw: 2.2, r: 3 })}${line(-8, -18, 8, -18, { sw: 1.6, stroke: "#fff" })}${ellipse(0, -26, 8, 2.5, "#c9c9d6", { sw: 1.6 })}</g>`);
  P.plateMold = (x, y, s) => T(x, y, s, `${ellipse(0, 0, 34, 10, "#ffffff", { sw: 2.6 })}${fellipse(-6, -4, 18, 6, "#8fbf4a")}${fcircle(4, -6, 4, "#5f8f2a")}${fcircle(-14, -4, 3, "#5f8f2a")}${path("M-4 -10 q2 -14 8 -18 M6 -8 q6 -10 14 -10", "none", { sw: 2, stroke: "#7fa84a" })}`);
  P.alarm = (x, y, s, o = {}) => {
    let i = "";
    i += circle(-16, -50, 9, "#f4c542", { sw: 2.4 }) + circle(16, -50, 9, "#f4c542", { sw: 2.4 });
    i += circle(0, -30, 26, o.color || "#d64545", { sw: 3 }) + circle(0, -30, 19, "#fffaf0", { sw: 2 });
    i += line(0, -30, 0, -42, { sw: 2.4 }) + line(0, -30, 9, -26, { sw: 2.4 });
    i += line(-14, -8, -20, 2, { sw: 3 }) + line(14, -8, 20, 2, { sw: 3 });
    if (o.ring) i += path("M-38 -54 q-8 10 0 20 M38 -54 q8 10 0 20 M-46 -62 q-12 16 0 34 M46 -62 q12 16 0 34", "none", { sw: 2.6 });
    if (o.time) i += text(0, -36, o.time, { size: 9 });
    return T(x, y, s, i);
  };
  P.alarmParts = (x, y, s) => T(x, y, s, `${circle(-30, -8, 14, "#d64545", { sw: 2.4 })}${path("M0 -4 l8 -10 l8 10", "none", { sw: 2.4 })}${circle(30, -10, 8, "#f4c542", { sw: 2.2 })}${path("M44 -4 q6 -10 14 -2 q6 8 14 -2", "none", { sw: 2 })}${fcircle(12, 0, 3, INK)}${fcircle(-8, 2, 2.4, "#a9b3c4")}`);
  P.calendar = (x, y, w, h, o = {}) => {
    let i = rect(x, y, w, h, "#ffffff", { sw: 2.8 });
    i += frect(x + 1.5, y + 1.5, w - 3, h * 0.2, o.color || "#c9473c");
    i += text(x + w / 2, y + h * 0.16, o.title || "MARCH", { size: h * 0.12, font: "title", fill: "#fff", ls: 1 });
    const cols = 7,
      rows = 5;
    const cw = (w - 12) / cols,
      ch = (h * 0.76 - 8) / rows;
    for (let r2 = 0; r2 < rows; r2++)
      for (let c = 0; c < cols; c++) {
        const cx = x + 6 + c * cw,
          cy = y + h * 0.22 + 4 + r2 * ch;
        i += `<rect x="${n(cx)}" y="${n(cy)}" width="${n(cw - 2)}" height="${n(ch - 2)}" fill="none" stroke="#c9c3b5" stroke-width="1"/>`;
        const idx = r2 * cols + c;
        if (o.checks && idx < o.checks) i += path(`M${n(cx + cw * 0.2)} ${n(cy + ch * 0.5)} l${n(cw * 0.2)} ${n(ch * 0.25)} l${n(cw * 0.4)} ${n(-ch * 0.5)}`, "none", { sw: Math.max(1.8, cw / 9), stroke: "#2a9d5a" });
        if (o.xs && idx < o.xs) i += path(`M${n(cx + cw * 0.2)} ${n(cy + ch * 0.2)} l${n(cw * 0.55)} ${n(ch * 0.55)} M${n(cx + cw * 0.75)} ${n(cy + ch * 0.2)} l${n(-cw * 0.55)} ${n(ch * 0.55)}`, "none", { sw: Math.max(1.8, cw / 9), stroke: "#d8352a" });
      }
    return i;
  };
  P.choreChart = (x, y, w, h, o = {}) => {
    let i = rect(x - 6, y - 6, w + 12, h + 12, "#a9b3c4", { sw: 2.8, r: 4 });
    i += rect(x, y, w, h, "#ffffff", { sw: 2 });
    i += text(x + w / 2, y + h * 0.13, o.title || "LEX'S CHORES", { size: h * 0.1, font: "title", fill: "#2a8f86", ls: 1 });
    const items = o.items || ["Make bed", "Trash", "Dishes", "Laundry", "Feed Biscuit"];
    const days = 5;
    const rowH = (h * 0.8) / items.length;
    items.forEach((t, k) => {
      const ry = y + h * 0.2 + k * rowH;
      i += text(x + 8, ry + rowH * 0.66, t, { size: Math.min(rowH * 0.55, 15), font: "hand", anchor: "start" });
      for (let d = 0; d < days; d++) {
        const bx = x + w * 0.5 + d * ((w * 0.48) / days);
        i += `<rect x="${n(bx)}" y="${n(ry + rowH * 0.15)}" width="${n(rowH * 0.7)}" height="${n(rowH * 0.7)}" fill="none" stroke="#9a9ab0" stroke-width="1.4"/>`;
        if (o.checked && (o.checked === true || (k * days + d) % 7 < o.checked))
          i += path(`M${n(bx + rowH * 0.12)} ${n(ry + rowH * 0.5)} l${n(rowH * 0.18)} ${n(rowH * 0.2)} l${n(rowH * 0.36)} ${n(-rowH * 0.42)}`, "none", { sw: 2.4, stroke: "#2a9d5a" });
      }
    });
    if (o.planes) {
      i += path(`M${n(x + w * 0.3)} ${n(y + h * 0.5)} l30 -10 l-8 14 Z`, "#ffffff", { sw: 2 }) + path(`M${n(x + w * 0.65)} ${n(y + h * 0.35)} l28 6 l-14 10 Z`, "#ffffff", { sw: 2 });
      i += circle(x + w * 0.5, y + h * 0.55, h * 0.18, "none", { sw: 2.4, stroke: "#d8352a" }) + circle(x + w * 0.5, y + h * 0.55, h * 0.08, "none", { sw: 2.4, stroke: "#d8352a" });
    }
    return i;
  };
  P.goalBoard = (x, y, w, h, o = {}) => {
    let i = rect(x - 8, y - 8, w + 16, h + 16, "#8a5a3c", { sw: 3, r: 4 });
    i += rect(x, y, w, h, "#d9b98a", { sw: 2 });
    i += text(x + w / 2, y + 30, o.title || "LEX'S GOALS", { size: 26, font: "title", fill: "#c9473c", ls: 1 });
    const goals = o.goals || [];
    goals.forEach((gl, k) => {
      const ny = y + 46 + k * ((h - 56) / Math.max(1, goals.length));
      const nh = (h - 66) / Math.max(1, goals.length);
      const col = ["#fff6a8", "#bfe8ff", "#ffd1dc", "#c9f2c0", "#ffe0b0", "#e6d4ff"][k % 6];
      i += `<g transform="rotate(${k % 2 ? 1.2 : -1.2} ${n(x + w / 2)} ${n(ny + nh / 2)})">${rect(x + 14, ny, w - 28, nh, col, { sw: 1.8 })}`;
      i += rect(x + 22, ny + nh / 2 - 8, 16, 16, "#fff", { sw: 2 });
      if (gl.done) i += path(`M${n(x + 24)} ${n(ny + nh / 2)} l5 6 l12 -14`, "none", { sw: 3.4, stroke: "#2a9d5a" });
      i += text(x + 46, ny + nh / 2 + 6, gl.t, { size: Math.min(nh * 0.55, 19), font: "hand", anchor: "start" });
      i += fcircle(x + w / 2, ny + 3, 4, "#d8352a") + `</g>`;
    });
    return i;
  };
  P.sink = (x, y, s, o = {}) => {
    let i = "";
    i += rect(-90, -88, 180, 88, "#e9e4da", { sw: 3 });
    i += rect(-82, -80, 78, 72, "#dcd6ca", { sw: 2 }) + rect(4, -80, 78, 72, "#dcd6ca", { sw: 2 });
    i += fcircle(-14, -44, 3, INK) + fcircle(14, -44, 3, INK);
    i += rect(-100, -104, 200, 18, "#f6f6f2", { sw: 3, r: 4 });
    i += ellipse(0, -100, 52, 8, "#cfe6ec", { sw: 2.4 });
    i += path("M-6 -104 L-6 -130 Q-6 -138 6 -138 L22 -138 L22 -128 L8 -128 L8 -104", "#c9d3e0", { sw: 2.6 });
    if (o.running) i += path("M18 -128 Q20 -116 16 -104", "none", { sw: 4, stroke: "#7fd3ff" });
    i += rect(56, -134, 18, 30, "#4fb3e8", { sw: 2.4, r: 4 }) + line(62, -150, 60, -134, { sw: 2.4, stroke: "#4fb3e8" }) + line(68, -152, 70, -134, { sw: 2.4, stroke: "#d64545" });
    i += rect(-80, -128, 24, 24, "#ffffff", { sw: 2.2, r: 4 }) + rect(-76, -146, 16, 18, "#e8536b", { sw: 2 });
    return T(x, y, s, i);
  };
  P.mirror = (x, y, w, h, o = {}) => {
    let i = rect(x - 8, y - 8, w + 16, h + 16, "#c9b38a", { sw: 3, r: 10 });
    i += rect(x, y, w, h, "#d7eef6", { sw: 2.4, r: 6 });
    i += path(`M${n(x + w * 0.15)} ${n(y + h * 0.15)} L${n(x + w * 0.35)} ${n(y + h * 0.05)} M${n(x + w * 0.12)} ${n(y + h * 0.3)} L${n(x + w * 0.5)} ${n(y + h * 0.1)}`, "none", { sw: 3, stroke: "#ffffff", op: 0.8 });
    return i;
  };
  P.toilet = (x, y, s, o = {}) => {
    let i = "";
    i += rect(-38, -150, 76, 64, "#f6f6f2", { sw: 3, r: 6 });
    i += rect(-46, -160, 92, 14, "#ffffff", { sw: 2.6, r: 4 });
    i += rect(26, -132, 14, 6, "#c9d3e0", { sw: 2 });
    i += path("M-54 -86 L54 -86 Q50 -40 20 -30 L24 0 L-24 0 L-20 -30 Q-50 -40 -54 -86 Z", "#ffffff", { sw: 3 });
    i += ellipse(0, -88, 56, 10, "#ffffff", { sw: 3 });
    return T(x, y, s, i);
  };
  P.tp = (x, y, s) => T(x, y, s, `${rect(-4, -4, 8, 8, "#c9d3e0", { sw: 2 })}${rect(-20, -16, 40, 26, "#ffffff", { sw: 2.4, r: 12 })}${ellipse(-20, -3, 6, 13, "#e9e4da", { sw: 2 })}${path("M20 6 L20 30 L8 30 L8 10", "#ffffff", { sw: 2 })}`);
  P.showerCurtain = (x, y, w, h, o = {}) => {
    let i = rect(x - 6, y - 10, w + 12, 8, "#c9d3e0", { sw: 2.4, r: 4 });
    let d = `M${n(x)} ${n(y)}`;
    const N = Math.round(w / 30);
    for (let k = 0; k < N; k++) d += ` q${n(w / N / 2)} 14 ${n(w / N)} 0`;
    d += ` L${n(x + w)} ${n(y + h)} L${n(x)} ${n(y + h)} Z`;
    i += path(d, o.color || "#8fd0c9", { sw: 3 });
    for (let k = 1; k < N; k++) i += line(x + (k * w) / N, y + 12, x + (k * w) / N + 4, y + h - 4, { sw: 1.6, stroke: shade(o.color || "#8fd0c9", -0.25) });
    if (o.ducks) for (let k = 0; k < 6; k++) i += fcircle(x + 20 + ((k * 53) % (w - 40)), y + 50 + ((k * 71) % (h - 80)), 6, "#f4c542");
    return i;
  };
  P.towelRack = (x, y, w, color) => rect(x, y, w, 6, "#c9d3e0", { sw: 2, r: 3 }) + path(`M${n(x + 8)} ${n(y + 4)} L${n(x + w - 8)} ${n(y + 4)} L${n(x + w - 12)} ${n(y + 80)} L${n(x + 12)} ${n(y + 80)} Z`, color || "#f4c542", { sw: 2.6 }) + line(x + 14, y + 66, x + w - 14, y + 66, { sw: 3, stroke: "#ffffff" });
  P.caddy = (x, y, s, o = {}) => {
    let i = rect(-60, -44, 120, 44, "#4fb3e8", { sw: 3, r: 6 });
    i += path("M-40 -44 Q-40 -76 0 -76 Q40 -76 40 -44", "none", { sw: 6 });
    if (o.snacks) {
      i += rect(-52, -70, 22, 30, "#f4c542", { sw: 2.2, r: 3 }) + text(-41, -52, "CHIPS", { size: 6 });
      i += rect(-24, -62, 20, 22, "#d64545", { sw: 2.2, r: 3 });
      i += C.held.controller(24, -52, 0.7, 1);
      i += rect(36, -66, 10, 22, "#7cc35a", { sw: 2, r: 2 });
    } else {
      i += rect(-50, -82, 12, 40, "#ffffff", { sw: 2.2, r: 3 }) + rect(-34, -74, 14, 32, "#4fb3e8", { sw: 2.2, r: 4 }) + rect(-16, -78, 16, 36, "#7cc35a", { sw: 2.2, r: 4 }) + rect(4, -70, 22, 28, "#f6f1e6", { sw: 2.2, r: 4 }) + rect(30, -84, 10, 42, "#e8536b", { sw: 2.2, r: 3 });
    }
    i += text(0, -14, o.label || "FRESH START KIT", { size: 12, font: "title", fill: "#ffffff", ls: 1 });
    return T(x, y, s, i);
  };
  P.couch = (x, y, s, o = {}) => {
    const c = o.color || "#6f8fd6";
    let i = "";
    i += rect(-170, -150, 340, 80, shade(c, -0.1), { sw: 3, r: 18 });
    i += rect(-160, -84, 320, 50, c, { sw: 3, r: 10 });
    i += line(0, -84, 0, -34, { sw: 2.4 });
    i += rect(-190, -110, 44, 96, c, { sw: 3, r: 14 }) + rect(146, -110, 44, 96, c, { sw: 3, r: 14 });
    i += rect(-180, -14, 14, 14, "#5a3a26", { sw: 2 }) + rect(166, -14, 14, 14, "#5a3a26", { sw: 2 });
    if (o.pillow) i += path("M-140 -140 L-90 -146 L-86 -96 L-138 -92 Z", "#f4c542", { sw: 2.6 });
    return T(x, y, s, i);
  };
  P.tv = (x, y, s, o = {}) => {
    let i = rect(-110, -20, 220, 20, "#5a3a26", { sw: 3 });
    i += rect(-100, -150, 200, 120, "#22222f", { sw: 3, r: 6 });
    i += frect(-92, -142, 184, 104, o.off ? "#2f3a4f" : "#103248");
    if (!o.off) {
      i += frect(-92, -70, 184, 32, "#3f8f5a") + path("M-60 -70 l18 -26 l18 26 Z", "#d8402f", { sw: 2 }) + fcircle(40, -100, 12, "#f4c542");
      i += text(0, -116, o.label || "LEVEL 47", { size: 18, font: "title", fill: "#fff" });
      i += `<rect x="-92" y="-142" width="184" height="104" fill="url(#screenGlow)" opacity=".4"/>`;
    }
    i += rect(-12, -30, 24, 10, "#22222f", { sw: 2 });
    return T(x, y, s, i);
  };
  P.table = (x, y, s, o = {}) => {
    let i = rect(-150, -100, 300, 16, o.color || "#b07a4a", { sw: 3, r: 4 });
    if (o.cloth) i += path("M-156 -104 L156 -104 L150 -60 Q0 -50 -150 -60 Z", o.cloth, { sw: 2.6 });
    i += rect(-130, -84, 14, 84, "#8a5a3c", { sw: 2.6 }) + rect(116, -84, 14, 84, "#8a5a3c", { sw: 2.6 });
    return T(x, y, s, i);
  };
  P.fridge = (x, y, s, o = {}) => {
    let i = rect(-55, -300, 110, 300, "#e9edf2", { sw: 3, r: 8 });
    i += line(-55, -190, 55, -190, { sw: 2.6 });
    i += rect(38, -280, 6, 60, "#b9c1cc", { sw: 2, r: 3 }) + rect(38, -170, 6, 70, "#b9c1cc", { sw: 2, r: 3 });
    i += rect(-38, -280, 30, 36, "#ffffff", { sw: 1.8 }) + fx.heart(-23, -264, 7);
    i += rect(-10, -150, 36, 44, "#fff6a8", { sw: 1.8 });
    return T(x, y, s, i);
  };
  P.cabinets = (x, y, w, h, o = {}) => {
    const c = o.color || "#d8c3a0";
    let i = rect(x, y, w, h, c, { sw: 3 });
    const N = Math.max(1, Math.round(w / 90));
    for (let k = 0; k < N; k++) {
      const cx = x + (k * w) / N;
      i += rect(cx + 6, y + 6, w / N - 12, h - 12, shade(c, 0.12), { sw: 2 });
      i += rect(cx + w / N - 22, y + h / 2 - 10, 5, 20, "#8a7a5a", { sw: 1.6, r: 2 });
    }
    return i;
  };
  P.counter = (x, y, w, o = {}) => {
    const c = o.color || "#d8c3a0";
    let i = P.cabinets(x, y + 16, w, 104, { color: c });
    i += rect(x - 6, y, w + 12, 18, o.top || "#f0ede4", { sw: 3 });
    return i;
  };
  P.stairs = (x, y, w, h, o = {}) => {
    // stairs rising to the right; x,y bottom-left
    const steps = o.steps || 8;
    let i = "";
    const sw2 = w / steps,
      sh = h / steps;
    let d = `M${n(x)} ${n(y)}`;
    for (let k = 0; k < steps; k++) d += ` L${n(x + k * sw2)} ${n(y - (k + 1) * sh)} L${n(x + (k + 1) * sw2)} ${n(y - (k + 1) * sh)}`;
    d += ` L${n(x + w)} ${n(y)} Z`;
    i += path(d, o.color || "#b07a4a", { sw: 3 });
    for (let k = 0; k < steps; k++) i += line(x + k * sw2, y - (k + 1) * sh + 6, x + (k + 1) * sw2, y - (k + 1) * sh + 6, { sw: 1.6, stroke: "#8a5a3c" });
    i += line(x + 10, y - 120, x + w + 10, y - h - 120, { sw: 7 });
    for (let k = 0; k <= steps; k += 1) i += line(x + 10 + k * sw2, y - k * sh - 118, x + 10 + k * sw2, y - (k + 0.5) * sh, { sw: 3 });
    return i;
  };
  P.door = (x, y, w, h, o = {}) => {
    let i = rect(x - 8, y - 8, w + 16, h + 8, "#f6f1e6", { sw: 3 });
    i += rect(x, y, w, h, o.color || "#b07a4a", { sw: 3 });
    i += rect(x + 12, y + 14, w - 24, h * 0.36, shade(o.color || "#b07a4a", 0.12), { sw: 2 }) + rect(x + 12, y + h * 0.52, w - 24, h * 0.4, shade(o.color || "#b07a4a", 0.12), { sw: 2 });
    i += circle(x + w - 16, y + h * 0.5, 6, "#d8b84a", { sw: 2 });
    if (o.sign) i += o.sign;
    return i;
  };
  P.trashCan = (x, y, s, o = {}) => T(x, y, s, `${path("M-28 -70 L28 -70 L22 0 L-22 0 Z", o.color || "#7a8a9a", { sw: 3 })}${rect(-32, -78, 64, 10, shade(o.color || "#7a8a9a", -0.15), { sw: 2.6, r: 3 })}${[-12, 0, 12].map((d) => line(d, -62, d * 0.8, -8, { sw: 1.6, stroke: "#5a6a7a" })).join("")}${o.full ? path("M-24 -78 Q-10 -100 8 -84 Q20 -98 30 -78", "#2d2d3a", { sw: 2.4 }) : ""}`);
  P.plant = (x, y, s) => T(x, y, s, `${path("M-20 0 L20 0 L26 -36 L-26 -36 Z", "#c9673c", { sw: 2.6 })}${path("M0 -36 Q-30 -70 -26 -96 Q-6 -70 0 -36 Q10 -80 34 -92 Q24 -60 0 -36 Q-4 -66 6 -110 Q14 -66 0 -36", "#5fa84a", { sw: 2.4 })}`);
  P.bookstack = (x, y, s) => T(x, y, s, `${rect(-30, -12, 60, 12, "#2a8f86", { sw: 2.2 })}${rect(-26, -24, 54, 12, "#c9473c", { sw: 2.2 })}${rect(-28, -36, 50, 12, "#f4c542", { sw: 2.2 })}`);
  P.highlighters = (x, y, s) => T(x, y, s, ["#f4e04a", "#ff8fb8", "#7fe08a", "#7fd3ff"].map((c, k) => `<g transform="rotate(${-20 + k * 12} ${k * 14} 0)">${rect(k * 14 - 4, -40, 9, 40, c, { sw: 2, r: 3 })}${rect(k * 14 - 4, -48, 9, 10, shade(c, -0.25), { sw: 2, r: 2 })}</g>`).join(""));
  P.journal = (x, y, s, o = {}) => {
    let i = `<g transform="rotate(${o.rot || -4})">`;
    i += rect(-190, -120, 380, 240, "#2a8f86", { sw: 3, r: 8 });
    i += rect(-182, -114, 178, 228, "url(#lined)", { sw: 2 }) + rect(4, -114, 178, 228, "url(#lined)", { sw: 2 });
    (o.left || []).forEach((t, k) => (i += text(-170, -84 + k * 26, t, { size: 19, font: "hand", anchor: "start", weight: 400, fill: k === 0 ? "#c9473c" : INK })));
    (o.right || []).forEach((t, k) => (i += text(16, -84 + k * 26, t, { size: 19, font: "hand", anchor: "start", weight: 400, fill: k === 0 ? "#2a5a9a" : INK })));
    i += `</g>`;
    return T(x, y, s, i);
  };
  P.bibleOpen = (x, y, s, o = {}) => {
    // large open Bible for close-ups. x,y = centre.
    let i = "";
    if (o.glow) i += `<ellipse cx="0" cy="0" rx="330" ry="210" fill="url(#glow)"/>`;
    i += path("M-300 -150 Q-150 -190 0 -150 Q150 -190 300 -150 L300 160 Q150 120 0 160 Q-150 120 -300 160 Z", "#5a2a1f", { sw: 3.4 });
    i += path("M-286 -160 Q-140 -196 0 -158 L0 150 Q-140 112 -286 150 Z", "#fffbec", { sw: 3 });
    i += path("M286 -160 Q140 -196 0 -158 L0 150 Q140 112 286 150 Z", "#fffbec", { sw: 3 });
    i += line(0, -158, 0, 150, { sw: 3 });
    i += path("M-10 150 L-6 196 L0 182 L6 196 L10 150", "#c9473c", { sw: 2 });
    const filler = (x0, x1, y0, y1, skip) => {
      let f = "";
      for (let yy = y0; yy < y1; yy += 16) {
        if (skip && yy > skip[0] && yy < skip[1]) continue;
        f += line(x0, yy, x1 - ((yy * 7) % 40), yy, { sw: 2, stroke: "#c9bfa8" });
      }
      return f;
    };
    i += filler(-262, -24, -124, 124, o.leftSkip);
    i += filler(24, 262, -124, 124, o.rightSkip);
    if (o.head) i += text(-143, -132, o.head[0], { size: 15, font: "verse", italic: true, fill: "#8a5a3c" }) + text(143, -132, o.head[1], { size: 15, font: "verse", italic: true, fill: "#8a5a3c" });
    return T(x, y, s, i);
  };
  P.sneakerPair = (x, y, s, o = {}) => {
    const dirty = o.dirty;
    const fn = dirty ? C.held.sneakerDirty : C.held.sneaker;
    let i = fn(-22, 0, 1, 1) + fn(26, 8, 1, 1);
    if (!dirty && o.shine) i += fx.sparkle(50, -20, 9) + fx.sparkle(-46, -16, 7);
    return T(x, y, s, i);
  };
  P.bike = (x, y, s, o = {}) => {
    const c = o.color || "#2d6fb5";
    let i = "";
    const wheel = (wx) => circle(wx, -40, 38, "none", { sw: 5 }) + circle(wx, -40, 33, "none", { sw: 1.4, stroke: "#9aa3b5" }) + [0, 30, 60, 90, 120, 150].map((a) => line(wx + Math.cos((a * Math.PI) / 180) * 32, -40 + Math.sin((a * Math.PI) / 180) * 32, wx - Math.cos((a * Math.PI) / 180) * 32, -40 - Math.sin((a * Math.PI) / 180) * 32, { sw: 1, stroke: "#9aa3b5" })).join("") + fcircle(wx, -40, 4, INK);
    i += wheel(-70) + wheel(70);
    i += path("M-70 -40 L-14 -40 L-34 -100 Z M-14 -40 L46 -100 L-34 -100 M46 -100 L70 -40", "none", { sw: 6, stroke: c });
    i += path("M-14 -40 L-70 -40 L-34 -100 L46 -100 L70 -40 M-14 -40 L46 -100", "none", { sw: 1.4 });
    i += line(-34, -100, -40, -118, { sw: 5 }) + rect(-58, -126, 36, 9, "#2a2f3f", { sw: 2.2, r: 4 });
    i += line(46, -100, 40, -128, { sw: 5 }) + path("M28 -132 L54 -126", "none", { sw: 6 });
    i += circle(-14, -40, 9, "#c9c9d6", { sw: 2.4 });
    if (o.brokenChain) i += path("M-14 -32 Q-40 -10 -60 -20 M-70 -32 Q-80 -6 -90 -12", "none", { sw: 2.4, stroke: "#5a5a6e", dash: "4 3" });
    else i += path("M-14 -49 L-70 -45 M-14 -31 L-70 -35", "none", { sw: 2, stroke: "#5a5a6e" });
    return T(x, y, s, i);
  };
  P.workbench = (x, y, w, o = {}) => {
    let i = rect(x, y - 110, w, 18, "#b07a4a", { sw: 3 });
    i += rect(x + 10, y - 92, 16, 92, "#8a5a3c", { sw: 2.6 }) + rect(x + w - 26, y - 92, 16, 92, "#8a5a3c", { sw: 2.6 });
    i += rect(x + 10, y - 40, w - 20, 12, "#8a5a3c", { sw: 2.4 });
    return i;
  };
  P.pegboard = (x, y, w, h) => {
    let i = rect(x, y, w, h, "url(#pegboard)", { sw: 3 });
    i += C.held.wrench(x + w * 0.15, y + h * 0.55, 1, 1) + `<g transform="translate(${n(x + w * 0.35)} ${n(y + h * 0.25)})">${rect(-4, 0, 8, 40, "#d64545", { sw: 2 })}${rect(-12, -10, 24, 12, "#5a5a6e", { sw: 2 })}</g>`;
    i += circle(x + w * 0.6, y + h * 0.4, 22, "none", { sw: 5, stroke: "#2a2f3f" }) + C.held.brushTool(x + w * 0.82, y + h * 0.7, 1, 1);
    return i;
  };
  P.jar = (x, y, s, label, fill, color) => {
    let i = path("M-32 -100 L32 -100 L36 -86 Q40 -10 30 0 L-30 0 Q-40 -10 -36 -86 Z", "#e6f4fa", { sw: 3, op: 1 });
    i += rect(-34, -112, 68, 14, "#a9b3c4", { sw: 2.6, r: 3 });
    const fh = 80 * (fill || 0.5);
    i += path(`M-34 ${n(-4 - fh)} L34 ${n(-4 - fh)} L32 -4 Q30 0 26 0 L-26 0 Q-30 0 -32 -4 Z`, "#8fcf7a", { sw: 0, stroke: "none" });
    for (let k = 0; k < Math.round(fill * 6); k++) i += circle(-18 + ((k * 13) % 36), -10 - ((k * 11) % Math.max(10, fh - 10)), 7, "#f4c542", { sw: 1.6 });
    i += rect(-28, -76, 56, 24, color || "#ffffff", { sw: 2 });
    i += text(0, -58, label, { size: 15, font: "title", fill: INK, ls: 1 });
    i += path("M20 -94 Q26 -60 22 -20", "none", { sw: 3, stroke: "#ffffff", op: 0.8 });
    return T(x, y, s, i);
  };
  P.cashBox = (x, y, s) => T(x, y, s, `${rect(-50, -40, 100, 40, "#3f8f5a", { sw: 3, r: 4 })}${path("M-50 -40 L-40 -70 L60 -70 L50 -40 Z", "#4fa86a", { sw: 3 })}${C.held.money(0, -48, 0.9, 1)}${rect(-8, -26, 16, 10, "#d8b84a", { sw: 2 })}`);
  P.pew = (x, y, w, o = {}) => {
    const c = o.color || "#8a5a3c";
    let i = rect(x, y - 120, w, 70, c, { sw: 3, r: 6 });
    i += rect(x - 6, y - 128, w + 12, 12, shade(c, -0.15), { sw: 2.6, r: 4 });
    i += rect(x, y - 54, w, 20, shade(c, -0.08), { sw: 2.6 });
    i += rect(x, y - 34, 14, 34, shade(c, -0.2), { sw: 2.4 }) + rect(x + w - 14, y - 34, 14, 34, shade(c, -0.2), { sw: 2.4 });
    if (o.bible) i += rect(x + w * 0.3, y - 106, 30, 10, "#5a2a1f", { sw: 2 });
    return i;
  };
  P.stainedGlass = (x, y, w, h) => {
    let i = path(`M${n(x)} ${n(y + h)} L${n(x)} ${n(y + w / 2)} Q${n(x)} ${n(y)} ${n(x + w / 2)} ${n(y)} Q${n(x + w)} ${n(y)} ${n(x + w)} ${n(y + w / 2)} L${n(x + w)} ${n(y + h)} Z`, "#2b3a73", { sw: 4 });
    const cols = ["#e8536b", "#f4c542", "#4fb3e8", "#7cc35a", "#9b59b6", "#f08a3c"];
    const r = C.rng(31);
    for (let yy = y + w * 0.35; yy < y + h - 10; yy += h / 6) {
      for (let xx = x + 6; xx < x + w - 10; xx += w / 3) i += rect(xx, yy, w / 3 - 6, h / 6 - 6, cols[Math.floor(r() * cols.length)], { sw: 2.2, op: 0.95 });
    }
    i += circle(x + w / 2, y + w * 0.38, w * 0.22, "#f4c542", { sw: 2.4 });
    i += path(`M${n(x + w / 2 - 3)} ${n(y + w * 0.24)} h6 v${n(w * 0.1)} h${n(w * 0.08)} v6 h${n(-w * 0.08)} v${n(w * 0.16)} h-6 v${n(-w * 0.16)} h${n(-w * 0.08)} v-6 h${n(w * 0.08)} Z`, "#ffffff", { sw: 1.6 });
    return i;
  };
  P.pulpit = (x, y, s, o = {}) => T(x, y, s, `${path("M-60 0 L60 0 L50 -120 L-50 -120 Z", "#8a5a3c", { sw: 3 })}${rect(-64, -132, 128, 14, "#6e452d", { sw: 3 })}${path("M-4 -96 h8 v14 h14 v8 h-14 v30 h-8 v-30 h-14 v-8 h14 Z", "#e2b955", { sw: 2 })}`);
  P.cross = (x, y, s, color) => T(x, y, s, path("M-10 -200 h20 v60 h50 v20 h-50 v120 h-20 v-120 h-50 v-20 h50 Z", color || "#8a5a3c", { sw: 3 }));
  P.offeringPlate = (x, y, s) => T(x, y, s, `${ellipse(0, 0, 50, 14, "#c9a25a", { sw: 3 })}${ellipse(0, -4, 36, 9, "#8a2a2a", { sw: 2 })}${C.held.envelope(-8, -10, 0.6, 1)}${C.held.money(14, -8, 0.5, 1)}`);
  P.podium = (x, y, s, o = {}) => T(x, y, s, `${path("M-56 0 L56 0 L46 -110 L-46 -110 Z", o.color || "#2a8f86", { sw: 3 })}${rect(-60, -122, 120, 14, shade(o.color || "#2a8f86", -0.2), { sw: 3 })}${C.gear(0, -60, 22, "#f4c542")}${line(20, -122, 34, -160, { sw: 3 })}${circle(36, -164, 7, "#5a5a6e", { sw: 2 })}`);
  P.easel = (x, y, s, o = {}) => {
    let i = line(-40, 0, -10, -200, { sw: 6, stroke: "#8a5a3c" }) + line(40, 0, 10, -200, { sw: 6, stroke: "#8a5a3c" });
    i += rect(-80, -200, 160, 120, "#ffffff", { sw: 3 });
    i += text(0, -176, o.title || "FROM DIRTY KICKS", { size: 15, font: "title", fill: "#c9473c" });
    i += text(0, -158, o.sub || "TO CLEAN PROFITS", { size: 15, font: "title", fill: "#2a8f86" });
    i += path("M-60 -96 L-30 -110 L0 -106 L30 -128 L60 -146", "none", { sw: 4, stroke: "#2a9d5a" }) + fcircle(60, -146, 5, "#2a9d5a");
    return T(x, y, s, i);
  };
  P.sign = (x, y, w, h, t1, t2, o = {}) => {
    let i = rect(x, y, w, h, o.bg || "#ffffff", { sw: 3, r: 6 });
    i += text(x + w / 2, y + h * (t2 ? 0.45 : 0.66), t1, { size: o.size || h * 0.36, font: o.font || "title", fill: o.color || "#c9473c", ls: 1 });
    if (t2) i += text(x + w / 2, y + h * 0.82, t2, { size: (o.size || h * 0.36) * 0.62, font: o.font2 || "letter", fill: o.color2 || INK });
    return i;
  };
  P.house = (x, y, w, h, o = {}) => {
    // facade with porch, x,y = bottom-left
    let i = "";
    const roofC = o.roof || "#5a4a6a";
    i += rect(x, y - h, w, h, "url(#siding)", { sw: 3 });
    i += path(`M${n(x - 30)} ${n(y - h)} L${n(x + w / 2)} ${n(y - h - h * 0.45)} L${n(x + w + 30)} ${n(y - h)} Z`, roofC, { sw: 3 });
    i += P.window(x + w * 0.1, y - h * 0.82, w * 0.22, h * 0.3, { time: o.lit ? "sunset" : "day" });
    i += P.window(x + w * 0.68, y - h * 0.82, w * 0.22, h * 0.3, { time: o.lit ? "sunset" : "day" });
    i += rect(x + w * 0.42, y - h * 0.62, w * 0.16, h * 0.62, "#c9473c", { sw: 3 });
    i += circle(x + w * 0.55, y - h * 0.3, 4, "#d8b84a", { sw: 1.6 });
    // porch
    i += rect(x - 10, y - h * 0.08, w + 20, h * 0.08, "#b8a38a", { sw: 3 });
    i += rect(x - 14, y - h * 0.48, w + 28, 12, "#f6f1e6", { sw: 3 });
    i += rect(x, y - h * 0.48, 10, h * 0.4, "#f6f1e6", { sw: 2.6 }) + rect(x + w - 10, y - h * 0.48, 10, h * 0.4, "#f6f1e6", { sw: 2.6 });
    return i;
  };
  P.tree = (x, y, s, o = {}) => T(x, y, s, `${path("M-14 0 L-10 -120 L10 -120 L14 0 Z", "#7a5233", { sw: 3 })}${path("M-90 -120 Q-110 -190 -50 -210 Q-30 -270 30 -250 Q90 -260 96 -190 Q120 -130 60 -110 Q0 -90 -40 -104 Q-90 -96 -90 -120 Z", o.color || "#5fa84a", { sw: 3 })}${path("M-40 -180 q20 -14 40 0 M20 -150 q20 -14 40 4", "none", { sw: 2.2, stroke: shade(o.color || "#5fa84a", -0.25) })}`);
  P.fence = (x, y, w, h) => {
    let i = "";
    for (let xx = x; xx < x + w; xx += 28) i += path(`M${n(xx)} ${n(y)} L${n(xx)} ${n(y - h + 10)} L${n(xx + 10)} ${n(y - h)} L${n(xx + 20)} ${n(y - h + 10)} L${n(xx + 20)} ${n(y)} Z`, "#f6f1e6", { sw: 2.4 });
    i += rect(x - 4, y - h * 0.7, w + 8, 8, "#f6f1e6", { sw: 2.2 }) + rect(x - 4, y - h * 0.3, w + 8, 8, "#f6f1e6", { sw: 2.2 });
    return i;
  };
  P.cloud = (x, y, s) => T(x, y, s, path("M-60 0 Q-80 0 -76 -20 Q-74 -40 -50 -36 Q-44 -64 -10 -58 Q16 -76 40 -52 Q70 -56 72 -28 Q90 -20 80 0 Z", "#ffffff", { sw: 2.6 }));
  P.sun = (x, y, r) => fx.rays(x, y, r * 2.6, "#fff3b8", 18, 0.45) + circle(x, y, r, "#ffd23f", { sw: 3 });
  P.wateringCan = (x, y, s, f) => T(x, y, s, `${path("M-22 -30 L22 -30 L18 6 L-18 6 Z", "#7fb3a0", { sw: 2.6 })}${path("M22 -20 L48 -40 L52 -36 L24 -10", "#7fb3a0", { sw: 2.4 })}${path("M-22 -24 Q-40 -26 -36 -6 Q-30 4 -20 -2", "none", { sw: 3 })}`);
  P.bankCounter = (x, y, w, h) => {
    let i = rect(x, y - h, w, h, "#7a5a8a", { sw: 3 });
    i += rect(x - 10, y - h - 14, w + 20, 16, "#e6e0f0", { sw: 3 });
    for (let k = 0; k < 3; k++) i += rect(x + 14 + (k * (w - 28)) / 3, y - h + 16, (w - 28) / 3 - 10, h - 32, shade("#7a5a8a", 0.12), { sw: 2 });
    return i;
  };
  P.dog = (x, y, s, o = {}) => {
    // Biscuit, the family dog. Side view, faces +x.
    const f = o.f || 1;
    const mood = o.mood || "happy";
    const c = "#d9a35a",
      dk = "#a8743a";
    let i = "";
    const lying = mood === "sleep";
    if (!lying) {
      [-30, -16, 18, 32].forEach((lx, k) => {
        const run = mood === "flee";
        const a = run ? (k % 2 ? 30 : -30) : 0;
        i += `<g transform="rotate(${a} ${lx} -26)">${C.stroke2([[lx, -26], [lx, -4]], 10, k < 2 ? dk : c, 2.6)}${ellipse(lx + 4, -2, 8, 4, k < 2 ? dk : c, { sw: 2.2 })}</g>`;
      });
    }
    const by = lying ? -16 : -40;
    const wag = mood === "happy" || mood === "love";
    i += path(`M-44 ${by - 4} Q-70 ${by - 30} ${wag ? -58 : -66} ${by - 44}`, "none", { sw: 9, stroke: INK });
    i += path(`M-44 ${by - 4} Q-70 ${by - 30} ${wag ? -58 : -66} ${by - 44}`, "none", { sw: 5, stroke: c });
    if (wag) i += path(`M-80 ${by - 50} q-6 8 0 16 M-86 ${by - 40} q-6 8 0 16`, "none", { sw: 2 });
    i += ellipse(0, by, 50, 24, c, { sw: 3 });
    i += path(`M10 ${by + 4} Q20 ${by + 26} 40 ${by + 10}`, "#f6e6c8", { sw: 2.4 });
    const hx = 44,
      hy = by - 26;
    i += circle(hx, hy, 24, c, { sw: 3 });
    i += ellipse(hx + 22, hy + 8, 16, 11, "#f6e6c8", { sw: 2.6 });
    i += fellipse(hx + 36, hy + 2, 6, 5, INK);
    i += path(`M${hx - 14} ${hy - 18} Q${hx - 34} ${hy - 6} ${hx - 26} ${hy + 22} Q${hx - 12} ${hy + 12} ${hx - 6} ${hy - 12} Z`, dk, { sw: 2.6 });
    if (mood === "sleep") {
      i += path(`M${hx + 2} ${hy - 4} q6 4 12 0`, "none", { sw: 2.4 });
      i += fx.zz(hx + 30, hy - 30, 0.8);
    } else if (mood === "gross") {
      i += path(`M${hx} ${hy - 10} l10 10 M${hx + 10} ${hy - 10} l-10 10`, "none", { sw: 2.6 });
      i += path(`M${hx + 22} ${hy + 14} q4 14 10 2`, "#e5737a", { sw: 2 });
      i += rect(hx + 28, hy - 8, 8, 16, "#f4c542", { sw: 2, r: 2 });
      i += fellipse(hx + 6, hy + 4, 30, 26, "#8dc26b", 0.3);
    } else {
      i += fcircle(hx + 6, hy - 6, 4.4, INK) + fcircle(hx + 7.4, hy - 7.6, 1.4, "#fff");
      if (mood === "happy" || mood === "love") i += path(`M${hx + 22} ${hy + 16} q2 14 10 8 q2 -4 0 -8`, "#e5737a", { sw: 2 });
      if (mood === "flee") i += fx.sweat(hx - 10, hy - 30, 1);
      if (mood === "love") i += fx.heart(hx + 10, hy - 46, 10) + fx.heart(hx + 34, hy - 58, 7);
    }
    i += rect(-8 + hx - 30, by - 22, 16, 8, "#c9473c", { sw: 2, r: 3 });
    return T(x, y, s, `<g transform="scale(${f} 1)">${i}</g>`);
  };
})();
