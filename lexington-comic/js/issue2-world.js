/* Lexington Issue #2 — new cast, props and places.
   Loaded only by issue-2.html, after the shared engine and kit.js. */
(function () {
  "use strict";
  const C = window.Comic;
  const { n, text, rect, frect, path, line, circle, fcircle, ellipse, fellipse, T, INK, shade } = C;
  const S = C.scene,
    P = C.prop,
    H = C.held,
    fx = C.fx;

  // ---------- cast ----------
  const crewTee = { type: "tee", color: "#4fb3e8", sleeve: "short", badge: "bubbles" };
  C.cast.jonathan = (outfit) => {
    const base = { type: "teen", skin: "#f6d5bd", shade: "#e3b79c", hair: { style: "crop", color: "#d9b25c" }, freckles: true, iris: "#3f7fc4", lip: "#c98a7a", eyeScale: 1.05 };
    const o = {
      casual: { top: { type: "tee", color: "#3f9b5a", sleeve: "short" }, bottom: { type: "pants", color: "#4a5a7a" }, shoes: { color: "#ffffff", sole: "#3f9b5a" } },
      hoodie: { top: { type: "hoodie", color: "#e0a33a" }, bottom: { type: "pants", color: "#4a5a7a" }, shoes: { color: "#ffffff", sole: "#3f9b5a" } },
      crew: { top: crewTee, bottom: { type: "shorts", color: "#3d4f7a" }, shoes: { color: "#ffffff", sole: "#4fb3e8" } },
      church: { top: { type: "shirtTie", color: "#fbfbf7", tie: "#3f9b5a", collar: "#ffffff" }, bottom: { type: "pants", color: "#2a2f45" }, shoes: { color: "#2a1d15", sole: "#140d09" } },
    };
    return Object.assign(base, o[outfit || "casual"] || o.casual);
  };
  C.jonathan = (o = {}) => C.person(C.cast.jonathan(o.outfit), o);
  // crew shirts for the brothers
  C.lexCrew = (o = {}) => C.person(Object.assign(C.cast.lex("clean"), { top: crewTee, bottom: { type: "shorts", color: "#33416b" } }), o);
  C.tonyCrew = (o = {}) => C.person(Object.assign(C.cast.tony("casual"), { top: Object.assign({}, crewTee, { color: "#2f8fd0" }) }), o);
  C.cast.bishop = () => ({ type: "man", skin: "#efc6a4", shade: "#d8a988", hair: { style: "short", color: "#a9a49c" }, glasses: "#3a3a3a", jaw: 1, top: { type: "suit", color: "#4a4f5e", tie: "#2b4ea2" }, bottom: { type: "pants", color: "#4a4f5e" }, shoes: { color: "#1d1510", sole: null } });
  C.cast.elderA = () => ({ type: "man", skin: "#c99a74", shade: "#ad7f5c", hair: { style: "short", color: "#1f1512" }, eyeScale: 1.1, top: { type: "shirtTie", color: "#ffffff", tie: "#7a2236", collar: "#ffffff", nametag: true, sleeve: "short" }, bottom: { type: "pants", color: "#22262f" }, shoes: { color: "#1d1510", sole: null } });
  C.cast.elderB = () => ({ type: "man", skin: "#f0cdb0", shade: "#d9b090", hair: { style: "short", color: "#8a5a2c" }, eyeScale: 1.1, top: { type: "shirtTie", color: "#ffffff", tie: "#2a5a9a", collar: "#ffffff", nametag: true, sleeve: "short" }, bottom: { type: "pants", color: "#22262f" }, shoes: { color: "#1d1510", sole: null } });
  C.cast.wilson = () => ({ type: "man", skin: "#e9b896", shade: "#cf9c7a", hair: { style: "cap", color: "#6b4a2c", capColor: "#3f7d56" }, beard: "#8a6a4a", mustache: "#8a6a4a", top: { type: "tucked", color: "#c9473c", collar: "#d96a5a", pocket: true }, bottom: { type: "pants", color: "#4a5a7a" }, shoes: { color: "#6b4a2c", sole: "#3a2a1a" } });
  C.cast.larsen = () => ({ type: "woman", skin: "#f3d3bd", shade: "#ddb69c", hair: { style: "bob", color: "#d9d6d0" }, glasses: "#7a3f8f", earrings: true, top: { type: "cardigan", color: "#c86a8a", blouse: "#fff6f0" }, bottom: { type: "skirt", color: "#5b7fb5", len: 92 }, shoes: { color: "#6b4a2c", sole: null } });
  C.cast.clerk = () => ({ type: "teen", skin: "#d9a066", shade: "#bb8450", hair: { style: "pony", color: "#2a1c14" }, top: { type: "polo", color: "#e07a2e", sleeve: "short", collar: "#f09a4e" }, bottom: { type: "pants", color: "#2a2f45" }, shoes: { color: "#222222", sole: "#ffffff" } });

  // ---------- held items ----------
  H.sponge = (x, y, s, f) => T(x, y, s, `${rect(-14, -10, 28, 20, "#f4d03f", { sw: 2.4, r: 6 })}${[[-6, -3], [4, 2], [-2, 4], [7, -4]].map(([a, b]) => fcircle(a, b, 1.6, "#c9a227")).join("")}${circle(-10, -16, 5, "#ffffff", { sw: 1.4 })}${circle(4, -18, 4, "#ffffff", { sw: 1.2 })}`);
  H.hose = (x, y, s, f) =>
    T(x, y, s, `<g transform="scale(${f} 1)">${rect(-6, -8, 30, 14, "#3a7d3a", { sw: 2.2, r: 4 })}${rect(22, -6, 12, 10, "#c9c9d6", { sw: 2 })}${path("M34 -1 Q120 -60 210 10", "none", { sw: 9, stroke: "#bfe8ff", op: 0.9 })}${path("M34 -1 Q120 -60 210 10", "none", { sw: 3, stroke: "#ffffff" })}${[[90, -40], [130, -46], [170, -26], [200, -2], [150, -10]].map(([a, b]) => fcircle(a, b, 4, "#7fd3ff")).join("")}${path("M-6 0 Q-40 30 -30 80", "none", { sw: 6, stroke: "#3a7d3a" })}</g>`);
  H.vac = (x, y, s, f) => T(x, y, s, `<g transform="scale(${f} 1)">${rect(-20, -14, 44, 26, "#d64545", { sw: 2.4, r: 8 })}${fcircle(-6, -2, 4, "#7ff3ff")}${fcircle(8, -2, 4, "#7ff3ff")}${rect(22, -6, 40, 10, "#5a5a6e", { sw: 2, r: 3 })}${rect(60, -10, 10, 18, "#3a3a4a", { sw: 2 })}${line(-10, -14, -10, -26, { sw: 2.2 })}${fcircle(-10, -28, 3.5, "#f4c542")}</g>`);
  H.tray = (x, y, s, f) => T(x, y + 4 * s, s, `${ellipse(0, 0, 34, 9, "#d9dde4", { sw: 2.4 })}${ellipse(0, -3, 26, 6, "#eef1f5", { sw: 1.4 })}${[-14, -5, 4, 13].map((d) => rect(d - 3, -10, 6, 7, "#ffffff", { sw: 1.2 })).join("")}${line(-26, 0, -34, 6, { sw: 2, stroke: "#b9bfc9" })}`);
  H.slip = (x, y, s, f) => T(x, y, s, `${rect(-24, -16, 48, 32, "#fffaf0", { sw: 2.2 })}${frect(-24, -16, 48, 8, "#c9c3b5")}${[0, 7].map((d) => line(-18, -2 + d, 18, -2 + d, { sw: 1.4, stroke: "#9a9ab0" })).join("")}`);
  H.calculator = (x, y, s, f) => T(x, y, s, `${rect(-16, -24, 32, 46, "#3a3f5a", { sw: 2.4, r: 4 })}${frect(-11, -19, 22, 10, "#bfe8b0")}${[0, 1, 2].map((r) => [0, 1, 2].map((c) => frect(-11 + c * 8, -4 + r * 8, 6, 6, "#e6e2d8")).join("")).join("")}`);
  H.bigBox = (x, y, s, f) => T(x, y, s, `${rect(-46, -40, 92, 70, "#d9b98a", { sw: 2.6 })}${line(-46, -22, 46, -22, { sw: 2 })}${text(0, 10, "3D PRINTER", { size: 12, font: "title", ls: 1 })}`);

  // ---------- props ----------
  // car side view, facing +x. x,y = ground under the middle. kind: sedan | van | truck
  P.car = (x, y, s, o = {}) => {
    const c = o.color || "#c9473c",
      dk = shade(c, -0.25),
      kind = o.kind || "sedan";
    const f = o.f || 1;
    let i = "";
    const roof = kind === "van" ? -320 : -250;
    let body;
    if (kind === "truck") {
      body = `M-390 -50 L-390 -150 L-60 -150 L-60 -250 Q-56 -270 -30 -270 L110 -270 Q140 -270 160 -245 L230 -165 L340 -155 Q385 -148 388 -110 L388 -50 Q388 -30 360 -30 L-365 -30 Q-390 -30 -390 -50 Z`;
    } else if (kind === "van") {
      body = `M-385 -50 L-385 -270 Q-380 -320 -320 -322 L120 -322 Q160 -320 190 -280 L250 -175 L340 -160 Q385 -150 388 -110 L388 -50 Q388 -30 360 -30 L-360 -30 Q-385 -30 -385 -50 Z`;
    } else {
      body = `M-375 -50 L-375 -120 Q-370 -140 -330 -145 L-230 -152 L-150 -232 Q-130 -252 -90 -252 L90 -252 Q130 -252 152 -232 L232 -160 L330 -150 Q376 -144 378 -110 L378 -50 Q378 -30 355 -30 L-355 -30 Q-378 -30 -375 -50 Z`;
    }
    i += path(body, c, { sw: 3.4 });
    i += path(`M-370 -100 L375 -100`, "none", { sw: 2, stroke: dk });
    // windows
    if (kind === "truck") {
      i += path("M-46 -160 L-46 -250 Q-44 -258 -30 -258 L100 -258 Q125 -258 140 -240 L205 -165 Z", "#bfe0f0", { sw: 2.6 });
      i += line(50, -258, 50, -162, { sw: 4, stroke: c });
      i += rect(-385, -168, 320, 16, dk, { sw: 2.4 });
    } else if (kind === "van") {
      i += path("M-360 -175 L-360 -290 Q-356 -305 -330 -305 L110 -305 Q140 -305 165 -275 L225 -178 Z", "#bfe0f0", { sw: 2.6 });
      [-200, -40, 90].forEach((dx) => (i += line(dx, -305, dx, -177, { sw: 5, stroke: c })));
    } else {
      i += path("M-210 -160 L-140 -228 Q-124 -240 -96 -240 L-12 -240 L-12 -162 Z", "#bfe0f0", { sw: 2.6 });
      i += path("M8 -240 L88 -240 Q118 -240 136 -224 L204 -162 L8 -162 Z", "#bfe0f0", { sw: 2.6 });
    }
    i += path("M-120 -230 L-60 -200 M30 -232 L100 -196", "none", { sw: 4, stroke: "#ffffff", op: 0.6 });
    // doors, handles, lights
    i += line(0, -158, 0, -40, { sw: 2, stroke: dk }) + line(210, -158, 200, -40, { sw: 2, stroke: dk });
    i += rect(-60, -140, 24, 7, dk, { sw: 1.6, r: 3 }) + rect(150, -140, 24, 7, dk, { sw: 1.6, r: 3 });
    i += ellipse(362, -118, 14, 10, "#fff3a0", { sw: 2.2 }) + rect(-382, -128, 14, 22, "#e8536b", { sw: 2.2, r: 3 });
    i += rect(-385, -66, 40, 18, "#c9c9d6", { sw: 2.2, r: 4 }) + rect(345, -66, 42, 18, "#c9c9d6", { sw: 2.2, r: 4 });
    // wheels
    [-245, 245].forEach((wx) => {
      i += path(`M${wx - 78} -30 Q${wx - 78} -120 ${wx} -120 Q${wx + 78} -120 ${wx + 78} -30 Z`, shade(c, -0.45), { sw: 2.6 });
      i += circle(wx, -58, 58, "#2a2a33", { sw: 3 }) + circle(wx, -58, 32, "#c9c9d6", { sw: 2.4 }) + circle(wx, -58, 10, "#8a8a98", { sw: 2 });
      [0, 72, 144, 216, 288].forEach((a) => (i += line(wx, -58, wx + Math.cos((a * Math.PI) / 180) * 28, -58 + Math.sin((a * Math.PI) / 180) * 28, { sw: 3, stroke: "#8a8a98" })));
    });
    if (o.dirty) {
      const r = C.rng(o.seed || 3);
      for (let k = 0; k < 16; k++) i += fellipse(-360 + r() * 720, -60 - r() * 120, 12 + r() * 26, 6 + r() * 12, "#8a6a3f", 0.55);
      i += path("M-380 -40 Q-250 -90 -100 -50 Q0 -80 120 -45 Q260 -85 385 -45 L385 -32 L-380 -32 Z", "#7a5a32", { op: 0.6, sw: 0 });
    }
    if (o.soapy) for (let k = 0; k < 18; k++) i += circle(-300 + ((k * 97) % 600), -80 - ((k * 53) % 150), 10 + (k % 4) * 5, "#ffffff", { sw: 1.6, op: 0.95 });
    if (o.wet) for (let k = 0; k < 14; k++) i += path(`M${-320 + ((k * 89) % 640)} ${-200 + ((k * 37) % 120)} q-5 9 0 12 q5 -3 0 -12 Z`, "#bfe8ff", { sw: 1.2 });
    let out = T(x, y, s, `<g transform="scale(${f} 1)">${i}</g>`);
    if (o.dirty && o.washMe) out += text(x + f * -110 * s, y - 196 * s, "WASH ME", { size: 22 * s, font: "hand", fill: "#6a5a3a", weight: 400, rot: -4 });
    if (o.shine) out += fx.sparkle(x + f * 200 * s, y - 230 * s, 14 * s) + fx.sparkle(x - f * 260 * s, y - 160 * s, 11 * s) + fx.sparkle(x + f * 330 * s, y - 120 * s, 9 * s) + fx.sparkle(x - f * 40 * s, y - 270 * s, 10 * s);
    return out;
  };
  P.bucket = (x, y, s, o = {}) =>
    T(x, y, s, `${path("M-34 -70 L34 -70 L28 0 L-28 0 Z", o.color || "#4f86c6", { sw: 2.8 })}${line(-31, -48, 31, -48, { sw: 1.6, stroke: shade(o.color || "#4f86c6", -0.25) })}${path("M-34 -70 Q0 -110 34 -70", "none", { sw: 3 })}${o.suds !== false ? [[-24, -74, 13], [-6, -80, 15], [14, -76, 13], [26, -70, 9], [2, -92, 9]].map(([a, b, r]) => circle(a, b, r, "#ffffff", { sw: 1.8 })).join("") : ""}`);
  P.aSign = (x, y, s, o = {}) => {
    let i = path("M-90 0 L-60 -210 L60 -210 L90 0", "none", { sw: 6, stroke: "#8a5a3c" });
    i += rect(-74, -200, 148, 170, "#ffffff", { sw: 3, r: 6 });
    i += frect(-72, -198, 144, 44, "#4fb3e8");
    i += text(0, -168, "SUDS BROTHERS", { size: 21, font: "title", fill: "#ffffff", stroke: INK, sw: 3, ls: 1 });
    i += text(0, -128, "CAR WASH", { size: 20, font: "title", fill: "#c9473c", ls: 1 });
    i += text(0, -92, o.price || "$10", { size: 38, font: "title", fill: "#2a8f86" });
    i += text(0, -48, "CLOSED SUNDAYS", { size: 13, font: "title", fill: INK, ls: 1 });
    return T(x, y, s, i);
  };
  P.whiteboard = (x, y, w, h, title, lines, o = {}) => {
    let i = rect(x - 8, y - 8, w + 16, h + 16, "#a9b3c4", { sw: 3, r: 4 }) + rect(x, y, w, h, "#ffffff", { sw: 2 });
    i += text(x + w / 2, y + 36, title, { size: o.titleSize || 28, font: "title", fill: o.color || "#2a5a9a", ls: 1 });
    lines.forEach((l, k) => (i += text(x + 18, y + 74 + k * (o.lh || 32), l, { size: o.size || 23, font: "hand", anchor: "start", weight: 400, fill: k === (o.hi ?? -1) ? "#c9473c" : INK })));
    return i;
  };
  P.paper = (x, y, w, h, title, lines, o = {}) => {
    let i = `<g transform="rotate(${o.rot || 0} ${n(x + w / 2)} ${n(y + h / 2)})">${rect(x, y, w, h, o.bg || "#fffdf4", { sw: 2.6 })}`;
    if (title) i += text(x + w / 2, y + 30, title, { size: o.titleSize || 20, font: "title", fill: o.color || INK, ls: 1 });
    lines.forEach((l, k) => (i += text(x + 14, y + (title ? 60 : 30) + k * (o.lh || 24), l, { size: o.size || 17, font: "hand", anchor: "start", weight: 400 })));
    return i + `</g>`;
  };
  P.printer3d = (x, y, s, o = {}) =>
    T(x, y, s, `${rect(-70, -150, 140, 150, "#3a3f5a", { sw: 3, r: 6 })}${rect(-58, -138, 116, 108, "#cfe6f2", { sw: 2 })}${rect(-50, -40, 100, 10, "#5a5a6e", { sw: 2 })}${line(-50, -120, 50, -120, { sw: 4, stroke: "#8a8a98" })}${rect(-10, -126, 20, 18, "#f0b429", { sw: 2 })}${line(0, -108, 0, -70, { sw: 2, stroke: "#c9473c" })}${path("M-16 -40 L0 -70 L16 -40 Z", "#c9473c", { sw: 2 })}${frect(-60, -20, 40, 12, "#7fd3ff")}`);
  P.foamCannon = (x, y, s, o = {}) => T(x, y, s, `${rect(-20, -60, 40, 60, "#2f8fd0", { sw: 2.6, r: 8 })}${rect(-6, -80, 12, 22, "#3a3a4a", { sw: 2 })}${rect(-30, -90, 60, 14, "#3a3a4a", { sw: 2, r: 4 })}${text(0, -26, "FOAM", { size: 12, font: "title", fill: "#fff" })}`);
  P.receipt = (x, y, s, lines, total) => {
    let i = path("M-60 -150 L60 -150 L60 130 L50 140 L40 130 L30 140 L20 130 L10 140 L0 130 L-10 140 L-20 130 L-30 140 L-40 130 L-50 140 L-60 130 Z", "#ffffff", { sw: 2.4 });
    i += text(0, -124, "HARDWARE HUT", { size: 15, font: "title", ls: 1 });
    lines.forEach(([a, b], k) => (i += text(-50, -92 + k * 22, a, { size: 13, anchor: "start", weight: 400 }) + text(50, -92 + k * 22, b, { size: 13, anchor: "end", weight: 400 })));
    i += line(-50, 70, 50, 70, { sw: 1.6, dash: "4 3" }) + text(-50, 96, "TOTAL", { size: 16, font: "title", anchor: "start" }) + text(50, 96, total, { size: 16, font: "title", anchor: "end", fill: "#2a9d5a" });
    return T(x, y, s, i);
  };
  P.templeFrame = (x, y, w, h) => {
    let i = rect(x, y, w, h, "#b5843c", { sw: 3 }) + rect(x + 8, y + 8, w - 16, h - 16, "#cfe6f2", { sw: 1.6 });
    const cx = x + w / 2,
      by = y + h - 18;
    i += frect(x + 8, by - 6, w - 16, 12, "#7cc35a");
    i += rect(cx - w * 0.28, by - h * 0.32, w * 0.56, h * 0.32, "#f6f3ea", { sw: 1.6 });
    i += rect(cx - w * 0.08, by - h * 0.55, w * 0.16, h * 0.24, "#f6f3ea", { sw: 1.6 });
    i += path(`M${n(cx - w * 0.06)} ${n(by - h * 0.55)} L${n(cx)} ${n(by - h * 0.74)} L${n(cx + w * 0.06)} ${n(by - h * 0.55)} Z`, "#f6f3ea", { sw: 1.6 });
    i += fcircle(cx, by - h * 0.77, Math.max(2, w * 0.022), "#e2b955");
    [-0.2, -0.07, 0.07, 0.2].forEach((d) => (i += frect(cx + w * d - 3, by - h * 0.25, 6, h * 0.12, "#9fc3e6")));
    return i;
  };
  P.hymnBoard = (x, y, nums) => {
    let i = rect(x, y, 90, 40 + nums.length * 34, "#8a5a3c", { sw: 3, r: 4 });
    i += text(x + 45, y + 26, "HYMNS", { size: 15, font: "title", fill: "#f6efe0", ls: 1 });
    nums.forEach((v, k) => (i += rect(x + 12, y + 36 + k * 34, 66, 28, "#f6efe0", { sw: 1.6 }) + text(x + 45, y + 57 + k * 34, String(v), { size: 20, font: "title" })));
    return i;
  };

  // ---------- places ----------
  function rig(o, w, h) {
    const k = o.k || 1,
      gy = o.gy != null ? o.gy : h * 0.86,
      ox = o.ox != null ? o.ox : w / 2;
    return { k, gy, ox, X: (rx) => ox + rx * k, Y: (ry) => gy + ry * k };
  }
  // driveway in front of the family garage
  S.driveway = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    const time = o.time || "day";
    let s = S.sky(w, gy, time);
    if (time === "day") s += P.sun(X(500), Y(-560), 40 * k) + P.cloud(X(-200), Y(-560), k) + P.cloud(X(300), Y(-600), 0.7 * k);
    if (time === "sunset") s += P.sun(X(420), Y(-200), 70 * k);
    s += `<path d="M0 ${n(gy - 130 * k)} L${n(w * 0.2)} ${n(gy - 170 * k)} L${n(w * 0.45)} ${n(gy - 120 * k)} L${n(w * 0.7)} ${n(gy - 160 * k)} L${n(w)} ${n(gy - 125 * k)} L${n(w)} ${n(gy)} L0 ${n(gy)} Z" fill="${time === "sunset" ? "#c96a6a" : "#9fc6a5"}" opacity=".7"/>`;
    // house + garage
    const hx = X(o.houseX ?? -760);
    s += rect(hx, Y(-360), 560 * k, 360 * k, "url(#siding)", { sw: 3 });
    s += path(`M${n(hx - 30 * k)} ${n(Y(-360))} L${n(hx + 280 * k)} ${n(Y(-520))} L${n(hx + 590 * k)} ${n(Y(-360))} Z`, "#5a4a6a", { sw: 3 });
    s += rect(hx + 250 * k, Y(-300), 280 * k, 300 * k, "#3a3f4f", { sw: 3 });
    for (let i = 0; i < 4; i++) s += rect(hx + 250 * k, Y(-300 + i * 40), 280 * k, 40 * k, "#e9e4da", { sw: 2 });
    s += P.window(hx + 40 * k, Y(-300), 150 * k, 120 * k, { time });
    s += frect(0, gy, w, h - gy, "#69a94f") + `<rect x="0" y="${n(gy)}" width="${n(w)}" height="${n(h - gy)}" fill="url(#grass)"/>`;
    s += path(`M${n(hx + 230 * k)} ${n(gy)} L${n(hx + 550 * k)} ${n(gy)} L${n(hx + 760 * k + (o.drivewayWide || 600) * k)} ${n(h + 4)} L${n(hx + 120 * k)} ${n(h + 4)} Z`, "#c9c3b5", { sw: 2.6 });
    s += line(0, gy, w, gy, { sw: 3 });
    if (o.wet) s += fellipse(X(o.puddle ?? 0), Y(60), 260 * k, 22 * k, "#9fd0e6", 0.6);
    if (time === "sunset") s += `<rect width="${n(w)}" height="${n(h)}" fill="#ff9a5a" opacity=".12"/>`;
    return s;
  };
  // the ward meetinghouse from outside
  S.meetinghouse = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = S.sky(w, gy, o.time || "day") + P.cloud(X(-320), Y(-560), k);
    s += rect(X(-420), Y(-280), 840 * k, 280 * k, "url(#brick)", { sw: 3 });
    s += path(`M${n(X(-440))} ${n(Y(-280))} L${n(X(0))} ${n(Y(-380))} L${n(X(440))} ${n(Y(-280))} Z`, "#4a4f5e", { sw: 3 });
    s += rect(X(-40), Y(-520), 80 * k, 160 * k, "#f6f3ea", { sw: 3 }) + path(`M${n(X(-40))} ${n(Y(-520))} L${n(X(0))} ${n(Y(-660))} L${n(X(40))} ${n(Y(-520))} Z`, "#f6f3ea", { sw: 3 });
    [-330, -200, 130, 260].forEach((rx) => (s += rect(X(rx), Y(-230), 70 * k, 120 * k, "#cfe6f2", { sw: 2.6 }) + line(X(rx + 35), Y(-230), X(rx + 35), Y(-110), { sw: 2, stroke: "#f6f3ea" })));
    s += rect(X(-70), Y(-200), 140 * k, 200 * k, "#f6f3ea", { sw: 3 }) + rect(X(-60), Y(-190), 58 * k, 190 * k, "#8a5a3c", { sw: 2 }) + rect(X(2), Y(-190), 58 * k, 190 * k, "#8a5a3c", { sw: 2 });
    s += frect(0, gy, w, h - gy, "#69a94f") + `<rect x="0" y="${n(gy)}" width="${n(w)}" height="${n(h - gy)}" fill="url(#grass)"/>`;
    s += frect(0, Y(40), w, h, "#6a6f7a") + line(0, Y(40), w, Y(40), { sw: 3 });
    for (let x = X(-1000); x < w; x += 160 * k) s += line(x, Y(60), x + 30 * k, h, { sw: 3, stroke: "#f6f3ea" });
    // sign
    const sx = X(o.signX ?? 470);
    s += rect(sx - 10 * k, Y(-120), 20 * k, 120 * k, "#8a8a92", { sw: 2.4 }) + rect(sx - 150 * k, Y(-230), 300 * k, 120 * k, "#f6f3ea", { sw: 3, r: 4 });
    s += text(sx, Y(-200), "THE CHURCH OF", { size: 15 * k, font: "verse", italic: false, weight: 500 }) + text(sx, Y(-176), "JESUS CHRIST", { size: 22 * k, font: "verse", weight: 500 }) + text(sx, Y(-152), "OF LATTER-DAY SAINTS", { size: 14 * k, font: "verse", weight: 500 }) + text(sx, Y(-126), "Visitors Welcome", { size: 12 * k, font: "verse", italic: true });
    return s;
  };
  // inside the chapel: pulpit, organ pipes, hymn board, sacrament table — no cross
  S.chapel = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = frect(0, 0, w, gy, "#efe6d4") + frect(0, gy - 110 * k, w, 110 * k, "#b07a4a") + line(0, gy - 110 * k, w, gy - 110 * k, { sw: 2.4 });
    for (let x = X(-2000); x < w; x += 80 * k) s += line(x, gy - 110 * k, x, gy, { sw: 1.4, stroke: "#8a5a3c" });
    s += frect(0, gy, w, h - gy, "#7a8fb3");
    // windows along the walls
    [-620, 520].forEach((rx) => (s += rect(X(rx), Y(-480), 110 * k, 260 * k, "#e8f2f6", { sw: 3 }) + line(X(rx + 55), Y(-480), X(rx + 55), Y(-220), { sw: 2, stroke: "#c9d3e0" })));
    // organ pipes
    for (let i = 0; i < 13; i++) {
      const ph = (160 + Math.abs(6 - i) * -14 + 60) * k;
      s += rect(X(-220 + i * 34), Y(-260) - ph, 22 * k, ph, "#d9b46a", { sw: 2 });
    }
    // rostrum + pulpit
    s += rect(X(-380), Y(-260), 760 * k, 120 * k, "#9a6a40", { sw: 3 }) + line(X(-380), Y(-230), X(380), Y(-230), { sw: 2, stroke: "#7a5233" });
    s += path(`M${n(X(-50))} ${n(Y(-260))} L${n(X(50))} ${n(Y(-260))} L${n(X(40))} ${n(Y(-380))} L${n(X(-40))} ${n(Y(-380))} Z`, "#8a5a3c", { sw: 3 }) + rect(X(-56), Y(-394), 112 * k, 16 * k, "#6e452d", { sw: 3 });
    s += line(X(10), Y(-394), X(26), Y(-430), { sw: 2.4 }) + circle(X(28), Y(-434), 5 * k, "#5a5a6e", { sw: 1.6 });
    if (o.hymns !== false) s += P.hymnBoard(X(-520), Y(-470), o.hymns || [2, 169, 193]);
    // sacrament table with white cloth
    if (o.table !== false) {
      const tx = X(o.tableX ?? 300);
      s += rect(tx - 90 * k, Y(-190), 180 * k, 90 * k, "#8a5a3c", { sw: 3 });
      s += path(`M${n(tx - 96 * k)} ${n(Y(-196))} L${n(tx + 96 * k)} ${n(Y(-196))} L${n(tx + 92 * k)} ${n(Y(-140))} Q${n(tx)} ${n(Y(-128))} ${n(tx - 92 * k)} ${n(Y(-140))} Z`, "#ffffff", { sw: 2.6 });
      s += path(`M${n(tx - 60 * k)} ${n(Y(-196))} Q${n(tx)} ${n(Y(-236))} ${n(tx + 60 * k)} ${n(Y(-196))}`, "#ffffff", { sw: 2.2 });
    }
    if (o.light) s += `<rect width="${n(w)}" height="${n(h)}" fill="#fff3c8" opacity=".12"/>`;
    return s;
  };
  // church hallway / foyer
  S.foyer = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = S.walls(w, h, gy, "#e9e1d0", "#8a7a6a", { stripe: true });
    s += P.templeFrame(X(-180), Y(-420), 200 * k, 160 * k);
    s += rect(X(120), Y(-400), 220 * k, 150 * k, "#c9a77a", { sw: 3 }) + rect(X(130), Y(-390), 200 * k, 130 * k, "#fffaf0", { sw: 1.6 });
    s += text(X(230), Y(-366), "WARD NEWS", { size: 18 * k, font: "title", ls: 1 });
    [0, 1, 2].forEach((i) => (s += rect(X(145 + i * 62), Y(-350), 50 * k, 70 * k, ["#fff6a8", "#bfe8ff", "#ffd1dc"][i], { sw: 1.4 })));
    s += P.couch(X(-420), Y(0), k * 0.75, { color: "#7a8f6a" });
    return s;
  };
  // hardware store aisle
  S.store = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = frect(0, 0, w, gy, "#e9edf2") + frect(0, gy, w, h - gy, "#c9c3b5") + line(0, gy, w, gy, { sw: 3 });
    s += rect(0, 20, w, 50, "#e07a2e", { sw: 3 }) + text(w / 2, 56, o.sign || "CAR CARE  •  CLEANING  •  BUCKETS", { size: 28, font: "title", fill: "#ffffff", ls: 2 });
    const cols = ["#4f86c6", "#f4d03f", "#e8536b", "#7cc35a", "#ffffff", "#2f8fd0", "#f08a3c"];
    const r = C.rng(5);
    for (let row = 0; row < 3; row++) {
      const sy = 120 + row * ((gy - 160) / 3);
      s += rect(-10, sy + (gy - 160) / 3 - 14, w + 20, 14, "#8a8a92", { sw: 2.4 });
      for (let x = 10; x < w - 30; x += 34 + r() * 10) {
        const bh = 40 + r() * 40;
        s += rect(x, sy + (gy - 160) / 3 - 14 - bh, 28, bh, cols[Math.floor(r() * cols.length)], { sw: 2, r: 4 });
      }
    }
    return s;
  };
})();
