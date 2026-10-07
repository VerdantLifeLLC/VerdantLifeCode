/* Lexington: The Turnaround — backgrounds.
   Every room has fixed "room coordinates" (origin = centre of the back wall at
   floor level, same scale as the characters). A panel frames part of a room with
   { k: scale, gy: floor line in panel px, ox: panel x of the room origin }. */
(function () {
  "use strict";
  const C = window.Comic;
  const { n, rect, frect, path, line, circle, ellipse, text, fcircle, fellipse, shade, INK } = C;
  const P = C.prop,
    fx = C.fx;
  const S = (C.scene = {});

  // place helper: room coords -> panel coords
  function rig(o, w, h) {
    const k = o.k || 1,
      gy = o.gy != null ? o.gy : h * 0.86,
      ox = o.ox != null ? o.ox : w / 2;
    return { k, gy, ox, X: (rx) => ox + rx * k, Y: (ry) => gy + ry * k };
  }

  function walls(w, h, gy, wall, floor, o = {}) {
    let s = frect(0, 0, w, gy, wall);
    if (o.wallPattern) s += `<rect x="0" y="0" width="${n(w)}" height="${n(gy)}" fill="${o.wallPattern}"/>`;
    if (o.stripe) s += frect(0, gy * 0.55, w, 6, shade(wall, -0.08));
    s += frect(0, gy, w, h - gy, floor);
    s += frect(0, gy - 8, w, 10, o.base || shade(wall, -0.25)) + line(0, gy - 8, w, gy - 8, { sw: 2 }) + line(0, gy + 2, w, gy + 2, { sw: 2.4 });
    return s;
  }
  S.walls = walls;

  function nightShade(w, h, op) {
    return `<rect x="0" y="0" width="${n(w)}" height="${n(h)}" fill="#141a44" opacity="${op || 0.55}"/>`;
  }
  S.night = nightShade;

  S.color = (w, h, c, pattern) => frect(0, 0, w, h, c) + (pattern ? `<rect width="${n(w)}" height="${n(h)}" fill="url(#${pattern})"/>` : "");
  S.burst = (w, h, c1, c2, cx, cy) => frect(0, 0, w, h, c1) + fx.focus(w, h, cx ?? w / 2, cy ?? h / 2, c2, 70, Math.min(w, h) * 0.18);
  S.rays = (w, h, c1, c2, cx, cy) => frect(0, 0, w, h, c1) + fx.rays(cx ?? w / 2, cy ?? h / 2, Math.hypot(w, h), c2, 22, 0.55);
  S.sky = (w, h, time) => {
    const id = { day: "skyDay", night: "skyNight", dusk: "skyDusk", dawn: "skyDawn", sunset: "skySunset" }[time || "day"];
    return `<rect width="${n(w)}" height="${n(h)}" fill="url(#${id})"/>`;
  };

  // ---------- bedroom ----------
  S.bedroom = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    const messy = !!o.messy;
    let s = walls(w, h, gy, messy ? "#a9b4c9" : "#b8d7d0", messy ? "#7d7f99" : "url(#carpet)", { stripe: true });
    if (!messy) s += frect(0, gy, w, h - gy, "#7d8fb3") + `<rect x="0" y="${n(gy)}" width="${n(w)}" height="${n(h - gy)}" fill="url(#carpet)"/>`;
    // door
    s += P.door(X(-600), Y(-270), 120 * k, 270 * k, { color: "#b07a4a" });
    // window
    s += P.window(X(-85), Y(-345), 170 * k, 170 * k, { time: o.time || "day", curtains: messy ? "#7a6a9a" : "#e8c35a" });
    // posters
    s += P.poster(X(-270), Y(-330), 80 * k, 110 * k, "robot", messy ? -6 : 0);
    s += P.poster(X(150), Y(-335), 84 * k, 112 * k, messy ? "game" : "verse", messy ? 5 : 0);
    // desk area
    s += P.shelf(X(-470), Y(-300), 230 * k, { messy, trophy: !messy, seed: 8 });
    s += P.desk(X(-360), Y(0), k);
    s += P.monitor(X(-385), Y(-112), k, o.monitor || { code: !messy, game: messy });
    s += P.lamp(X(-285), Y(-112), k, { on: o.time === "night" || o.lamp });
    if (!o.noChair) s += P.chair(X(-330), Y(4), k, { color: "#c9473c" });
    if (!messy && o.goalBoard) s += P.goalBoard(X(270), Y(-360), 190 * k, 200 * k, { goals: o.goalBoard });
    // bed
    if (!o.noBed) s += P.bed(X(400), Y(0), k, { messy, blanket: "#3f6fb5" });
    if (o.robot) s += P.robot(X(-140), Y(2), k * 0.9, { sparks: o.robotSparks });
    if (messy) {
      s += P.clothesPile(X(-60), Y(10), k);
      s += P.clothesPile(X(170), Y(16), k * 0.8, { colors: ["#5b7fb5", "#ffffff", "#c9473c", "#f4c542", "#7cc35a"] });
      s += P.pizzaBox(X(-230), Y(18), k);
      s += P.can(X(60), Y(24), k, 80) + P.can(X(250), Y(8), k, 0) + P.can(X(-280), Y(-112), k, 0);
      s += P.sock(X(-300), Y(-130), k, 160) + P.sock(X(110), Y(30), k, -70);
      s += P.plateMold(X(300), Y(20), k);
      if (o.flies !== false) s += fx.flies(X(-40), Y(-120), k, 3);
    } else {
      s += P.plant(X(-130), Y(4), k * 0.9);
      s += `<ellipse cx="${n(X(60))}" cy="${n(Y(40))}" rx="${n(150 * k)}" ry="${n(22 * k)}" fill="#e09a3e" stroke="${INK}" stroke-width="2.6"/>`;
    }
    if (o.time === "night") {
      s += nightShade(w, h, 0.5);
      // moonbeam from the window
      s += `<path d="M${n(X(-85))} ${n(Y(-345))} L${n(X(85))} ${n(Y(-345))} L${n(X(260))} ${n(Y(60))} L${n(X(-40))} ${n(Y(60))} Z" fill="#cfe0ff" opacity=".18"/>`;
    }
    return s;
  };

  // ---------- bathroom ----------
  S.bathroom = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = frect(0, 0, w, gy, "#dff0f3") + `<rect width="${n(w)}" height="${n(gy)}" fill="url(#tiles)"/>`;
    s += frect(0, gy, w, h - gy, "#c9d3e0") + line(0, gy, w, gy, { sw: 3 });
    for (let x = 0; x < w; x += 46 * k) s += line(x, gy, x - 40 * k, h, { sw: 1.4, stroke: "#a9b3c4" });
    s += P.mirror(X(-95), Y(-360), 190 * k, 150 * k);
    if (o.reflect) s += `<g clip-path="none">${o.reflect}</g>`;
    s += P.sink(X(0), Y(0), k, { running: o.running });
    s += P.showerCurtain(X(170), Y(-380), 260 * k, 380 * k, { color: "#8fd0c9", ducks: true });
    s += P.toilet(X(-300), Y(0), k);
    s += P.tp(X(-200), Y(-120), k);
    s += P.towelRack(X(-470), Y(-260), 90 * k, "#f4c542");
    if (o.checklist) {
      s += rect(X(-470), Y(-420), 140 * k, 120 * k, "#fff8b8", { sw: 2.4 });
    }
    if (o.steam) s += `<rect width="${n(w)}" height="${n(h)}" fill="#ffffff" opacity=".22"/>` + fx.steam(X(300), Y(-380), k * 1.4);
    return s;
  };

  // ---------- kitchen ----------
  S.kitchen = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = walls(w, h, gy, "#f3dfb5", "url(#planks)", { stripe: false });
    s += `<rect x="0" y="${n(gy)}" width="${n(w)}" height="${n(h - gy)}" fill="#b9814f"/><rect x="0" y="${n(gy)}" width="${n(w)}" height="${n(h - gy)}" fill="url(#planks)"/>`;
    s += P.cabinets(X(-560), Y(-380), 470 * k, 110 * k, { color: "#5f8f8a" });
    s += P.window(X(-410), Y(-250), 160 * k, 110 * k, { time: o.time === "night" ? "night" : "day", curtains: null });
    s += P.counter(X(-560), Y(-120), 470 * k, { color: "#5f8f8a" });
    s += `<g transform="translate(${n(X(-330))} ${n(Y(-120))}) scale(${n(k)})">${ellipse(0, 4, 50, 8, "#c9d3e0", { sw: 2.4 })}${path("M-6 0 L-6 -24 Q-6 -32 6 -32 L20 -32 L20 -24 L8 -24 L8 0", "#c9d3e0", { sw: 2.4 })}</g>`;
    s += P.fridge(X(20), Y(0), k);
    if (o.chart) s += P.choreChart(X(110), Y(-330), 170 * k, 140 * k, o.chart);
    s += P.frame(X(320), Y(-330), 120 * k, 90 * k, "verse");
    if (o.dishes) s += C.held.dishes(X(-480), Y(-124), k) + C.held.plate(X(-200), Y(-124), k);
    if (o.table !== false) s += P.table(X(o.tableX ?? 260), Y(0), k, { cloth: "#e8536b" });
    if (o.time === "night") s += nightShade(w, h, 0.42) + `<ellipse cx="${n(X(260))}" cy="${n(Y(-230))}" rx="${n(260 * k)}" ry="${n(200 * k)}" fill="url(#lampGlow)" opacity=".7"/>` + line(X(260), 0, X(260), Y(-330), { sw: 2 }) + path(`M${n(X(220))} ${n(Y(-330))} L${n(X(300))} ${n(Y(-330))} L${n(X(280))} ${n(Y(-370))} L${n(X(240))} ${n(Y(-370))} Z`, "#f4c542", { sw: 2.4 });
    return s;
  };

  // ---------- living room ----------
  S.living = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = walls(w, h, gy, o.wall || "#e6c9a8", "#b9814f", { stripe: true });
    s += `<rect x="0" y="${n(gy)}" width="${n(w)}" height="${n(h - gy)}" fill="url(#planks)"/>`;
    s += `<ellipse cx="${n(X(0))}" cy="${n(Y(40))}" rx="${n(300 * k)}" ry="${n(34 * k)}" fill="#c9473c" stroke="${INK}" stroke-width="2.6"/>`;
    s += P.frame(X(-140), Y(-360), 90 * k, 70 * k, "family") + P.frame(X(-20), Y(-380), 60 * k, 90 * k, "cross") + P.frame(X(70), Y(-355), 80 * k, 60 * k, "family");
    s += P.window(X(300), Y(-330), 150 * k, 170 * k, { time: o.time || "day", curtains: "#e8c35a" });
    s += P.floorLamp(X(-250), Y(0), k, { on: o.time === "night" });
    if (o.couch !== false) s += P.couch(X(0), Y(0), k, { color: "#6f8fd6", pillow: true });
    if (o.tvGlow) s += `<rect width="${n(w)}" height="${n(h)}" fill="#2a3a7a" opacity=".38"/><ellipse cx="${n(o.tvGlow[0])}" cy="${n(o.tvGlow[1])}" rx="${n(w * 0.55)}" ry="${n(h * 0.5)}" fill="url(#screenGlow)" opacity=".55"/>`;
    if (o.time === "night" && !o.tvGlow) s += nightShade(w, h, 0.4);
    return s;
  };

  // ---------- hallway / stairs ----------
  S.hall = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = walls(w, h, gy, "#d8c8e6", "#b9814f", { stripe: true });
    s += `<rect x="0" y="${n(gy)}" width="${n(w)}" height="${n(h - gy)}" fill="url(#planks)"/>`;
    s += P.frame(X(-260), Y(-330), 80 * k, 100 * k, "family") + P.frame(X(-150), Y(-310), 60 * k, 80 * k, "cross");
    s += P.stairs(X(-40), Y(0), 420 * k, 400 * k, { steps: 9 });
    if (o.door) s += P.door(X(-460), Y(-270), 120 * k, 270 * k, { color: "#c9473c" });
    if (o.time === "night") s += nightShade(w, h, 0.45);
    return s;
  };

  // ---------- church ----------
  S.church = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = walls(w, h, gy, "#efe2c8", "#9a3a3a", { stripe: false, base: "#8a5a3c" });
    s += frect(0, gy - 140 * k, w, 140 * k, "#c9a77a") + line(0, gy - 140 * k, w, gy - 140 * k, { sw: 2.6 });
    for (let x = X(-1200); x < w; x += 70 * k) s += line(x, gy - 140 * k, x, gy - 8, { sw: 1.6, stroke: "#a8865a" });
    [-430, -230, 230, 430].forEach((rx) => (s += P.stainedGlass(X(rx - 55), Y(-470), 110 * k, 260 * k)));
    s += `<ellipse cx="${n(X(0))}" cy="${n(Y(-320))}" rx="${n(200 * k)}" ry="${n(200 * k)}" fill="url(#glow)" opacity=".7"/>`;
    s += P.cross(X(0), Y(-180), k * 1.15, "#8a5a3c");
    if (o.pulpit !== false) s += P.pulpit(X(o.pulpitX ?? 0), Y(0), k);
    if (o.light) s += `<rect width="${n(w)}" height="${n(h)}" fill="#fff3c8" opacity=".14"/>`;
    return s;
  };
  S.pews = (w, h, o = {}) => {
    // rows of pews filling the panel bottom (for congregation shots); returns front layer only
    const { k, gy, X } = rig(o, w, h);
    return P.pew(X(-700), gy, 1400 * k, { bible: true });
  };

  // ---------- school ----------
  S.school = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = walls(w, h, gy, "#cfe3c9", "#c9b48a", { stripe: true });
    s += rect(X(-330), Y(-380), 560 * k, 220 * k, "#2f5a46", { sw: 6, r: 4 });
    s += rect(X(-330), Y(-165), 560 * k, 10 * k, "#b07a4a", { sw: 2 });
    const eq = o.board || ["x² + 5x + 6 = 0", "(x + 2)(x + 3) = 0", "x = -2, -3  ✓"];
    eq.forEach((t, i) => (s += text(X(-300), Y(-330 + i * 52), t, { size: 32 * k, font: "hand", anchor: "start", fill: "#f6f6ee", weight: 400 })));
    s += rect(X(270), Y(-360), 90 * k, 110 * k, "#ffffff", { sw: 2.4 }) + text(X(315), Y(-320), "A+", { size: 40 * k, font: "title", fill: "#c9473c" }) + text(X(315), Y(-280), "WALL", { size: 14 * k, font: "title" });
    s += circle(X(420), Y(-390), 26 * k, "#ffffff", { sw: 3 }) + line(X(420), Y(-390), X(420), Y(-406), { sw: 2.4 }) + line(X(420), Y(-390), X(432), Y(-384), { sw: 2.4 });
    return s;
  };
  S.schoolDesk = (x, y, k) =>
    `<g transform="translate(${n(x)} ${n(y)}) scale(${n(k)})">${rect(-90, -110, 180, 14, "#c9a77a", { sw: 3, r: 3 })}${line(-70, -96, -70, 0, { sw: 6 })}${line(70, -96, 70, 0, { sw: 6 })}${rect(-80, -96, 160, 18, "#9aa3b5", { sw: 2.4 })}</g>`;

  // ---------- exterior ----------
  S.yard = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    const time = o.time || "day";
    let s = S.sky(w, gy, time);
    if (time === "day") s += P.sun(X(420), Y(-470), 40 * k) + P.cloud(X(-300), Y(-480), k) + P.cloud(X(150), Y(-520), k * 0.7);
    if (time === "sunset") s += P.sun(X(380), Y(-160), 70 * k);
    if (time === "night") [[0.1, 0.1], [0.3, 0.25], [0.6, 0.12], [0.85, 0.3], [0.45, 0.4]].forEach(([a, b]) => (s += fx.sparkle(w * a, gy * b, 6, "#fff8dc")));
    // distant houses
    s += `<path d="M0 ${n(gy - 120 * k)} L${n(w * 0.15)} ${n(gy - 160 * k)} L${n(w * 0.3)} ${n(gy - 120 * k)} L${n(w * 0.5)} ${n(gy - 150 * k)} L${n(w * 0.75)} ${n(gy - 110 * k)} L${n(w)} ${n(gy - 140 * k)} L${n(w)} ${n(gy)} L0 ${n(gy)} Z" fill="${time === "night" ? "#1d2350" : time === "sunset" ? "#c96a6a" : "#9fc6a5"}" opacity=".7"/>`;
    s += frect(0, gy, w, h - gy, "#69a94f") + `<rect x="0" y="${n(gy)}" width="${n(w)}" height="${n(h - gy)}" fill="url(#grass)"/>` + line(0, gy, w, gy, { sw: 3 });
    if (o.house !== false) s += P.house(X(o.houseX ?? -380), Y(0), 380 * k, 300 * k, { lit: time !== "day" });
    if (o.fence) s += P.fence(X(o.fence[0]), Y(0), o.fence[1] * k, 70 * k);
    if (o.tree) s += P.tree(X(o.tree), Y(0), k);
    if (o.sidewalk) s += frect(0, Y(30), w, 40 * k, "#c9c3b5") + line(0, Y(30), w, Y(30), { sw: 2.4 }) + line(0, Y(70), w, Y(70), { sw: 2.4 });
    if (time === "night") s += nightShade(w, h, 0.45);
    if (time === "sunset") s += `<rect width="${n(w)}" height="${n(h)}" fill="#ff9a5a" opacity=".12"/>`;
    return s;
  };
  S.porch = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    const time = o.time || "sunset";
    let s = S.sky(w, h, time);
    if (time === "sunset") s += P.sun(X(o.sunX ?? 300), Y(-120), 80 * k);
    s += `<path d="M0 ${n(gy - 90 * k)} L${n(w * 0.2)} ${n(gy - 120 * k)} L${n(w * 0.45)} ${n(gy - 95 * k)} L${n(w * 0.7)} ${n(gy - 130 * k)} L${n(w)} ${n(gy - 100 * k)} L${n(w)} ${n(gy)} L0 ${n(gy)} Z" fill="#b8607a" opacity=".55"/>`;
    s += frect(0, gy, w, h - gy, "#b8a38a") + line(0, gy, w, gy, { sw: 3 });
    for (let x = 0; x < w; x += 60 * k) s += line(x, gy, x, h, { sw: 1.6, stroke: "#9a8670" });
    // porch posts + rail
    s += rect(X(-520), Y(-420), 24 * k, 420 * k, "#f6f1e6", { sw: 3 }) + rect(X(500), Y(-420), 24 * k, 420 * k, "#f6f1e6", { sw: 3 });
    s += rect(0, Y(-430), w, 20 * k, "#f6f1e6", { sw: 3 });
    return s;
  };

  // ---------- garage workshop ----------
  S.garage = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = walls(w, h, gy, "#c7c9cf", "#a9a39a", { stripe: false, base: "#8a8a92" });
    for (let y = 30; y < gy; y += 40 * k) s += line(0, y, w, y, { sw: 1.2, stroke: "#b3b5bc" });
    s += P.pegboard(X(-500), Y(-400), 300 * k, 200 * k);
    s += P.workbench(X(-520), Y(0), 340 * k);
    s += P.shelf(X(140), Y(-360), 220 * k, { seed: 3, books: 0 });
    // supply bottles on shelf
    ["#4fb3e8", "#7cc35a", "#e8536b", "#f4c542"].forEach((c, i) => (s += rect(X(155 + i * 50), Y(-404), 30 * k, 44 * k, c, { sw: 2.2, r: 5 })));
    if (!o.noSign) s += P.sign(X(-130), Y(-470), 300 * k, 90 * k, o.signTitle || "LEXINGTON ENTERPRISES", o.signSub || "Sneakers • Bikes • Done Right", { size: 26 * k, color: "#2a8f86" });
    if (o.open) s += P.sign(X(200), Y(-260), 120 * k, 50 * k, "OPEN", null, { bg: "#c9473c", color: "#ffffff", size: 30 * k });
    if (o.display) {
      s += P.shelf(X(140), Y(-210), 230 * k, { books: 0 });
      s += C.held.sneakerDirty(X(180), Y(-220), k * 0.9, 1) + C.held.sneaker(X(320), Y(-220), k * 0.9, 1) + text(X(180), Y(-180), "BEFORE", { size: 14 * k, font: "title" }) + text(X(320), Y(-180), "AFTER", { size: 14 * k, font: "title", fill: "#2a8f86" }) + fx.sparkle(X(352), Y(-246), 9 * k);
    }
    return s;
  };

  S.bank = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = walls(w, h, gy, "#e8e4f0", "#c9c3b5", { stripe: true, base: "#7a5a8a" });
    s += P.sign(X(-260), Y(-460), 520 * k, 80 * k, "FIRST HOMETOWN BANK", "Savings • Checking • Youth Accounts", { size: 30 * k, color: "#7a5a8a" });
    s += P.plant(X(-420), Y(0), k);
    return s;
  };

  S.expo = (w, h, o = {}) => {
    const { k, gy, X, Y } = rig(o, w, h);
    let s = walls(w, h, gy, "#2b3a73", "#3a3f5a", { stripe: false, base: "#1d2350" });
    s += fx.rays(X(0), Y(-500), Math.hypot(w, h), "#3a4a8a", 20, 0.6);
    s += rect(X(-380), Y(-470), 760 * k, 80 * k, "#f4c542", { sw: 3, r: 6 });
    s += text(X(0), Y(-418), "YOUTH BUSINESS EXPO", { size: 42 * k, font: "title", fill: "#c9473c", ls: 2 });
    [[-0.45, "#e8536b"], [0.45, "#4fb3e8"]].forEach(([fx2, c]) => (s += `<path d="M${n(X(fx2 * 900))} 0 L${n(X(fx2 * 900 - 60))} ${n(gy)} L${n(X(fx2 * 900 + 60))} ${n(gy)} Z" fill="${c}" opacity=".15"/>`));
    return s;
  };

  // crowd silhouettes along the bottom edge
  S.crowd = (w, h, y, o = {}) => {
    let s = "";
    const r = C.rng(o.seed || 12);
    const cols = o.colors || ["#2a2f45", "#3a3f5a", "#1f2338"];
    for (let x = -20; x < w + 40; x += 46 + r() * 20) {
      const hh = 30 + r() * 10;
      const c = cols[Math.floor(r() * cols.length)];
      s += `<ellipse cx="${n(x + 20)}" cy="${n(y + 40)}" rx="38" ry="40" fill="${c}"/><circle cx="${n(x + 20)}" cy="${n(y - hh * 0.2)}" r="${n(hh * 0.6)}" fill="${c}"/>`;
      if (o.clap && r() > 0.5) s += path(`M${n(x + 5)} ${n(y - 40)} l-6 -10 M${n(x + 20)} ${n(y - 46)} v-12 M${n(x + 35)} ${n(y - 40)} l6 -10`, "none", { sw: 2.4, stroke: "#f4c542" });
    }
    return s;
  };
})();
