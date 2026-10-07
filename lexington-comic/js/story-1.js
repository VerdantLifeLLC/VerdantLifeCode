/* Lexington: The Turnaround — script part 1: cover, cast, chapter 1. */
(function () {
  "use strict";
  const C = window.Comic;
  const { text, rect, frect, path, line, circle, fcircle, ellipse, fellipse, T, INK, BODY } = C;
  const S = C.scene,
    P = C.prop,
    H = C.held,
    fx = C.fx;

  // ---------- script kit shared by every part ----------
  const kit = (C.kit = {
    say: (t, x, y, tail, o) => Object.assign({ t, x, y, tail }, o || {}),
    shout: (t, x, y, tail, o) => Object.assign({ t, x, y, tail, k: "shout" }, o || {}),
    think: (t, x, y, tail, o) => Object.assign({ t, x, y, tail, k: "think" }, o || {}),
    whisper: (t, x, y, tail, o) => Object.assign({ t, x, y, tail, k: "whisper" }, o || {}),
    pray: (t, x, y, tail, o) => Object.assign({ t, x, y, tail, k: "pray", lower: true }, o || {}),
    cap: (t, x, y, o) => Object.assign({ t, x, y, k: "cap", tl: true }, o || {}),
    verse: (t, x, y, o) => Object.assign({ t, x, y, k: "verse", tl: true }, o || {}),
    note: (t, x, y, o) => Object.assign({ t, x, y, k: "note", tl: true }, o || {}),
    sfx: (t, x, y, o) => Object.assign({ t, x, y, k: "sfx" }, o || {}),
    // a point just above a character's head, for balloon tails
    top(type, x, y, s, o = {}) {
      const B = BODY[type];
      return [x + (o.dx || 0), y + (B.hcy - B.r * 1.35 + kit.bodyDy(type, o)) * s];
    },
    bodyDy(type, o = {}) {
      const B = BODY[type];
      return o.floorSit ? -14 - B.hy : o.seated ? -(B.sh + 14) - B.hy : o.kneel ? B.th * 0.92 : 0;
    },
    // the feet position that puts the top of a character's head at headTop
    yFor(type, headTop, s, o = {}) {
      const B = BODY[type];
      return headTop - (B.hcy - 1.2 * B.r + kit.bodyDy(type, o)) * s;
    },
    // the mouth, for tails that should land close
    mouth(type, x, y, s, f, o = {}) {
      const B = BODY[type];
      const dy = o.seated ? -(B.sh + 14) - B.hy : o.kneel ? B.th * 0.92 : 0;
      return [x + (f || 1) * 12 * s + (o.dx || 0), y + (B.hcy + 22 + dy) * s];
    },
    page(p) {
      (C.STORY = C.STORY || []).push(p);
    },
    ghost: (inner, op) => `<g opacity="${op || 0.55}" filter="url(#desat)">${inner}</g>`,
    sepia: (inner) => `<g filter="url(#sepia)">${inner}</g>`,
    test(x, y, s, rot) {
      return T(x, y, s, `<g transform="rotate(${rot || 0})">${rect(-34, -44, 68, 88, "#ffffff", { sw: 2.6 })}${text(-6, -14, "100%", { size: 18, fill: "#c9473c" })}${circle(16, 16, 15, "none", { sw: 2.6, stroke: "#c9473c" })}${text(16, 23, "A+", { size: 16, font: "title", fill: "#c9473c" })}${[0, 8, 16].map((d) => line(-26, 6 + d, -2, 6 + d, { sw: 1.6, stroke: "#9a9ab0" })).join("")}</g>`);
    },
  });
  const { say, shout, think, whisper, cap, verse, note, sfx, top, mouth, page, ghost } = kit;
  const lex = C.lex,
    mom = C.mom,
    dad = C.dad,
    npc = C.npc,
    tony = C.tony;
  // The caucasian edition adds Big Tony, Lexington's 18-year-old brother.
  const CAU = (C.kit.CAU = C.edition === "caucasian");
  H.bowl = (x, y, s, f) => T(x, y, s, `${path("M-22 -6 Q-20 16 0 16 Q20 16 22 -6 Z", "#f4c542", { sw: 2.4 })}${ellipse(0, -6, 22, 6, "#fff6dc", { sw: 2.2 })}${line(6, -8, 22, -30, { sw: 3, stroke: "#a9b3c4" })}`);
  H.dressShoe = (x, y, s, f) => T(x, y, s, `<g transform="scale(${f} 1)">${path("M-30 6 Q-32 -14 -16 -16 L0 -12 Q14 -4 30 -2 Q40 0 38 8 Z", "#2a1d15", { sw: 2.6 })}${path("M-26 -8 Q-10 -12 4 -8", "none", { sw: 2, stroke: "#6b4a35" })}${line(-31, 6, 38, 6, { sw: 3, stroke: "#140d09" })}</g>`);

  // =====================================================================
  // COVER
  // =====================================================================
  page({
    alt: "Cover: Lexington: The Turnaround. A confident Lexington stands in golden sunrise light while a faded, messy version of his old self slumps in a storm behind him.",
    noNumber: true,
    full(W, Hh) {
      let s = `<rect width="${W}" height="${Hh}" fill="url(#skySunset)"/>`;
      s += fx.rays(W * 0.64, Hh * 0.56, 1500, "#fff6c8", 26, 0.55);
      // storm wedge: the old Lexington
      s += `<path d="M0 ${Hh * 0.33} L${W * 0.56} ${Hh} L0 ${Hh} Z" fill="#3b3f66" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 0; i < 26; i++) {
        const x = (i * 37) % 520,
          y = Hh * 0.42 + ((i * 83) % 820);
        if (y > Hh * 0.33 + (x / (W * 0.56)) * Hh * 0.67 + 30) s += line(x, y, x - 10, y + 30, { sw: 2.4, stroke: "#9fb0ff", op: 0.6 });
      }
      s += path("M30 640 Q20 590 80 585 Q100 540 160 560 Q210 540 230 590 Q270 600 250 640 Z", "#5a5f8a", { sw: 3 });
      s += path("M120 650 L95 720 L125 715 L100 790", "none", { sw: 6, stroke: "#ffd23f" });
      s += ghost(lex({ x: 132, y: 1222, s: 1.36, messy: true, expr: "gloom", pose: "slump", flies: 2 }), 0.62);
      // the new Lexington
      s += `<ellipse cx="${W * 0.63}" cy="${Hh * 0.96}" rx="250" ry="34" fill="#c98a3a" opacity=".45"/>`;
      s += lex({ x: W * 0.63, y: Hh * 0.965, s: 2.72, expr: "confident", pose: "hips", sparkle: true });
      s += P.dog(W * 0.9, Hh * 0.975, 1.25, { mood: "love", f: -1 });
      // title
      const title = (y) => {
        let t = "";
        t += text(W / 2 + 9, y + 10, "LEXINGTON", { size: 178, font: "title", fill: INK, stroke: INK, sw: 16, ls: 4 });
        t += text(W / 2, y, "LEXINGTON", { size: 178, font: "title", fill: "#d8402f", stroke: INK, sw: 12, ls: 4 });
        t += text(W / 2, y, "LEXINGTON", { size: 178, font: "title", fill: "#e65a45", ls: 4 });
        return t;
      };
      s += title(250);
      s += `<g transform="rotate(-3 ${W / 2} 320)"><rect x="${W / 2 - 250 + 7}" y="${288 + 7}" width="500" height="70" fill="${INK}"/><rect x="${W / 2 - 250}" y="288" width="500" height="70" fill="#ffd95e" stroke="${INK}" stroke-width="5"/>${text(W / 2, 340, "THE TURNAROUND", { size: 52, font: "title", ls: 5 })}</g>`;
      // issue badge
      s += `<g transform="rotate(-10 104 96)">${circle(104, 96, 62, "#2a8f86", { sw: 5 })}${text(104, 86, "ISSUE", { size: 24, font: "title", fill: "#fff", ls: 2 })}${text(104, 126, "#1", { size: 44, font: "title", fill: "#ffd95e", stroke: INK, sw: 4 })}</g>`;
      s += `<g transform="rotate(6 880 92)">${rect(790, 60, 180, 64, "#ffffff", { sw: 4, r: 8 })}${text(880, 88, "FAITH • GRIT", { size: 22, font: "title", fill: "#c9473c", ls: 1 })}${text(880, 114, "& GROWING UP", { size: 22, font: "title", fill: "#2a8f86", ls: 1 })}</g>`;
      // tagline
      s += `<g transform="rotate(-2 250 1380)">${rect(36 + 6, 1318 + 6, 440, 112, INK, { sw: 0 })}${rect(36, 1318, 440, 112, "#ffffff", { sw: 5 })}${text(256, 1362, "SMART KID. DUMB CHOICES.", { size: 34, font: "title", ls: 1 })}${text(256, 1406, "ONE BIG TURNAROUND.", { size: 38, font: "title", fill: "#c9473c", ls: 1 })}</g>`;
      return s;
    },
  });

  // =====================================================================
  // MEET THE CAST
  // =====================================================================
  function card(x, y, w, h, o) {
    let s = `<rect x="${x + 8}" y="${y + 8}" width="${w}" height="${h}" rx="18" fill="${INK}"/>`;
    s += rect(x, y, w, h, "#ffffff", { sw: 5, r: 18 });
    s += `<path d="M${x} ${y + 18} Q${x} ${y} ${x + 18} ${y} L${x + w - 18} ${y} Q${x + w} ${y} ${x + w} ${y + 18} L${x + w} ${y + 64} L${x} ${y + 64} Z" fill="${o.color}" stroke="${INK}" stroke-width="5"/>`;
    s += text(x + 20, y + 47, o.name, { size: 40, font: "title", anchor: "start", fill: "#ffffff", stroke: INK, sw: 6, ls: 1.5 });
    s += text(x + w - 18, y + 44, o.role, { size: 18, font: "title", anchor: "end", fill: o.roleColor || INK, ls: 1 });
    const ph = h * 0.5;
    s += `<svg x="${x + 16}" y="${y + 78}" width="${w - 32}" height="${ph}" viewBox="0 0 ${w - 32} ${ph}" overflow="hidden"><rect width="${w - 32}" height="${ph}" fill="${o.bg}"/><rect width="${w - 32}" height="${ph}" fill="url(#dots)"/>${o.art(w - 32, ph)}</svg>`;
    s += rect(x + 16, y + 78, w - 32, ph, "none", { sw: 3.5 });
    let ty = y + 78 + ph + 34;
    o.lines.forEach((l) => {
      s += text(x + 22, ty, l, { size: 19, anchor: "start" });
      ty += 25;
    });
    ty += 4;
    (o.stats || []).forEach(([label, val, col]) => {
      s += text(x + 22, ty + 13, label, { size: 15, font: "title", anchor: "start", ls: 1 });
      for (let i = 0; i < 10; i++) s += rect(x + 150 + i * ((w - 180) / 10), ty, (w - 180) / 10 - 4, 16, i < val ? col : "#ece6da", { sw: 2, r: 3 });
      ty += 26;
    });
    return s;
  }
  // narrow trading card for the five-card cast page
  function cardN(x, y, w, h, o) {
    let s = `<rect x="${x + 7}" y="${y + 7}" width="${w}" height="${h}" rx="16" fill="${INK}"/>`;
    s += rect(x, y, w, h, "#ffffff", { sw: 5, r: 16 });
    s += `<path d="M${x} ${y + 16} Q${x} ${y} ${x + 16} ${y} L${x + w - 16} ${y} Q${x + w} ${y} ${x + w} ${y + 16} L${x + w} ${y + 58} L${x} ${y + 58} Z" fill="${o.color}" stroke="${INK}" stroke-width="5"/>`;
    s += text(x + 16, y + 43, o.name, { size: 34, font: "title", anchor: "start", fill: "#ffffff", stroke: INK, sw: 6, ls: 1.2 });
    s += text(x + w - 14, y + 40, o.role, { size: 14, font: "title", anchor: "end", fill: INK, ls: 0.6 });
    const ph = h * 0.52;
    s += `<svg x="${x + 14}" y="${y + 70}" width="${w - 28}" height="${ph}" viewBox="0 0 ${w - 28} ${ph}" overflow="hidden"><rect width="${w - 28}" height="${ph}" fill="${o.bg}"/><rect width="${w - 28}" height="${ph}" fill="url(#dots)"/>${o.art(w - 28, ph)}</svg>`;
    s += rect(x + 14, y + 70, w - 28, ph, "none", { sw: 3.5 });
    let ty = y + 70 + ph + 30;
    o.lines.forEach((l) => {
      s += text(x + 18, ty, l, { size: 16, anchor: "start" });
      ty += 21;
    });
    ty += 6;
    (o.stats || []).forEach(([label, val, col]) => {
      s += text(x + 18, ty + 12, label, { size: 13, font: "title", anchor: "start", ls: 0.8 });
      for (let i = 0; i < 10; i++) s += rect(x + 108 + i * ((w - 128) / 10), ty, (w - 128) / 10 - 3, 14, i < val ? col : "#ece6da", { sw: 1.8, r: 3 });
      ty += 23;
    });
    return s;
  }
  function castFive(W, Hh) {
    let s = `<rect width="${W}" height="${Hh}" fill="#2a8f86"/><rect width="${W}" height="${Hh}" fill="url(#dotsWhite)"/>`;
    s += text(W / 2 + 6, 128, "MEET THE CAST", { size: 104, font: "title", fill: INK, stroke: INK, sw: 12, ls: 3 });
    s += text(W / 2, 122, "MEET THE CAST", { size: 104, font: "title", fill: "#ffd95e", stroke: INK, sw: 8, ls: 3 });
    s += card(42, 162, 440, 586, {
      name: "LEXINGTON",
      role: "AGE 13",
      color: "#c9473c",
      bg: "#bfe0f0",
      art: (w, h) => lex({ x: w / 2, y: h + 150, s: 1.32, messy: true, expr: "grin", pose: "thumbs", stink: false }),
      lines: ["Genius brain. Builds robots for fun.", "Also forgets to shower for days."],
      stats: [
        ["BRAINS", 10, "#2a8f86"],
        ["LISTENING", 2, "#c9473c"],
        ["HYGIENE", 1, "#c9473c"],
        ["FAITH", 3, "#f0b429"],
        ["CONFIDENCE", 4, "#f0b429"],
      ],
    });
    s += card(518, 162, 440, 586, {
      name: "BIG TONY",
      role: "AGE 18 • SENIOR",
      roleColor: "#f0b429",
      color: "#24345e",
      bg: "#e6e0f0",
      art: (w, h) => tony({ x: w / 2, y: h + 175, s: 1.12, expr: "confident", pose: "cross" }),
      lines: ["Lexington's big brother. High school", "senior. Almost out the door."],
      stats: [
        ["SENIOR STATUS", 10, "#24345e"],
        ["BIG-BRO SKILLS", 10, "#f0b429"],
        ["COOL FACTOR", 9, "#2a8f86"],
        ["PATIENCE", 4, "#c9473c"],
      ],
    });
    const cw = 292,
      cy = 776,
      ch = 590;
    s += cardN(42, cy, cw, ch, {
      name: "MOM",
      role: "CHIEF OF EVERYTHING",
      color: "#e09a3e",
      bg: "#ffe3c2",
      art: (w, h) => mom({ x: w / 2, y: h + 200, s: 1.08, expr: "happy", pose: "heart" }) + fx.heart(w * 0.84, 50, 13),
      lines: ["Loves hard. Prays harder.", "Smells trouble two rooms away."],
      stats: [
        ["PATIENCE", 7, "#2a8f86"],
        ["PRAYERS", 10, "#f0b429"],
        ["HUGS", 10, "#e8536b"],
      ],
    });
    s += cardN(42 + cw + 20, cy, cw, ch, {
      name: "DAD",
      role: "BUILDER • COACH",
      color: "#3f6fb5",
      bg: "#d6e4f5",
      art: (w, h) => dad({ x: w / 2, y: h + 175, s: 1.02, expr: "proud", pose: "cross" }),
      lines: ["Built the chore chart.", "Will build ten more if he has to."],
      stats: [
        ["STRENGTH", 9, "#2a8f86"],
        ["DAD JOKES", 10, "#f0b429"],
        ["WISDOM", 9, "#3f6fb5"],
      ],
    });
    s += cardN(42 + (cw + 20) * 2, cy, cw, ch, {
      name: "BISCUIT",
      role: "GOOD DOG",
      color: "#b5843c",
      bg: "#f6e6c8",
      art: (w, h) => P.dog(w / 2 - 8, h - 30, 1.85, { mood: "happy" }),
      lines: ["Family dog. Pro sniffer.", "Strong opinions about smells."],
      stats: [
        ["NOSE", 10, "#b5843c"],
        ["LOYALTY", 10, "#e8536b"],
        ["PATIENCE", 3, "#c9473c"],
      ],
    });
    s += text(W / 2, 1418, "For every kid who is smart enough to choose better,", { size: 24, font: "hand", fill: "#ffffff" });
    s += text(W / 2, 1450, "and for the parents who never stop praying.", { size: 24, font: "hand", fill: "#ffffff" });
    return s;
  }
  page({
    noNumber: true,
    alt: CAU
      ? "Meet the cast: Lexington, his big brother Big Tony, Mom, Dad and Biscuit the dog, drawn as trading cards with stats."
      : "Meet the cast: Lexington, Mom, Dad and Biscuit the dog, drawn as trading cards with stats.",
    full(W, Hh) {
      if (CAU) return castFive(W, Hh);
      let s = `<rect width="${W}" height="${Hh}" fill="#2a8f86"/><rect width="${W}" height="${Hh}" fill="url(#dotsWhite)"/>`;
      s += text(W / 2 + 6, 128, "MEET THE CAST", { size: 104, font: "title", fill: INK, stroke: INK, sw: 12, ls: 3 });
      s += text(W / 2, 122, "MEET THE CAST", { size: 104, font: "title", fill: "#ffd95e", stroke: INK, sw: 8, ls: 3 });
      const cw = 440,
        ch = 590;
      s += card(42, 170, cw, ch, {
        name: "LEXINGTON",
        role: "AGE 13",
        color: "#c9473c",
        bg: "#bfe0f0",
        art: (w, h) => lex({ x: w / 2, y: h + 150, s: 1.32, messy: true, expr: "grin", pose: "thumbs", stink: false }),
        lines: ["Genius brain. Builds robots for fun.", "Also forgets to shower for days."],
        stats: [
          ["BRAINS", 10, "#2a8f86"],
          ["LISTENING", 2, "#c9473c"],
          ["HYGIENE", 1, "#c9473c"],
          ["FAITH", 3, "#f0b429"],
          ["CONFIDENCE", 4, "#f0b429"],
        ],
      });
      s += card(518, 170, cw, ch, {
        name: "MOM",
        role: "CHIEF OF EVERYTHING",
        color: "#e09a3e",
        bg: "#ffe3c2",
        art: (w, h) => mom({ x: w / 2, y: h + 210, s: 1.2, expr: "happy", pose: "heart" }) + fx.heart(w * 0.8, 60, 16) + fx.heart(w * 0.86, 100, 10),
        lines: ["Loves hard. Prays harder.", "Can smell trouble from two rooms away."],
        stats: [
          ["PATIENCE", 7, "#2a8f86"],
          ["PRAYERS", 10, "#f0b429"],
          ["HUGS", 10, "#e8536b"],
        ],
      });
      s += card(42, 790, cw, ch, {
        name: "DAD",
        role: "BUILDER • COACH",
        color: "#3f6fb5",
        bg: "#d6e4f5",
        art: (w, h) => dad({ x: w / 2, y: h + 160, s: 1.12, expr: "proud", pose: "cross" }),
        lines: ["Built the chore chart.", "Will build ten more if he has to."],
        stats: [
          ["STRENGTH", 9, "#2a8f86"],
          ["DAD JOKES", 10, "#f0b429"],
          ["WISDOM", 9, "#3f6fb5"],
        ],
      });
      s += card(518, 790, cw, ch, {
        name: "BISCUIT",
        role: "GOOD DOG",
        color: "#b5843c",
        bg: "#f6e6c8",
        art: (w, h) => P.dog(w / 2 - 10, h - 30, 2.4, { mood: "happy" }),
        lines: ["Family dog. Professional sniffer.", "Has strong opinions about smells."],
        stats: [
          ["NOSE", 10, "#b5843c"],
          ["LOYALTY", 10, "#e8536b"],
          ["PATIENCE", 3, "#c9473c"],
        ],
      });
      s += text(W / 2, 1430, "For every kid who is smart enough to choose better,", { size: 24, font: "hand", fill: "#ffffff" });
      s += text(W / 2, 1462, "and for the parents who never stop praying.", { size: 24, font: "hand", fill: "#ffffff" });
      return s;
    },
  });

  // =====================================================================
  // CHAPTER 1 — BIG BRAIN, BAD CHOICES
  // =====================================================================
  page({
    chapter: { n: 1, title: "Big Brain, Bad Choices" },
    rows: [
      [0.5, [1]],
      [0.5, [0.5, 0.5]],
    ],
    panels: [
      {
        alt: "Lexington's messy bedroom. Wearing goggles, he powers up a robot built from a vacuum cleaner.",
        art(w, h) {
          const gy = h * 0.88,
            k = 1.0,
            ox = 470;
          let s = S.bedroom(w, h, { messy: true, k, gy, ox, robot: false, flies: false });
          s += P.robot(ox - 230, gy + 8, 1.25, { sparks: true, eyes: "#7ff3ff" });
          s += `<ellipse cx="${ox - 230}" cy="${gy - 70}" rx="120" ry="80" fill="url(#glow)" opacity=".7"/>`;
          s += lex({ x: ox + 10, y: gy + 6, s: 1.16, f: -1, messy: true, expr: "joy", pose: "cheer", goggles: true, flies: 3 });
          s += P.dog(w - 110, gy + 30, 1.0, { mood: "gross", f: -1 });
          s += sfxText(ox - 230, gy - 230);
          return s;
        },
        b: (w, h) => [
          cap("Meet **Lexington**. Thirteen years old.", 18, 18, { w: 330 }),
          cap("Over ONE weekend, he turned Mom's old vacuum cleaner into a working robot.", 18, 74, { w: 330 }),
          shout("Vac-Bot 3000... ONLINE!", 650, 120, top("teen", 480, h * 0.88 + 6, 1.16), { w: 200 }),
        ],
      },
      {
        alt: "At school, the teacher hands Lexington a perfect test score. He looks smug.",
        art(w, h) {
          const gy = h * 0.92;
          let s = S.school(w, h, { k: 0.78, gy, ox: w * 0.5 });
          s += npc("teacher", { x: 105, y: gy, s: 1.0, expr: "happy", pose: "holdOut" });
          s += lex({ x: 320, y: gy - 6, s: 1.08, f: -1, messy: true, expr: "smug", pose: "sitHands", stink: false });
          s += S.schoolDesk(330, gy + 6, 1.05);
          s += kit.test(205, gy - 250, 1.15, -8);
          return s;
        },
        b: (w, h) => [
          cap("He aces every math test. Without studying.", 14, 14, { w: 240 }),
          say("A perfect score... AGAIN, Lexington!", 120, 160, top("woman", 105, h * 0.92, 1.0, { dx: 8 }), { w: 170 }),
          say("Math is easy. It's just logic.", 340, 230, top("teen", 320, h * 0.92 - 6, 1.08, { seated: true }), { w: 150 }),
        ],
      },
      {
        alt: "In class, a classmate pinches his nose next to Lexington while flies circle him.",
        art(w, h) {
          const gy = h + 40;
          let s = S.school(w, h, { k: 0.8, gy: h * 0.92, ox: w * 0.1, board: ["E = mc²", "a² + b² = c²", "π ≈ 3.14159"] });
          s += npc("friend2", { x: 100, y: gy, s: 1.3, expr: "disgust", pose: "pinchNose", seated: true });
          s += lex({ x: 320, y: gy, s: 1.3, f: -1, messy: true, expr: "smug", pose: "sitHands", flies: 4 });
          s += S.schoolDesk(320, gy - 10, 1.25) + S.schoolDesk(100, gy - 10, 1.25);
          return s;
        },
        b: (w, h) => [
          cap("But somehow, a kid THIS smart could NOT remember to take a shower.", 14, 14, { w: 330 }),
          say("Bro... what IS that smell?", 110, 200, top("teen", 100, h + 40, 1.3, { seated: true, dx: -10 }), { w: 130 }),
          say("That's the smell of genius.", 350, 220, top("teen", 320, h + 40, 1.3, { seated: true }), { w: 130 }),
        ],
      },
    ],
  });
  function sfxText(x, y) {
    return "";
  }

  page({
    rows: [
      [0.37, [0.55, 0.45]],
      [0.29, [1]],
      [0.34, [1]],
    ],
    panels: [
      {
        alt: "Lexington sleeps through a ringing alarm clock, drooling on his pillow.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#a9b4c9") + `<rect width="${w}" height="${h}" fill="url(#dotsFine)"/>`;
          s += P.window(w - 150, 30, 120, 120, { time: "dawn", curtains: "#7a6a9a" });
          s += rect(-10, 300, 130, 200, "#8a5a3c", { sw: 3 }) + rect(10, 330, 90, 40, "#9a6a40", { sw: 2.4 });
          s += P.alarm(62, 300, 1.4, { ring: true, time: "7:00" });
          s += `<ellipse cx="225" cy="318" rx="130" ry="52" fill="#f6f1e6" stroke="${INK}" stroke-width="3"/>`;
          s += lex({ x: 445, y: 465, s: 1.6, rot: -90, messy: true, expr: "asleep", pose: "slump", stink: false });
          s += path(`M282 262 Q330 228 400 248 Q470 222 ${w + 10} 250 L${w + 10} ${h + 10} L190 ${h + 10} Q200 380 282 262 Z`, "#3f6fb5", { sw: 3 });
          s += path("M300 330 q40 -20 80 0 M380 300 q40 -18 90 6 M260 420 q60 -10 120 10", "none", { sw: 2.4, stroke: "#2c4f86" });
          s += fellipse(330, 380, 16, 8, "#c9a227", 0.7);
          return s;
        },
        b: (w, h) => [
          sfx("BRRRIIIING!", 150, 230, { size: 50, rot: -12, color: "#ffd23f" }),
          shout("LEXINGTON! UP! Shower! Teeth! Deodorant!", 300, 72, [w + 30, 40], { w: 220, size: 19 }),
          whisper("five more minutes...", 380, 186, [250, 250], { w: 120, lower: true }),
        ],
      },
      {
        alt: "In the bathroom, Lexington just runs his toothbrush under the faucet.",
        art(w, h) {
          const gy = h * 0.95,
            k = 1.1,
            ox = w * 0.4;
          let s = S.bathroom(w, h, { k, gy, ox, running: true });
          s += lex({ x: ox + 128, y: gy + 4, s: 1.12, f: -1, messy: true, expr: "sly", pose: "holdOut", stink: false });
          s += T(ox + 30, gy - 170, 1.1, `<g transform="rotate(-14)">${rect(-4, -3, 52, 7, "#4fb3e8", { sw: 2, r: 3 })}${rect(-16, -6, 14, 10, "#ffffff", { sw: 2, r: 2 })}</g>`);
          return s;
        },
        b: (w, h) => [
          think("Wet toothbrush = proof of brushing. Flawless logic.", 300, 92, top("teen", 300, h * 0.95, 1.12), { w: 170 }),
          cap("7:04 A.M.", 14, 14, { w: 120 }),
        ],
      },
      {
        alt: "Lexington blasts himself with a giant cloud of body spray instead of showering.",
        art(w, h) {
          const gy = h * 0.97;
          let s = frect(0, 0, w, h, "#d9c8f0") + `<rect width="${w}" height="${h}" fill="url(#dots)"/>`;
          s += fx.rays(w * 0.62, h * 0.4, 900, "#efe4ff", 18, 0.7);
          const cloud = [
            [380, 120, 64],
            [470, 90, 72],
            [560, 140, 84],
            [660, 110, 70],
            [520, 230, 76],
            [640, 240, 80],
            [750, 190, 74],
            [430, 220, 54],
            [830, 280, 60],
          ];
          s += `<path d="M300 150 L380 110 L400 170 Z" fill="#f3eaff" opacity=".9"/>`;
          cloud.forEach(([x, y, r]) => (s += circle(x, y, r, "#f3eaff", { sw: 2.6, op: 0.94 })));
          s += lex({ x: 220, y: gy + 40, s: 1.12, messy: true, expr: "smug", pose: "spray", hold: { r: H.spray }, stink: false });
          s += fx.flies(560, 330, 1, 3);
          s += T(700, 350, 1, text(0, 0, "x_x", { size: 18, fill: "#5a5670" }));
          return s;
        },
        b: (w, h) => [
          sfx("PSSSSSHHH!", w * 0.6, 64, { size: 58, rot: 6, color: "#b48cff" }),
          cap("Day 4 without a shower. Lexington's theory: body spray counts as a shower.", 16, 16, { w: 230 }),
          cap("(It does not.)", w - 190, h - 66, { w: 150, bg: "#ffffff" }),
        ],
      },
      {
        alt: CAU
          ? "In the kitchen, Mom and Dad gag at the breakfast table and Big Tony pinches his nose as smelly Lexington walks in. The dog runs away."
          : "In the kitchen, Mom and Dad gag at the breakfast table as smelly Lexington walks in. The dog runs away.",
        art(w, h) {
          const gy = h * 0.97,
            k = 0.85,
            ox = 340;
          let s = S.kitchen(w, h, { k, gy, ox, table: false });
          s += mom({ x: 500, y: gy, s: 0.86, expr: "gag", pose: "pinchNose", seated: true });
          s += dad({ x: 680, y: gy, s: 0.86, f: -1, expr: "disgust", pose: "facepalm", seated: true });
          s += P.table(590, gy, 0.86, { cloth: "#e8536b" });
          s += T(560, gy - 92, 0.86, ellipse(-40, 0, 24, 7, "#ffffff", { sw: 2.2 }) + ellipse(60, 0, 24, 7, "#ffffff", { sw: 2.2 }) + rect(10, -26, 18, 24, "#c9473c", { sw: 2.2, r: 3 }));
          if (CAU) s += tony({ x: 368, y: gy + 4, s: 0.84, f: -1, expr: "disgust", pose: "pinchNose", hold: { l: H.bowl } });
          s += lex({ x: 205, y: gy, s: 0.9, messy: true, expr: "happy", pose: "wave", flies: 3 });
          s += fx.stink(205, gy - 140, 1.3, "#8fbf4a");
          s += P.dog(860, gy - 4, 0.9, { mood: "flee" }) + fx.motion(800, gy - 40, 1, 1);
          return s;
        },
        b: (w, h) =>
          CAU
            ? [
                say("Bro. Close the door. We can SMELL you.", 400, 56, top("man", 368, h * 0.97 + 4, 0.84, { dx: 10 }), { w: 150 }),
                say("Son. When did you last SHOWER?", 760, 70, top("man", 680, h * 0.97, 0.86, { seated: true, dx: 10 }), { w: 170 }),
                say("Define 'last.'", 110, 132, top("teen", 205, h * 0.97, 0.9, { dx: -14 }), { w: 100 }),
              ]
            : [
                say("Son. When did you last SHOWER?", 760, 70, top("man", 680, h * 0.97, 0.86, { seated: true, dx: 10 }), { w: 170 }),
                say("Define 'last.'", 210, 60, top("teen", 205, h * 0.97, 0.9), { w: 120 }),
              ],
      },
    ],
  });

  page({
    rows: [
      [0.34, [1]],
      [0.33, [0.5, 0.5]],
      [0.33, [0.38, 0.62]],
    ],
    panels: [
      {
        alt: "Lexington squirms on the couch playing a video game because he needs the bathroom but won't stop playing.",
        art(w, h) {
          const gy = h * 0.93,
            k = 1.05;
          let s = S.living(w, h, { k, gy, ox: w / 2, tvGlow: [w / 2, h * 0.45] });
          s += lex({ x: w / 2, y: gy - 22, s: 1.08, messy: true, expr: "nervous", pose: "game", hold: { r: H.controller }, handsOver: true, stink: false });
          s += path(`M${w / 2 - 60} ${gy - 70} q-10 10 0 20 M${w / 2 + 60} ${gy - 70} q10 10 0 20 M${w / 2 - 76} ${gy - 90} q-12 14 0 28 M${w / 2 + 76} ${gy - 90} q12 14 0 28`, "none", { sw: 3 });
          s += P.dog(w * 0.82, gy + 20, 0.95, { mood: "happy", f: -1 });
          s += fx.mark(w * 0.86, gy - 130, 1, "?", "#ffd23f");
          return s;
        },
        b: (w, h) => [
          cap("And then there was... the BATHROOM situation.", 16, 16, { w: 300 }),
          say("Just... one... more... level...", w / 2 + 180, 110, top("teen", w / 2, h * 0.93 - 22, 1.08, { seated: true, dx: 24 }), { w: 150 }),
          think("I can totally hold it.", 160, 150, top("teen", w / 2, h * 0.93 - 22, 1.08, { seated: true, dx: -30 }), { w: 130 }),
        ],
      },
      {
        alt: "Lexington sprints down the hallway toward the bathroom.",
        art(w, h) {
          const gy = h * 0.95;
          let s = S.hall(w, h, { k: 0.9, gy, ox: w * 0.2 });
          s += `<rect width="${w}" height="${h}" fill="#fff" opacity=".35"/>` + fx.speedLines(w, h, -1, "#ffffff", 22);
          s += lex({ x: w * 0.62, y: gy, s: 1.12, messy: true, expr: "gasp", pose: "run", lean: 14, stink: false });
          s += fx.motion(w * 0.45, gy - 160, 1.2, 1) + fx.dust(w * 0.36, gy - 10, 1);
          return s;
        },
        b: (w, h) => [sfx("ZOOOOM!", 120, h * 0.5, { size: 56, rot: -10, color: "#4fd3ff" }), shout("GOTTA GO GOTTA GO GOTTA GO!", 290, 74, top("teen", w * 0.62, h * 0.95, 1.12, { dx: 10 }), { w: 170, size: 18 })],
      },
      {
        alt: "Dad waits outside the bathroom with arms crossed as Lexington comes out.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.walls(w, h, gy, "#d8c8e6", "#b9814f", { stripe: true }) + `<rect x="0" y="${gy}" width="${w}" height="${h - gy}" fill="url(#planks)"/>`;
          s += P.door(30, gy - 300, 130, 300, { color: "#f6f1e6" });
          s += rect(56, gy - 262, 78, 30, "#ffffff", { sw: 2 }) + text(95, gy - 241, "BATHROOM", { size: 12, font: "title" });
          s += lex({ x: 150, y: gy, s: 1.0, messy: true, expr: "sheepish", pose: "headScratch", stink: false });
          s += dad({ x: 350, y: gy + 6, s: 1.0, f: -1, expr: "stern", pose: "cross" });
          return s;
        },
        b: (w, h) => [
          say("Did you flush? Did you WIPE? Did you wash your HANDS?", 318, 70, top("man", 350, h * 0.96 + 6, 1.0, { dx: -6 }), { w: 180 }),
          say("...Two out of three?", 92, 92, top("teen", 150, h * 0.96, 1.0, { dx: -10 }), { w: 100 }),
        ],
      },
      {
        alt: "Dad covers his face with his hand.",
        art(w, h) {
          let s = S.burst(w, h, "#bcd3ee", "#ffffff", w * 0.5, h * 0.45);
          s += dad({ x: w * 0.52, y: h + 230, s: 1.45, expr: "prayHard", pose: "facepalm" });
          return s;
        },
        b: (w, h) => [say("Lord, give me strength.", w / 2, 60, [w * 0.55, 170], { w: 150 })],
      },
      {
        alt: "Mom holds a stinky laundry basket at arm's length with a clothespin on her nose while Lexington cringes in the doorway.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.walls(w, h, gy, "#cfe6d8", "#c9d3e0", { stripe: false });
          // washer and dryer
          [20, 150].forEach((x) => (s += rect(x, gy - 170, 120, 170, "#f6f6f2", { sw: 3, r: 6 }) + circle(x + 60, gy - 85, 40, "#cfe6ec", { sw: 3 }) + rect(x + 10, gy - 160, 100, 20, "#e6e6e0", { sw: 2 })));
          s += mom({ x: 330, y: gy, s: 1.0, f: -1, expr: "disgust", pose: "carry", hold: { c: H.basket }, handsOver: true });
          s += rect(316, gy - 306, 12, 14, "#f4c542", { sw: 2, r: 2 });
          s += fx.stink(300, gy - 140, 0.9, "#8fbf4a");
          s += lex({ x: 500, y: gy, s: 0.92, f: -1, messy: true, expr: "shock", pose: "handsHead", stink: false });
          return s;
        },
        b: (w, h) => [
          shout("LEXINGTON! We need to talk about WIPING!", 230, 70, top("woman", 330, h * 0.96, 1.0, { dx: -8 }), { w: 210, size: 19 }),
          cap("Some things are too gross to draw. This was one of them.", w - 210, h - 96, { w: 190 }),
        ],
      },
    ],
  });
})();
