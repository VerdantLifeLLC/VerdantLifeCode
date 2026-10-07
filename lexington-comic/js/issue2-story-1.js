/* Lexington Issue #2: Down to Business — script part 1: cover, crew, chapters 1–3. */
(function () {
  "use strict";
  const C = window.Comic;
  const { text, rect, frect, path, line, circle, fcircle, ellipse, fellipse, T, INK } = C;
  const S = C.scene,
    P = C.prop,
    H = C.held,
    fx = C.fx;
  const { say, shout, think, whisper, pray, cap, verse, note, sfx, top, page } = C.kit;
  const lex = C.lex,
    mom = C.mom,
    dad = C.dad,
    npc = C.npc,
    tony = C.tony,
    jon = C.jonathan,
    lexC = C.lexCrew,
    tonyC = C.tonyCrew;
  C.EXTRAS_LABEL = "Money Rules + Business Plan";
  const bubbles = (w, h, seed, count, maxR) => {
    const r = C.rng(seed || 4);
    let s = "";
    for (let i = 0; i < (count || 14); i++) {
      const x = r() * w,
        y = r() * h,
        rr = 6 + r() * (maxR || 22);
      s += circle(x, y, rr, "#ffffff", { sw: 2, op: 0.85 }) + path(`M${x - rr * 0.45} ${y - rr * 0.2} q${rr * 0.2} ${-rr * 0.35} ${rr * 0.5} ${-rr * 0.35}`, "none", { sw: 1.6, stroke: "#9fd8ff" });
    }
    return s;
  };
  C.bubbles = bubbles;

  // =====================================================================
  // COVER
  // =====================================================================
  page({
    alt: "Cover: Lexington Issue 2, Down to Business. Lexington, his best friend Jonathan and big brother Big Tony stand in Suds Brothers shirts in front of a sparkling car surrounded by soap bubbles.",
    noNumber: true,
    // o.insetX / o.insetY pull the corner badges in from the edges for print covers
    full(W, Hh, o = {}) {
      const ix = o.insetX || 0,
        iy = o.insetY || 0;
      let s = `<rect width="${W}" height="${Hh}" fill="url(#skyDay)"/>`;
      s += fx.rays(W * 0.5, Hh * 0.62, 1500, "#ffffff", 26, 0.35);
      s += bubbles(W, Hh * 0.75, 9, 30, 30);
      s += frect(0, Hh * 0.86, W, Hh * 0.14, "#c9c3b5") + line(0, Hh * 0.86, W, Hh * 0.86, { sw: 4 });
      s += P.car(W * 0.5, Hh * 0.87, 1.12, { color: "#c9473c", shine: true });
      s += jon({ x: W * 0.2, y: Hh * 0.985, s: 1.5, outfit: "crew", expr: "joy", pose: "holdOut", hold: { r: H.hose } });
      s += tonyC({ x: W * 0.8, y: Hh * 0.985, s: 1.32, f: -1, expr: "confident", pose: "holdBoth", hold: { c: H.clipboard } });
      s += lexC({ x: W * 0.5, y: Hh * 0.99, s: 1.62, expr: "confident", pose: "fistPump", hold: { l: H.vac } });
      s += P.dog(W * 0.65, Hh * 0.995, 1.05, { mood: "happy" }) + circle(W * 0.65 + 46, Hh * 0.995 - 100, 14, "#ffffff", { sw: 2 });
      const title = (y) =>
        text(W / 2 + 9, y + 10, "LEXINGTON", { size: 178, font: "title", fill: INK, stroke: INK, sw: 16, ls: 4 }) +
        text(W / 2, y, "LEXINGTON", { size: 178, font: "title", fill: "#d8402f", stroke: INK, sw: 12, ls: 4 }) +
        text(W / 2, y, "LEXINGTON", { size: 178, font: "title", fill: "#e65a45", ls: 4 });
      s += title(250);
      s += `<g transform="rotate(-3 ${W / 2} 320)"><rect x="${W / 2 - 260 + 7}" y="${288 + 7}" width="520" height="70" fill="${INK}"/><rect x="${W / 2 - 260}" y="288" width="520" height="70" fill="#ffd95e" stroke="${INK}" stroke-width="5"/>${text(W / 2, 340, "DOWN TO BUSINESS", { size: 52, font: "title", ls: 4 })}</g>`;
      s += C.mv(`<g transform="rotate(-10 104 96)">${circle(104, 96, 62, "#2a8f86", { sw: 5 })}${text(104, 86, "ISSUE", { size: 24, font: "title", fill: "#fff", ls: 2 })}${text(104, 126, "#2", { size: 44, font: "title", fill: "#ffd95e", stroke: INK, sw: 4 })}</g>`, ix, iy);
      s += C.mv(`<g transform="rotate(6 880 92)">${rect(790, 60, 180, 64, "#ffffff", { sw: 4, r: 8 })}${text(880, 88, "HARD WORK", { size: 22, font: "title", fill: "#c9473c", ls: 1 })}${text(880, 114, "& HONEST MONEY", { size: 22, font: "title", fill: "#2a8f86", ls: 1 })}</g>`, W - 1000 - ix, iy);
      s += `<g transform="rotate(-2 ${W / 2} 418)">${rect(W / 2 - 300 + 6, 386 + 6, 600, 64, INK, { sw: 0 })}${rect(W / 2 - 300, 386, 600, 64, "#ffffff", { sw: 4 })}${text(W / 2, 430, "THREE PARTNERS. ONE BUCKET. A LOT TO LEARN.", { size: 30, font: "title", ls: 1 })}</g>`;
      return s;
    },
  });

  // =====================================================================
  // MEET THE CREW
  // =====================================================================
  function card(x, y, w, h, o) {
    let s = `<rect x="${x + 7}" y="${y + 7}" width="${w}" height="${h}" rx="16" fill="${INK}"/>`;
    s += rect(x, y, w, h, "#ffffff", { sw: 5, r: 16 });
    s += `<path d="M${x} ${y + 16} Q${x} ${y} ${x + 16} ${y} L${x + w - 16} ${y} Q${x + w} ${y} ${x + w} ${y + 16} L${x + w} ${y + 58} L${x} ${y + 58} Z" fill="${o.color}" stroke="${INK}" stroke-width="5"/>`;
    s += text(x + 16, y + 43, o.name, { size: o.nameSize || 34, font: "title", anchor: "start", fill: "#ffffff", stroke: INK, sw: 6, ls: 1.2 });
    s += text(x + w - 14, y + 40, o.role, { size: 14, font: "title", anchor: "end", fill: o.roleColor || INK, ls: 0.6 });
    const ph = h * (o.ph || 0.5);
    s += `<svg x="${x + 14}" y="${y + 70}" width="${w - 28}" height="${ph}" viewBox="0 0 ${w - 28} ${ph}" overflow="hidden"><rect width="${w - 28}" height="${ph}" fill="${o.bg}"/><rect width="${w - 28}" height="${ph}" fill="url(#dots)"/>${o.art(w - 28, ph)}</svg>`;
    s += rect(x + 14, y + 70, w - 28, ph, "none", { sw: 3.5 });
    let ty = y + 70 + ph + 28;
    o.lines.forEach((l) => {
      s += text(x + 18, ty, l, { size: 16, anchor: "start" });
      ty += 21;
    });
    ty += 6;
    (o.stats || []).forEach(([label, val, col]) => {
      s += text(x + 18, ty + 12, label, { size: 13, font: "title", anchor: "start", ls: 0.8 });
      for (let i = 0; i < 10; i++) s += rect(x + 118 + i * ((w - 138) / 10), ty, (w - 138) / 10 - 3, 14, i < val ? col : "#ece6da", { sw: 1.8, r: 3 });
      ty += 23;
    });
    return s;
  }
  page({
    noNumber: true,
    alt: "Meet the crew: Lexington the builder, his best friend Jonathan the talker, and Big Tony the manager, plus Mom, Dad and Biscuit, drawn as trading cards.",
    full(W, Hh) {
      let s = `<rect width="${W}" height="${Hh}" fill="#4fb3e8"/><rect width="${W}" height="${Hh}" fill="url(#dotsWhite)"/>`;
      s += text(W / 2 + 6, 128, "MEET THE CREW", { size: 104, font: "title", fill: INK, stroke: INK, sw: 12, ls: 3 });
      s += text(W / 2, 122, "MEET THE CREW", { size: 104, font: "title", fill: "#ffd95e", stroke: INK, sw: 8, ls: 3 });
      const cw = 292;
      s += card(42, 160, cw, 660, {
        name: "LEXINGTON",
        nameSize: 30,
        role: "AGE 13",
        color: "#c9473c",
        bg: "#bfe0f0",
        art: (w, h) => lexC({ x: w / 2, y: h + 130, s: 1.15, expr: "grin", pose: "thumbs" }),
        lines: ["The Builder. Fixes anything.", "Can't stop inventing."],
        stats: [
          ["BRAINS", 10, "#2a8f86"],
          ["BUILDING", 10, "#2a8f86"],
          ["SALES", 3, "#c9473c"],
          ["SAVINGS", 1, "#c9473c"],
        ],
      });
      s += card(42 + cw + 20, 160, cw, 660, {
        name: "JONATHAN",
        nameSize: 30,
        role: "AGE 13",
        color: "#3f9b5a",
        bg: "#d9f2d0",
        art: (w, h) => jon({ x: w / 2, y: h + 130, s: 1.15, outfit: "crew", expr: "joy", pose: "wave" }),
        lines: ["The Talker. Best friend.", "Same ward. Same deacons quorum."],
        stats: [
          ["TALKING", 10, "#3f9b5a"],
          ["SMILES", 10, "#f0b429"],
          ["FOCUS", 4, "#c9473c"],
          ["ENERGY", 10, "#3f9b5a"],
        ],
      });
      s += card(42 + (cw + 20) * 2, 160, cw, 660, {
        name: "BIG TONY",
        role: "AGE 18",
        roleColor: "#f0b429",
        color: "#24345e",
        bg: "#e6e0f0",
        art: (w, h) => tonyC({ x: w / 2, y: h + 175, s: 1.0, expr: "confident", pose: "holdBoth", hold: { c: H.clipboard } }),
        lines: ["The Manager. High school senior.", "Has a driver's license."],
        stats: [
          ["LEADERSHIP", 9, "#24345e"],
          ["MONEY SENSE", 9, "#2a9d5a"],
          ["DRIVING", 8, "#f0b429"],
          ["PATIENCE", 5, "#c9473c"],
        ],
      });
      const sy = 846,
        sh = 520;
      s += card(42, sy, cw, sh, { name: "MOM", role: "HEART OF HOME", color: "#e09a3e", bg: "#ffe3c2", ph: 0.56, art: (w, h) => mom({ x: w / 2, y: h + 170, s: 0.95, expr: "happy", pose: "heart" }), lines: ["Leads Family Home Evening.", "Biggest cheerleader."] });
      s += card(42 + cw + 20, sy, cw, sh, { name: "DAD", role: "THE BANK OF DAD", color: "#3f6fb5", bg: "#d6e4f5", ph: 0.56, art: (w, h) => dad({ x: w / 2, y: h + 150, s: 0.92, expr: "smug", pose: "cross" }), lines: ["Loans money. Expects it back.", "Works hard for the family."] });
      s += card(42 + (cw + 20) * 2, sy, cw, sh, { name: "BISCUIT", role: "SECURITY", color: "#b5843c", bg: "#f6e6c8", ph: 0.56, art: (w, h) => P.dog(w / 2 - 8, h - 24, 1.7, { mood: "happy" }) + bubbles(w, h * 0.5, 2, 6, 14), lines: ["Chases bubbles. Never catches", "one. Never gives up."] });
      s += text(W / 2, 1420, "For every kid who wants to earn it,", { size: 24, font: "hand", fill: "#ffffff" });
      s += text(W / 2, 1452, "and for every parent who taught them how.", { size: 24, font: "hand", fill: "#ffffff" });
      return s;
    },
  });

  // =====================================================================
  // CHAPTER 1 — BIG DREAMS, EMPTY WALLET
  // =====================================================================
  page({
    chapter: { n: 1, title: "Big Dreams, Empty Wallet" },
    rows: [
      [0.42, [1]],
      [0.3, [0.5, 0.5]],
      [0.28, [1]],
    ],
    panels: [
      {
        alt: "On a shopping street, Lexington drools over a 3D printer in a tech shop window while Jonathan stares at a mountain bike next door.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#b5543f") + `<rect width="${w}" height="${h * 0.86}" fill="url(#brick)"/>`;
          const win = (x, label, color) => rect(x, 60, w * 0.42, h * 0.5, "#cfe6f2", { sw: 4 }) + rect(x - 10, 20, w * 0.42 + 20, 44, color, { sw: 3 }) + text(x + w * 0.21, 52, label, { size: 30, font: "title", fill: "#ffffff", ls: 2 }) + path(`M${x + 20} 80 L${x + 90} 70 M${x + 20} 110 L${x + 140} 90`, "none", { sw: 4, stroke: "#ffffff", op: 0.7 });
          s += win(w * 0.05, "TECH TOWN", "#2a5a9a") + win(w * 0.53, "BIKE BARN", "#3f9b5a");
          s += P.printer3d(w * 0.26, h * 0.5, 0.95) + P.sign(w * 0.33, h * 0.42, 80, 40, "$299", null, { bg: "#ffd95e", color: INK, size: 26 });
          s += P.bike(w * 0.74, h * 0.53, 1.0, { color: "#c9473c" }) + P.sign(w * 0.84, h * 0.2, 80, 40, "$350", null, { bg: "#ffd95e", color: INK, size: 26 });
          s += frect(0, h * 0.86, w, h * 0.14, "#c9c3b5") + line(0, h * 0.86, w, h * 0.86, { sw: 3 });
          s += lex({ x: w * 0.3, y: h + 110, s: 1.05, expr: "joy", pose: "heart" });
          s += jon({ x: w * 0.7, y: h + 110, s: 1.05, f: -1, expr: "joy", pose: "heart" });
          return s;
        },
        b: (w, h) => [
          cap("Lexington had turned his life around. He was still brilliant. Still building...", 16, h - 100, { w: 290 }),
          cap("...and now he had a brand-new problem.", w - 330, h - 66, { w: 310 }),
          say("A 3D printer. Do you know what I could BUILD?", w * 0.4, h * 0.36, top("teen", w * 0.3, h + 110, 1.05), { w: 160 }),
          say("Do you know what I could RIDE?", w * 0.6, h * 0.24, top("teen", w * 0.7, h + 110, 1.05), { w: 130 }),
        ],
      },
      {
        alt: "Lexington opens his wallet and a moth flutters out. Jonathan turns out his empty pockets.",
        art(w, h) {
          let s = S.burst(w, h, "#d6e4f5", "#ffffff", w * 0.5, h * 0.5);
          s += lex({ x: w * 0.3, y: h + 130, s: 1.15, expr: "blank", pose: "holdBoth", hold: { c: (x, y, sc) => T(x, y, sc, rect(-30, -20, 60, 40, "#6b4a2c", { sw: 2.6, r: 4 }) + rect(-24, -14, 48, 10, "#2a1f2f", { sw: 0 })) } });
          s += T(w * 0.36, h * 0.42, 1, `${fellipse(-10, 0, 14, 8, "#c9c3b5", 1, -20)}${fellipse(10, 0, 14, 8, "#c9c3b5", 1, 20)}${fcircle(0, 2, 4, "#5a5670")}`) + path(`M${w * 0.3} ${h * 0.62} q20 -40 40 -70`, "none", { sw: 1.6, dash: "4 4" });
          s += jon({ x: w * 0.74, y: h + 130, s: 1.15, f: -1, expr: "sheepish", pose: "shrug" });
          return s;
        },
        b: (w, h) => [sfx("flutter...", w * 0.5, 50, { size: 30, rot: -6, color: "#c9c3b5", font: "hand" }), say("Two dollars and a library card.", w * 0.24, h * 0.3, top("teen", w * 0.3, h + 130, 1.15, { dx: -20 }), { w: 110 }), say("I have a button.", w * 0.82, h * 0.34, top("teen", w * 0.74, h + 130, 1.15, { dx: 20 }), { w: 80 })],
      },
      {
        alt: "The two boys sit glumly on the curb.",
        art(w, h) {
          let s = frect(0, 0, w, h * 0.6, "#b5543f") + `<rect width="${w}" height="${h * 0.6}" fill="url(#brick)"/>` + frect(0, h * 0.6, w, h * 0.4, "#c9c3b5") + line(0, h * 0.6, w, h * 0.6, { sw: 3 }) + rect(-10, h * 0.86, w + 20, 18, "#a9a39a", { sw: 3 });
          s += lex({ x: w * 0.32, y: h * 0.9, s: 1.0, expr: "gloom", pose: "sitSlump", seated: true });
          s += jon({ x: w * 0.68, y: h * 0.9, s: 1.0, f: -1, expr: "think", pose: "think", seated: true });
          return s;
        },
        b: (w, h) => [say("We could ask our parents?", w * 0.74, 50, top("teen", w * 0.68, h * 0.9, 1.0, { seated: true }), { w: 120 }), say("Dad says money doesn't grow on trees.", w * 0.26, 74, top("teen", w * 0.32, h * 0.9, 1.0, { seated: true }), { w: 130 }), say("Has he CHECKED?", w * 0.82, h * 0.42, top("teen", w * 0.68, h * 0.9, 1.0, { seated: true, dx: 10 }), { w: 80 })],
      },
      {
        alt: "Big Tony walks up twirling the car keys.",
        art(w, h) {
          const gy = h * 0.9;
          let s = frect(0, 0, w, gy, "#b5543f") + `<rect width="${w}" height="${gy}" fill="url(#brick)"/>` + frect(0, gy, w, h - gy, "#6a6f7a") + line(0, gy, w, gy, { sw: 3 });
          s += P.car(w * 0.7, gy + 10, 0.8, { kind: "van", color: "#8db3d8" });
          s += lex({ x: w * 0.12, y: h + 60, s: 0.95, expr: "surprised", pose: "stand" }) + jon({ x: w * 0.24, y: h + 60, s: 0.95, expr: "surprised", pose: "stand" });
          s += tony({ x: w * 0.42, y: h + 100, s: 0.92, f: -1, outfit: "casual", expr: "smug", pose: "wave", hold: { r: (x, y, sc) => T(x, y, sc, circle(0, 0, 8, "none", { sw: 2.4, stroke: "#c9c9d6" }) + rect(4, 2, 16, 8, "#c9c9d6", { sw: 1.6 })) } });
          return s;
        },
        b: (w, h) => [
          say("You two look like you need a ride... and a JOB.", w * 0.56, 60, top("man", w * 0.42, h + 100, 0.92, { dx: 10 }), { w: 200 }),
          say("How'd you know?", w * 0.14, 60, top("teen", w * 0.12, h + 60, 0.95), { w: 90 }),
          say("I was thirteen once.", w * 0.85, 110, top("man", w * 0.42, h + 100, 0.92, { dx: 20 }), { w: 110 }),
        ],
      },
    ],
  });

  page({
    rows: [
      [0.46, [1]],
      [0.27, [0.5, 0.5]],
      [0.27, [1]],
    ],
    panels: [
      {
        alt: "At home, Big Tony teaches Money 101 on a whiteboard while Lexington and Jonathan take notes on the couch.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.living(w, h, { k: 0.9, gy, ox: w * 0.7, couch: false });
          s += P.whiteboard(40, 50, 420, 380, "MONEY 101  by Big Tony", ["1. Find a problem people have.", "2. Solve it better than anyone.", "3. Charge a fair price.", "4. Pay the Lord first (tithing).", "5. Pay back what you borrow.", "6. Save. THEN spend.", "7. Hard work = real money."], { lh: 42, size: 24 });
          s += tony({ x: w * 0.56, y: gy + 6, s: 0.9, f: -1, outfit: "casual", expr: "talk", pose: "point" });
          s += P.couch(w * 0.82, gy, 0.75, { color: "#6f8fd6" });
          s += lex({ x: w * 0.75, y: gy - 30, s: 0.82, expr: "focus", pose: "write", seated: true, hold: { r: H.pencil } });
          s += jon({ x: w * 0.9, y: gy - 30, s: 0.82, f: -1, expr: "think", pose: "think", seated: true });
          return s;
        },
        b: (w, h) => [cap("That night, Big Tony taught his very first class.", w - 340, 16, { w: 320 }), say("Money isn't magic. It's what people pay you for solving their problems.", w * 0.7, 150, top("man", w * 0.56, h * 0.96 + 6, 0.9, { dx: 10 }), { w: 230 })],
      },
      {
        alt: "Jonathan pinches his nose remembering his dad's smelly car.",
        art(w, h) {
          let s = S.rays(w, h, "#fff3c8", "#ffffff", w * 0.5, h * 0.5);
          s += jon({ x: w * 0.5, y: h + 150, s: 1.2, expr: "disgust", pose: "pinchNose" });
          s += fx.stink(w * 0.5, h * 0.95, 1, "#c9a227");
          return s;
        },
        b: (w, h) => [say("Problems people have... my dad's car smells like old french fries.", w * 0.5, 60, top("teen", w * 0.5, h + 150, 1.2), { w: 220 })],
      },
      {
        alt: "A lightbulb appears over Lexington's head. Tony grins.",
        art(w, h) {
          let s = S.rays(w, h, "#d6f0ec", "#ffffff", w * 0.3, h * 0.5);
          s += lex({ x: w * 0.3, y: h + 140, s: 1.15, expr: "confident", pose: "pointUp" });
          s += fx.bulb(w * 0.3, h * 0.32, 0.7);
          s += tony({ x: w * 0.8, y: h + 250, s: 1.05, f: -1, outfit: "casual", expr: "grin", pose: "thumbs" });
          return s;
        },
        b: (w, h) => [say("EVERYBODY'S car is dirty! I already clean sneakers. How hard can a CAR be?", w * 0.62, 60, top("teen", w * 0.3, h + 140, 1.15, { dx: 30 }), { w: 210 }), say("Now you're thinking like a businessman.", w * 0.8, h * 0.56, top("man", w * 0.8, h + 250, 1.05, { dx: 10 }), { w: 110 })],
      },
      {
        alt: "In the garage the three of them look at the dirty family car with WASH ME written in the dust and come up with a name: Suds Brothers.",
        art(w, h) {
          const gy = h * 0.95;
          let s = S.garage(w, h, { k: 0.8, gy, ox: w * 0.1, noSign: true });
          s += P.car(w * 0.62, gy + 6, 0.62, { color: "#8db3d8", kind: "van", dirty: true, washMe: true });
          s += lex({ x: w * 0.12, y: h + 50, s: 0.9, expr: "think", pose: "think" }) + jon({ x: w * 0.26, y: h + 50, s: 0.9, f: -1, expr: "joy", pose: "cheer" }) + tony({ x: w * 0.38, y: h + 100, s: 0.85, f: -1, outfit: "casual", expr: "happy", pose: "cross" });
          return s;
        },
        b: (w, h) => [say("We need a name.", w * 0.08, 40, top("teen", w * 0.12, h + 50, 0.9, { dx: -6 }), { w: 80 }), shout("SUDS... BROTHERS!", w * 0.3, 52, top("teen", w * 0.26, h + 50, 0.9), { w: 110, size: 20 }), say("Suds Brothers Car Wash. I like it.", w * 0.47, 110, top("man", w * 0.38, h + 100, 0.85, { dx: 10 }), { w: 130 })],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 2 — THE PLAN
  // =====================================================================
  page({
    chapter: { n: 2, title: "The Plan", color: "#3f6fb5" },
    rows: [
      [0.36, [1]],
      [0.32, [0.5, 0.5]],
      [0.32, [1]],
    ],
    panels: [
      {
        alt: "Monday night Family Home Evening: Mom and Dad sit on the couch, Jonathan is visiting, and Lexington stands beside a poster titled Suds Brothers.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.living(w, h, { k: 0.85, gy, ox: w * 0.36, couch: false, time: "night" });
          s += P.couch(w * 0.36, gy, 0.8, { color: "#6f8fd6" });
          s += mom({ x: w * 0.28, y: gy - 26, s: 0.78, expr: "happy", pose: "sitHands", seated: true });
          s += dad({ x: w * 0.44, y: gy - 26, s: 0.78, expr: "smug", pose: "sitHands", seated: true });
          s += jon({ x: w * 0.66, y: gy, s: 0.88, f: -1, expr: "joy", pose: "cheer" });
          s += P.easel(w * 0.86, gy + 10, 1.05, { title: "SUDS BROTHERS", sub: "BUSINESS PLAN" });
          return s;
        },
        b: (w, h) => [
          cap("Monday night. Family Home Evening.", 16, 16, { w: 290 }),
          say("Suds BROTHERS? Jonathan's not your brother.", w * 0.42, 110, top("man", w * 0.44, h * 0.97 - 26, 0.78, { seated: true }), { w: 160 }),
          shout("I'm a brother in the gospel!", w * 0.66, 86, top("teen", w * 0.66, h * 0.97, 0.88), { w: 140, size: 18 }),
        ],
      },
      {
        alt: "Lexington's poster lists the services and prices and what it costs to start: eighty dollars.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#3d4470");
          s += P.paper(30, 24, w - 60, h - 48, "SUDS BROTHERS BUSINESS PLAN", ["SERVICES", "  Outside wash ........ $10", "  Inside + outside ... $20", "  Full detail .......... $35", "SUPPLIES: buckets, soap, towels,", "  sponges, tire shine, VAC-BOT", "COST TO START: $80"], { titleSize: 22, size: 21, lh: 34, rot: -1.5, color: "#2a5a9a" });
          return s;
        },
        b: () => [],
      },
      {
        alt: "Dad asks where the eighty dollars is coming from. Lexington smiles sheepishly.",
        art(w, h) {
          let s = S.rays(w, h, "#d6e4f5", "#ffffff", w * 0.5, h * 0.5);
          s += dad({ x: w * 0.28, y: h + 240, s: 1.1, expr: "smug", pose: "cross" });
          s += lex({ x: w * 0.74, y: h + 120, s: 1.1, f: -1, expr: "sheepish", pose: "headScratch" });
          return s;
        },
        b: (w, h) => [say("And where's the eighty dollars coming from?", w * 0.28, 60, top("man", w * 0.28, h + 240, 1.1), { w: 150 }), say("...That's the part where YOU come in.", w * 0.76, 140, top("teen", w * 0.74, h + 120, 1.1), { w: 130 })],
      },
      {
        alt: "Dad agrees to loan the money, not give it, and shakes Lexington's hand over a written I.O.U.",
        art(w, h) {
          let s = S.living(w, h, { k: 0.85, gy: h * 0.97, ox: w * 0.5, couch: false, time: "night" });
          s += dad({ x: w * 0.3, y: h + 150, s: 1.0, expr: "happy", pose: "handshake" });
          s += lex({ x: w * 0.56, y: h + 70, s: 1.0, f: -1, expr: "joy", pose: "handshake" });
          s += P.paper(w * 0.7, 40, 230, 190, "I.O.U.  $80", ["Pay back from first earnings.", "", "Lexington  Jonathan  Tony", "  ✓            ✓            ✓"], { rot: 4, color: "#c9473c", titleSize: 26 });
          return s;
        },
        b: (w, h) => [say("I'll LOAN it. Not give it. You pay me back from your first earnings. Deal?", w * 0.24, 70, top("man", w * 0.3, h + 150, 1.0, { dx: -10 }), { w: 210 }), say("Deal!", w * 0.6, 120, top("teen", w * 0.56, h + 70, 1.0), { w: 60 }), cap("Borrowed money isn't YOUR money. It belongs to somebody else until you pay it back.", w - 330, h - 82, { w: 310 })],
      },
    ],
  });

  page({
    rows: [
      [0.36, [1]],
      [0.34, [0.55, 0.45]],
      [0.3, [1]],
    ],
    panels: [
      {
        alt: "In the garage, the three partners kneel around their supply boxes and Lexington prays for their business.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.garage(w, h, { k: 0.8, gy, ox: w * 0.5, noSign: true });
          const by = gy - 10;
          s += lexC({ x: w * 0.5, y: by - 4, s: 1.0, expr: "pray", pose: "kneelPray" });
          s += jon({ x: w * 0.3, y: by - 4, s: 0.96, outfit: "crew", expr: "pray", pose: "kneelPray" });
          s += tonyC({ x: w * 0.7, y: by + 4, s: 0.9, expr: "pray", pose: "kneelPray" });
          [0.3, 0.5, 0.7].forEach((fxp, i) => (s += rect(w * fxp - 110, gy - 120, 220, 130, "#d9b98a", { sw: 3 }) + line(w * fxp - 110, gy - 96, w * fxp + 110, gy - 96, { sw: 2 }) + text(w * fxp, gy - 40, ["BUCKETS", "SOAP", "TOWELS"][i], { size: 22, font: "title", fill: "#8a6a3a", ls: 2 })));
          return s;
        },
        b: (w, h) => [
          pray("Dear Heavenly Father, please bless our business. Help us work hard, be honest, and help people.", w * 0.24, 90, [w * 0.45, h * 0.4], { w: 260 }),
          pray("In the name of Jesus Christ, amen.", w * 0.78, 80, [w * 0.55, h * 0.4], { w: 170 }),
        ],
      },
      {
        alt: "The partnership agreement, signed by all three, lists who does what and their rules.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#2a8f86") + `<rect width="${w}" height="${h}" fill="url(#dotsWhite)"/>`;
          s += P.paper(24, 24, w - 48, h - 120, "SUDS BROTHERS PARTNERSHIP", ["LEXINGTON: Chief Builder", "   vacuum, tools, quality", "JONATHAN: Sales & Smiles", "   customers, flyers, phone", "TONY: Manager", "   money, schedule, driving", "* Tithing first. Pay debts. Save.", "* Split the rest 3 ways.", "* Tell the truth, even when it costs us."], { size: 18, lh: 30, rot: 1.2, titleSize: 22, color: "#2a5a9a" });
          return s;
        },
        b: (w, h) => [verse("“Two are better than one... and a threefold cord is not quickly broken.” — Ecclesiastes 4:9, 12", 20, h - 92, { w: w - 70 })],
      },
      {
        alt: "Three hands stack together: one, two, three, Suds!",
        art(w, h) {
          let s = S.burst(w, h, "#4fb3e8", "#9fd8ff", w * 0.5, h * 0.62);
          s += bubbles(w, h, 6, 10, 20);
          const cx = w * 0.5,
            cy = h * 0.62;
          const reach = (x, y, sc, f) => C.ik((cx - x) / (f * sc), (cy - y) / sc);
          s += jon({ x: w * 0.12, y: h + 130, s: 1.0, outfit: "crew", expr: "joy", pose: "stand", ra: reach(w * 0.12, h + 130, 1.0, 1) });
          s += tonyC({ x: w * 0.88, y: h + 220, s: 0.95, f: -1, expr: "joy", pose: "stand", ra: reach(w * 0.88, h + 220, 0.95, -1) });
          const sk = C.famSkin().skin;
          s += C.stroke2([[cx + 6, h + 20], [cx + 2, cy + 14]], 20, sk) + C.stroke2([[cx + 6, h + 20], [cx + 6, h - 40]], 34, "#4fb3e8") + ellipse(cx, cy + 6, 16, 13, sk, { sw: 2.6 });
          return s;
        },
        b: (w, h) => [sfx("1... 2... 3...", w * 0.5, 70, { size: 40, rot: -4, color: "#ffffff" }), sfx("SUDS!", w * 0.5, h * 0.36, { size: 74, rot: -6, color: "#ffd23f" })],
      },
      {
        alt: "At the hardware store, Tony sticks to the eighty-dollar budget while Jonathan begs to buy a $129 foam cannon.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.store(w, h, { k: 1, gy });
          s += tony({ x: w * 0.18, y: h + 90, s: 0.88, outfit: "casual", expr: "stern", pose: "holdBoth", hold: { c: H.calculator } });
          s += jon({ x: w * 0.42, y: h + 40, s: 0.92, f: -1, expr: "joy", pose: "holdBoth", hold: { c: (x, y, sc) => P.foamCannon(x, y + 50 * sc, sc * 1.1) } });
          s += P.sign(w * 0.42 + 40, h * 0.38, 70, 34, "$129", null, { bg: "#ffd95e", color: INK, size: 22 });
          s += lex({ x: w * 0.74, y: h + 40, s: 0.92, f: -1, expr: "happy", pose: "carry", hold: { c: (x, y, sc) => P.bucket(x, y + 30, sc * 0.9, { suds: false }) } });
          s += npc("clerk", { x: w * 0.92, y: h + 50, s: 0.88, f: -1, expr: "happy", pose: "stand" });
          return s;
        },
        b: (w, h) => [
          say("Budget: eighty dollars. Not a penny more.", w * 0.12, 110, top("man", w * 0.18, h + 90, 0.88, { dx: -10 }), { w: 140 }),
          say("But it makes FOAM, Tony!", w * 0.36, 170, top("teen", w * 0.42, h + 40, 0.92), { w: 110 }),
          shout("Put. It. Back.", w * 0.12, h - 60, [w * 0.15, h - 140], { w: 90, size: 18 }),
        ],
      },
    ],
  });

  page({
    rows: [
      [0.46, [0.42, 0.58]],
      [0.54, [1]],
    ],
    panels: [
      {
        alt: "The store receipt totals $78.36, just under budget.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#e9edf2") + `<rect width="${w}" height="${h}" fill="url(#dotsFine)"/>`;
          s += P.receipt(w / 2, h * 0.5, 1.45, [["3 Buckets", "15.00"], ["Car soap", "9.98"], ["Towels", "19.99"], ["Sponges", "6.47"], ["Tire shine", "8.99"], ["Spray bottles", "5.97"], ["Glass cleaner", "6.49"], ["Tax", "5.47"]], "$78.36");
          return s;
        },
        b: (w, h) => [shout("Under budget!", w * 0.7, 50, [w * 0.5, h * 0.2], { w: 90, size: 18 }), say("$1.64 left. Write it down.", w * 0.3, h - 50, [w * 0.1, h + 30], { w: 120 })],
      },
      {
        alt: "Wearing goggles, Lexington turns his robot vacuum into a handheld Vac-Bot 3000 Car Edition.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#3d4470");
          s += `<ellipse cx="${w * 0.5}" cy="${h * 0.55}" rx="${w * 0.45}" ry="${h * 0.4}" fill="url(#lampGlow)" opacity=".7"/>`;
          s += lexC({ x: w * 0.45, y: h + 120, s: 1.25, expr: "joy", pose: "cheer", goggles: true, hold: { r: (x, y, sc, f) => H.vac(x, y, sc * 1.6, f) } });
          s += fx.sparkle(w * 0.75, h * 0.2, 16, "#ffd23f") + fx.sparkle(w * 0.2, h * 0.3, 12, "#ffd23f");
          return s;
        },
        b: (w, h) => [shout("Introducing... VAC-BOT 3000: CAR EDITION!", w * 0.5, h * 0.22, top("teen", w * 0.45, h + 120, 1.25), { w: 200, size: 20 })],
      },
      {
        alt: "For practice, the boys wash Dad's car until it sparkles. Dad nods, impressed.",
        art(w, h) {
          const gy = h * 0.9;
          let s = S.driveway(w, h, { k: 0.9, gy, ox: w * 0.7 });
          s += P.car(w * 0.55, gy + 30, 0.78, { color: "#8db3d8", kind: "van", shine: true, wet: true });
          s += lexC({ x: w * 0.12, y: h + 40, s: 1.0, expr: "proud", pose: "hips" }) + jon({ x: w * 0.25, y: h + 40, s: 1.0, outfit: "crew", expr: "joy", pose: "holdOut", hold: { r: H.sponge } });
          s += dad({ x: w * 0.88, y: h + 90, s: 1.0, f: -1, expr: "surprised", pose: "thumbs" });
          s += P.bucket(w * 0.38, h * 0.97, 0.9);
          return s;
        },
        b: (w, h) => [cap("Practice run: Dad's van.", 16, 16, { w: 220 }), say("Not bad, Suds Brothers. Not bad at ALL.", w * 0.84, 70, top("man", w * 0.88, h + 90, 1.0, { dx: -10 }), { w: 150 })],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 3 — GRAND OPENING
  // =====================================================================
  page({
    chapter: { n: 3, title: "Grand Opening", color: "#2a8f86" },
    rows: [
      [0.42, [1]],
      [0.29, [0.5, 0.5]],
      [0.29, [1]],
    ],
    panels: [
      {
        alt: "Saturday at eight in the morning: the three partners in matching Suds Brothers shirts pose proudly in the driveway beside their sign, buckets and hose.",
        art(w, h) {
          const gy = h * 0.8;
          let s = S.driveway(w, h, { k: 0.95, gy, ox: w * 0.66 });
          s += P.aSign(w * 0.84, h * 0.98, 1.2);
          s += P.bucket(w * 0.62, h * 0.98, 1.0) + P.bucket(w * 0.68, h * 0.97, 0.9);
          s += tonyC({ x: w * 0.42, y: h + 70, s: 0.95, expr: "confident", pose: "cross" });
          s += lexC({ x: w * 0.27, y: h + 40, s: 1.0, expr: "grin", pose: "thumbs", hold: { l: H.vac } });
          s += jon({ x: w * 0.12, y: h + 40, s: 1.0, outfit: "crew", expr: "joy", pose: "cheer" });
          s += P.dog(w * 0.55, h * 0.99, 0.9, { mood: "happy" });
          return s;
        },
        b: (w, h) => [cap("Saturday. 8:00 A.M. Grand opening.", 16, 16, { w: 300 }), shout("SUDS BROTHERS IS OPEN FOR BUSINESS!", w * 0.2, 150, top("teen", w * 0.12, h + 40, 1.0, { dx: 10 }), { w: 200, size: 20 })],
      },
      {
        alt: "An hour later, nobody has come. Jonathan has fallen asleep sitting on a bucket.",
        art(w, h) {
          const gy = h * 0.72;
          let s = S.driveway(w, h, { k: 0.7, gy, ox: w * 0.9 });
          s += P.bucket(w * 0.3, h * 0.99, 1.2, { suds: false });
          s += jon({ x: w * 0.3, y: h * 0.86, s: 0.9, outfit: "crew", expr: "asleep", pose: "sitSlump", seated: true });
          s += lexC({ x: w * 0.74, y: h + 30, s: 0.95, f: -1, expr: "bored", pose: "hips" });
          return s;
        },
        b: (w, h) => [cap("9:00 A.M.", 14, 14, { w: 90 })],
      },
      {
        alt: "At ten thirty, still no customers. Tony asks who they told. Nobody.",
        art(w, h) {
          const gy = h * 0.72;
          let s = S.driveway(w, h, { k: 0.7, gy, ox: w * 0.9 });
          s += P.dog(w * 0.5, h * 0.98, 0.8, { mood: "sleep" });
          s += lexC({ x: w * 0.2, y: h + 40, s: 0.9, expr: "worried", pose: "shrug" }) + jon({ x: w * 0.4, y: h + 40, s: 0.9, outfit: "crew", expr: "sheepish", pose: "headScratch" });
          s += tonyC({ x: w * 0.8, y: h + 100, s: 0.88, f: -1, expr: "stern", pose: "hips" });
          return s;
        },
        b: (w, h) => [cap("10:30 A.M.", 14, 14, { w: 100 }), say("Where IS everybody?", w * 0.22, 74, top("teen", w * 0.2, h + 40, 0.9), { w: 90 }), say("Who did you TELL?", w * 0.78, 70, top("man", w * 0.8, h + 100, 0.88), { w: 90 }), say("...Nobody.", w * 0.48, 130, [[w * 0.24, h * 0.5], [w * 0.42, h * 0.5]], { w: 70 })],
      },
      {
        alt: "Tony explains that customers can't buy what they don't know about. Jonathan cracks his knuckles, ready to take charge of marketing.",
        art(w, h) {
          let s = S.rays(w, h, "#d9f2d0", "#ffffff", w * 0.7, h * 0.6);
          s += tonyC({ x: w * 0.25, y: h + 200, s: 1.0, expr: "talk", pose: "point" });
          s += jon({ x: w * 0.72, y: h + 110, s: 1.05, f: -1, outfit: "crew", expr: "fierce", pose: "cross" });
          return s;
        },
        b: (w, h) => [say("Customers can't buy what they don't know about.", w * 0.24, 66, top("man", w * 0.25, h + 200, 1.0), { w: 190 }), say("Leave that... to ME.", w * 0.86, 90, top("teen", w * 0.72, h + 110, 1.05, { dx: 10 }), { w: 100 })],
      },
    ],
  });

  page({
    rows: [
      [0.33, [0.5, 0.5]],
      [0.33, [1]],
      [0.34, [0.5, 0.5]],
    ],
    panels: [
      {
        alt: "Jonathan designs a Suds Brothers flyer on the laptop.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#d9f2d0") + `<rect width="${w}" height="${h}" fill="url(#dotsFine)"/>`;
          s += jon({ x: w * 0.22, y: h + 60, s: 1.0, outfit: "crew", expr: "focus", pose: "sitRead", seated: true });
          s += rect(-10, h * 0.82, w + 20, 30, "#b07a4a", { sw: 3 });
          s += P.laptop(w * 0.42, h * 0.82, 0.9, {});
          s += `<g transform="rotate(3 ${w * 0.74} ${h * 0.44})">${rect(w * 0.53, 30, 190, 300, "#ffffff", { sw: 3 })}${frect(w * 0.53 + 2, 32, 186, 50, "#4fb3e8")}${text(w * 0.53 + 95, 66, "SUDS BROTHERS", { size: 24, font: "title", fill: "#fff", stroke: INK, sw: 3 })}`;
          ["Fresh cars.", "Fair prices.", "Honest work.", "Outside ....... $10", "In + Out ...... $20", "Full detail ... $35", "Saturdays 8 – 4", "CLOSED SUNDAYS", "Text Tony: 555-0127"].forEach((t, i) => (s += text(w * 0.53 + 95, 108 + i * 24, t, { size: 17, font: i < 3 ? "title" : "hand", weight: 400, fill: i === 7 ? "#c9473c" : INK })));
          s += `</g>`;
          return s;
        },
        b: () => [],
      },
      {
        alt: "Going door to door, Jonathan charms a neighbor, Brother Wilson, who books the boys for his truck.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.walls(w, h, gy, "url(#siding)", "#c9c3b5") + frect(0, 0, w, gy, "#e9dcc2") + `<rect width="${w}" height="${gy}" fill="url(#siding)"/>`;
          s += P.door(30, gy - 300, 150, 300, { color: "#3f7d56" });
          s += npc("wilson", { x: 110, y: h + 70, s: 0.85, expr: "surprised", pose: "cross" });
          s += jon({ x: 330, y: h + 30, s: 0.95, f: -1, outfit: "crew", expr: "grin", pose: "present", hold: { r: H.flyer } });
          return s;
        },
        b: (w, h) => [say("Hi! I'm Jonathan, and these are the Suds Brothers. Is your truck feeling dirty and unloved?", w * 0.68, 70, top("teen", 330, h + 30, 0.95), { w: 200, size: 17 }), say("...Twenty bucks for inside AND out? You're on.", 96, 92, top("man", 110, h + 70, 0.85, { dx: 10 }), { w: 110 })],
      },
      {
        alt: "Sunday in the church foyer, Jonathan starts handing out flyers. Tony stops him: not at church, and not on Sunday.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.foyer(w, h, { k: 0.8, gy, ox: w * 0.5 });
          s += npc("larsen", { x: w * 0.1, y: h + 70, s: 0.85, expr: "surprised", pose: "stand" });
          s += jon({ x: w * 0.32, y: h + 40, s: 0.95, outfit: "church", expr: "joy", pose: "present", hold: { r: H.flyer } });
          s += tony({ x: w * 0.5, y: h + 90, s: 0.9, f: -1, outfit: "church", expr: "stern", pose: "stand", ra: C.ik(96, -205) });
          s += lex({ x: w * 0.72, y: h + 40, s: 0.95, f: -1, outfit: "church", expr: "sheepish", pose: "stand" });
          return s;
        },
        b: (w, h) => [
          say("Dude. Not at church. And not on Sunday.", w * 0.6, 60, top("man", w * 0.5, h + 90, 0.9, { dx: 10 }), { w: 170 }),
          say("Oh. Right. Sabbath. Sorry!", w * 0.24, 140, top("teen", w * 0.32, h + 40, 0.95, { dx: -10 }), { w: 110 }),
          cap("Some things are more important than business.", w - 330, h - 60, { w: 310 }),
        ],
      },
      {
        alt: "After church, Bishop Carter asks the boys if they have time on Saturday to wash his car.",
        art(w, h) {
          let s = S.meetinghouse(w, h, { k: 0.48, gy: h * 0.7, ox: w * 0.4, signX: 1000 });
          s += npc("bishop", { x: w * 0.25, y: h + 110, s: 0.95, expr: "happy", pose: "stand" });
          s += jon({ x: w * 0.6, y: h + 50, s: 0.95, f: -1, outfit: "church", expr: "joy", pose: "stand" }) + lex({ x: w * 0.82, y: h + 50, s: 0.95, f: -1, outfit: "church", expr: "happy", pose: "stand" });
          return s;
        },
        b: (w, h) => [say("I hear you boys wash cars. Is Saturday at ten open?", w * 0.3, 60, top("man", w * 0.25, h + 110, 0.95), { w: 150 }), say("For you, Bishop? Absolutely!", w * 0.68, 150, top("teen", w * 0.6, h + 50, 0.95), { w: 110 })],
      },
      {
        alt: "The next Saturday, three cars wait in line in the driveway.",
        art(w, h) {
          const gy = h * 0.62;
          let s = S.driveway(w, h, { k: 0.6, gy, ox: w * 0.95, drivewayWide: 900 });
          s += P.car(w * 0.75, h * 0.7, 0.36, { kind: "truck", color: "#3f7d56", dirty: true, f: -1 }) + P.car(w * 0.5, h * 0.82, 0.42, { color: "#4a4f5e", dirty: true, f: -1 }) + P.car(w * 0.28, h * 0.97, 0.5, { color: "#f0b429", dirty: true, f: -1 });
          s += lexC({ x: w * 0.88, y: h + 40, s: 0.85, f: -1, expr: "gasp", pose: "handsHead" });
          return s;
        },
        b: (w, h) => [cap("Next Saturday.", 14, 14, { w: 140 }), shout("WHOA.", w * 0.8, 70, top("teen", w * 0.88, h + 40, 0.85), { w: 60, size: 22 })],
      },
    ],
  });

  page({
    rows: [
      [0.36, [1]],
      [0.32, [0.5, 0.5]],
      [0.32, [1]],
    ],
    panels: [
      {
        alt: "The car wash in full swing: Jonathan sprays a soapy car with the hose, Lexington vacuums with Vac-Bot, and Tony dries with a towel.",
        art(w, h) {
          const gy = h * 0.8;
          let s = S.driveway(w, h, { k: 0.8, gy, ox: w * 0.9 });
          s += P.car(w * 0.52, h * 0.98, 0.7, { color: "#4a4f5e", soapy: true, wet: true });
          s += jon({ x: w * 0.1, y: h + 40, s: 0.95, outfit: "crew", expr: "joy", pose: "holdOut", hold: { r: H.hose } });
          s += lexC({ x: w * 0.6, y: h + 40, s: 0.9, f: -1, expr: "focus", pose: "holdOut", hold: { r: H.vac } });
          s += tonyC({ x: w * 0.88, y: h + 90, s: 0.88, f: -1, expr: "focus", pose: "holdOut", hold: { r: H.towel } });
          s += P.bucket(w * 0.34, h * 0.99, 0.9);
          return s;
        },
        b: (w, h) => [sfx("SPLOOSH!", w * 0.3, 60, { size: 48, rot: -8, color: "#7fd3ff" }), sfx("SCRUB SCRUB", w * 0.66, 70, { size: 36, rot: 4, color: "#ffffff" }), sfx("VRRRRR!", w * 0.5, h * 0.45, { size: 34, rot: -4, color: "#f0b429" })],
      },
      {
        alt: "Jonathan accidentally sprays Tony, who is dripping wet.",
        art(w, h) {
          let s = S.rays(w, h, "#d6f0ec", "#ffffff", w * 0.7, h * 0.5);
          s += jon({ x: w * 0.22, y: h + 70, s: 1.0, outfit: "crew", expr: "gasp", pose: "holdOut", hold: { r: H.hose } });
          s += tonyC({ x: w * 0.8, y: h + 190, s: 1.0, f: -1, expr: "furious", pose: "stand" });
          s += [0, 1, 2, 3, 4, 5].map((i) => path(`M${w * 0.68 + i * 18} ${h * 0.3 + (i % 3) * 30} q-6 10 0 14 q6 -4 0 -14 Z`, "#9fd8ff", { sw: 1.6 })).join("");
          return s;
        },
        b: (w, h) => [shout("JONATHAN!!", w * 0.76, 52, top("man", w * 0.8, h + 190, 1.0), { w: 100, size: 22 }), say("Oops.", w * 0.18, 90, top("teen", w * 0.22, h + 70, 1.0), { w: 50 })],
      },
      {
        alt: "At four in the afternoon, a sunburned, exhausted Lexington slumps on the curb.",
        art(w, h) {
          let s = S.driveway(w, h, { k: 0.6, gy: h * 0.6, ox: w * 0.9, time: "sunset" });
          s += lexC({ x: w * 0.5, y: h * 0.96, s: 1.1, expr: "wince", pose: "sitSlump", seated: true });
          s += fellipse(w * 0.5, h * 0.96 - 228, 40, 18, "#e8536b", 0.35);
          return s;
        },
        b: (w, h) => [cap("4:00 P.M. Eight cars.", 14, 14, { w: 180 }), say("My arms... don't work anymore.", w * 0.76, 90, top("teen", w * 0.5, h * 0.96, 1.1, { seated: true, dx: 20 }), { w: 110 })],
      },
      {
        alt: "Lexington counts the day's money, surprised by how much work it took. Tony explains that now he knows what money costs.",
        art(w, h) {
          let s = S.kitchen(w, h, { k: 0.85, gy: h * 0.97, ox: w * 0.25, table: false, time: "night" });
          s += lexC({ x: w * 0.35, y: h + 70, s: 1.0, expr: "shock", pose: "holdBoth", hold: { c: H.money } });
          s += tonyC({ x: w * 0.6, y: h + 140, s: 0.95, f: -1, expr: "smug", pose: "cross" });
          s += P.cashBox(w * 0.16, h * 0.98, 1.1);
          return s;
        },
        b: (w, h) => [
          say("A hundred and forty dollars... for EIGHT HOURS of scrubbing?", w * 0.2, 60, top("teen", w * 0.35, h + 70, 1.0, { dx: -20 }), { w: 170 }),
          say("Welcome to the real world, little bro. Now you know what money COSTS.", w * 0.62, 80, top("man", w * 0.6, h + 140, 0.95, { dx: 10 }), { w: 180 }),
          cap("For the first time, Lexington understood: every dollar is a little piece of somebody's hard work.", w - 320, h - 108, { w: 300, bg: "#ffffff" }),
        ],
      },
    ],
  });
})();
