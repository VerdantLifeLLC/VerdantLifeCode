/* Lexington: The Turnaround — character rig.
   person(cfg, opts) draws a posable cartoon figure. Origin is between the feet;
   +x is the way the character faces (opts.f = -1 mirrors). */
(function () {
  "use strict";
  const C = window.Comic;
  const { n, pt, path, circle, ellipse, line, INK, SW, shade, fillPath, fellipse, fcircle } = C;
  const rad = (d) => (d * Math.PI) / 180;

  const BODY = {
    teen: { r: 40, hcy: -240, sy: -186, sw: 33, tb: 27, hy: -104, hw: 17, ua: 46, fa: 44, th: 50, sh: 50, aw: 16, lw: 20, hand: 10, foot: 15, eye: 1 },
    man: { r: 41, hcy: -332, sy: -274, sw: 45, tb: 36, hy: -156, hw: 22, ua: 62, fa: 58, th: 76, sh: 74, aw: 21, lw: 25, hand: 12.5, foot: 18, eye: 0.82 },
    woman: { r: 38, hcy: -312, sy: -258, sw: 36, tb: 31, hy: -146, hw: 21, ua: 57, fa: 53, th: 72, sh: 70, aw: 16, lw: 20, hand: 11, foot: 15, eye: 0.92 },
    child: { r: 38, hcy: -196, sy: -146, sw: 26, tb: 22, hy: -80, hw: 13, ua: 34, fa: 32, th: 38, sh: 38, aw: 13, lw: 16, hand: 9, foot: 12, eye: 1.1 },
  };
  C.BODY = BODY;

  // ---------- limb solving ----------
  function solve(S, L1, L2, spec, side, kind) {
    if (!spec) spec = [0, 0];
    if (Array.isArray(spec)) {
      const t1 = rad(spec[0]) * side,
        t2 = rad(spec[0] + spec[1]) * side;
      const E = [S[0] + L1 * Math.sin(t1), S[1] + L1 * Math.cos(t1)];
      return [S, E, [E[0] + L2 * Math.sin(t2), E[1] + L2 * Math.cos(t2)]];
    }
    const T = kind === "arm" ? [spec.x * side, spec.y] : [spec.x, spec.y];
    const dx = T[0] - S[0],
      dy = T[1] - S[1];
    let d = Math.hypot(dx, dy) || 1;
    const ux = dx / d,
      uy = dy / d;
    if (d >= L1 + L2 - 0.5) {
      return [S, [S[0] + ux * L1, S[1] + uy * L1], [S[0] + ux * (L1 + L2), S[1] + uy * (L1 + L2)]];
    }
    d = Math.max(d, Math.abs(L1 - L2) + 1);
    const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    const P = [S[0] + ux * a, S[1] + uy * a];
    const p1 = [-uy, ux],
      p2 = [uy, -ux];
    let pref = kind === "arm" ? [side, 0.35] : [1, 0];
    if (spec.pref) pref = kind === "arm" ? [spec.pref[0] * side, spec.pref[1]] : spec.pref;
    if (spec.bend === -1) pref = [-pref[0], -pref[1]];
    const p = p1[0] * pref[0] + p1[1] * pref[1] >= p2[0] * pref[0] + p2[1] * pref[1] ? p1 : p2;
    return [S, [P[0] + p[0] * h, P[1] + p[1] * h], T];
  }

  function stroke2(pts, w, color, ow = 2.8, cap = "round") {
    const d = "M" + pts.map(pt).join(" L");
    return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${n(w + ow * 2)}" stroke-linecap="${cap}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${n(
      w
    )}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
  }
  C.stroke2 = stroke2;

  function handShape(H, E, r, skin, kind) {
    if (kind === "none") return "";
    const dx = H[0] - E[0],
      dy = H[1] - E[1];
    const L = Math.hypot(dx, dy) || 1;
    const ux = dx / L,
      uy = dy / L;
    const c = [H[0] + ux * r * 0.5, H[1] + uy * r * 0.5];
    const ang = (Math.atan2(uy, ux) * 180) / Math.PI;
    let p1 = [-uy, ux],
      p2 = [uy, -ux];
    const tp = p1[1] < p2[1] ? p1 : p2; // thumb points upward
    let out = "";
    if (kind === "fist") {
      out += circle(c[0], c[1], r * 0.95, skin, { sw: 2.6 });
      out += path(`M${pt([c[0] + ux * r * 0.2 - tp[0] * r * 0.5, c[1] + uy * r * 0.2 - tp[1] * r * 0.5])} L${pt([c[0] + ux * r * 0.2 + tp[0] * r * 0.3, c[1] + uy * r * 0.2 + tp[1] * r * 0.3])}`, "none", { sw: 1.8 });
      return out;
    }
    if (kind === "point") {
      const tip = [c[0] + ux * r * 1.9, c[1] + uy * r * 1.9];
      out += stroke2([[c[0], c[1]], tip], r * 0.55, skin, 2.4);
      out += circle(c[0], c[1], r * 0.9, skin, { sw: 2.6 });
      return out;
    }
    if (kind === "thumb") {
      out += circle(c[0], c[1], r * 0.92, skin, { sw: 2.6 });
      const tip = [c[0] + tp[0] * r * 1.5, c[1] + tp[1] * r * 1.5 - r * 0.2];
      out += stroke2([[c[0] + tp[0] * r * 0.4, c[1] + tp[1] * r * 0.4], tip], r * 0.55, skin, 2.4);
      return out;
    }
    // open mitten with thumb
    out += ellipse(c[0] + tp[0] * r * 0.55, c[1] + tp[1] * r * 0.55, r * 0.45, r * 0.32, skin, { sw: 2.4, rot: ang - 35 });
    out += ellipse(c[0], c[1], r * 1.08, r * 0.86, skin, { sw: 2.6, rot: ang });
    return out;
  }

  function shoe(H, r, color, sole, untied, dir) {
    // dir = 1 points to +x (local)
    const x = H[0],
      y = H[1] + r * 0.1;
    const X = (v) => x + v * dir;
    const body = `M${n(X(-0.7 * r))} ${n(y - 0.3 * r)} Q${n(X(-0.8 * r))} ${n(y + 0.5 * r)} ${n(X(-0.4 * r))} ${n(y + 0.5 * r)} L${n(X(1.25 * r))} ${n(y + 0.5 * r)} Q${n(X(1.62 * r))} ${n(y + 0.5 * r)} ${n(X(1.45 * r))} ${n(y + 0.02 * r)} Q${n(X(1.2 * r))} ${n(y - 0.4 * r)} ${n(X(0.45 * r))} ${n(y - 0.5 * r)} L${n(X(-0.2 * r))} ${n(y - 0.66 * r)} Q${n(X(-0.62 * r))} ${n(y - 0.66 * r)} ${n(X(-0.7 * r))} ${n(y - 0.3 * r)} Z`;
    let out = path(body, color, { sw: 2.6 });
    if (sole) {
      out += path(`M${n(X(-0.78 * r))} ${n(y + 0.22 * r)} L${n(X(1.52 * r))} ${n(y + 0.22 * r)} Q${n(X(1.6 * r))} ${n(y + 0.5 * r)} ${n(X(1.25 * r))} ${n(y + 0.5 * r)} L${n(X(-0.4 * r))} ${n(y + 0.5 * r)} Q${n(X(-0.8 * r))} ${n(y + 0.5 * r)} ${n(X(-0.78 * r))} ${n(y + 0.22 * r)} Z`, sole, { sw: 2.2 });
      out += path(`M${n(X(0.2 * r))} ${n(y - 0.45 * r)} l${n(0.25 * r * dir)} ${n(0.25 * r)} M${n(X(0.5 * r))} ${n(y - 0.4 * r)} l${n(0.22 * r * dir)} ${n(0.25 * r)}`, "none", { sw: 1.6 });
    }
    if (untied) {
      out += path(`M${n(X(0.4 * r))} ${n(y - 0.35 * r)} q${n(0.6 * r * dir)} ${n(0.4 * r)} ${n(0.4 * r * dir)} ${n(0.95 * r)} q${n(-0.1 * r * dir)} ${n(0.2 * r)} ${n(0.5 * r * dir)} ${n(0.1 * r)}`, "none", { sw: 1.8 });
      out += path(`M${n(X(0.5 * r))} ${n(y - 0.3 * r)} q${n(-0.4 * r * dir)} ${n(0.5 * r)} ${n(-0.9 * r * dir)} ${n(0.85 * r)}`, "none", { sw: 1.8 });
    }
    return out;
  }

  // ---------- faces ----------
  const EXPR = {
    neutral: { eyes: "open", brows: "neutral", mouth: "small" },
    happy: { eyes: "open", brows: "neutral", mouth: "smile" },
    talk: { eyes: "open", brows: "neutral", mouth: "open" },
    joy: { eyes: "happy", brows: "up", mouth: "big" },
    laugh: { eyes: "happy", brows: "up", mouth: "big", extras: ["blush"] },
    grin: { eyes: "open", brows: "neutral", mouth: "grin" },
    smug: { eyes: "half", brows: "raise1", mouth: "smirk" },
    sad: { eyes: "open", brows: "sad", mouth: "frown", gaze: [0, 3] },
    cry: { eyes: "teary", brows: "sad", mouth: "wavy", extras: ["tears"] },
    angry: { eyes: "open", brows: "angry", mouth: "frown" },
    stern: { eyes: "open", brows: "angry", mouth: "flat" },
    yell: { eyes: "open", brows: "angry", mouth: "yell", extras: ["vein"] },
    furious: { eyes: "squint", brows: "angry", mouth: "yell", extras: ["vein"] },
    shock: { eyes: "wide", brows: "up", mouth: "o" },
    gasp: { eyes: "wide", brows: "up", mouth: "yell" },
    worried: { eyes: "open", brows: "worry", mouth: "wavy", extras: ["sweat"] },
    nervous: { eyes: "open", brows: "worry", mouth: "gritted", extras: ["sweat"] },
    sleepy: { eyes: "sleepy", brows: "neutral", mouth: "o", extras: ["zz"] },
    asleep: { eyes: "closed", brows: "neutral", mouth: "drool", extras: ["zz"] },
    determined: { eyes: "open", brows: "determined", mouth: "firm" },
    fierce: { eyes: "open", brows: "angry", mouth: "grin" },
    pray: { eyes: "closed", brows: "neutral", mouth: "small" },
    prayHard: { eyes: "closedTight", brows: "worry", mouth: "flat" },
    peace: { eyes: "happy", brows: "neutral", mouth: "smile" },
    think: { eyes: "open", brows: "raise1", mouth: "pout", gaze: [4, -4] },
    sheepish: { eyes: "open", brows: "worry", mouth: "smile", extras: ["blush", "sweat"], gaze: [-3, 1] },
    disgust: { eyes: "tight", brows: "angry", mouth: "tongue", extras: ["green"] },
    gag: { eyes: "squint", brows: "worry", mouth: "puffed", extras: ["green"] },
    proud: { eyes: "happy", brows: "up", mouth: "smile", extras: ["blush"] },
    bored: { eyes: "half", brows: "neutral", mouth: "flat", gaze: [0, -4] },
    touched: { eyes: "teary", brows: "worry", mouth: "smile", extras: ["blush"] },
    gloom: { eyes: "dots", brows: "sad", mouth: "flat", extras: ["gloom"] },
    focus: { eyes: "open", brows: "determined", mouth: "tongueSide", gaze: [3, 3] },
    sly: { eyes: "half", brows: "angry", mouth: "smirk" },
    dazed: { eyes: "spiral", brows: "up", mouth: "wavy" },
    blank: { eyes: "dots", brows: "neutral", mouth: "flat" },
    surprised: { eyes: "wide", brows: "up", mouth: "smile" },
    wince: { eyes: "squint", brows: "worry", mouth: "gritted", extras: ["sweat"] },
    hopeful: { eyes: "teary", brows: "up", mouth: "smile" },
    confident: { eyes: "open", brows: "raise1", mouth: "grin", extras: ["shine"] },
  };
  C.EXPR = EXPR;

  function face(B, cfg, ex, o) {
    const r = B.r,
      hc = B.hcy,
      k = r / 40;
    const look = 5 * k;
    const es = B.eye * (cfg.eyeScale || 1);
    const gz = o.gaze || ex.gaze || [2, 0];
    const ey = hc + 2 * k;
    const ex1 = look - 15 * k,
      ex2 = look + 15 * k;
    const erx = 6.6 * k * es,
      ery = 8.6 * k * es;
    const skin = cfg.skin,
      skinShade = cfg.shade;
    const iris = cfg.iris || "#3b2618";
    let s = "";
    const extras = ex.extras || [];

    if (extras.includes("green")) s += `<path d="${headPath(r, hc, cfg.jaw || 1)}" fill="#8dc26b" opacity=".38"/>`;
    if (extras.includes("blush") || o.blush) {
      s += fellipse(ex1 - 4 * k, ey + 13 * k, 7 * k, 3.6 * k, "#e8536b", 0.45);
      s += fellipse(ex2 + 3 * k, ey + 13 * k, 7 * k, 3.6 * k, "#e8536b", 0.45);
    }

    const eye = (x, which) => {
      const kind = ex.eyes;
      if (kind === "closed") return path(`M${n(x - erx)} ${n(ey)} Q${n(x)} ${n(ey + ery * 0.75)} ${n(x + erx)} ${n(ey)}`, "none", { sw: 2.6 });
      if (kind === "closedTight")
        return path(`M${n(x - erx)} ${n(ey - 2 * k)} Q${n(x)} ${n(ey + ery * 0.5)} ${n(x + erx)} ${n(ey - 2 * k)} M${n(x - erx * 0.7)} ${n(ey + 3 * k)} L${n(x + erx * 0.7)} ${n(ey + 2 * k)}`, "none", { sw: 2.4 });
      if (kind === "happy") return path(`M${n(x - erx)} ${n(ey + 2 * k)} Q${n(x)} ${n(ey - ery * 1.1)} ${n(x + erx)} ${n(ey + 2 * k)}`, "none", { sw: 2.8 });
      if (kind === "squint") {
        const d = which === 1 ? 1 : -1;
        return path(`M${n(x - erx * d)} ${n(ey - ery * 0.6)} L${n(x + erx * d)} ${n(ey)} L${n(x - erx * d)} ${n(ey + ery * 0.6)}`, "none", { sw: 2.8 });
      }
      if (kind === "tight") return line(x - erx, ey, x + erx, ey, { sw: 3 });
      if (kind === "dots") return fcircle(x + gz[0] * 0.4, ey + gz[1] * 0.4, 2.8 * k, INK);
      if (kind === "spiral")
        return path(`M${n(x)} ${n(ey)} m-1 0 a2 2 0 1 1 3 1 a4 4 0 1 1 -6 -2 a6 6 0 1 1 9 4`, "none", { sw: 1.8 });
      const big = kind === "wide" ? 1.3 : 1;
      const rx = erx * big,
        ry = ery * big;
      let e = ellipse(x, ey, rx, ry, "#fff", { sw: 2.4 });
      const pr = (kind === "wide" ? 3.2 : 4.4) * k * es;
      const px = x + gz[0] * 0.7 * k,
        py = ey + gz[1] * 0.7 * k + (kind === "sleepy" || kind === "half" ? 2 * k : 0);
      e += fcircle(px, py, pr, iris) + fcircle(px, py, pr * 0.55, "#120b08");
      e += fcircle(px + pr * 0.45, py - pr * 0.5, pr * 0.38, "#fff");
      if (kind === "teary") {
        e += fcircle(px - pr * 0.4, py + pr * 0.35, pr * 0.25, "#fff");
        e += path(`M${n(x - rx * 0.9)} ${n(ey + ry * 0.55)} Q${n(x)} ${n(ey + ry * 1.05)} ${n(x + rx * 0.9)} ${n(ey + ry * 0.55)}`, "#9fd8ff", { sw: 1.6, stroke: "#4c9fd6" });
      }
      if (kind === "half" || kind === "sleepy") {
        const lidY = ey - ry + ry * (kind === "sleepy" ? 1.15 : 0.95);
        e += `<path d="M${n(x - rx - 1)} ${n(ey - ry - 2)} L${n(x + rx + 1)} ${n(ey - ry - 2)} L${n(x + rx + 1)} ${n(lidY)} L${n(x - rx - 1)} ${n(lidY)} Z" fill="${skin}"/>`;
        e += line(x - rx - 1, lidY, x + rx + 1, lidY, { sw: 2.6 });
      }
      return e;
    };
    s += eye(ex1, 1) + eye(ex2, 2);

    // brows
    const bw = 8 * k,
      by = ey - 14 * k * (ex.eyes === "wide" ? 1.15 : 1);
    const brow = (x, side) => {
      let a = 0,
        dy = 0;
      // positive a pulls the inner end down (angry), negative lifts it (worried)
      switch (ex.brows) {
        case "up": dy = -5 * k; break;
        case "worry": a = -14; dy = -2 * k; break;
        case "sad": a = -18; dy = -1 * k; break;
        case "angry": a = 20; dy = 2 * k; break;
        case "determined": a = 12; dy = 1 * k; break;
        case "raise1": dy = side === 1 ? -6 * k : 1 * k; a = side === 1 ? -8 : 6; break;
        default: a = 0;
      }
      const cx = x,
        cy = by + dy;
      const ca = Math.cos(rad(a)),
        sa = Math.sin(rad(a));
      // side: +1 = right brow. Positive a tilts the inner end down.
      const x1 = cx - bw * ca,
        y1 = cy - bw * sa * -side,
        x2 = cx + bw * ca,
        y2 = cy + bw * sa * -side;
      return `<path d="M${n(x1)} ${n(y1)} Q${n(cx)} ${n(cy - 2.5 * k)} ${n(x2)} ${n(y2)}" fill="none" stroke="${cfg.browColor || INK}" stroke-width="${n(3.6 * k)}" stroke-linecap="round"/>`;
    };
    if (ex.brows !== "none") s += brow(ex1, -1) + brow(ex2, 1);

    // nose
    const nx = look * 1.55,
      ny = hc + 14 * k;
    s += path(`M${n(nx + 1 * k)} ${n(ny - 8 * k)} Q${n(nx + 7 * k)} ${n(ny + 2 * k)} ${n(nx + 1.5 * k)} ${n(ny + 4 * k)} M${n(nx - 5 * k)} ${n(ny + 3 * k)} q${n(2.5 * k)} ${n(2 * k)} ${n(5 * k)} ${n(0.6 * k)}`, "none", { sw: 2.2, stroke: shade(skinShade, -0.35) });

    // mouth
    const mx = look * 1.3,
      my = hc + 26 * k;
    const mw = 9 * k;
    const lip = cfg.lip || "#b5484c";
    switch (ex.mouth) {
      case "smile":
        s += path(`M${n(mx - mw)} ${n(my - 2 * k)} Q${n(mx)} ${n(my + 7 * k)} ${n(mx + mw)} ${n(my - 2 * k)}`, "none", { sw: 2.6 });
        break;
      case "small":
        s += path(`M${n(mx - mw * 0.55)} ${n(my)} Q${n(mx)} ${n(my + 3 * k)} ${n(mx + mw * 0.55)} ${n(my)}`, "none", { sw: 2.4 });
        break;
      case "big":
        s += path(`M${n(mx - mw * 1.2)} ${n(my - 3 * k)} Q${n(mx)} ${n(my - 1 * k)} ${n(mx + mw * 1.2)} ${n(my - 3 * k)} Q${n(mx + mw)} ${n(my + 13 * k)} ${n(mx)} ${n(my + 13 * k)} Q${n(mx - mw)} ${n(my + 13 * k)} ${n(mx - mw * 1.2)} ${n(my - 3 * k)} Z`, "#5a1f24", { sw: 2.6 });
        s += fellipse(mx, my + 9 * k, mw * 0.6, 3.6 * k, "#e5737a");
        s += `<path d="M${n(mx - mw * 1.05)} ${n(my - 2 * k)} Q${n(mx)} ${n(my + 0.5 * k)} ${n(mx + mw * 1.05)} ${n(my - 2 * k)} L${n(mx + mw * 0.95)} ${n(my + 1.6 * k)} Q${n(mx)} ${n(my + 3.4 * k)} ${n(mx - mw * 0.95)} ${n(my + 1.6 * k)} Z" fill="#fff"/>`;
        break;
      case "grin":
        s += path(`M${n(mx - mw * 1.2)} ${n(my - 3 * k)} Q${n(mx)} ${n(my - 1 * k)} ${n(mx + mw * 1.2)} ${n(my - 3 * k)} Q${n(mx + mw * 0.9)} ${n(my + 9 * k)} ${n(mx)} ${n(my + 9 * k)} Q${n(mx - mw * 0.9)} ${n(my + 9 * k)} ${n(mx - mw * 1.2)} ${n(my - 3 * k)} Z`, "#fff", { sw: 2.6 });
        s += line(mx - mw * 1.0, my + 2.5 * k, mx + mw * 1.0, my + 2.5 * k, { sw: 1.6 });
        s += line(mx - mw * 0.35, my - 1.5 * k, mx - mw * 0.35, my + 8 * k, { sw: 1.4 }) + line(mx + mw * 0.35, my - 1.5 * k, mx + mw * 0.35, my + 8 * k, { sw: 1.4 });
        break;
      case "smirk":
        s += path(`M${n(mx - mw * 0.8)} ${n(my + 1 * k)} Q${n(mx + mw * 0.2)} ${n(my + 4 * k)} ${n(mx + mw * 1.1)} ${n(my - 4 * k)}`, "none", { sw: 2.6 });
        break;
      case "flat":
        s += line(mx - mw * 0.7, my + 1 * k, mx + mw * 0.7, my + 1 * k, { sw: 2.6 });
        break;
      case "firm":
        s += path(`M${n(mx - mw * 0.8)} ${n(my + 1 * k)} Q${n(mx)} ${n(my + 2.5 * k)} ${n(mx + mw * 0.8)} ${n(my)}`, "none", { sw: 3 });
        break;
      case "frown":
        s += path(`M${n(mx - mw * 0.9)} ${n(my + 4 * k)} Q${n(mx)} ${n(my - 4 * k)} ${n(mx + mw * 0.9)} ${n(my + 4 * k)}`, "none", { sw: 2.6 });
        break;
      case "o":
        s += ellipse(mx, my + 2 * k, 4.2 * k, 5.4 * k, "#5a1f24", { sw: 2.4 });
        break;
      case "open":
        s += path(`M${n(mx - mw * 0.8)} ${n(my - 1 * k)} Q${n(mx)} ${n(my + 1 * k)} ${n(mx + mw * 0.8)} ${n(my - 1 * k)} Q${n(mx + mw * 0.5)} ${n(my + 8 * k)} ${n(mx)} ${n(my + 8 * k)} Q${n(mx - mw * 0.5)} ${n(my + 8 * k)} ${n(mx - mw * 0.8)} ${n(my - 1 * k)} Z`, "#5a1f24", { sw: 2.4 });
        s += fellipse(mx, my + 5.6 * k, mw * 0.35, 1.8 * k, "#e5737a");
        break;
      case "yell":
        s += path(`M${n(mx - mw * 1.3)} ${n(my - 5 * k)} Q${n(mx)} ${n(my - 8 * k)} ${n(mx + mw * 1.3)} ${n(my - 5 * k)} Q${n(mx + mw * 1.1)} ${n(my + 15 * k)} ${n(mx)} ${n(my + 16 * k)} Q${n(mx - mw * 1.1)} ${n(my + 15 * k)} ${n(mx - mw * 1.3)} ${n(my - 5 * k)} Z`, "#5a1f24", { sw: 2.6 });
        s += `<path d="M${n(mx - mw * 1.1)} ${n(my - 4.5 * k)} Q${n(mx)} ${n(my - 7 * k)} ${n(mx + mw * 1.1)} ${n(my - 4.5 * k)} L${n(mx + mw)} ${n(my - 1 * k)} L${n(mx - mw)} ${n(my - 1 * k)} Z" fill="#fff"/>`;
        s += fellipse(mx, my + 11 * k, mw * 0.65, 3.6 * k, "#e5737a");
        break;
      case "wavy":
        s += path(`M${n(mx - mw)} ${n(my + 2 * k)} q${n(mw * 0.33)} ${n(-4 * k)} ${n(mw * 0.66)} 0 t${n(mw * 0.66)} 0 t${n(mw * 0.66)} 0`, "none", { sw: 2.4 });
        break;
      case "gritted":
        s += path(`M${n(mx - mw * 1.1)} ${n(my - 3 * k)} L${n(mx + mw * 1.1)} ${n(my - 3 * k)} L${n(mx + mw * 1.0)} ${n(my + 5 * k)} L${n(mx - mw * 1.0)} ${n(my + 5 * k)} Z`, "#fff", { sw: 2.4 });
        s += line(mx - mw * 1.05, my + 1 * k, mx + mw * 1.05, my + 1 * k, { sw: 1.4 });
        [-0.5, 0, 0.5].forEach((f) => (s += line(mx + mw * f, my - 3 * k, mx + mw * f, my + 5 * k, { sw: 1.3 })));
        break;
      case "tongue":
        s += path(`M${n(mx - mw)} ${n(my)} q${n(mw * 0.5)} ${n(-4 * k)} ${n(mw)} 0 t${n(mw)} 0`, "none", { sw: 2.4 });
        s += path(`M${n(mx - 3 * k)} ${n(my + 1 * k)} Q${n(mx)} ${n(my + 12 * k)} ${n(mx + 5 * k)} ${n(my + 1 * k)}`, "#e5737a", { sw: 2.2 });
        break;
      case "tongueSide":
        s += path(`M${n(mx - mw * 0.7)} ${n(my)} Q${n(mx)} ${n(my + 3 * k)} ${n(mx + mw * 0.7)} ${n(my)}`, "none", { sw: 2.4 });
        s += path(`M${n(mx + mw * 0.3)} ${n(my + 1.5 * k)} q${n(4 * k)} ${n(6 * k)} ${n(7 * k)} ${n(-0.5 * k)}`, "#e5737a", { sw: 2 });
        break;
      case "puffed":
        s += fellipse(mx - mw * 1.4, my - 1 * k, 6 * k, 6 * k, shade(skin, 0.12));
        s += fellipse(mx + mw * 1.4, my - 1 * k, 6 * k, 6 * k, shade(skin, 0.12));
        s += path(`M${n(mx - mw * 0.6)} ${n(my)} Q${n(mx)} ${n(my - 3 * k)} ${n(mx + mw * 0.6)} ${n(my)}`, "none", { sw: 2.6 });
        break;
      case "pout":
        s += path(`M${n(mx - mw * 0.2)} ${n(my + 1 * k)} q${n(mw * 0.4)} ${n(-3 * k)} ${n(mw * 0.8)} 0`, "none", { sw: 2.6 });
        break;
      case "drool":
        s += ellipse(mx, my + 1 * k, 4 * k, 3 * k, "#5a1f24", { sw: 2 });
        s += path(`M${n(mx + 3 * k)} ${n(my + 3 * k)} q${n(2 * k)} ${n(8 * k)} ${n(0)} ${n(10 * k)} q${n(-3 * k)} ${n(-2 * k)} ${n(0)} ${n(-10 * k)}`, "#bfe6ff", { sw: 1.6, stroke: "#5ea9d6" });
        break;
      default:
        break;
    }

    if (extras.includes("tears")) {
      s += path(`M${n(ex1 - 2 * k)} ${n(ey + 9 * k)} q${n(-3 * k)} ${n(12 * k)} ${n(-1 * k)} ${n(20 * k)}`, "none", { sw: 3.6, stroke: "#5fb3ea" });
      s += path(`M${n(ex2 + 2 * k)} ${n(ey + 9 * k)} q${n(3 * k)} ${n(12 * k)} ${n(1 * k)} ${n(20 * k)}`, "none", { sw: 3.6, stroke: "#5fb3ea" });
    }
    if (extras.includes("gloom")) {
      [-12, -4, 4, 12].forEach((dx) => (s += line(look + dx * k, hc - 30 * k, look + dx * k, hc - 12 * k, { sw: 2, stroke: "#4a4a7a", op: 0.7 })));
    }
    if (extras.includes("shine")) {
      s += fcircle(ex1 + 1 * k, ey - 1 * k, 1.8 * k, "#fff") + fcircle(ex2 + 1 * k, ey - 1 * k, 1.8 * k, "#fff");
    }
    if (cfg.freckles) {
      [[-1, 0], [1, 0.5], [0, 1]].forEach(([a, b]) => {
        s += fcircle(ex1 - 3 * k + a * 3 * k, ey + 12 * k + b * 2 * k, 1 * k, shade(skin, -0.35));
        s += fcircle(ex2 + 3 * k + a * 3 * k, ey + 12 * k + b * 2 * k, 1 * k, shade(skin, -0.35));
      });
    }
    return s;
  }

  // ---------- hair ----------
  function bumpy(cx, cy, rx, ry, a0, a1, N, amp, rnd, varAmp) {
    let d = "";
    for (let i = 1; i <= N; i++) {
      const t = rad(a0 + ((a1 - a0) * i) / N);
      const tm = rad(a0 + ((a1 - a0) * (i - 0.5)) / N);
      const k = 1 + amp * (1 + (rnd ? (rnd() - 0.5) * (varAmp || 0) : 0));
      d += ` Q${n(cx + rx * k * Math.cos(tm))} ${n(cy + ry * k * Math.sin(tm))} ${n(cx + rx * Math.cos(t))} ${n(cy + ry * Math.sin(t))}`;
    }
    return d;
  }

  function headPath(r, hc, jaw = 1) {
    return `M0 ${n(hc - 1.1 * r)} C${n(0.62 * r)} ${n(hc - 1.1 * r)} ${n(r)} ${n(hc - 0.62 * r)} ${n(r)} ${n(hc - 0.05 * r)} C${n(r)} ${n(hc + 0.55 * r)} ${n(0.62 * r * jaw)} ${n(hc + 1.06 * r)} 0 ${n(hc + 1.06 * r)} C${n(-0.62 * r * jaw)} ${n(hc + 1.06 * r)} ${n(-r)} ${n(hc + 0.55 * r)} ${n(-r)} ${n(hc - 0.05 * r)} C${n(-r)} ${n(hc - 0.62 * r)} ${n(-0.62 * r)} ${n(hc - 1.1 * r)} 0 ${n(hc - 1.1 * r)} Z`;
  }

  function texture(r, hc, color, rnd, count, yTop, yBot, xw) {
    let s = "";
    for (let i = 0; i < count; i++) {
      const x = (rnd() - 0.5) * 2 * xw * r;
      const y = hc + (yTop + rnd() * (yBot - yTop)) * r;
      s += `<path d="M${n(x)} ${n(y)} q${n(3 + rnd() * 2)} ${n(-4)} ${n(6 + rnd() * 2)} 0" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
    }
    return s;
  }

  const HAIR = {
    lex(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40,
        look = 5 * k;
      const rnd = C.rng(11);
      const messy = o.messy;
      let d = `M${n(0.95 * r)} ${n(hc + 0.02 * r)} L${n(1.03 * r)} ${n(hc - 0.2 * r)}`;
      d += bumpy(0, hc - 0.2 * r, 1.03 * r, 1.08 * r, -8, -172, messy ? 11 : 13, messy ? 0.2 : 0.11, rnd, messy ? 1.6 : 0.4);
      d += ` L${n(-0.95 * r)} ${n(hc + 0.02 * r)} L${n(-0.86 * r)} ${n(hc - 0.36 * r)} Q${n(-0.45 * r + look)} ${n(hc - 0.66 * r)} ${n(look)} ${n(hc - 0.62 * r)} Q${n(0.5 * r + look)} ${n(hc - 0.66 * r)} ${n(0.86 * r)} ${n(hc - 0.36 * r)} Z`;
      let front = path(d, col, { sw: 2.8 });
      front += `<g opacity=".55">${texture(r, hc, shade(col, 0.3), C.rng(5), messy ? 8 : 10, -1.1, -0.74, 0.58)}</g>`;
      if (messy) {
        const tufts = [
          [-0.55, -1.25, -25],
          [0.1, -1.38, 5],
          [0.62, -1.2, 35],
          [-0.95, -0.75, -70],
        ];
        tufts.forEach(([tx, ty, a]) => {
          const x = tx * r,
            y = hc + ty * r;
          front += `<path d="M${n(x - 6 * k)} ${n(y + 8 * k)} Q${n(x)} ${n(y - 10 * k)} ${n(x + 9 * k)} ${n(y - 14 * k)} Q${n(x + 4 * k)} ${n(y - 2 * k)} ${n(x + 6 * k)} ${n(y + 8 * k)} Z" fill="${col}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" transform="rotate(${a} ${n(x)} ${n(y)})"/>`;
        });
      }
      return { back: "", front };
    },
    crop(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40,
        look = 5 * k;
      let d = `M${n(0.96 * r)} ${n(hc - 0.02 * r)} L${n(1.01 * r)} ${n(hc - 0.25 * r)}`;
      d += bumpy(0, hc - 0.22 * r, 1.01 * r, 0.98 * r, -10, -170, 16, 0.06, null);
      d += ` L${n(-0.96 * r)} ${n(hc - 0.02 * r)} L${n(-0.88 * r)} ${n(hc - 0.42 * r)} Q${n(-0.4 * r + look)} ${n(hc - 0.74 * r)} ${n(look)} ${n(hc - 0.7 * r)} Q${n(0.45 * r + look)} ${n(hc - 0.74 * r)} ${n(0.88 * r)} ${n(hc - 0.42 * r)} Z`;
      return { back: "", front: path(d, col, { sw: 2.6 }) + texture(r, hc, shade(col, 0.22), C.rng(9), 8, -1.12, -0.8, 0.55) };
    },
    puff(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40,
        look = 5 * k;
      const rnd = C.rng(21);
      let back = path(`M${n(-0.62 * r)} ${n(hc - 1.28 * r)}` + bumpy(-0.05 * r, hc - 1.32 * r, 0.62 * r, 0.52 * r, 160, -200, 14, 0.12, rnd, 0.6) + " Z", col, { sw: 2.8 });
      back += texture(r, hc, shade(col, 0.28), C.rng(3), 8, -1.7, -1.1, 0.45);
      let d = `M${n(0.97 * r)} ${n(hc + 0.05 * r)} L${n(1.03 * r)} ${n(hc - 0.25 * r)} Q${n(1.02 * r)} ${n(hc - 1.18 * r)} 0 ${n(hc - 1.2 * r)} Q${n(-1.02 * r)} ${n(hc - 1.18 * r)} ${n(-1.03 * r)} ${n(hc - 0.25 * r)} L${n(-0.97 * r)} ${n(hc + 0.05 * r)} L${n(-0.85 * r)} ${n(hc - 0.4 * r)} Q${n(-0.4 * r)} ${n(hc - 0.72 * r)} ${n(look - 0.15 * r)} ${n(hc - 0.66 * r)} Q${n(0.5 * r)} ${n(hc - 0.74 * r)} ${n(0.85 * r)} ${n(hc - 0.4 * r)} Z`;
      let front = path(d, col, { sw: 2.6 });
      // headband
      const band = o.band || "#e0533d";
      front += path(`M${n(-0.98 * r)} ${n(hc - 0.52 * r)} Q0 ${n(hc - 1.2 * r)} ${n(0.98 * r)} ${n(hc - 0.52 * r)} L${n(0.92 * r)} ${n(hc - 0.72 * r)} Q0 ${n(hc - 1.38 * r)} ${n(-0.92 * r)} ${n(hc - 0.72 * r)} Z`, band, { sw: 2.4 });
      front += fcircle(-0.4 * r, hc - 1.0 * r, 2.4 * k, shade(band, 0.45)) + fcircle(0.1 * r, hc - 1.08 * r, 2.4 * k, shade(band, 0.45)) + fcircle(0.55 * r, hc - 0.93 * r, 2.4 * k, shade(band, 0.45));
      front += `<path d="M${n(0.86 * r)} ${n(hc - 0.36 * r)} q${n(5 * k)} ${n(4 * k)} ${n(1 * k)} ${n(8 * k)} q${n(-3 * k)} ${n(-3 * k)} ${n(1 * k)} ${n(-4 * k)}" fill="none" stroke="${col}" stroke-width="1.8"/>`;
      return { back, front };
    },
    pastor(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40;
      const side = (sx) =>
        path(`M${n(sx * 0.98 * r)} ${n(hc + 0.05 * r)} Q${n(sx * 1.12 * r)} ${n(hc - 0.3 * r)} ${n(sx * 0.9 * r)} ${n(hc - 0.62 * r)} Q${n(sx * 0.82 * r)} ${n(hc - 0.4 * r)} ${n(sx * 0.86 * r)} ${n(hc - 0.05 * r)} Z`, col, { sw: 2.4 });
      let front = side(1) + side(-1);
      front += path(`M${n(-0.35 * r)} ${n(hc - 0.95 * r)} Q${n(-0.1 * r)} ${n(hc - 1.08 * r)} ${n(0.15 * r)} ${n(hc - 1.0 * r)}`, "none", { sw: 3, stroke: "#fff", op: 0.6 });
      return { back: "", front };
    },
    hat(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40;
      const hatC = o.hatColor || "#7b3f9e";
      let back = path(`M${n(-1.0 * r)} ${n(hc + 0.2 * r)}` + bumpy(0, hc - 0.1 * r, 1.08 * r, 1.05 * r, 170, 10, 12, 0.1, C.rng(4), 0.4) + " Z", col, { sw: 2.4 });
      let front = path(`M${n(0.93 * r)} ${n(hc - 0.1 * r)}` + bumpy(0, hc - 0.35 * r, 0.98 * r, 0.6 * r, 10, -190, 9, 0.14, C.rng(8), 0.3) + " Z", col, { sw: 2.2 });
      front += `<g transform="rotate(-8 0 ${n(hc - 0.75 * r)})">`;
      front += ellipse(0, hc - 0.72 * r, 1.75 * r, 0.34 * r, hatC, { sw: 2.8 });
      front += path(`M${n(-0.82 * r)} ${n(hc - 0.75 * r)} Q${n(-0.85 * r)} ${n(hc - 1.62 * r)} 0 ${n(hc - 1.64 * r)} Q${n(0.85 * r)} ${n(hc - 1.62 * r)} ${n(0.82 * r)} ${n(hc - 0.75 * r)} Q0 ${n(hc - 0.6 * r)} ${n(-0.82 * r)} ${n(hc - 0.75 * r)} Z`, hatC, { sw: 2.8 });
      front += path(`M${n(-0.84 * r)} ${n(hc - 0.95 * r)} Q0 ${n(hc - 0.8 * r)} ${n(0.84 * r)} ${n(hc - 0.95 * r)} L${n(0.83 * r)} ${n(hc - 1.12 * r)} Q0 ${n(hc - 0.98 * r)} ${n(-0.83 * r)} ${n(hc - 1.12 * r)} Z`, shade(hatC, -0.35), { sw: 2 });
      [0, 72, 144, 216, 288].forEach((a) => (front += circle(0.55 * r + Math.cos(rad(a)) * 7 * k, hc - 1.05 * r + Math.sin(rad(a)) * 7 * k, 6 * k, "#f6c2d6", { sw: 1.8 })));
      front += circle(0.55 * r, hc - 1.05 * r, 4 * k, "#f4c542", { sw: 1.8 });
      front += `</g>`;
      return { back, front };
    },
    grayCurls(B, col, o) {
      const r = B.r,
        hc = B.hcy;
      let d = `M${n(0.97 * r)} ${n(hc)}` + bumpy(0, hc - 0.25 * r, 1.06 * r, 1.0 * r, 0, -180, 12, 0.14, C.rng(14), 0.5);
      d += ` L${n(-0.88 * r)} ${n(hc - 0.4 * r)} Q0 ${n(hc - 0.9 * r)} ${n(0.88 * r)} ${n(hc - 0.4 * r)} Z`;
      return { back: "", front: path(d, col, { sw: 2.4 }) + texture(r, hc, shade(col, -0.18), C.rng(2), 10, -1.2, -0.6, 0.7) };
    },
    bob(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40,
        look = 5 * k;
      const back = path(`M${n(-1.12 * r)} ${n(hc + 0.75 * r)} Q${n(-1.25 * r)} ${n(hc - 1.3 * r)} 0 ${n(hc - 1.22 * r)} Q${n(1.25 * r)} ${n(hc - 1.3 * r)} ${n(1.12 * r)} ${n(hc + 0.75 * r)} Z`, col, { sw: 2.6 });
      const front = path(`M${n(1.02 * r)} ${n(hc + 0.2 * r)} Q${n(1.08 * r)} ${n(hc - 1.18 * r)} 0 ${n(hc - 1.18 * r)} Q${n(-1.08 * r)} ${n(hc - 1.18 * r)} ${n(-1.02 * r)} ${n(hc + 0.2 * r)} L${n(-0.85 * r)} ${n(hc - 0.35 * r)} L${n(-0.5 * r)} ${n(hc - 0.5 * r)} L${n(-0.2 * r + look)} ${n(hc - 0.38 * r)} L${n(0.1 * r + look)} ${n(hc - 0.5 * r)} L${n(0.5 * r + look)} ${n(hc - 0.42 * r)} L${n(0.85 * r)} ${n(hc - 0.4 * r)} Z`, col, { sw: 2.6 });
      return { back, front };
    },
    cap(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40;
      const capC = o.capColor || "#d8402f";
      let front = path(`M${n(0.97 * r)} ${n(hc - 0.05 * r)} L${n(1.0 * r)} ${n(hc - 0.35 * r)} L${n(-1.0 * r)} ${n(hc - 0.35 * r)} L${n(-0.97 * r)} ${n(hc - 0.05 * r)} Z`, col, { sw: 2.2 });
      front += path(`M${n(-1.04 * r)} ${n(hc - 0.4 * r)} Q${n(-1.05 * r)} ${n(hc - 1.35 * r)} 0 ${n(hc - 1.36 * r)} Q${n(1.05 * r)} ${n(hc - 1.35 * r)} ${n(1.04 * r)} ${n(hc - 0.4 * r)} Z`, capC, { sw: 2.8 });
      front += path(`M${n(0.3 * r)} ${n(hc - 0.45 * r)} Q${n(1.0 * r)} ${n(hc - 0.62 * r)} ${n(1.6 * r)} ${n(hc - 0.38 * r)} Q${n(1.05 * r)} ${n(hc - 0.25 * r)} ${n(0.3 * r)} ${n(hc - 0.4 * r)} Z`, shade(capC, -0.2), { sw: 2.6 });
      front += fcircle(0, hc - 1.36 * r, 3 * k, shade(capC, -0.3));
      return { back: "", front };
    },
    puffs(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40,
        look = 5 * k;
      let back = "";
      [-1, 1].forEach((sx) => {
        back += path(`M${n(sx * 0.7 * r - 0.42 * r)} ${n(hc - 1.05 * r)}` + bumpy(sx * 0.7 * r, hc - 1.05 * r, 0.42 * r, 0.42 * r, 180, -180, 12, 0.14, C.rng(6 + sx), 0.4) + " Z", col, { sw: 2.6 });
      });
      const front = path(`M${n(0.97 * r)} ${n(hc + 0.03 * r)} Q${n(1.04 * r)} ${n(hc - 1.15 * r)} 0 ${n(hc - 1.16 * r)} Q${n(-1.04 * r)} ${n(hc - 1.15 * r)} ${n(-0.97 * r)} ${n(hc + 0.03 * r)} L${n(-0.85 * r)} ${n(hc - 0.42 * r)} Q${n(look)} ${n(hc - 0.85 * r)} ${n(0.85 * r)} ${n(hc - 0.42 * r)} Z`, col, { sw: 2.6 });
      return { back, front };
    },
    pony(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40,
        look = 5 * k;
      const back = path(`M${n(-0.8 * r)} ${n(hc - 0.9 * r)} Q${n(-1.7 * r)} ${n(hc - 0.6 * r)} ${n(-1.45 * r)} ${n(hc + 0.6 * r)} Q${n(-1.2 * r)} ${n(hc - 0.2 * r)} ${n(-0.75 * r)} ${n(hc - 0.55 * r)} Z`, col, { sw: 2.6 });
      const front = path(`M${n(0.98 * r)} ${n(hc + 0.1 * r)} Q${n(1.06 * r)} ${n(hc - 1.18 * r)} 0 ${n(hc - 1.18 * r)} Q${n(-1.06 * r)} ${n(hc - 1.18 * r)} ${n(-0.98 * r)} ${n(hc + 0.1 * r)} L${n(-0.86 * r)} ${n(hc - 0.4 * r)} Q${n(look - 0.2 * r)} ${n(hc - 0.75 * r)} ${n(look + 0.1 * r)} ${n(hc - 0.55 * r)} Q${n(0.5 * r)} ${n(hc - 0.8 * r)} ${n(0.86 * r)} ${n(hc - 0.4 * r)} Z`, col, { sw: 2.6 });
      return { back, front: front + fcircle(-0.95 * r, hc - 0.75 * r, 5 * k, o.tie || "#f0b429") };
    },
    shag(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40,
        look = 5 * k;
      let d = `M${n(1.0 * r)} ${n(hc + 0.15 * r)} Q${n(1.12 * r)} ${n(hc - 1.25 * r)} 0 ${n(hc - 1.22 * r)} Q${n(-1.12 * r)} ${n(hc - 1.25 * r)} ${n(-1.0 * r)} ${n(hc + 0.15 * r)}`;
      const pts = [-0.92, -0.65, -0.4, -0.15, 0.1, 0.35, 0.6, 0.88];
      d += ` L${n(-0.92 * r)} ${n(hc - 0.25 * r)}`;
      pts.forEach((p, i) => {
        d += ` L${n(p * r + look * 0.5)} ${n(hc - (i % 2 ? 0.55 : 0.32) * r)}`;
      });
      d += " Z";
      return { back: "", front: path(d, col, { sw: 2.6 }) };
    },
    braids(B, col, o) {
      const r = B.r,
        hc = B.hcy,
        k = r / 40,
        look = 5 * k;
      let back = "";
      [-1, 1].forEach((sx) => {
        for (let i = 0; i < 3; i++) back += C.stroke2([[sx * (0.75 + i * 0.12) * r, hc - 0.3 * r], [sx * (0.85 + i * 0.12) * r, hc + 0.9 * r]], 6 * k, col, 2);
      });
      let front = path(`M${n(0.97 * r)} ${n(hc + 0.02 * r)} Q${n(1.04 * r)} ${n(hc - 1.15 * r)} 0 ${n(hc - 1.16 * r)} Q${n(-1.04 * r)} ${n(hc - 1.15 * r)} ${n(-0.97 * r)} ${n(hc + 0.02 * r)} L${n(-0.85 * r)} ${n(hc - 0.45 * r)} Q${n(look)} ${n(hc - 0.8 * r)} ${n(0.85 * r)} ${n(hc - 0.45 * r)} Z`, col, { sw: 2.6 });
      [-0.5, -0.2, 0.1, 0.4].forEach((x) => (front += path(`M${n(x * r + look)} ${n(hc - 0.72 * r)} Q${n(x * r * 1.2)} ${n(hc - 1.0 * r)} ${n(x * r * 0.9)} ${n(hc - 1.14 * r)}`, "none", { sw: 1.6, stroke: shade(col, 0.35) })));
      return { back, front };
    },
    bald(B, col, o) {
      return { back: "", front: "" };
    },
  };

  function beard(B, col, cfg) {
    const r = B.r,
      hc = B.hcy,
      k = r / 40,
      look = 5 * k;
    let s = path(`M${n(-0.97 * r)} ${n(hc - 0.05 * r)} C${n(-0.97 * r)} ${n(hc + 0.6 * r)} ${n(-0.6 * r)} ${n(hc + 1.16 * r)} ${n(look * 0.6)} ${n(hc + 1.16 * r)} C${n(0.62 * r)} ${n(hc + 1.16 * r)} ${n(0.97 * r)} ${n(hc + 0.6 * r)} ${n(0.97 * r)} ${n(hc - 0.05 * r)} L${n(0.8 * r)} ${n(hc + 0.1 * r)} Q${n(0.6 * r + look)} ${n(hc + 0.92 * r)} ${n(look)} ${n(hc + 0.9 * r)} Q${n(-0.6 * r + look)} ${n(hc + 0.92 * r)} ${n(-0.8 * r)} ${n(hc + 0.1 * r)} Z`, col, { sw: 2.4 });
    return s;
  }
  function mustache(B, col) {
    const r = B.r,
      hc = B.hcy,
      k = r / 40,
      look = 5 * k;
    const mx = look * 1.3,
      my = hc + 20 * k;
    return path(`M${n(mx)} ${n(my - 1 * k)} Q${n(mx - 8 * k)} ${n(my - 6 * k)} ${n(mx - 15 * k)} ${n(my + 2 * k)} Q${n(mx - 7 * k)} ${n(my + 1 * k)} ${n(mx)} ${n(my + 2 * k)} Q${n(mx + 7 * k)} ${n(my + 1 * k)} ${n(mx + 15 * k)} ${n(my + 2 * k)} Q${n(mx + 8 * k)} ${n(my - 6 * k)} ${n(mx)} ${n(my - 1 * k)} Z`, col, { sw: 2 });
  }
  function glasses(B, color) {
    const r = B.r,
      hc = B.hcy,
      k = r / 40,
      look = 5 * k;
    const ey = hc + 2 * k;
    const g = color || INK;
    return `<g fill="#fff" fill-opacity=".18" stroke="${g}" stroke-width="2.6"><rect x="${n(look - 25 * k)}" y="${n(ey - 9 * k)}" width="${n(19 * k)}" height="${n(16 * k)}" rx="${n(5 * k)}"/><rect x="${n(look + 6 * k)}" y="${n(ey - 9 * k)}" width="${n(19 * k)}" height="${n(16 * k)}" rx="${n(5 * k)}"/></g>${line(look - 6 * k, ey - 3 * k, look + 6 * k, ey - 3 * k, { sw: 2.4, stroke: g })}`;
  }

  // ---------- garments ----------
  function torsoPath(B, flare, drop, top) {
    const sw = B.sw,
      tb = B.tb + flare,
      t = B.sy - 6 + (top || 0),
      bot = B.hy + 8 + drop;
    return `M${n(-sw + 8)} ${n(t)} Q0 ${n(t - 6)} ${n(sw - 8)} ${n(t)} Q${n(sw + 7)} ${n(t + 1)} ${n(sw + 7)} ${n(t + 16)} L${n(tb + 2)} ${n(bot - 4)} Q${n(tb + 2)} ${n(bot + 2)} ${n(tb - 6)} ${n(bot + 2)} Q0 ${n(bot + 6)} ${n(-tb + 6)} ${n(bot + 2)} Q${n(-tb - 2)} ${n(bot + 2)} ${n(-tb - 2)} ${n(bot - 4)} L${n(-sw - 7)} ${n(t + 16)} Q${n(-sw - 7)} ${n(t + 1)} ${n(-sw + 8)} ${n(t)} Z`;
  }

  function gear(cx, cy, r, color) {
    let d = "";
    const N = 8;
    for (let i = 0; i < N * 2; i++) {
      const a = (i / (N * 2)) * Math.PI * 2;
      const rr = i % 2 === 0 ? r : r * 0.78;
      const a2 = a + Math.PI / (N * 2);
      d += (i === 0 ? "M" : " L") + n(cx + Math.cos(a) * rr) + " " + n(cy + Math.sin(a) * rr) + " L" + n(cx + Math.cos(a2) * rr) + " " + n(cy + Math.sin(a2) * rr);
    }
    return path(d + " Z", color, { sw: 2 }) + circle(cx, cy, r * 0.35, "#fff", { sw: 1.8 });
  }
  C.gear = gear;

  function stains(B, rnd, k) {
    const cols = ["#8a6a2f", "#c9a227", "#b8442f", "#6f7f3a"];
    let s = "";
    const spots = [
      [-0.35, 0.3, 9],
      [0.4, 0.55, 7],
      [-0.1, 0.75, 6],
      [0.2, 0.15, 5],
    ];
    spots.forEach(([fx, fy, sz], i) => {
      const x = fx * B.tb * 1.6,
        y = B.sy + (B.hy - B.sy) * fy;
      let d = "M";
      for (let j = 0; j < 9; j++) {
        const a = (j / 9) * Math.PI * 2;
        const rr = sz * (0.7 + rnd() * 0.6);
        d += (j ? " L" : "") + n(x + Math.cos(a) * rr) + " " + n(y + Math.sin(a) * rr * 0.8);
      }
      s += `<path d="${d} Z" fill="${cols[i % cols.length]}" opacity=".75"/>`;
    });
    return s;
  }

  function wrinkles(B, col) {
    const c = shade(col, -0.3);
    let s = "";
    [
      [-0.5, 0.35, 1],
      [0.45, 0.25, -1],
      [-0.2, 0.62, 1],
      [0.35, 0.78, -1],
    ].forEach(([fx, fy, d]) => {
      const x = fx * B.tb,
        y = B.sy + (B.hy - B.sy) * fy;
      s += `<path d="M${n(x)} ${n(y)} q${n(6 * d)} ${n(4)} ${n(12 * d)} ${n(-2)}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
    });
    return s;
  }

  // ---------- person ----------
  function person(cfg, o) {
    o = o || {};
    const B = BODY[cfg.type || "teen"];
    const x = o.x || 0,
      y = o.y || 0,
      s = o.s || 1,
      f = o.f || 1;
    const k = B.r / 40;
    const ex = Object.assign({}, EXPR[o.expr || "neutral"] || EXPR.neutral);
    const top = Object.assign({}, cfg.top || {});
    const bottom = cfg.bottom || { type: "pants", color: "#3d4f7a" };
    const skin = cfg.skin,
      skinShade = cfg.shade || shade(cfg.skin, -0.15);
    const messy = !!o.messy;
    const rnd = C.rng(3);

    const poseFn = C.POSES[o.pose || "stand"] || C.POSES.stand;
    const pose = Object.assign({}, poseFn(B), o.limbs || {});
    if (o.la) pose.la = o.la;
    if (o.ra) pose.ra = o.ra;
    if (o.ll) pose.ll = o.ll;
    if (o.rl) pose.rl = o.rl;
    const handL = o.handL || pose.handL || "open",
      handR = o.handR || pose.handR || "open";

    const floorSit = o.floorSit || pose.floorSit;
    const seated = (o.seated || pose.seated) && !floorSit;
    const kneel = o.kneel || pose.kneel;
    const bodyDy = floorSit ? -14 - B.hy : seated ? -(B.sh + 14) - B.hy : kneel ? B.th * 0.92 : 0;

    let legs = "";
    const pantsC = bottom.color;
    const shoeC = (cfg.shoes && cfg.shoes.color) || "#f2f2f2";
    const soleC = cfg.shoes && cfg.shoes.sole !== undefined ? cfg.shoes.sole : "#ffffff";
    const barefoot = cfg.shoes && cfg.shoes.none;
    const legW = B.lw + (bottom.type === "pants" && bottom.baggy ? 4 : 0);
    if (!o.noLegs) {
      [-1, 1].forEach((side) => {
        const hip = [side * B.hw, B.hy + bodyDy];
        let L;
        if (floorSit) {
          L = [hip, [side * (B.hw + 5), -14 - B.th * 0.85], [side * (B.hw + 10) + 4, -4]];
        } else if (seated) {
          const kx = side * (B.hw + 3),
            ky = hip[1] + 10;
          const foot = [side * (B.hw + 5) + 2, -4];
          L = [hip, [kx, ky], foot];
        } else if (kneel) {
          L = [hip, [side * (B.hw + 2), -6], [side * (B.hw + 2) - 18, -6]];
        } else {
          const spec = side < 0 ? pose.ll : pose.rl;
          L = solve(hip, B.th, B.sh, spec || [3, 0], side, "leg");
        }
        const shinColor = bottom.type === "shorts" || bottom.type === "skirt" || bottom.type === "dress" ? (cfg.socks || skin) : pantsC;
        const thighColor = bottom.type === "skirt" || bottom.type === "dress" ? (cfg.socks || skin) : pantsC;
        if (seated) {
          legs += stroke2([L[1], L[2]], B.lw * 0.95, shinColor);
          legs += fellipse(L[1][0], L[1][1] - 4, B.lw * 0.75, B.lw * 0.7, thighColor) + `<ellipse cx="${n(L[1][0])}" cy="${n(L[1][1] - 4)}" rx="${n(B.lw * 0.75 + 1)}" ry="${n(B.lw * 0.7 + 1)}" fill="${thighColor}" stroke="${INK}" stroke-width="2.6"/>`;
        } else if (kneel) {
          legs += stroke2([L[0], L[1]], legW, thighColor);
        } else {
          if (bottom.type === "shorts") {
            legs += stroke2([L[1], L[2]], B.lw * 0.85, skin);
            legs += stroke2([L[0], [L[0][0] + (L[1][0] - L[0][0]) * 0.75, L[0][1] + (L[1][1] - L[0][1]) * 0.75]], legW + 4, pantsC);
          } else {
            legs += stroke2([L[0], L[1], L[2]], legW, shinColor === pantsC ? pantsC : shinColor);
            if (shinColor !== pantsC && thighColor === pantsC) legs += stroke2([L[0], L[1]], legW, pantsC);
          }
        }
        if (!kneel) {
          if (barefoot) legs += ellipse(L[2][0] + 6, L[2][1] + 2, B.foot * 0.9, B.foot * 0.45, skin, { sw: 2.4 });
          else legs += shoe(L[2], B.foot, shoeC, soleC, messy && cfg.messyLaces !== false, 1);
        }
      });
    }

    // upper body
    let up = "";
    const arms = { back: "", mid: "", front: "" };
    const sleeve = top.sleeve || "long";
    const topC = top.color || "#2a9d8f";
    const armColor = sleeve === "long" ? (top.armColor || topC) : skin;
    const hands = {};
    [-1, 1].forEach((side) => {
      const spec = side < 0 ? pose.la : pose.ra;
      const S = [side * (B.sw - 2), B.sy + 6];
      const A = solve(S, B.ua, B.fa, spec || [8, -6], side, "arm");
      hands[side] = A;
      let a = "";
      if (sleeve === "long") {
        a += stroke2(A, B.aw + 3, armColor);
        // cuff
        const dx = A[2][0] - A[1][0],
          dy = A[2][1] - A[1][1],
          L = Math.hypot(dx, dy) || 1;
        const cx = A[2][0] - (dx / L) * 4,
          cy = A[2][1] - (dy / L) * 4;
        const px = (-dy / L) * (B.aw / 2 + 3),
          py = (dx / L) * (B.aw / 2 + 3);
        a += line(cx - px, cy - py, cx + px, cy + py, { sw: 2 });
      } else {
        a += stroke2(A, B.aw, skin);
        const M = [A[0][0] + (A[1][0] - A[0][0]) * (sleeve === "short" ? 0.62 : 0.2), A[0][1] + (A[1][1] - A[0][1]) * (sleeve === "short" ? 0.62 : 0.2)];
        if (sleeve !== "none") a += stroke2([A[0], M], B.aw + 8, topC);
      }
      const hk = side < 0 ? handL : handR;
      if (hk !== "pray") a += handShape(A[2], A[1], B.hand, skin, hk);
      const layer = spec && spec.layer ? spec.layer : "mid";
      arms[layer] += a;
    });
    if (handL === "pray" || handR === "pray") {
      const hx = (hands[-1][2][0] + hands[1][2][0]) / 2,
        hy2 = (hands[-1][2][1] + hands[1][2][1]) / 2;
      const r = B.hand;
      arms.mid += path(`M${n(hx)} ${n(hy2 - r * 2.1)} Q${n(hx + r * 1.15)} ${n(hy2 - r * 0.7)} ${n(hx + r * 0.95)} ${n(hy2 + r * 0.8)} Q${n(hx)} ${n(hy2 + r * 1.3)} ${n(hx - r * 0.95)} ${n(hy2 + r * 0.8)} Q${n(hx - r * 1.15)} ${n(hy2 - r * 0.7)} ${n(hx)} ${n(hy2 - r * 2.1)} Z`, skin, { sw: 2.6 });
      arms.mid += line(hx, hy2 - r * 1.7, hx, hy2 + r * 0.9, { sw: 1.8 });
    }

    // neck & torso
    const neck = C.rect(-7 * k, B.sy - 20 * k, 14 * k, 26 * k, skinShade, { sw: 2.4 });
    let torso = "";
    let afterTorso = "";
    const tt = top.type || "tee";
    const flare = tt === "hoodie" ? 5 : tt === "dress" ? 2 : 0;
    const drop = tt === "hoodie" ? 12 : tt === "dress" ? 0 : tt === "tucked" ? -2 : 4;
    if (bottom.type === "pants" || bottom.type === "shorts") {
      // waistband under shirt hem
      torso += path(`M${n(-B.tb + 2)} ${n(B.hy - 6)} L${n(B.tb - 2)} ${n(B.hy - 6)} L${n(B.hw + legW / 2 + 2)} ${n(B.hy + 14)} L0 ${n(B.hy + 22)} L${n(-B.hw - legW / 2 - 2)} ${n(B.hy + 14)} Z`, pantsC, { sw: 2.4 });
    }
    const tp = torsoPath(B, flare, drop);
    torso += path(tp, topC, { sw: 3 });
    // cel shade on the back side
    torso += `<path d="M${n(-B.sw - 5)} ${n(B.sy + 14)} L${n(-B.tb - 1)} ${n(B.hy + drop + 2)} L${n(-B.tb + 12)} ${n(B.hy + drop + 6)} L${n(-B.sw + 8)} ${n(B.sy + 10)} Z" fill="${shade(topC, -0.18)}" opacity=".85"/>`;
    const neckY = B.sy - 6;
    if (tt === "hoodie") {
      torso += path(`M${n(-B.tb - 4)} ${n(B.hy + drop - 6)} L${n(B.tb + 4)} ${n(B.hy + drop - 6)}`, "none", { sw: 2.2 });
      torso += path(`M${n(-B.tb * 0.62)} ${n(B.hy - 28)} L${n(B.tb * 0.62)} ${n(B.hy - 28)} L${n(B.tb * 0.82)} ${n(B.hy + drop - 8)} L${n(-B.tb * 0.82)} ${n(B.hy + drop - 8)} Z`, shade(topC, -0.08), { sw: 2.4 });
      afterTorso += path(`M${n(-B.sw + 4)} ${n(neckY + 4)} Q0 ${n(neckY + 24)} ${n(B.sw - 4)} ${n(neckY + 4)} Q${n(B.sw - 2)} ${n(neckY - 14)} 0 ${n(neckY - 12)} Q${n(-B.sw + 2)} ${n(neckY - 14)} ${n(-B.sw + 4)} ${n(neckY + 4)} Z`, shade(topC, -0.12), { sw: 2.6 });
      afterTorso += line(-7 * k, neckY + 12, -9 * k, neckY + 44, { sw: 2 }) + line(7 * k, neckY + 12, 9 * k, neckY + 44, { sw: 2 });
      afterTorso += fcircle(-9 * k, neckY + 46, 2.6, "#fff") + fcircle(9 * k, neckY + 46, 2.6, "#fff");
    } else if (tt === "tee" || tt === "pjs") {
      afterTorso += path(`M${n(-11 * k)} ${n(neckY + 2)} Q0 ${n(neckY + 14)} ${n(11 * k)} ${n(neckY + 2)}`, shade(topC, -0.15), { sw: 2.4 });
      if (tt === "pjs") {
        for (let i = -2; i <= 2; i++) torso += line(i * B.tb * 0.38, B.sy + 4, i * B.tb * 0.42, B.hy + drop, { sw: 3, stroke: "#fff", op: 0.55 });
        torso += [0.3, 0.5, 0.7].map((fy) => circle(4, B.sy + (B.hy - B.sy) * fy, 2.6, "#fff", { sw: 1.4 })).join("");
      }
    } else if (tt === "polo" || tt === "shirtTie" || tt === "tucked" || tt === "suit") {
      const collarC = tt === "suit" ? "#ffffff" : top.collar || shade(topC, 0.15);
      if (tt === "suit") {
        torso += path(`M${n(-12 * k)} ${n(neckY)} L0 ${n(B.sy + 50 * k)} L${n(12 * k)} ${n(neckY)} Z`, "#fff", { sw: 2.2 });
      }
      if (tt === "shirtTie" || tt === "suit") {
        const tie = top.tie || "#2c4a9a";
        torso += path(`M${n(-5 * k)} ${n(neckY + 6)} L${n(5 * k)} ${n(neckY + 6)} L${n(4 * k)} ${n(neckY + 14)} L${n(-4 * k)} ${n(neckY + 14)} Z`, tie, { sw: 2 });
        torso += path(`M${n(-4 * k)} ${n(neckY + 14)} L${n(4 * k)} ${n(neckY + 14)} L${n(8 * k)} ${n(B.hy - 22)} L0 ${n(B.hy - 12)} L${n(-8 * k)} ${n(B.hy - 22)} Z`, tie, { sw: 2.2 });
        torso += line(-6 * k, neckY + 40, 6 * k, neckY + 32, { sw: 2, stroke: shade(tie, 0.35) });
      } else {
        torso += line(0, neckY + 10, 0, neckY + 46, { sw: 2 });
        torso += fcircle(2, neckY + 20, 2.2, INK) + fcircle(2, neckY + 34, 2.2, INK);
      }
      if (tt === "suit") {
        torso += path(`M${n(-12 * k)} ${n(neckY)} L${n(-2 * k)} ${n(B.sy + 54 * k)} L${n(-22 * k)} ${n(B.sy + 20 * k)} Z`, shade(topC, -0.12), { sw: 2.2 });
        torso += path(`M${n(12 * k)} ${n(neckY)} L${n(2 * k)} ${n(B.sy + 54 * k)} L${n(22 * k)} ${n(B.sy + 20 * k)} Z`, shade(topC, -0.12), { sw: 2.2 });
        torso += fcircle(0, B.sy + 66 * k, 2.6, INK) + fcircle(0, B.sy + 80 * k, 2.6, INK);
      }
      afterTorso += path(`M${n(-2)} ${n(neckY + 8)} L${n(-15 * k)} ${n(neckY - 4)} L${n(-17 * k)} ${n(neckY + 12)} Z`, collarC, { sw: 2.2 });
      afterTorso += path(`M${n(2)} ${n(neckY + 8)} L${n(15 * k)} ${n(neckY - 4)} L${n(17 * k)} ${n(neckY + 12)} Z`, collarC, { sw: 2.2 });
      if (tt === "tucked") {
        torso += C.rect(-B.tb - 1, B.hy - 6, B.tb * 2 + 2, 9, top.belt || "#4a3426", { sw: 2.2 });
        torso += C.rect(-6, B.hy - 7, 12, 11, "#d8b84a", { sw: 2 });
        if (top.pocket !== false) torso += C.rect(B.tb * 0.25, B.sy + 22, 16 * k, 16 * k, "none", { sw: 2 });
      }
    } else if (tt === "cardigan") {
      const blouse = top.blouse || "#f4ecdc";
      torso += path(`M${n(-14 * k)} ${n(neckY)} L${n(14 * k)} ${n(neckY)} L${n(10 * k)} ${n(B.hy + drop)} L${n(-10 * k)} ${n(B.hy + drop)} Z`, blouse, { sw: 2.2 });
      torso += line(-10 * k, neckY, -9 * k, B.hy + drop, { sw: 2.4 }) + line(10 * k, neckY, 9 * k, B.hy + drop, { sw: 2.4 });
      [0.35, 0.55, 0.75].forEach((fy) => (torso += fcircle(-10 * k, B.sy + (B.hy - B.sy) * fy, 2.4, INK)));
      if (top.necklace) torso += path(`M${n(-10 * k)} ${n(neckY + 2)} Q0 ${n(neckY + 20)} ${n(10 * k)} ${n(neckY + 2)}`, "none", { sw: 1.8, stroke: "#d8b84a" }) + `<path d="M0 ${n(neckY + 12)} v10 M-4 ${n(neckY + 16)} h8" stroke="#d8b84a" stroke-width="2"/>`;
    } else if (tt === "dress") {
      afterTorso += path(`M${n(-11 * k)} ${n(neckY + 2)} Q0 ${n(neckY + 16)} ${n(11 * k)} ${n(neckY + 2)}`, shade(topC, -0.15), { sw: 2.4 });
      if (top.necklace) afterTorso += path(`M${n(-10 * k)} ${n(neckY + 6)} Q0 ${n(neckY + 22)} ${n(10 * k)} ${n(neckY + 6)}`, "none", { sw: 2, stroke: "#f6f0e6" });
    } else if (tt === "vest") {
      torso += path(`M${n(-14 * k)} ${n(neckY)} L${n(14 * k)} ${n(neckY)} L${n(6 * k)} ${n(B.hy + drop)} L${n(-6 * k)} ${n(B.hy + drop)} Z`, top.inner || "#ffffff", { sw: 2.2 });
    }
    if (top.emblem) torso += gear(B.tb * 0.3 + 4, B.sy + 38 * k, 11 * k, top.emblem);
    if (top.apron) {
      const ap = top.apron;
      torso += path(`M${n(-B.tb * 0.7)} ${n(B.sy + 22)} L${n(B.tb * 0.7)} ${n(B.sy + 22)} L${n(B.tb * 0.92)} ${n(B.hy + 26)} L${n(-B.tb * 0.92)} ${n(B.hy + 26)} Z`, ap, { sw: 2.6 });
      torso += line(-B.tb * 0.62, B.sy + 22, -10 * k, neckY + 4, { sw: 3, stroke: ap }) + line(B.tb * 0.62, B.sy + 22, 10 * k, neckY + 4, { sw: 3, stroke: ap });
      torso += C.rect(-B.tb * 0.45, B.hy - 22, B.tb * 0.9, 20, shade(ap, -0.12), { sw: 2 });
      torso += gear(0, B.sy + 46 * k, 9 * k, "#f4c542");
    }
    if (messy && cfg.stains !== false) torso += stains(B, C.rng(17), k) + wrinkles(B, topC);

    // skirt / dress lower part drawn over legs
    let skirt = "";
    if (bottom.type === "skirt" || tt === "dress") {
      const sc = tt === "dress" ? topC : bottom.color;
      const len = bottom.len || B.th * 0.95;
      skirt += path(`M${n(-B.tb - 1)} ${n(B.hy - 6 + bodyDy)} L${n(B.tb + 1)} ${n(B.hy - 6 + bodyDy)} L${n(B.tb + 16)} ${n(B.hy + len + bodyDy)} Q0 ${n(B.hy + len + 8 + bodyDy)} ${n(-B.tb - 16)} ${n(B.hy + len + bodyDy)} Z`, sc, { sw: 2.8 });
      skirt += line(-B.tb * 0.3, B.hy + 10 + bodyDy, -B.tb * 0.45, B.hy + len + bodyDy, { sw: 1.6, stroke: shade(sc, -0.3) }) + line(B.tb * 0.4, B.hy + 10 + bodyDy, B.tb * 0.6, B.hy + len + bodyDy, { sw: 1.6, stroke: shade(sc, -0.3) });
    }

    // head
    const hairFn = HAIR[(cfg.hair && cfg.hair.style) || "crop"] || HAIR.crop;
    const hairCol = (cfg.hair && cfg.hair.color) || "#231815";
    const hair = hairFn(B, hairCol, Object.assign({ messy }, cfg.hair || {}));
    let head = hair.back;
    const r = B.r,
      hc = B.hcy;
    // ears
    [-1, 1].forEach((side) => {
      const ex2 = side * 0.97 * r - 5 * k * 0.4;
      head += ellipse(ex2, hc + 4 * k, 6.5 * k, 10 * k, skin, { sw: 2.4 });
      head += path(`M${n(ex2 + side * 1.5 * k)} ${n(hc - 1 * k)} q${n(-side * 3 * k)} ${n(4 * k)} 0 ${n(9 * k)}`, "none", { sw: 1.6, stroke: shade(skinShade, -0.3) });
      if (cfg.earrings) head += circle(ex2, hc + 16 * k, 4.5 * k, "none", { sw: 2.2, stroke: "#d8b84a" });
    });
    head += path(headPath(r, hc, cfg.jaw || 1), skin, { sw: 3 });
    // soft cheek shadow on the far side
    head += `<path d="M${n(-0.92 * r)} ${n(hc + 0.1 * r)} C${n(-0.9 * r)} ${n(hc + 0.6 * r)} ${n(-0.55 * r)} ${n(hc + 0.98 * r)} ${n(-0.1 * r)} ${n(hc + 1.02 * r)} C${n(-0.5 * r)} ${n(hc + 0.8 * r)} ${n(-0.75 * r)} ${n(hc + 0.5 * r)} ${n(-0.92 * r)} ${n(hc + 0.1 * r)} Z" fill="${skinShade}" opacity=".7"/>`;
    if (cfg.beard) head += beard(B, cfg.beard, cfg);
    head += face(B, cfg, ex, o);
    if (cfg.mustache) head += mustache(B, cfg.mustache);
    head += hair.front;
    if (cfg.glasses) head += glasses(B, cfg.glasses === true ? null : cfg.glasses);
    if (o.goggles) {
      const gy2 = hc - 0.62 * r;
      head += path(`M${n(-1.02 * r)} ${n(gy2 + 4)} Q0 ${n(gy2 - 10)} ${n(1.02 * r)} ${n(gy2 + 4)}`, "none", { sw: 7 }) + path(`M${n(-1.02 * r)} ${n(gy2 + 4)} Q0 ${n(gy2 - 10)} ${n(1.02 * r)} ${n(gy2 + 4)}`, "none", { sw: 4, stroke: "#5a5a6e" });
      [-0.32, 0.38].forEach((fx2) => (head += circle(fx2 * r, gy2 - 2, 0.27 * r, "#9fe0ff", { sw: 3 }) + circle(fx2 * r - 3, gy2 - 6, 0.08 * r, "#ffffff", { sw: 0 })));
    }
    if (o.cap) head += o.cap;

    const headTf = `translate(${n(o.headDx || 0)} ${n(o.headDy || 0)}) rotate(${o.headTilt || 0} 0 ${n(B.sy - 14)})`;
    up += arms.back + neck + torso + afterTorso;
    up += arms.mid;
    up += `<g transform="${headTf}">${head}</g>`;
    up += arms.front;

    const upperTf = `translate(0 ${n(bodyDy)}) rotate(${o.lean || 0} 0 ${n(B.hy)})`;
    // skirt sits over the legs but under the torso; sitting on the floor puts the knees in front
    const body = floorSit
      ? skirt + `<g transform="${upperTf}">${up.replace(arms.mid, "")}</g>` + legs + `<g transform="${upperTf}">${arms.mid}</g>`
      : legs + skirt + `<g transform="${upperTf}">${up}</g>`;

    // world-space extras
    const W = (lx, ly) => {
      // apply lean + bodyDy roughly
      const a = rad(o.lean || 0);
      const yy = ly - B.hy;
      const rx2 = lx * Math.cos(a) - yy * Math.sin(a),
        ry2 = lx * Math.sin(a) + yy * Math.cos(a) + B.hy + bodyDy;
      return [x + f * s * rx2, y + s * ry2];
    };
    let fx = "";
    const headTop = W(0, hc - r * 1.2);
    const headC = W(0, hc);
    if (o.stink || (messy && o.stink !== false)) fx += C.fx.stink(headC[0], W(0, B.sy + 30)[1], s, o.stinkColor);
    if (o.flies) fx += C.fx.flies(headC[0], headC[1] - 20 * s, s * 1.3, o.flies === true ? 3 : o.flies);
    if (o.sparkle) fx += C.fx.sparkles(headC[0], W(0, B.sy + 40)[1], s);
    if ((ex.extras || []).includes("sweat")) fx += C.fx.sweat(headC[0] + f * r * 0.9 * s, headC[1] - r * 0.5 * s, s);
    if ((ex.extras || []).includes("vein")) fx += C.fx.vein(headC[0] - f * r * 0.55 * s, headC[1] - r * 0.75 * s, s);
    if ((ex.extras || []).includes("zz")) fx += C.fx.zz(headTop[0] + f * 40 * s, headTop[1], s);

    let items = "";
    const handW = (side) => {
      const A = hands[side];
      const h = A[2];
      const dx = A[2][0] - A[1][0],
        dy = A[2][1] - A[1][1],
        L = Math.hypot(dx, dy) || 1;
      return W(h[0] + (dx / L) * B.hand * 0.5, h[1] + (dy / L) * B.hand * 0.5);
    };
    if (o.hold) {
      ["l", "r"].forEach((key) => {
        const fn = o.hold[key];
        if (!fn) return;
        const p = handW(key === "l" ? -1 : 1);
        items += fn(p[0], p[1], s, f);
      });
      if (o.hold.c) {
        // carried with both hands: centre the item between them
        const a = handW(-1),
          b = handW(1);
        items += o.hold.c((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, s, f);
      }
    }
    const tf = `translate(${n(x)} ${n(y)}) scale(${n(f * s)} ${n(s)})${o.rot ? ` rotate(${o.rot} 0 -100)` : ""}`;
    let main = `<g transform="${tf}">${body}</g>`;
    if (o.holdBehind) main = items + main;
    else main = main + items;
    if (o.handsOver && o.hold) {
      // redraw hands above held items
      let hs = "";
      [-1, 1].forEach((side) => {
        const A = hands[side];
        const ug = `<g transform="${upperTf}">${handShape(A[2], A[1], B.hand, skin, side < 0 ? handL : handR)}</g>`;
        hs += ug;
      });
      main += `<g transform="${tf}">${hs}</g>`;
    }
    return main + fx;
  }
  C.person = person;

  // ---------- poses ----------
  const ik = (x, y, extra) => Object.assign({ x, y }, extra || {});
  C.ik = ik;
  C.POSES = {
    stand: (B) => ({ la: [9, -6], ra: [9, -6], ll: [3, 0], rl: [3, 0] }),
    relax: (B) => ({ la: [5, -2], ra: [5, -2], ll: [4, 0], rl: [4, 0] }),
    wide: (B) => ({ la: [14, -8], ra: [14, -8], ll: [10, 0], rl: [10, 0] }),
    wave: (B) => ({ la: [9, -6], ra: [140, 25], ll: [3, 0], rl: [3, 0] }),
    cheer: (B) => ({ la: [150, 18], ra: [150, 18], ll: [8, 0], rl: [8, 0], handL: "fist", handR: "fist" }),
    fistPump: (B) => ({ la: [9, -6], ra: [125, 75], ll: [6, 0], rl: [6, 0], handR: "fist" }),
    hips: (B) => ({ la: ik(B.tb + 2, B.hy - 2), ra: ik(B.tb + 2, B.hy - 2), ll: [6, 0], rl: [6, 0], handL: "fist", handR: "fist" }),
    cross: (B) => ({ la: ik(B.sw * 0.45, B.sy + (B.hy - B.sy) * 0.45, { bend: 1 }), ra: ik(B.sw * 0.45, B.sy + (B.hy - B.sy) * 0.38), ll: [5, 0], rl: [5, 0], handL: "fist", handR: "fist" }),
    pray: (B) => ({ la: ik(4, B.sy + (B.hy - B.sy) * 0.3), ra: ik(4, B.sy + (B.hy - B.sy) * 0.3), ll: [3, 0], rl: [3, 0], handL: "pray", handR: "pray" }),
    point: (B) => ({ la: [9, -6], ra: [96, -4], ll: [5, 0], rl: [5, 0], handR: "point" }),
    pointUp: (B) => ({ la: ik(B.tb + 2, B.hy - 2), ra: [168, 8], ll: [5, 0], rl: [5, 0], handR: "point", handL: "fist" }),
    yell: (B) => ({ la: ik(B.tb + 2, B.hy - 2), ra: [100, -12], ll: [7, 0], rl: [7, 0], handR: "point", handL: "fist" }),
    shrug: (B) => ({ la: [40, 75], ra: [40, 75], ll: [4, 0], rl: [4, 0] }),
    think: (B) => ({ la: ik(B.sw * 0.5, B.sy + (B.hy - B.sy) * 0.55, { pref: [0.4, 1] }), ra: Object.assign(ik(B.r * 0.25, B.hcy + B.r * 1.15, { pref: [0.5, 1] }), { layer: "front" }), ll: [3, 0], rl: [3, 0], handR: "fist", handL: "fist" }),
    facepalm: (B) => ({ la: [9, -6], ra: Object.assign(ik(B.r * 0.05, B.hcy - B.r * 0.05, { pref: [0.6, 1] }), { layer: "front" }), ll: [3, 0], rl: [3, 0] }),
    holdBoth: (B) => ({ la: ik(8, B.sy + (B.hy - B.sy) * 0.5), ra: ik(8, B.sy + (B.hy - B.sy) * 0.5), ll: [3, 0], rl: [3, 0] }),
    holdOut: (B) => ({ la: [9, -6], ra: ik(B.sw + B.ua * 0.9, B.sy + B.ua * 0.6), ll: [4, 0], rl: [4, 0] }),
    present: (B) => ({ la: ik(B.sw + B.ua * 0.75, B.sy + B.ua * 0.75), ra: ik(B.sw + B.ua * 0.75, B.sy + B.ua * 0.75), ll: [5, 0], rl: [5, 0] }),
    reachUp: (B) => ({ la: [9, -6], ra: [172, 2], ll: [3, 0], rl: [3, 0] }),
    run: (B) => ({ la: [-35, 70], ra: [40, -100], ll: ik(-B.hw - B.th * 0.9, -B.sh * 0.5, { pref: [1, 0.3] }), rl: ik(B.hw + B.th * 0.55, -B.sh * 0.35, { pref: [1, -0.5] }), handL: "fist", handR: "fist" }),
    walk: (B) => ({ la: [-14, -10], ra: [22, -14], ll: [-14, 6], rl: [16, -4] }),
    sitHands: (B) => ({ la: ik(B.hw + 10, B.hy + 8), ra: ik(B.hw + 10, B.hy + 8), seated: true }),
    game: (B) => ({ la: ik(10, B.sy + (B.hy - B.sy) * 0.72), ra: ik(10, B.sy + (B.hy - B.sy) * 0.72), seated: true }),
    brush: (B) => ({ la: [9, -6], ra: Object.assign(ik(B.r * 0.45, B.hcy + B.r * 0.7, { pref: [0.3, 1] }), { layer: "front" }), ll: [3, 0], rl: [3, 0], handR: "fist" }),
    spray: (B) => ({ la: [9, -6], ra: [120, -25], ll: [4, 0], rl: [4, 0], handR: "fist" }),
    sniff: (B) => ({ la: [150, 30], ra: [9, -6], ll: [3, 0], rl: [3, 0] }),
    pinchNose: (B) => ({ la: [9, -6], ra: Object.assign(ik(B.r * 0.22, B.hcy + B.r * 0.42, { pref: [0.4, 1] }), { layer: "front" }), ll: [3, 0], rl: [3, 0], handR: "fist" }),
    headScratch: (B) => ({ la: [9, -6], ra: Object.assign(ik(B.r * 0.55, B.hcy - B.r * 1.0, { pref: [1, 0.1] }), { layer: "front" }), ll: [3, 0], rl: [3, 0] }),
    handsHead: (B) => ({ la: Object.assign(ik(B.r * 0.85, B.hcy - B.r * 0.4), { layer: "front" }), ra: Object.assign(ik(B.r * 0.85, B.hcy - B.r * 0.4), { layer: "front" }), ll: [5, 0], rl: [5, 0] }),
    heart: (B) => ({ la: ik(4, B.sy + 30), ra: Object.assign(ik(4, B.sy + 22), {}), ll: [3, 0], rl: [3, 0] }),
    handshake: (B) => ({ la: [9, -6], ra: ik(B.sw + B.ua * 0.8, B.sy + B.ua * 0.95), ll: [4, 0], rl: [4, 0] }),
    thumbs: (B) => ({ la: [9, -6], ra: ik(B.sw + 18, B.sy + 30, { bend: 1 }), ll: [4, 0], rl: [4, 0], handR: "thumb" }),
    slump: (B) => ({ la: [3, 0], ra: [3, 0], ll: [2, 0], rl: [2, 0] }),
    sitSlump: (B) => ({ la: [3, 0], ra: [3, 0], seated: true }),
    sitPray: (B) => ({ la: ik(4, B.sy + (B.hy - B.sy) * 0.3), ra: ik(4, B.sy + (B.hy - B.sy) * 0.3), handL: "pray", handR: "pray", seated: true }),
    sitRead: (B) => ({ la: ik(10, B.sy + (B.hy - B.sy) * 0.62), ra: ik(10, B.sy + (B.hy - B.sy) * 0.62), seated: true }),
    write: (B) => ({ la: ik(4, B.sy + (B.hy - B.sy) * 0.8), ra: ik(20, B.sy + (B.hy - B.sy) * 0.85), ll: [3, 0], rl: [3, 0], handR: "fist" }),
    kneelPray: (B) => ({ la: ik(4, B.sy + (B.hy - B.sy) * 0.3), ra: ik(4, B.sy + (B.hy - B.sy) * 0.3), handL: "pray", handR: "pray", kneel: true }),
    carry: (B) => ({ la: ik(B.sw + 6, B.sy + B.ua * 1.05), ra: ik(B.sw + 6, B.sy + B.ua * 1.05), ll: [4, 0], rl: [4, 0] }),
    sweep: (B) => ({ la: ik(14, B.sy + 30), ra: ik(26, B.hy - 6), ll: [8, 0], rl: [8, 0], handL: "fist", handR: "fist" }),
    hug: (B) => ({ la: ik(B.sw + 22, B.sy + 30, { bend: 1 }), ra: ik(B.sw + 22, B.sy + 30), ll: [4, 0], rl: [4, 0] }),
    tiptoe: (B) => ({ la: [60, 70], ra: [60, 70], ll: [-6, 16], rl: [10, -8] }),
    ride: (B) => ({ la: ik(B.sw + B.ua * 1.1, B.sy + 50), ra: ik(B.sw + B.ua * 1.1, B.sy + 50), ll: ik(10, -14, { pref: [1, -0.4] }), rl: ik(46, -10, { pref: [1, -0.4] }), handL: "fist", handR: "fist" }),
    hugKnees: (B) => ({ la: ik(B.hw + 8, B.hy - B.th * 0.85 + 4), ra: ik(B.hw + 8, B.hy - B.th * 0.85 + 4), floorSit: true }),
    floorRelax: (B) => ({ la: ik(B.hw + 12, B.hy - B.th * 0.8 + 10), ra: [12, -4], floorSit: true }),
    dance: (B) => ({ la: ik(B.tb + 2, B.hy + 10, { bend: -1 }), ra: ik(4, B.hy + 18), ll: [-12, 20], rl: [18, -26], handR: "fist" }),
  };

  // ---------- cast ----------
  const famSkin = () => C.famSkin();
  C.cast = {
    lex(outfit) {
      const sk = famSkin();
      const base = { type: "teen", skin: sk.skin, shade: sk.shade, hair: { style: "lex", color: C.famHair() }, eyeScale: 1.05, lip: shade(sk.skin, -0.25) };
      const outfits = {
        messy: { top: { type: "hoodie", color: "#c9473c" }, bottom: { type: "pants", color: "#59698c", baggy: true }, shoes: { color: "#d9d2c3", sole: "#b9b2a3" } },
        hoodie: { top: { type: "hoodie", color: "#c9473c" }, bottom: { type: "pants", color: "#3c4d78" }, shoes: { color: "#ffffff", sole: "#d8402f" } },
        clean: { top: { type: "tee", color: "#2a8f86", sleeve: "short", emblem: "#f4c542" }, bottom: { type: "pants", color: "#33416b" }, shoes: { color: "#ffffff", sole: "#d8402f" } },
        polo: { top: { type: "polo", color: "#2f5fa7", sleeve: "short", collar: "#3f72bd" }, bottom: { type: "pants", color: "#a3895c" }, shoes: { color: "#ffffff", sole: "#2f5fa7" } },
        church: { top: { type: "shirtTie", color: "#fbfbf7", tie: "#2b4ea2", collar: "#ffffff" }, bottom: { type: "pants", color: "#2a2f45" }, shoes: { color: "#3a2a20", sole: "#1d1510" } },
        pjs: { top: { type: "pjs", color: "#6f8fd6" }, bottom: { type: "pants", color: "#6f8fd6" }, shoes: { none: true } },
        apron: { top: { type: "tee", color: "#2a8f86", sleeve: "short", apron: "#3f8f5a" }, bottom: { type: "pants", color: "#33416b" }, shoes: { color: "#ffffff", sole: "#d8402f" } },
        suit: { top: { type: "suit", color: "#26324f", tie: "#c9473c" }, bottom: { type: "pants", color: "#26324f" }, shoes: { color: "#2a1d15", sole: "#140d09" } },
        adult: { top: { type: "suit", color: "#26324f", tie: "#2a8f86" }, bottom: { type: "pants", color: "#26324f" }, shoes: { color: "#2a1d15", sole: "#140d09" } },
      };
      return Object.assign(base, outfits[outfit || "clean"] || outfits.clean);
    },
    mom(outfit) {
      const sk = famSkin();
      const skin = shade(sk.skin, 0.06),
        sh = shade(sk.shade, 0.06);
      const base = { type: "woman", skin, shade: sh, hair: { style: "puff", color: C.famHair(), band: "#e0533d" }, earrings: true, lip: "#9b3b44" };
      const outfits = {
        home: { top: { type: "cardigan", color: "#e09a3e", blouse: "#f6efe0", necklace: true }, bottom: { type: "pants", color: "#40557d" }, shoes: { color: "#9b3b44", sole: "#6e2830" } },
        church: { top: { type: "dress", color: "#2f8a84", necklace: true }, bottom: { type: "skirt", color: "#2f8a84" }, shoes: { color: "#2a1d15", sole: null } },
      };
      return Object.assign(base, outfits[outfit || "home"] || outfits.home);
    },
    dad(outfit) {
      const sk = famSkin();
      const skin = shade(sk.skin, -0.06),
        sh = shade(sk.shade, -0.06);
      const base = { type: "man", skin, shade: sh, hair: { style: "crop", color: C.famHair() }, beard: C.famHair(), mustache: C.famHair(), lip: shade(skin, -0.25) };
      const outfits = {
        home: { top: { type: "tucked", color: "#8db3d8", collar: "#a3c4e4" }, bottom: { type: "pants", color: "#4a4f60" }, shoes: { color: "#5a3a26", sole: "#2a1d15" } },
        church: { top: { type: "suit", color: "#2b3550", tie: "#b5843c" }, bottom: { type: "pants", color: "#2b3550" }, shoes: { color: "#2a1d15", sole: "#140d09" } },
        casual: { top: { type: "polo", color: "#3f7d56", sleeve: "short" }, bottom: { type: "pants", color: "#4a4f60" }, shoes: { color: "#e6e2d8", sole: "#9a9488" } },
      };
      return Object.assign(base, outfits[outfit || "home"] || outfits.home);
    },
    pastor: () => ({ type: "man", skin: "#6b4430", shade: "#553525", hair: { style: "pastor", color: "#d4d0c8" }, mustache: "#d4d0c8", glasses: "#3a3a3a", top: { type: "suit", color: "#3a2f5a", tie: "#b5843c" }, bottom: { type: "pants", color: "#3a2f5a" }, shoes: { color: "#1d1510", sole: "#0d0907" } }),
    motherJ: () => ({ type: "woman", skin: "#4f3223", shade: "#3d261a", hair: { style: "hat", color: "#d9d6d0", hatColor: "#7b3f9e" }, glasses: "#7b3f9e", earrings: true, top: { type: "dress", color: "#9b59b6", necklace: true }, bottom: { type: "skirt", color: "#9b59b6", len: 92 }, shoes: { color: "#5a2d6e", sole: null } }),
    pearl: () => ({ type: "woman", skin: "#e8b796", shade: "#cf9a78", hair: { style: "grayCurls", color: "#e6e2dc" }, glasses: "#6a4a8a", top: { type: "cardigan", color: "#7fb3a0", blouse: "#fff7e8" }, bottom: { type: "skirt", color: "#c87a8a", len: 92 }, shoes: { color: "#8a6a4a", sole: null } }),
    teacher: () => ({ type: "woman", skin: "#f1c9a5", shade: "#d9ab86", hair: { style: "bob", color: "#7a4b2a" }, glasses: "#2d4a7a", top: { type: "cardigan", color: "#5b7fb5", blouse: "#ffffff" }, bottom: { type: "pants", color: "#3d3d4d" }, shoes: { color: "#3a2a20", sole: null } }),
    teller: () => ({ type: "man", skin: "#c99a74", shade: "#ad7f5c", hair: { style: "crop", color: "#2a1c14" }, top: { type: "vest", color: "#355c7d", inner: "#ffffff", sleeve: "long", armColor: "#ffffff" }, bottom: { type: "pants", color: "#2a2f45" }, shoes: { color: "#2a1d15", sole: null } }),
    friend: () => ({ type: "teen", skin: "#d9a066", shade: "#bb8450", hair: { style: "cap", color: "#2a1c14", capColor: "#2d6fb5" }, top: { type: "tee", color: "#f0b429", sleeve: "short" }, bottom: { type: "shorts", color: "#4a5a6a" }, shoes: { color: "#ffffff", sole: "#2d6fb5" } }),
    friend2: () => ({ type: "teen", skin: "#f3d0b5", shade: "#ddb194", hair: { style: "shag", color: "#a0652e" }, freckles: true, top: { type: "hoodie", color: "#6a5acd" }, bottom: { type: "pants", color: "#3d4f7a" }, shoes: { color: "#222222", sole: "#ffffff" } }),
    girl: () => ({ type: "teen", skin: "#7a4a30", shade: "#613a24", hair: { style: "puffs", color: "#1f1512" }, earrings: true, top: { type: "tee", color: "#e85d75", sleeve: "short" }, bottom: { type: "pants", color: "#33416b" }, shoes: { color: "#ffffff", sole: "#e85d75" } }),
    girl2: () => ({ type: "teen", skin: "#e9be98", shade: "#d0a17a", hair: { style: "pony", color: "#3a2416" }, top: { type: "hoodie", color: "#3fa7a0" }, bottom: { type: "pants", color: "#2a2f45" }, shoes: { color: "#ffffff", sole: "#3fa7a0" } }),
    kid: () => ({ type: "child", skin: C.famSkin().skin, shade: C.famSkin().shade, hair: { style: "crop", color: C.famHair() }, top: { type: "tee", color: "#f08a3c", sleeve: "short" }, bottom: { type: "shorts", color: "#3d4f7a" }, shoes: { color: "#ffffff", sole: "#2d6fb5" } }),
    kid2: () => ({ type: "child", skin: "#b07850", shade: "#93603d", hair: { style: "braids", color: "#1f1512" }, top: { type: "tee", color: "#7cc35a", sleeve: "short" }, bottom: { type: "shorts", color: "#6a4a8a" }, shoes: { color: "#ffffff", sole: "#e85d75" } }),
    boy3: () => ({ type: "teen", skin: "#5b3a27", shade: "#472c1d", hair: { style: "crop", color: "#120c0a" }, top: { type: "tee", color: "#d64545", sleeve: "short" }, bottom: { type: "pants", color: "#2a2f45" }, shoes: { color: "#111111", sole: "#ffffff" } }),
  };

  // Convenience wrappers: lex({...}), mom({...}), ...
  C.lex = (o = {}) => person(C.cast.lex(o.outfit || (o.messy ? "messy" : "clean")), o);
  C.mom = (o = {}) => person(C.cast.mom(o.outfit), o);
  C.dad = (o = {}) => person(C.cast.dad(o.outfit), o);
  C.npc = (who, o = {}) => person(C.cast[who](o.outfit), o);
})();
