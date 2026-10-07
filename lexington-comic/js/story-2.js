/* Lexington: The Turnaround — script part 2: chapters 2–5. */
(function () {
  "use strict";
  const C = window.Comic;
  const { text, rect, frect, path, line, circle, fcircle, ellipse, fellipse, T, INK } = C;
  const S = C.scene,
    P = C.prop,
    H = C.held,
    fx = C.fx;
  const { say, shout, think, whisper, pray, cap, verse, note, sfx, top, page, ghost } = C.kit;
  const lex = C.lex,
    mom = C.mom,
    dad = C.dad,
    npc = C.npc;

  // ---------- extra props for these chapters ----------
  H.drill = (x, y, s, f) => T(x, y, s, `<g transform="scale(${f} 1)">${rect(-10, -16, 46, 24, "#f0b429", { sw: 2.6, r: 6 })}${rect(-6, 6, 16, 30, "#3a3a4a", { sw: 2.4, r: 4 })}${rect(36, -10, 22, 10, "#a9b3c4", { sw: 2 })}${line(58, -5, 74, -5, { sw: 3 })}</g>`);
  H.coffee = (x, y, s, f) => T(x, y, s, `${rect(-12, -22, 24, 26, "#ffffff", { sw: 2.4, r: 4 })}${path("M12 -16 q12 0 12 9 q0 9 -12 9", "none", { sw: 3 })}${frect(-9, -19, 18, 6, "#6b4430")}`);
  H.paper = (x, y, s, f) => T(x, y, s, `${rect(-22, -28, 44, 56, "#ffffff", { sw: 2.2 })}${[0, 8, 16, 24].map((d) => line(-14, -16 + d, 14, -16 + d, { sw: 1.6, stroke: "#9a9ab0" })).join("")}`);
  H.marker = (x, y, s, f) => T(x, y, s, `<g transform="rotate(${f * 30})">${rect(-4, -36, 9, 36, "#2a9d5a", { sw: 2, r: 3 })}${rect(-4, -44, 9, 9, "#1d6b3d", { sw: 2, r: 2 })}</g>`);
  H.airplane = (x, y, s, f) => T(x, y, s, `<g transform="scale(${f} 1)">${path("M-22 0 L26 -10 L-6 12 Z", "#ffffff", { sw: 2.2 })}${path("M-6 12 L-2 -2 L26 -10", "none", { sw: 1.6 })}</g>`);
  const blueprint = (x, y, s, rot) =>
    T(x, y, s, `<g transform="rotate(${rot || 0})">${rect(-120, -80, 240, 160, "#2f5fa7", { sw: 3 })}${rect(-112, -72, 224, 144, "none", { sw: 1.4, stroke: "#9fc3ff" })}${text(0, -48, "OPERATION: LEXINGTON 2.0", { size: 17, font: "title", fill: "#ffffff", ls: 1 })}${["Up at 6:30", "Pray first", "Shower + teeth + deodorant", "Bathroom: go, wipe, flush, wash", "Chores BEFORE games"].map((t, i) => rect(-100, -30 + i * 20, 11, 11, "none", { sw: 1.6, stroke: "#ffffff" }) + text(-82, -20 + i * 20, t, { size: 13, font: "hand", anchor: "start", fill: "#ffffff", weight: 400 })).join("")}${C.gear(84, 40, 18, "#9fc3ff")}</g>`);
  C.blueprint = blueprint;
  // a framed mini panel inside a panel (montages)
  const sub = (x, y, w, h, inner, bg) =>
    `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="hidden"><rect width="${w}" height="${h}" fill="${bg || "#ffffff"}"/>${inner}</svg>` + rect(x, y, w, h, "none", { sw: 4 });
  C.sub = sub;
  const tally = (x, y, count, s) => {
    let o = "";
    for (let i = 0; i < count; i++) {
      const grp = Math.floor(i / 5),
        j = i % 5;
      const gx = x + (grp % 3) * 52 * s,
        gyy = y + Math.floor(grp / 3) * 46 * s;
      if (j < 4) o += line(gx + j * 9 * s, gyy, gx + j * 9 * s + 2, gyy + 34 * s, { sw: 3, stroke: "#3a3a4a" });
      else o += line(gx - 6 * s, gyy + 26 * s, gx + 36 * s, gyy + 6 * s, { sw: 3, stroke: "#3a3a4a" });
    }
    return o;
  };

  // =====================================================================
  // CHAPTER 2 — SET UP FOR SUCCESS
  // =====================================================================
  page({
    chapter: { n: 2, title: "Set Up for Success", color: "#3f6fb5" },
    rows: [
      [0.36, [1]],
      [0.3, [0.5, 0.5]],
      [0.34, [0.55, 0.45]],
    ],
    panels: [
      {
        alt: "Late at night at the kitchen table, Mom and Dad make a plan over papers and coffee.",
        art(w, h) {
          const gy = h * 0.97,
            k = 0.95,
            ox = w * 0.55 - 260 * k;
          let s = S.kitchen(w, h, { k, gy, ox, table: false, time: "night" });
          s += mom({ x: ox + 170 * k, y: gy, s: 0.95, expr: "worried", pose: "sitHands", seated: true });
          s += dad({ x: ox + 360 * k, y: gy, s: 0.95, f: -1, expr: "determined", pose: "sitHands", seated: true });
          s += P.table(ox + 260 * k, gy, k, { cloth: "#e8536b" });
          const ty = gy - 100 * k;
          s += `<g transform="rotate(-6 ${ox + 230 * k} ${ty})">${rect(ox + 200 * k, ty - 6, 60, 12, "#ffffff", { sw: 2 })}</g>` + rect(ox + 250 * k, ty - 8, 70, 12, "#fff6a8", { sw: 2 });
          s += H.coffee(ox + 140 * k, ty - 2, 0.9, 1) + H.coffee(ox + 390 * k, ty - 2, 0.9, -1);
          return s;
        },
        b: (w, h) => {
          const k = 0.95,
            ox = w * 0.55 - 260 * k,
            gy = h * 0.97;
          return [
            cap("That night, Mom and Dad made a plan.", 16, 16, { w: 290 }),
            say("He's SO smart. Why can't he remember the simple stuff?", ox + 40 * k, 120, top("woman", ox + 170 * k, gy, 0.95, { seated: true, dx: -10 }), { w: 190 }),
            say("Then we make the simple stuff impossible to forget.", ox + 520 * k, 110, top("man", ox + 360 * k, gy, 0.95, { seated: true, dx: 10 }), { w: 190 }),
          ];
        },
      },
      {
        alt: "Dad drills a big chore chart onto the wall.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.walls(w, h, gy, "#f3dfb5", "#b9814f", { stripe: false }) + `<rect x="0" y="${gy}" width="${w}" height="${h - gy}" fill="url(#planks)"/>`;
          s += P.choreChart(40, 120, 200, 160, {});
          s += dad({ x: 340, y: h + 60, s: 0.9, f: -1, expr: "focus", pose: "holdOut", hold: { r: H.drill } });
          s += fx.sparkle(246, 128, 10, "#ffd23f") + fx.sparkle(254, 152, 6, "#ffd23f");
          return s;
        },
        b: (w, h) => [sfx("BZZZT!", 130, 340, { size: 48, rot: -6, color: "#ffd23f" }), say("Chore chart: check.", 150, 54, top("man", 340, h + 60, 0.9, { dx: -16 }), { w: 170 })],
      },
      {
        alt: "Mom sets a caddy labeled Fresh Start Kit, full of toothpaste, soap and deodorant, on the bathroom sink.",
        art(w, h) {
          const gy = h * 1.02,
            k = 0.95,
            ox = w * 0.62;
          let s = S.bathroom(w, h, { k, gy, ox });
          s += P.caddy(ox - 10, gy - 104 * k, 1.05, {});
          s += mom({ x: 110, y: gy + 4, s: 0.95, expr: "happy", pose: "present" });
          s += fx.sparkle(ox - 80, gy - 230, 10) + fx.sparkle(ox + 70, gy - 210, 8);
          return s;
        },
        b: (w, h) => [say("Fresh Start Kit: check.", 230, 60, top("woman", 110, h * 1.02 + 4, 0.95, { dx: 14 }), { w: 130 })],
      },
      {
        alt: "In the morning, Mom and Dad proudly show Lexington the new chore chart, the kit, and a new alarm clock.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.living(w, h, { k: 0.85, gy, ox: w * 0.5, couch: false });
          s += P.choreChart(30, 70, 150, 120, {});
          const y2 = h + 50;
          s += dad({ x: 100, y: y2, s: 0.8, expr: "joy", pose: "wave" });
          s += mom({ x: 240, y: y2, s: 0.8, expr: "joy", pose: "present" });
          s += P.caddy(240 + 72, y2 - 190, 0.6, {}) + P.alarm(240 + 74, y2 - 228, 0.66, {});
          s += lex({ x: 420, y: y2 - 10, s: 0.9, f: -1, messy: true, expr: "surprised", pose: "stand", stink: false });
          return s;
        },
        b: (w, h) => [shout("TA-DA!", 170, 64, [top("man", 100, h + 50, 0.8), top("woman", 240, h + 50, 0.8)], { w: 90, size: 30 }), say("Whoa... thanks!", 410, 110, top("teen", 420, h + 40, 0.9), { w: 100 })],
      },
      {
        alt: "A close-up of Lexington grinning slyly in shadow.",
        art(w, h) {
          let s = S.burst(w, h, "#2b2350", "#4a3a7a", w * 0.5, h * 0.55);
          s += lex({ x: w * 0.5, y: h + 300, s: 1.9, messy: true, expr: "sly", pose: "stand", stink: false });
          return s;
        },
        b: (w, h) => [cap("They set Lexington up for success.", 14, 16, { w: 250 }), cap("So, naturally... he did the exact OPPOSITE.", w - 260, h - 80, { w: 230, bg: "#ffffff" })],
      },
    ],
  });

  page({
    rows: [
      [0.33, [0.5, 0.5]],
      [0.33, [0.5, 0.5]],
      [0.34, [1]],
    ],
    panels: [
      {
        alt: "Lexington throws paper airplanes at the chore chart like it's a dartboard.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.walls(w, h, gy, "#a9b4c9", "#7d7f99", { stripe: true });
          s += P.choreChart(40, 60, 190, 150, { planes: true });
          s += lex({ x: 340, y: gy, s: 1.05, f: -1, messy: true, expr: "fierce", pose: "point", stink: false });
          s += H.airplane(170, 250, 1.2, -1) + path("M200 252 Q260 240 290 225", "none", { sw: 2, dash: "6 6" });
          return s;
        },
        b: (w, h) => [cap("The chore chart became a target.", 14, h - 56, { w: 260 })],
      },
      {
        alt: "The Fresh Start Kit is now stuffed with chips and a game controller, while the unopened toothbrush sits in the trash.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.walls(w, h, gy, "#a9b4c9", "#7d7f99", { stripe: true });
          s += P.desk(150, gy, 1.0);
          s += P.caddy(150, gy - 112, 1.25, { snacks: true });
          s += P.trashCan(370, gy, 1.1, {});
          s += T(370, gy - 92, 1, `<g transform="rotate(-20)">${rect(-30, -16, 60, 30, "#ffffff", { sw: 2.4, r: 3 })}${rect(-22, -6, 44, 8, "#4fb3e8", { sw: 1.6, r: 3 })}${text(0, -8, "NEW!", { size: 9, fill: "#c9473c" })}</g>`);
          s += P.dog(300, gy + 6, 0.8, { mood: "happy", f: -1 });
          return s;
        },
        b: (w, h) => [cap("The Fresh Start Kit became a snack caddy.", 14, 14, { w: 260 }), cap("The new toothbrush? Never opened.", w - 230, h - 56, { w: 210, bg: "#ffffff" })],
      },
      {
        alt: "Lexington takes the new alarm clock apart with a screwdriver to use its parts for his robot.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.walls(w, h, gy, "#a9b4c9", "#7d7f99", { stripe: true });
          s += P.poster(30, 40, 90, 120, "robot");
          s += lex({ x: 300, y: gy - 10, s: 1.15, f: -1, messy: true, expr: "focus", pose: "write", goggles: true, seated: true, stink: false });
          s += P.desk(240, gy, 1.2);
          s += P.alarmParts(230, gy - 136, 1.1);
          s += P.robot(90, gy - 132, 0.55, {});
          s += fx.sparkle(260, gy - 190, 10, "#ffd23f");
          return s;
        },
        b: (w, h) => [cap("The alarm clock? Spare parts.", 14, 14, { w: 230 }), say("Excellent servo motor!", 330, 70, top("teen", 300, h * 0.96 - 10, 1.15, { seated: true }), { w: 120 })],
      },
      {
        alt: "At chore time, Lexington hides in his dark closet playing on a tablet while Mom yells for him outside.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#20203a");
          s += `<path d="M${w - 60} 0 L${w} 0 L${w} ${h} L${w - 120} ${h} Z" fill="#ffe9a8" opacity=".55"/>`;
          s += line(0, 40, w, 40, { sw: 5, stroke: "#5a5a72" });
          [60, 130, 200, 300, 360].forEach((x, i) => (s += line(x, 40, x, 60, { sw: 2, stroke: "#9a9ab0" }) + path(`M${x - 34} 60 L${x + 34} 60 L${x + 40} 200 L${x - 40} 200 Z`, ["#c9473c", "#5b7fb5", "#7cc35a", "#f4c542", "#9b59b6"][i], { sw: 2.4, op: 0.8 })));
          s += `<ellipse cx="200" cy="${h * 0.7}" rx="170" ry="120" fill="url(#screenGlow)" opacity=".6"/>`;
          s += lex({ x: 200, y: h * 0.98, s: 1.1, messy: true, expr: "sly", pose: "game", hold: { c: H.tablet }, handsOver: true, stink: false });
          return s;
        },
        b: (w, h) => [shout("LEXINGTON! TRASH! DISHES! NOW!", w - 140, 70, [w + 30, 90], { w: 150, size: 18 }), whisper("She'll never find me in here.", 120, 250, top("teen", 200, h * 0.98, 1.1, { seated: true, dx: -20 }), { w: 130 })],
      },
      {
        alt: "Dad stares at the broken alarm clock pieces, eye twitching, while Mom holds her head and Biscuit sighs.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.bedroom(w, h, { messy: true, k: 0.85, gy, ox: w * 0.48, flies: false, noChair: true });
          s += P.choreChart(w * 0.48 - 120, gy - 330, 130, 100, { planes: true });
          s += dad({ x: w * 0.3, y: gy, s: 0.95, expr: "blank", pose: "holdBoth", hold: { c: (x, y, sc) => P.alarmParts(x, y + 10, sc * 0.8) } });
          s += fx.vein(w * 0.3 - 30, gy - 350, 1.1);
          s += mom({ x: w * 0.55, y: gy, s: 0.95, f: -1, expr: "worried", pose: "handsHead" });
          s += P.dog(w * 0.78, gy + 10, 0.9, { mood: "sleep", f: -1 });
          return s;
        },
        b: (w, h) => [
          say("We gave him EVERYTHING he needed.", w * 0.14, 80, top("man", w * 0.3, h * 0.96, 0.95, { dx: -10 }), { w: 180 }),
          say("Lord... what are we going to DO with this boy?", w * 0.72, 80, top("woman", w * 0.55, h * 0.96, 0.95, { dx: 10 }), { w: 200 }),
        ],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 3 — TROUBLE, TROUBLE, TROUBLE
  // =====================================================================
  page({
    chapter: { n: 3, title: "Trouble, Trouble, Trouble", color: "#7a3f8f" },
    rows: [
      [0.4, [1]],
      [0.3, [0.5, 0.5]],
      [0.3, [1]],
    ],
    panels: [
      {
        alt: "Lexington cowers small in the middle of the panel while shouts of his name come from every direction.",
        art(w, h) {
          let s = S.burst(w, h, "#c9473c", "#8a2a22", w / 2, h * 0.6);
          s += lex({ x: w / 2, y: h * 0.96, s: 0.85, messy: true, expr: "shock", pose: "handsHead", stink: false });
          return s;
        },
        b: (w, h) => [
          shout("LEXINGTON!!!", 160, 90, [-30, 30], { w: 200, size: 30, seed: 4 }),
          shout("LEXINGTON!", w - 180, 110, [w + 30, 40], { w: 170, size: 26, seed: 9 }),
          shout("LEXINGTON?!", 150, h - 120, [-30, h], { w: 170, size: 24, seed: 2 }),
          shout("LEX-ING-TON!", w - 170, h - 110, [w + 30, h], { w: 180, size: 24, seed: 6 }),
          cap("His name got yelled so much, it practically echoed.", w / 2 - 190, 14, { w: 360, align: "center" }),
        ],
      },
      {
        alt: "Neighbor Ms. Pearl, watering her flowers over the fence, asks Lexington what he did this time.",
        art(w, h) {
          const gy = h * 0.94;
          let s = S.yard(w, h, { k: 0.8, gy, ox: w * 0.5, house: false, tree: 330 });
          s += npc("pearl", { x: 110, y: h + 60, s: 0.82, expr: "smug", pose: "holdOut", hold: { r: (x, y, sc, f) => P.wateringCan(x + 10, y + 10, sc, f) } });
          s += P.fence(-10, gy + 2, 250, 110);
          s += lex({ x: 360, y: h + 40, s: 0.85, f: -1, messy: true, expr: "worried", pose: "shrug", stink: false });
          return s;
        },
        b: (w, h) => [
          say("What did you do THIS time, Lexington?", 120, 54, top("woman", 110, h + 60, 0.82, { dx: 8 }), { w: 170 }),
          say("I haven't done ANYTHING yet today!", 350, 106, top("teen", 360, h + 40, 0.85), { w: 150 }),
          say("...Yet.", 210, 160, top("woman", 110, h + 60, 0.82, { dx: 20 }), { w: 60 }),
        ],
      },
      {
        alt: "At the bottom of the stairs, Dad points up. Lexington trudges toward his room under a gloomy cloud.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.hall(w, h, { k: 0.72, gy, ox: w * 0.14 });
          const lx = w * 0.47,
            sc = 0.56,
            stepTop = gy - ((lx - (w * 0.14 - 40 * 0.72)) / (420 * 0.72)) * 400 * 0.72;
          s += lex({ x: lx, y: stepTop + 6, s: sc, f: 1, messy: true, expr: "gloom", pose: "slump", stink: false });
          const cy = stepTop - 300 * sc - 18;
          s += path(`M${lx - 50} ${cy} Q${lx - 60} ${cy - 34} ${lx - 18} ${cy - 32} Q${lx} ${cy - 58} ${lx + 34} ${cy - 38} Q${lx + 70} ${cy - 34} ${lx + 52} ${cy} Z`, "#5a5f8a", { sw: 2.6 });
          s += line(lx - 30, cy + 6, lx - 36, cy + 26, { sw: 2.4, stroke: "#7f9cff" }) + line(lx + 10, cy + 6, lx + 4, cy + 28, { sw: 2.4, stroke: "#7f9cff" }) + line(lx + 40, cy + 6, lx + 34, cy + 24, { sw: 2.4, stroke: "#7f9cff" });
          s += dad({ x: 80, y: h + 70, s: 0.85, expr: "stern", pose: "pointUp" });
          return s;
        },
        b: (w, h) => [say("Room. Now. I'll be up in a minute.", 200, 56, top("man", 80, h + 70, 0.85, { dx: 16 }), { w: 150 })],
      },
      {
        alt: "Lexington's house at dusk, with one lonely lit window upstairs.",
        art(w, h) {
          const gy = h * 0.9;
          let s = S.yard(w, h, { k: 0.95, gy, ox: w * 0.62, time: "dusk", houseX: -190, tree: 330, fence: [-560, 330] });
          s += rect(w * 0.62 - 190 * 0.95 + 380 * 0.95 * 0.68, gy - 300 * 0.95 * 0.82, 380 * 0.95 * 0.22, 300 * 0.95 * 0.3, "#ffd76a", { sw: 3 });
          return s;
        },
        b: (w, h) => [cap("By March, Lexington had gotten more whoopings than he had clean socks.", 16, 16, { w: 300 }), sfx("chirp... chirp...", w - 150, h - 56, { size: 26, rot: 0, color: "#cfe0ff", font: "hand" })],
      },
    ],
  });

  page({
    rows: [
      [0.32, [1]],
      [0.35, [1]],
      [0.33, [0.45, 0.55]],
    ],
    panels: [
      {
        alt: "Alone on his bed at night, Lexington counts tally marks on his wall labeled whoopings.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.walls(w, h, gy, "#8f97b3", "#5f6280", { stripe: true });
          s += P.window(w * 0.42, 50, 130, 130, { time: "night", curtains: "#7a6a9a" });
          s += rect(40, 60, 230, 190, "#c9cfe0", { sw: 0, op: 0.35 });
          s += text(156, 94, "WHOOPINGS", { size: 26, font: "hand", fill: "#3a3a4a", weight: 400 });
          s += tally(66, 116, 22, 1);
          s += P.bed(w * 0.7, gy, 0.95, { messy: true });
          s += lex({ x: w * 0.7 - 20, y: gy - 30, s: 0.98, messy: true, expr: "sad", pose: "sitSlump", stink: false });
          s += S.night(w, h, 0.35);
          return s;
        },
        b: (w, h) => [think("Twenty-two. A new record.", w * 0.88, 80, top("teen", w * 0.7 - 20, h * 0.97 - 30, 0.98, { seated: true }), { w: 140 }), cap("...That is NOT the kind of record you want.", 14, h - 70, { w: 300 })],
      },
      {
        alt: "Downstairs at night, Mom cries at the kitchen table as Dad comforts her with a hand on her shoulder.",
        art(w, h) {
          const gy = h * 0.97,
            k = 0.95,
            ox = w * 0.5 - 260 * k;
          let s = S.kitchen(w, h, { k, gy, ox, table: false, time: "night" });
          s += mom({ x: w * 0.47, y: gy, s: 0.95, expr: "cry", pose: "handsHead", seated: true, headTilt: 6 });
          const dx2 = w * 0.6;
          s += dad({ x: dx2, y: gy, s: 0.95, f: -1, expr: "sad", pose: "stand", ra: C.ik((dx2 - (w * 0.47 + 34)) / 0.95, -196) });
          s += P.table(w * 0.5, gy, k, { cloth: "#e8536b" });
          return s;
        },
        b: (w, h) => [
          say("I don't want to yell at him anymore. I'm so tired.", w * 0.2, 90, top("woman", w * 0.47, h * 0.97, 0.95, { seated: true, dx: -20 }), { w: 210 }),
          say("Me too. But we don't give up on him. We keep praying.", w * 0.82, 80, top("man", w * 0.59, h * 0.97, 0.95, { dx: 12 }), { w: 200 }),
          say("God's not finished with Lexington.", w * 0.82, 200, top("man", w * 0.59, h * 0.97, 0.95, { dx: 12 }), { w: 180 }),
        ],
      },
      {
        alt: "Lexington sits at the top of the dark stairs, hugging his knees, overhearing his parents.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#262944");
          const sh = 66,
            top0 = h * 0.6;
          for (let i = 0; i < 5; i++) {
            const y = top0 + i * sh,
              x = w * 0.22 - i * 70;
            s += rect(x, y, w - x + 10, sh, i % 2 ? "#4a3a5a" : "#55436a", { sw: 3 });
            s += line(x, y + 8, w, y + 8, { sw: 1.6, stroke: "#6a5a80" });
          }
          s += line(w * 0.18, top0 - 150, -40, top0 + 260, { sw: 7, stroke: "#3a2f4a" });
          s += `<path d="M0 ${h} L0 ${h * 0.66} L${w * 0.7} ${h} Z" fill="#ffe9a8" opacity=".28"/>`;
          s += lex({ x: w * 0.58, y: top0 + 60, s: 1.0, messy: true, expr: "touched", pose: "hugKnees", stink: false });
          return s;
        },
        b: (w, h) => [think("They're... praying for ME?", w * 0.42, 74, [w * 0.55, h * 0.6 - 100], { w: 150 })],
      },
      {
        alt: "Lexington sits alone on his bedroom floor in the moonlight, leaning against his bed.",
        art(w, h) {
          const gy = h * 0.9;
          let s = S.bedroom(w, h, { messy: true, k: 0.9, gy, ox: w * 0.34, time: "night", flies: false, noChair: true });
          s += lex({ x: w * 0.6, y: gy + 26, s: 1.05, messy: true, expr: "gloom", pose: "hugKnees", stink: false });
          return s;
        },
        b: (w, h) => [think("I'm the smartest kid in my grade. So why do I keep making the DUMBEST choices?", w * 0.42, 90, [w * 0.58, h * 0.9 - 130], { w: 220 })],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 4 — THE TURNING POINT
  // =====================================================================
  page({
    chapter: { n: 4, title: "The Turning Point", color: "#2a8f86" },
    rows: [
      [0.32, [0.5, 0.5]],
      [0.34, [1]],
      [0.34, [1]],
    ],
    panels: [
      {
        alt: "Moonlight falls on a dusty Bible on Lexington's cluttered shelf. It seems to glow.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#3d4470");
          s += `<path d="M0 0 L${w * 0.45} 0 L${w} ${h} L${w * 0.45} ${h} Z" fill="#cfe0ff" opacity=".16"/>`;
          s += P.shelf(20, 230, 420, { books: 7, messy: true, seed: 2 });
          s += P.can(300, 230, 1.4, 0) + P.sock(370, 200, 1.2, 40) + H.controller(80, 218, 1.1, 1);
          s += `<ellipse cx="220" cy="196" rx="110" ry="80" fill="url(#glow)"/>`;
          s += T(220, 228, 1.3, `${rect(-40, -26, 80, 26, "#5a2a1f", { sw: 2.8, r: 3 })}${path("M-2 -20 V-6 M-9 -14 H5", "none", { sw: 2.6, stroke: "#e2b955" })}${frect(-36, -26, 72, 4, "#c9c3b5", 0.8)}`);
          s += fx.sparkle(160, 150, 9, "#fff6b0") + fx.sparkle(290, 160, 7, "#fff6b0");
          s += S.night(w, h, 0.2);
          return s;
        },
        b: (w, h) => [think("Huh... my Bible. From when I got baptized.", w * 0.5, 74, [w * 0.5, h + 40], { w: 190 })],
      },
      {
        alt: "Lexington blows a big cloud of dust off the Bible and coughs.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#3d4470") + `<rect width="${w}" height="${h}" fill="url(#dots)"/>`;
          s += lex({ x: w * 0.36, y: h + 200, s: 1.55, messy: true, expr: "gag", pose: "holdOut", hold: { r: (x, y, sc) => H.bible(x + 10, y - 6, sc, 1) }, stink: false });
          s += fx.dust(w * 0.72, h * 0.42, 2.2) + fx.dust(w * 0.85, h * 0.3, 1.4);
          return s;
        },
        b: (w, h) => [sfx("FWOOOF!", w * 0.68, 64, { size: 50, rot: 8, color: "#e8e2d4" }), say("*cough*", 80, 60, [w * 0.3, 150], { w: 70, lower: true })],
      },
      {
        alt: "A close-up of the open Bible, glowing, showing Ephesians 6:1. Lexington peeks in from the side.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#232a52");
          s += P.bibleOpen(w * 0.42, h * 0.56, 1.25, { glow: true, head: ["EPHESIANS", "CHAPTER 6"], leftSkip: [-60, 70] });
          s += lex({ x: w * 0.93, y: h + 270, s: 1.7, f: -1, messy: true, expr: "think", pose: "think", stink: false });
          return s;
        },
        b: (w, h) => [verse("“Children, obey your parents in the Lord: for this is right.”\n— Ephesians 6:1", w * 0.1, h * 0.36, { w: 330, size: 22 }), say("...Okay. That's pretty direct.", w - 150, 60, [w - 120, 140], { w: 150 })],
      },
      {
        alt: "Lexington sits on his bed reading the Bible in the lamplight, surrounded by verses: Philippians 4:13 and Luke 2.",
        art(w, h) {
          const gy = h * 0.95;
          let s = S.bedroom(w, h, { messy: true, k: 0.9, gy, ox: w * 0.12, time: "night", flies: false, noChair: true, lamp: true });
          s += lex({ x: w * 0.5, y: gy - 30, s: 1.08, messy: true, expr: "shock", pose: "sitRead", hold: { c: H.bookOpen }, stink: false });
          s += `<ellipse cx="${w * 0.5}" cy="${gy - 160}" rx="200" ry="150" fill="url(#lampGlow)" opacity=".55"/>`;
          return s;
        },
        b: (w, h) => [
          verse("“I can do all things through Christ which strengtheneth me.” — Philippians 4:13", 16, 16, { w: 250 }),
          say("ALL things? Even... remembering deodorant?", 180, 220, top("teen", w * 0.5, h * 0.95 - 30, 1.08, { seated: true, dx: -30 }), { w: 150 }),
          verse("Jesus was twelve years old, and He “was subject unto” His parents... “And Jesus increased in wisdom and stature, and in favour with God and man.” — Luke 2:51–52", w - 330, 16, { w: 300, size: 17 }),
          say("Jesus was basically MY age. And He listened.", w - 160, h - 110, top("teen", w * 0.5, h * 0.95 - 30, 1.08, { seated: true, dx: 30 }), { w: 150 }),
        ],
      },
    ],
  });

  page({
    rows: [
      [0.58, [1]],
      [0.42, [0.5, 0.5]],
    ],
    panels: [
      {
        alt: "In the moonlight, Lexington kneels at his bed with his hands folded on his Bible and prays.",
        art(w, h) {
          const gy = h * 0.99;
          let s = frect(0, 0, w, h, "#2b3260");
          s += frect(0, gy - 120, w, 120, "#23284e");
          s += P.window(w / 2 - 110, 60, 220, 230, { time: "night", curtains: "#5a4a7a" });
          s += `<path d="M${w / 2 - 110} 290 L${w / 2 + 110} 290 L${w / 2 + 330} ${h} L${w / 2 - 330} ${h} Z" fill="#cfe0ff" opacity=".2"/>`;
          s += `<ellipse cx="${w / 2}" cy="${h * 0.56}" rx="300" ry="260" fill="url(#glow)" opacity=".75"/>`;
          s += P.poster(80, 140, 110, 150, "space", -4) + P.poster(w - 190, 150, 100, 130, "robot", 4);
          const bt = gy - 236;
          s += fx.rays(w / 2, bt - 150, 520, "#fff6c8", 18, 0.16);
          s += lex({ x: w / 2, y: bt + 200, s: 1.8, outfit: "pjs", expr: "pray", pose: "kneelPray", stink: false });
          // the side of his bed, seen from the other side
          s += path(`M-20 ${bt + 10} Q${w * 0.25} ${bt - 12} ${w / 2} ${bt + 2} Q${w * 0.75} ${bt - 14} ${w + 20} ${bt + 8} L${w + 20} ${h + 20} L-20 ${h + 20} Z`, "#3f6fb5", { sw: 3.4 });
          s += path(`M60 ${bt + 70} q80 -20 160 0 M${w - 260} ${bt + 60} q90 -24 180 4 M300 ${bt + 150} q120 -16 240 6`, "none", { sw: 2.6, stroke: "#2c4f86" });
          s += path(`M-20 ${bt - 70} Q60 ${bt - 96} 150 ${bt - 70} Q170 ${bt - 20} 140 ${bt + 4} Q60 ${bt + 18} -20 ${bt + 4} Z`, "#f6f1e6", { sw: 3 });
          s += `<g transform="rotate(-8 ${w / 2 - 170} ${bt + 4})">${H.bookOpen(w / 2 - 170, bt + 4, 1.15, 1)}</g>`;
          return s;
        },
        b: (w, h) => [
          pray("God... I don't want to be like this anymore.", 190, 90, [w / 2 - 70, 300], { w: 210 }),
          pray("I'm tired of being in trouble. I'm tired of hurting Mom and Dad.", w - 190, 100, [w / 2 + 70, 300], { w: 220 }),
          pray("Jesus, You gave me a good brain. Help me use it for the RIGHT things.", 180, 330, [w / 2 - 90, 380], { w: 210 }),
          pray("Help me listen. Help me remember. Help me change.", w - 175, 340, [w / 2 + 90, 380], { w: 210 }),
          pray("Amen.", w / 2 + 170, h - 90, [w / 2 + 40, h - 190], { w: 80 }),
        ],
      },
      {
        alt: "A close-up of Lexington's face in the moonlight. His eyes are open now, determined, with a tear on his cheek.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#2b3260") + fx.rays(w * 0.8, -40, 900, "#cfe0ff", 14, 0.18);
          s += lex({ x: w * 0.5, y: h + 420, s: 2.6, outfit: "pjs", expr: "hopeful", pose: "stand", stink: false });
          return s;
        },
        b: (w, h) => [cap("Something changed that night.", 14, 16, { w: 230 }), cap("Not everything. Not all at once. But SOMETHING.", w - 250, h - 90, { w: 230, bg: "#ffffff" })],
      },
      {
        alt: "Late at night at his desk lamp, Lexington draws a blueprint titled Operation: Lexington 2.0.",
        art(w, h) {
          const gy = h * 0.98;
          let s = frect(0, 0, w, h, "#3d4470");
          s += `<ellipse cx="${w * 0.6}" cy="${h * 0.62}" rx="260" ry="200" fill="url(#lampGlow)" opacity=".85"/>`;
          s += lex({ x: w * 0.27, y: gy - 30, s: 1.15, outfit: "pjs", expr: "determined", pose: "write", hold: { r: H.pencil }, seated: true, stink: false });
          s += rect(-10, gy - 150, w + 20, 20, "#b07a4a", { sw: 3 });
          s += blueprint(w * 0.66, gy - 236, 0.78, -4);
          s += P.lamp(w - 70, gy - 150, 1.1, { on: true });
          return s;
        },
        b: (w, h) => [say("If I can build a robot... I can rebuild ME.", w * 0.4, 70, top("teen", w * 0.27, h * 0.98 - 30, 1.15, { seated: true }), { w: 180 })],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 5 — DAY BY DAY
  // =====================================================================
  page({
    chapter: { n: 5, title: "Day by Day", color: "#e09a3e" },
    rows: [
      [0.34, [0.5, 0.5]],
      [0.32, [0.5, 0.5]],
      [0.34, [1]],
    ],
    panels: [
      {
        alt: "At 6:30 in the morning, Lexington springs out of bed on his own while Mom peeks in, shocked.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.walls(w, h, gy, "#b8d7d0", "#7d8fb3", { stripe: true });
          s += P.window(150, 40, 120, 110, { time: "dawn", curtains: "#e8c35a" });
          s += P.door(-30, gy - 280, 110, 280, { color: "#b07a4a" });
          s += mom({ x: 50, y: gy + 10, s: 0.85, expr: "shock", pose: "stand" });
          s += P.bed(w * 0.62, gy, 1.0, { messy: false });
          s += lex({ x: w * 0.6, y: gy - 40, s: 1.0, outfit: "pjs", expr: "joy", pose: "cheer", stink: false });
          s += P.alarm(w - 40, gy - 6, 0.9, { ring: true, color: "#2a8f86" });
          return s;
        },
        b: (w, h) => [cap("DAY 1. 6:30 A.M.", w - 170, 14, { w: 150 }), say("Up and at 'em!", w * 0.62, 80, top("teen", w * 0.6, h * 0.96 - 40, 1.0), { w: 110 })],
      },
      {
        alt: "Lexington brushes his teeth properly while a sand timer counts two minutes.",
        art(w, h) {
          const gy = h * 1.0,
            k = 1.0,
            ox = w * 0.38;
          let s = S.bathroom(w, h, { k, gy, ox });
          s += H.sandTimer(ox - 60, gy - 106, 1.2, 1);
          s += lex({ x: ox + 150, y: gy + 6, s: 1.1, f: -1, outfit: "pjs", expr: "focus", pose: "brush", hold: { r: H.toothbrush }, stink: false });
          return s;
        },
        b: (w, h) => [cap("Two full minutes. Top, bottom, back teeth, tongue.", 14, 14, { w: 210 })],
      },
      {
        alt: "Steam and singing drift from behind the bathroom door while Mom and Dad stare at each other in the hallway.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.walls(w, h, gy, "#d8c8e6", "#b9814f", { stripe: true }) + `<rect x="0" y="${gy}" width="${w}" height="${h - gy}" fill="url(#planks)"/>`;
          s += P.door(w - 160, gy - 300, 130, 300, { color: "#f6f1e6" });
          s += fx.steam(w - 95, gy - 10, 0.9) + `<rect x="${w - 160}" y="${gy - 6}" width="130" height="6" fill="#ffffff" opacity=".8"/>`;
          s += fx.notes(w - 120, gy - 330, 1.2);
          s += mom({ x: 80, y: h + 70, s: 0.85, expr: "shock", pose: "heart" });
          s += dad({ x: 210, y: h + 76, s: 0.85, f: -1, expr: "shock", pose: "stand" });
          return s;
        },
        b: (w, h) => [
          say("♪ This little light of mine... ♪", w - 120, 60, [w - 95, 150], { w: 140, lower: true }),
          say("Is he... SHOWERING? Without being TOLD?", 150, 66, top("man", 210, h + 76, 0.85), { w: 170 }),
        ],
      },
      {
        alt: "Dressed in fresh clothes, Lexington puts on deodorant and sparkles.",
        art(w, h) {
          let s = S.rays(w, h, "#d6f0ec", "#ffffff", w * 0.4, h * 0.5);
          s += lex({ x: w * 0.4, y: h * 0.98, s: 1.18, expr: "confident", pose: "sniff", hold: { r: H.deodorant }, sparkle: true });
          return s;
        },
        b: (w, h) => [note("Deodorant ✓\nClean clothes ✓\nClean socks (BOTH!) ✓", w - 214, 40, { w: 200 })],
      },
      {
        alt: "Lexington walks into the kitchen sparkling clean. Mom sniffs in amazement, Dad spills his coffee, and Biscuit hugs Lexington's leg.",
        art(w, h) {
          const gy = h * 0.97,
            k = 0.85,
            ox = 340;
          let s = S.kitchen(w, h, { k, gy, ox, table: false });
          s += mom({ x: 500, y: gy, s: 0.86, expr: "surprised", pose: "sniff", seated: true });
          s += dad({ x: 690, y: gy, s: 0.86, f: -1, expr: "gasp", pose: "holdOut", seated: true });
          s += P.table(590, gy, 0.86, { cloth: "#e8536b" });
          s += T(610, gy - 150, 1, `<g transform="rotate(50)">${H.coffee(0, 0, 0.9, 1)}</g>`) + path(`M630 ${gy - 140} q20 20 6 50`, "none", { sw: 6, stroke: "#6b4430" });
          s += lex({ x: 200, y: gy, s: 0.92, expr: "joy", pose: "wave", sparkle: true });
          s += P.dog(300, gy + 4, 0.85, { mood: "love", f: -1 });
          return s;
        },
        b: (w, h) => [
          say("Good morning, family!", 150, 60, top("teen", 200, h * 0.97, 0.92), { w: 150 }),
          say("Is that... CLEAN BOY smell?", 470, 70, top("woman", 500, h * 0.97, 0.86, { seated: true }), { w: 150 }),
          sfx("SPLOSH!", 790, 150, { size: 40, rot: 10, color: "#c99a6a" }),
        ],
      },
    ],
  });

  page({
    rows: [
      [0.36, [0.45, 0.55]],
      [0.31, [0.5, 0.5]],
      [0.33, [1]],
    ],
    panels: [
      {
        alt: "Gaming on the couch, Lexington pauses right away when he needs the bathroom.",
        art(w, h) {
          const gy = h * 0.93;
          let s = S.living(w, h, { k: 0.95, gy, ox: w * 0.5, tvGlow: [w / 2, h * 0.45] });
          s += lex({ x: w * 0.5, y: gy - 22, s: 1.02, expr: "determined", pose: "game", hold: { r: H.controller }, handsOver: true });
          s += rect(w - 90, 30, 70, 70, "#ffffff", { sw: 3, r: 10 }) + rect(w - 72, 46, 12, 38, INK, { sw: 0 }) + rect(w - 52, 46, 12, 38, INK, { sw: 0 });
          return s;
        },
        b: (w, h) => [think("Body says GO? I GO. No more 'one more level.'", w * 0.42, 80, top("teen", w * 0.5, h * 0.93 - 22, 1.02, { seated: true }), { w: 170 }), sfx("PAUSE", w - 56, 130, { size: 28, rot: 0, color: "#ffffff" })],
      },
      {
        alt: "Lexington proudly points to his own handwritten bathroom checklist taped to the bathroom door.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.walls(w, h, gy, "#d8c8e6", "#b9814f", { stripe: true }) + `<rect x="0" y="${gy}" width="${w}" height="${h - gy}" fill="url(#planks)"/>`;
          s += P.door(30, 40, 300, gy - 40, { color: "#f6f1e6" });
          s += `<g transform="rotate(-1.5 180 220)">${rect(54, 70, 252, 290, "#fff8b8", { sw: 3 })}${text(180, 104, "LEX'S BATHROOM", { size: 24, font: "title", fill: "#c9473c", ls: 1 })}${text(180, 128, "CHECKLIST", { size: 22, font: "title", fill: "#c9473c", ls: 2 })}`;
          ["Go as soon as you feel it", "Wipe until the paper", "   comes back clean", "Flush!", "Wash hands: soap +", "   20 seconds", "Mirror check"].forEach((t, i) => {
            const num = ["1.", "2.", "", "3.", "4.", "", "5."][i];
            s += text(70, 164 + i * 28, num, { size: 21, font: "hand", anchor: "start", weight: 400 }) + text(94, 164 + i * 28, t.trim(), { size: 21, font: "hand", anchor: "start", weight: 400 });
          });
          s += `</g>` + rect(170, 60, 22, 14, "#cfe6ec", { sw: 1.6, op: 0.8 });
          s += lex({ x: w - 110, y: gy, s: 1.02, f: -1, expr: "proud", pose: "point" });
          return s;
        },
        b: (w, h) => [say("Wrote it myself.", w - 110, 60, top("teen", w - 110, h * 0.97, 1.02), { w: 110 })],
      },
      {
        alt: "Lexington washes his hands with soap, singing, as Dad walks by and starts to remind him.",
        art(w, h) {
          const gy = h * 1.02,
            k = 0.95,
            ox = w * 0.36;
          let s = S.bathroom(w, h, { k, gy, ox, running: true });
          s += lex({ x: ox + 20, y: gy - 10, s: 1.0, f: 1, expr: "peace", pose: "holdBoth" });
          s += T(ox + 20, gy - 160, 1, circle(-10, 0, 7, "#ffffff", { sw: 1.8 }) + circle(8, -8, 9, "#ffffff", { sw: 1.8 }) + circle(18, 6, 6, "#ffffff", { sw: 1.6 }));
          s += fx.notes(ox + 80, gy - 320, 0.9);
          s += dad({ x: w - 60, y: h + 100, s: 0.95, f: -1, expr: "talk", pose: "point" });
          return s;
        },
        b: (w, h) => [say("♪ Happy birthday to me... ♪", w * 0.26, 54, top("teen", w * 0.36 + 20, h * 1.02 - 10, 1.0), { w: 150, lower: true }), say("Lex, did you rem—", w - 110, 70, top("man", w - 60, h + 100, 0.95, { dx: -10 }), { w: 110 })],
      },
      {
        alt: "Dad gives a surprised thumbs up as Lexington grins.",
        art(w, h) {
          let s = S.rays(w, h, "#d6e4f5", "#ffffff", w * 0.5, h * 0.4);
          s += dad({ x: w * 0.36, y: h + 170, s: 1.25, expr: "surprised", pose: "thumbs" });
          s += lex({ x: w * 0.78, y: h + 80, s: 1.15, f: -1, expr: "grin", pose: "stand", sparkle: true });
          return s;
        },
        b: (w, h) => [say("...Oh. You DID.", w * 0.3, 54, [w * 0.36, 130], { w: 120 }), say("Every time now, Dad.", w * 0.74, 100, [w * 0.76, 180], { w: 110 })],
      },
      {
        alt: "A four-part montage of Lexington doing chores without being asked: trash, dishes, making his bed and feeding Biscuit.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#2a8f86") + `<rect width="${w}" height="${h}" fill="url(#dotsWhite)"/>`;
          const pw = (w - 50) / 4,
            ph = h - 90,
            y0 = 70;
          const vign = [
            (W2, H2) => S.yard(W2, H2, { k: 0.55, gy: H2 * 0.95, ox: W2 * 0.8, house: false }) + P.trashCan(W2 * 0.75, H2 * 0.97, 0.75, { full: true }) + lex({ x: W2 * 0.4, y: H2 * 0.98, s: 0.72, expr: "happy", pose: "carry", hold: { r: H.trashBag } }),
            (W2, H2) => S.kitchen(W2, H2, { k: 0.55, gy: H2 * 0.95, ox: W2 * 1.05, table: false }) + lex({ x: W2 * 0.5, y: H2 * 0.98, s: 0.72, expr: "focus", pose: "holdBoth", hold: { c: H.dishes } }),
            (W2, H2) => S.walls(W2, H2, H2 * 0.9, "#b8d7d0", "#7d8fb3") + P.bed(W2 * 0.55, H2 * 0.95, 0.62, {}) + lex({ x: W2 * 0.3, y: H2 * 0.98, s: 0.72, expr: "peace", pose: "present" }) + fx.sparkle(W2 * 0.7, H2 * 0.5, 9),
            (W2, H2) => S.walls(W2, H2, H2 * 0.9, "#f3dfb5", "#b9814f") + lex({ x: W2 * 0.35, y: H2 * 0.98, s: 0.72, expr: "joy", pose: "present" }) + ellipse(W2 * 0.68, H2 * 0.92, 26, 9, "#c9473c", { sw: 2.4 }) + P.dog(W2 * 0.72, H2 * 0.96, 0.6, { mood: "love", f: -1 }),
          ];
          const labels = ["TRASH", "DISHES", "BED", "BISCUIT'S BREAKFAST"];
          vign.forEach((fn, i) => {
            const x = 10 + i * (pw + 10);
            s += sub(x, y0, pw, ph, fn(pw, ph), "#ffffff");
            s += `<g transform="rotate(-3 ${x + pw / 2} ${y0 + ph - 18})">${rect(x + 10, y0 + ph - 36, pw - 20, 30, "#ffd95e", { sw: 2.6 })}${text(x + pw / 2, y0 + ph - 15, labels[i], { size: 18, font: "title", ls: 1 })}</g>`;
          });
          return s;
        },
        b: (w, h) => [cap("Trash. Dishes. Bed. Biscuit's breakfast. And nobody had to ask.", w / 2 - 260, 14, { w: 500, align: "center" })],
      },
    ],
  });

  page({
    rows: [
      [0.31, [0.5, 0.5]],
      [0.37, [1]],
      [0.32, [0.5, 0.5]],
    ],
    panels: [
      {
        alt: "On day five, Mom reminds Lexington about the trash and he slaps his forehead.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.kitchen(w, h, { k: 0.85, gy, ox: w * 0.95, table: false });
          s += P.trashCan(60, gy, 1.0, { full: true });
          s += mom({ x: 150, y: h + 50, s: 0.85, expr: "talk", pose: "hips" });
          s += lex({ x: 360, y: h + 30, s: 0.92, f: -1, expr: "wince", pose: "facepalm" });
          return s;
        },
        b: (w, h) => [cap("DAY 5.", 14, 14, { w: 80 }), say("Lexington... the trash?", 170, 74, top("woman", 150, h + 50, 0.85, { dx: 10 }), { w: 120 }), shout("AW, MAN! I forgot!", 370, 80, top("teen", 360, h + 30, 0.92), { w: 110, size: 18 })],
      },
      {
        alt: "Sitting on his bed, Lexington hears his old self, a tiny ghostly messy version on his shoulder, telling him to quit.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.walls(w, h, gy, "#b8d7d0", "#7d8fb3", { stripe: true });
          s += P.bed(w * 0.55, gy, 1.0, {});
          s += lex({ x: w * 0.55, y: gy - 40, s: 1.0, expr: "determined", pose: "sitHands" });
          s += ghost(lex({ x: w * 0.32, y: gy - 230, s: 0.38, messy: true, expr: "sly", pose: "hips" }), 0.7);
          s += fx.stink(w * 0.32, gy - 300, 0.4);
          return s;
        },
        b: (w, h) => [whisper("See? You can't do this. Just quit.", 100, 60, [w * 0.3, h * 0.97 - 330], { w: 130, lower: true }), say("Nope.", w * 0.72, 90, top("teen", w * 0.55, h * 0.97 - 40, 1.0, { seated: true, dx: 10 }), { w: 70 })],
      },
      {
        alt: "Lexington checks off another day on a row of wall calendars, now filling up with green check marks.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.walls(w, h, gy, "#b8d7d0", "#7d8fb3", { stripe: true });
          s += P.calendar(60, 150, 180, 180, { title: "MAY", checks: 7 });
          s += P.calendar(270, 140, 180, 180, { title: "JUNE", checks: 21, color: "#2a8f86" });
          s += P.calendar(480, 150, 180, 180, { title: "JULY", checks: 35, color: "#3f6fb5" });
          s += lex({ x: 770, y: gy, s: 1.1, f: -1, expr: "determined", pose: "point", hold: { r: H.marker } });
          s += P.dog(890, gy + 6, 0.85, { mood: "happy", f: -1 });
          return s;
        },
        b: (w, h) => [
          verse("“And let us not be weary in well doing: for in due season we shall reap, if we faint not.” — Galatians 6:9", 16, 16, { w: 420 }),
          say("One slip isn't the end. I just get back up.", 790, 70, top("teen", 770, h * 0.97, 1.1), { w: 170 }),
          sfx("DAY 7", 150, 370, { size: 32, rot: -4, color: "#ffffff" }),
          sfx("DAY 21", 360, 362, { size: 32, rot: -2, color: "#ffffff" }),
          sfx("DAY 40!", 570, 372, { size: 36, rot: -4, color: "#ffd23f" }),
        ],
      },
      {
        alt: "Mom finds the dishes already done and dramatically faints into Dad's arms.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.kitchen(w, h, { k: 0.8, gy, ox: w * 1.15, table: false, dishes: true });
          s += dad({ x: w * 0.62, y: gy + 4, s: 0.9, f: -1, expr: "gasp", pose: "hug" });
          s += mom({ x: w * 0.46, y: gy + 10, s: 0.88, expr: "dazed", pose: "cheer", lean: -28 });
          return s;
        },
        b: (w, h) => [shout("Honey? HONEY!", w * 0.76, 60, top("man", w * 0.62, h * 0.97, 0.9, { dx: 10 }), { w: 110, size: 18 }), say("He did the dishes... without being ASKED...", 120, 70, [w * 0.35, 150], { w: 150 })],
      },
      {
        alt: "Dad and Lexington bump fists, both smiling.",
        art(w, h) {
          let s = S.rays(w, h, "#ffe3c2", "#fff6e6", w * 0.5, h * 0.55);
          s += dad({ x: w * 0.3, y: h + 150, s: 1.1, expr: "proud", pose: "handshake", handR: "fist" });
          s += lex({ x: w * 0.74, y: h + 60, s: 1.15, f: -1, expr: "joy", pose: "handshake", handR: "fist" });
          s += fx.sparkle(w * 0.52, h * 0.52, 16, "#ffd23f");
          return s;
        },
        b: (w, h) => [say("Proud of you, son.", w * 0.26, 54, [w * 0.3, 130], { w: 120 }), sfx("BUMP!", w * 0.52, h * 0.38, { size: 34, rot: -6, color: "#ffd23f" })],
      },
    ],
  });
})();
