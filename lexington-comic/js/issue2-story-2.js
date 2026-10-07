/* Lexington Issue #2: Down to Business — script part 2: chapters 4–8 and back pages. */
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
    tonyC = C.tonyCrew,
    bubbles = C.bubbles,
    sub = C.sub;

  // =====================================================================
  // CHAPTER 4 — HONEST WORK
  // =====================================================================
  page({
    chapter: { n: 4, title: "Honest Work", color: "#7a3f8f" },
    rows: [
      [0.36, [1]],
      [0.3, [0.5, 0.5]],
      [0.34, [1]],
    ],
    panels: [
      {
        alt: "Vacuuming under the seat of Brother Wilson's truck, Lexington finds a folded fifty-dollar bill. Jonathan's eyes go wide.",
        art(w, h) {
          const gy = h * 0.8;
          let s = S.driveway(w, h, { k: 0.8, gy, ox: w * 1.1 });
          s += P.car(w * 0.42, h * 0.99, 0.72, { kind: "truck", color: "#3f7d56" });
          s += lexC({ x: w * 0.68, y: h + 50, s: 1.0, f: -1, expr: "shock", pose: "holdOut", hold: { r: (x, y, sc) => T(x, y - 10, sc * 1.3, rect(-22, -10, 44, 20, "#8fcf7a", { sw: 2, r: 2 }) + text(0, 6, "50", { size: 14, font: "title", fill: "#2f6a2a" })), l: H.vac } });
          s += jon({ x: w * 0.88, y: h + 50, s: 1.0, f: -1, outfit: "crew", expr: "gasp", pose: "handsHead" });
          return s;
        },
        b: (w, h) => [sfx("BEEP BEEP!", w * 0.48, 60, { size: 40, rot: -6, color: "#f0b429" }), say("Whoa.", w * 0.62, 150, top("teen", w * 0.68, h + 50, 1.0), { w: 60 }), shout("FIFTY BUCKS! Finders keepers?", w * 0.86, 80, top("teen", w * 0.88, h + 50, 1.0), { w: 130, size: 18 })],
      },
      {
        alt: "Lexington and Tony look at each other.",
        art(w, h) {
          let s = S.burst(w, h, "#e6d4ff", "#f6efff", w * 0.5, h * 0.5);
          s += lexC({ x: w * 0.28, y: h + 120, s: 1.15, expr: "determined", pose: "stand" });
          s += tonyC({ x: w * 0.76, y: h + 240, s: 1.1, f: -1, expr: "determined", pose: "cross" });
          return s;
        },
        b: (w, h) => [say("Rule number one...", w * 0.28, 60, top("teen", w * 0.28, h + 120, 1.15), { w: 100 }), say("We tell the truth...", w * 0.78, 80, top("man", w * 0.76, h + 240, 1.1), { w: 100 })],
      },
      {
        alt: "Jonathan sighs and nods.",
        art(w, h) {
          let s = S.burst(w, h, "#d9f2d0", "#f2fbef", w * 0.5, h * 0.5);
          s += jon({ x: w * 0.5, y: h + 130, s: 1.2, outfit: "crew", expr: "sheepish", pose: "headScratch" });
          return s;
        },
        b: (w, h) => [say("...even when it costs us. Yeah, yeah. I know.", w * 0.5, 60, top("teen", w * 0.5, h + 130, 1.2), { w: 180 })],
      },
      {
        alt: "Lexington hands the money back to Brother Wilson, who is amazed and promises to tell everyone about the honest boys.",
        art(w, h) {
          const gy = h * 0.8;
          let s = S.driveway(w, h, { k: 0.8, gy, ox: w * 0.95 });
          s += npc("wilson", { x: w * 0.3, y: h + 140, s: 1.0, expr: "touched", pose: "heart" });
          s += lexC({ x: w * 0.52, y: h + 70, s: 1.0, f: -1, expr: "happy", pose: "present", hold: { r: H.money } });
          s += jon({ x: w * 0.7, y: h + 70, s: 0.95, f: -1, outfit: "crew", expr: "happy", pose: "stand" }) + tonyC({ x: w * 0.86, y: h + 130, s: 0.92, f: -1, expr: "proud", pose: "cross" });
          return s;
        },
        b: (w, h) => [
          say("I've been looking for that all week! It's my daughter's birthday money.", w * 0.18, 70, top("man", w * 0.3, h + 140, 1.0, { dx: -16 }), { w: 200 }),
          say("You boys just earned a customer for LIFE. And I'm telling EVERYONE.", w * 0.68, 70, top("man", w * 0.3, h + 140, 1.0, { dx: 30 }), { w: 210 }),
          cap("Honesty turned out to be worth a whole lot more than fifty dollars.", 16, h - 70, { w: 360 }),
        ],
      },
    ],
  });

  page({
    rows: [
      [0.32, [0.5, 0.5]],
      [0.34, [1]],
      [0.34, [0.45, 0.55]],
    ],
    panels: [
      {
        alt: "Tony's phone buzzes nonstop with new bookings.",
        art(w, h) {
          let s = S.rays(w, h, "#d6e4f5", "#ffffff", w * 0.3, h * 0.6);
          s += tonyC({ x: w * 0.28, y: h + 200, s: 1.05, expr: "shock", pose: "holdOut", hold: { r: H.phone } });
          ["Can you do my van Saturday?", "Heard you're HONEST. Booking 2!", "Brother Wilson sent me!", "Do you do minivans?"].forEach((t, i) => {
            const y = 40 + i * 74;
            s += rect(w * 0.48, y, w * 0.48, 56, "#ffffff", { sw: 2.6, r: 14 }) + text(w * 0.72, y + 34, t, { size: 15, weight: 700 });
          });
          return s;
        },
        b: (w, h) => [sfx("BZZT! BZZT!", w * 0.2, 60, { size: 34, rot: -8, color: "#ffd23f" })],
      },
      {
        alt: "Booked solid, Tony shows the calendar: three Saturdays full.",
        art(w, h) {
          let s = S.rays(w, h, "#d9f2d0", "#ffffff", w * 0.5, h * 0.5);
          s += P.calendar(w * 0.08, 50, w * 0.58, h - 100, { title: "JULY", checks: 0, color: "#3f9b5a" });
          [5, 6, 12, 13, 19, 20].forEach((d) => {
            const c = d % 7,
              r = Math.floor(d / 7);
            const cw = (w * 0.58 - 12) / 7,
              ch = ((h - 100) * 0.76 - 8) / 5;
            s += frect(w * 0.08 + 6 + c * cw + 2, 50 + (h - 100) * 0.22 + 4 + r * ch + 2, cw - 6, ch - 6, "#4fb3e8", 0.75);
          });
          s += tonyC({ x: w * 0.82, y: h + 210, s: 1.0, f: -1, expr: "grin", pose: "point" });
          return s;
        },
        b: (w, h) => [say("We're booked solid for THREE Saturdays.", w * 0.84, 60, top("man", w * 0.82, h + 210, 1.0), { w: 140 })],
      },
      {
        alt: "Rushing through a car, the boys leave soap streaks. Sister Larsen points out the spots they missed.",
        art(w, h) {
          const gy = h * 0.8;
          let s = S.driveway(w, h, { k: 0.8, gy, ox: w * 1.05 });
          s += P.car(w * 0.55, h * 0.98, 0.66, { color: "#f6f3ea", kind: "sedan" });
          [[0.42, 0.62], [0.5, 0.7], [0.62, 0.6], [0.7, 0.74]].forEach(([a, b]) => (s += path(`M${w * a} ${h * b} q20 -10 40 4 q20 10 40 -2`, "none", { sw: 5, stroke: "#c9c3b5", op: 0.9 })));
          s += npc("larsen", { x: w * 0.12, y: h + 80, s: 0.95, expr: "stern", pose: "point" });
          s += lexC({ x: w * 0.84, y: h + 40, s: 0.95, f: -1, expr: "sheepish", pose: "headScratch" }) + jon({ x: w * 0.96, y: h + 40, s: 0.95, f: -1, outfit: "crew", expr: "nervous", pose: "stand" });
          return s;
        },
        b: (w, h) => [cap("With so many customers, the boys started to rush...", 16, 16, { w: 290 }), say("Boys? You missed a spot. Several, actually.", w * 0.28, 140, top("woman", w * 0.12, h + 80, 0.95, { dx: 20 }), { w: 160 })],
      },
      {
        alt: "Lexington apologizes and offers to redo the job for free. Sister Larsen approves.",
        art(w, h) {
          let s = S.rays(w, h, "#ffe3c2", "#fff6e6", w * 0.5, h * 0.5);
          s += lexC({ x: w * 0.3, y: h + 120, s: 1.1, expr: "determined", pose: "holdOut", hold: { r: H.sponge } });
          s += npc("larsen", { x: w * 0.75, y: h + 160, s: 1.05, f: -1, expr: "proud", pose: "heart" });
          return s;
        },
        b: (w, h) => [say("We're sorry, Sister Larsen. We'll wash it again. For free.", w * 0.26, 60, top("teen", w * 0.3, h + 120, 1.1), { w: 160 }), say("Now THAT is how you run a business.", w * 0.78, 110, top("woman", w * 0.75, h + 160, 1.05), { w: 130 }), cap("Do it right, or do it twice.", 14, h - 54, { w: 220 })],
      },
      {
        alt: "At his desk with a calculator, Lexington works out that the 3D printer will take thirty cars, about sixty hours of scrubbing.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#3d4470");
          s += `<ellipse cx="${w * 0.5}" cy="${h * 0.6}" rx="${w * 0.45}" ry="${h * 0.45}" fill="url(#lampGlow)" opacity=".6"/>`;
          s += lex({ x: w * 0.3, y: h + 60, s: 1.05, expr: "shock", pose: "holdBoth", hold: { c: H.calculator }, seated: true });
          s += rect(-10, h * 0.84, w + 20, 30, "#b07a4a", { sw: 3 });
          s += P.paper(w * 0.52, 40, w * 0.42, 200, "3D PRINTER", ["$299", "= 30 cars", "= 60 hours", "  of scrubbing!"], { rot: 3, titleSize: 22, size: 24, lh: 32, color: "#c9473c" });
          return s;
        },
        b: (w, h) => [think("Huh. Money really isn't free.", w * 0.3, h * 0.36, top("teen", w * 0.3, h + 60, 1.05, { seated: true }), { w: 120 })],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 5 — THE LORD'S SHARE
  // =====================================================================
  page({
    chapter: { n: 5, title: "The Lord's Share", color: "#b5843c" },
    rows: [
      [0.36, [0.5, 0.5]],
      [0.32, [1]],
      [0.32, [0.5, 0.5]],
    ],
    panels: [
      {
        alt: "Dad comes home tired from work. Lexington asks how many hours he works each week. About fifty.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.hall(w, h, { k: 0.7, gy, ox: w * 0.9, door: true, time: "night" });
          s += dad({ x: w * 0.3, y: h + 90, s: 1.0, expr: "sleepy", pose: "stand", hold: { r: (x, y, sc) => T(x, y + 20, sc, rect(-26, -10, 52, 40, "#5a3a26", { sw: 2.4, r: 4 }) + path("M-10 -10 q10 -14 20 0", "none", { sw: 3 })) } });
          s += lex({ x: w * 0.75, y: h + 40, s: 1.0, f: -1, expr: "think", pose: "stand" });
          return s;
        },
        b: (w, h) => [say("Dad... how many hours do you work every week?", w * 0.74, 60, top("teen", w * 0.75, h + 40, 1.0), { w: 150 }), say("Oh, about fifty. Why?", w * 0.26, 150, top("man", w * 0.3, h + 90, 1.0), { w: 110 })],
      },
      {
        alt: "Lexington hugs Dad and thanks him for working so hard. Dad is touched.",
        art(w, h) {
          let s = S.rays(w, h, "#ffe3c2", "#fff6e6", w * 0.5, h * 0.5);
          s += dad({ x: w * 0.4, y: h + 170, s: 1.1, expr: "touched", pose: "hug" });
          s += lex({ x: w * 0.6, y: h + 70, s: 1.1, f: -1, expr: "peace", pose: "hug" });
          s += fx.heart(w * 0.5, 70, 14) + fx.heart(w * 0.58, 46, 9);
          return s;
        },
        b: (w, h) => [say("Thanks for working so hard for us, Dad.", w * 0.76, 90, top("teen", w * 0.6, h + 70, 1.1, { dx: 20 }), { w: 130 }), say("...Anytime, son.", w * 0.2, 80, top("man", w * 0.4, h + 170, 1.1, { dx: -20 }), { w: 90 })],
      },
      {
        alt: "At the kitchen table, Lexington pays Dad back the full eighty dollars early. Dad stamps the I.O.U. paid in full.",
        art(w, h) {
          let s = S.kitchen(w, h, { k: 0.85, gy: h * 0.97, ox: w * 0.25, table: false });
          s += dad({ x: w * 0.32, y: h * 0.97, s: 0.95, expr: "proud", pose: "sitHands", seated: true });
          s += lexC({ x: w * 0.6, y: h * 0.97, s: 0.95, f: -1, expr: "proud", pose: "present", hold: { r: H.money } });
          s += P.table(w * 0.45, h * 0.97 + 10, 1.2, { cloth: "#e8536b" });
          s += P.paper(w * 0.68, 30, 230, 150, "I.O.U.  $80", ["Pay back from first earnings."], { rot: 4, color: "#c9473c", titleSize: 24 });
          s += `<g transform="rotate(-14 ${w * 0.8} 120)">${rect(w * 0.7, 98, 200, 46, "none", { sw: 4, stroke: "#2a9d5a" })}${text(w * 0.7 + 100, 132, "PAID IN FULL", { size: 30, font: "title", fill: "#2a9d5a", ls: 2 })}</g>`;
          return s;
        },
        b: (w, h) => [say("Paid back in full... and EARLY. I'm impressed, son.", w * 0.22, 60, top("man", w * 0.32, h * 0.97, 0.95, { seated: true, dx: -20 }), { w: 170 })],
      },
      {
        alt: "Tony's whiteboard shows how the money gets divided: earnings, supplies, the loan, business savings, then a three-way split.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#2a5a9a") + `<rect width="${w}" height="${h}" fill="url(#dotsWhite)"/>`;
          s += P.whiteboard(24, 24, w - 48, h - 48, "WHERE THE MONEY GOES", ["Earned (2 Saturdays) ...... $420", "Soap + supplies ............ − $30", "Dad's loan (PAID!) ......... − $80", "Business savings ........... − $40", "Split 3 ways ... $90 each!"], { size: 19, lh: 31, titleSize: 22, hi: 4 });
          return s;
        },
        b: () => [],
      },
      {
        alt: "Lexington divides his ninety dollars into four jars: tithing, mission, save and spend.",
        art(w, h) {
          let s = S.walls(w, h, h * 0.98, "#b8d7d0", "#7d8fb3", { stripe: true });
          s += rect(-10, h * 0.82, w + 20, 30, "#b07a4a", { sw: 3 });
          s += P.jar(w * 0.14, h * 0.82, 0.8, "TITHE", 0.2, "#ffe0b0") + P.jar(w * 0.36, h * 0.82, 0.8, "MISSION", 0.5, "#bfe8ff") + P.jar(w * 0.58, h * 0.82, 0.8, "SAVE", 0.6, "#c9f2c0") + P.jar(w * 0.8, h * 0.82, 0.8, "SPEND", 0.25, "#ffd1dc");
          ["$9", "$30", "$36", "$15"].forEach((t, i) => (s += text(w * (0.14 + i * 0.22), h * 0.93, t, { size: 26, font: "title", fill: "#ffffff", stroke: INK, sw: 4 })));
          return s;
        },
        b: (w, h) => [verse("“Bring ye all the tithes into the storehouse... and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven.” — Malachi 3:10", 16, 16, { w: w - 60, size: 16 })],
      },
      {
        alt: "Lexington fills out a tithing slip. Jonathan is surprised he pays tithing on car wash money, then decides to pay his too.",
        art(w, h) {
          let s = S.rays(w, h, "#fff3c8", "#ffffff", w * 0.4, h * 0.5);
          s += lex({ x: w * 0.3, y: h + 100, s: 1.05, expr: "peace", pose: "holdBoth", hold: { c: H.slip } });
          s += jon({ x: w * 0.76, y: h + 100, s: 1.05, f: -1, expr: "surprised", pose: "stand" });
          return s;
        },
        b: (w, h) => [
          say("Wait. You pay tithing on CAR WASH money?", w * 0.78, 54, top("teen", w * 0.76, h + 100, 1.05), { w: 130 }),
          say("On everything the Lord helps me earn.", w * 0.26, 110, top("teen", w * 0.3, h + 100, 1.05), { w: 120 }),
          say("...Then I'm paying mine too.", w * 0.78, h * 0.52, top("teen", w * 0.76, h + 100, 1.05, { dx: 10 }), { w: 110 }),
        ],
      },
    ],
  });

  page({
    rows: [
      [0.44, [1]],
      [0.28, [0.5, 0.5]],
      [0.28, [1]],
    ],
    panels: [
      {
        alt: "On Sunday in sacrament meeting, Lexington and Jonathan, in white shirts and ties, reverently pass the sacrament to the congregation.",
        art(w, h) {
          // looking from the front of the chapel toward the congregation
          let s = frect(0, 0, w, h, "#efe6d4");
          s += frect(0, h * 0.34, w, h * 0.66, "#b07a4a") + line(0, h * 0.34, w, h * 0.34, { sw: 2.4 });
          [0.06, 0.82].forEach((fxp) => (s += rect(w * fxp, 30, w * 0.12, h * 0.26, "#e8f2f6", { sw: 3 })));
          s += rect(w * 0.4, 40, w * 0.2, h * 0.3, "#8a5a3c", { sw: 3 }) + line(w * 0.5, 40, w * 0.5, h * 0.34, { sw: 3 });
          s += circle(w * 0.5, 22, 14, "#ffffff", { sw: 2.4 });
          const back = h * 0.66;
          s += npc("larsen", { x: w * 0.12, y: back, s: 0.62, expr: "pray", pose: "sitHands", seated: true }) + npc("wilson", { x: w * 0.25, y: back, s: 0.6, expr: "neutral", pose: "sitHands", seated: true });
          s += npc("elderA", { x: w * 0.72, y: back, s: 0.6, expr: "pray", pose: "sitHands", seated: true }) + npc("elderB", { x: w * 0.85, y: back, s: 0.6, expr: "peace", pose: "sitHands", seated: true });
          s += P.pew(-20, back + 24, w * 0.4, {}) + P.pew(w * 0.6, back + 24, w * 0.42, {});
          s += jon({ x: w * 0.47, y: back + 12, s: 0.72, outfit: "church", expr: "pray", pose: "holdBoth", hold: { c: H.tray } });
          const front = h + 40;
          s += mom({ x: w * 0.08, y: front, s: 0.9, outfit: "church", expr: "pray", pose: "sitHands", seated: true }) + dad({ x: w * 0.25, y: front, s: 0.9, outfit: "church", expr: "peace", pose: "sitHands", seated: true });
          s += tony({ x: w * 0.75, y: front, s: 0.9, outfit: "church", expr: "peace", pose: "sitHands", seated: true });
          s += P.pew(-20, front + 30, w * 0.42, {}) + P.pew(w * 0.6, front + 30, w * 0.42, {});
          s += lex({ x: w * 0.54, y: front - 20, s: 1.0, f: 1, outfit: "church", expr: "peace", pose: "holdBoth", hold: { c: H.tray } });
          s += `<rect width="${w}" height="${h}" fill="#fff3c8" opacity=".1"/>`;
          return s;
        },
        b: (w, h) => [cap("On Sunday, the Suds Brothers were closed. Lexington and Jonathan had more important work.", 16, 16, { w: 330 })],
      },
      {
        alt: "Lexington sits quietly and reverently with his family after passing the sacrament.",
        art(w, h) {
          let s = S.chapel(w, h, { k: 0.5, gy: h * 0.55, ox: w * 0.5, light: true });
          s += lex({ x: w * 0.5, y: h + 30, s: 1.05, outfit: "church", expr: "peace", pose: "sitHands", seated: true });
          s += P.pew(-20, h + 60, w + 40, {});
          return s;
        },
        b: (w, h) => [verse("“Six days shalt thou labour, and do all thy work: But the seventh day is the sabbath of the LORD thy God.” — Exodus 20:9–10", 14, 14, { w: w - 40, size: 16 })],
      },
      {
        alt: "In the church hallway, Lexington hands his tithing envelope to Bishop Carter.",
        art(w, h) {
          let s = S.foyer(w, h, { k: 0.6, gy: h * 0.96, ox: w * 0.5 });
          s += npc("bishop", { x: w * 0.28, y: h + 140, s: 1.0, expr: "happy", pose: "handshake" });
          s += lex({ x: w * 0.72, y: h + 70, s: 1.0, f: -1, outfit: "church", expr: "happy", pose: "present", hold: { r: H.envelope } });
          return s;
        },
        b: (w, h) => [say("Thank you, Lexington. The Lord keeps His promises.", w * 0.28, 50, top("man", w * 0.28, h + 140, 1.0), { w: 150 })],
      },
      {
        alt: "In the church parking lot, two missionaries climb into a very dirty car. Lexington, Jonathan and Tony look at each other with the same idea.",
        art(w, h) {
          let s = S.meetinghouse(w, h, { k: 0.45, gy: h * 0.6, ox: w * 0.3, signX: 900 });
          s += P.car(w * 0.42, h * 0.98, 0.55, { color: "#f6f3ea", dirty: true, washMe: true, seed: 8 });
          s += npc("elderA", { x: w * 0.12, y: h + 120, s: 0.85, expr: "happy", pose: "wave" }) + npc("elderB", { x: w * 0.24, y: h + 120, s: 0.85, expr: "sheepish", pose: "stand" });
          s += lex({ x: w * 0.68, y: h + 60, s: 0.9, f: -1, outfit: "church", expr: "sly", pose: "stand" }) + jon({ x: w * 0.8, y: h + 60, s: 0.9, f: -1, outfit: "church", expr: "think", pose: "stand" }) + tony({ x: w * 0.93, y: h + 110, s: 0.86, f: -1, outfit: "church", expr: "smug", pose: "cross" });
          return s;
        },
        b: (w, h) => [say("Are you thinking what I'm thinking?", w * 0.62, 50, top("teen", w * 0.68, h + 60, 0.9), { w: 140 }), say("Lunch?", w * 0.84, 120, top("teen", w * 0.8, h + 60, 0.9), { w: 60 }), say("...The OTHER thing.", w * 0.5, 150, top("teen", w * 0.68, h + 60, 0.9, { dx: -10 }), { w: 100 })],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 6 — SERVICE SATURDAY
  // =====================================================================
  page({
    chapter: { n: 6, title: "Service Saturday", color: "#2a9d5a" },
    rows: [
      [0.4, [1]],
      [0.3, [0.5, 0.5]],
      [0.3, [1]],
    ],
    panels: [
      {
        alt: "The boys wash the missionaries' car for free while the two missionaries in white shirts and name tags laugh and help.",
        art(w, h) {
          const gy = h * 0.78;
          let s = S.driveway(w, h, { k: 0.85, gy, ox: w * 1.1 });
          s += P.car(w * 0.5, h * 0.98, 0.68, { color: "#f6f3ea", soapy: true, wet: true });
          s += P.sign(w * 0.03, h * 0.06, 190, 80, "FREE TODAY", "Service Saturday", { bg: "#ffffff", color: "#2a9d5a", size: 30 });
          s += npc("elderA", { x: w * 0.12, y: h + 120, s: 0.88, expr: "laugh", pose: "holdOut", hold: { r: H.sponge } }) + npc("elderB", { x: w * 0.26, y: h + 120, s: 0.88, expr: "happy", pose: "holdOut", hold: { r: H.towel } });
          s += jon({ x: w * 0.66, y: h + 40, s: 0.95, f: -1, outfit: "crew", expr: "joy", pose: "holdOut", hold: { r: H.hose } }) + lexC({ x: w * 0.8, y: h + 40, s: 0.95, f: -1, expr: "happy", pose: "holdOut", hold: { r: H.sponge } }) + tonyC({ x: w * 0.93, y: h + 110, s: 0.9, f: -1, expr: "happy", pose: "cross" });
          return s;
        },
        b: (w, h) => [say("How much do we owe you?", w * 0.24, h * 0.36, top("man", w * 0.12, h + 120, 0.88, { dx: 20 }), { w: 120 }), say("Nothing, Elders. Missionaries always ride clean for free.", w * 0.86, 60, top("man", w * 0.93, h + 110, 0.9, { dx: -10 }), { w: 170 })],
      },
      {
        alt: "Lexington scrubs a tire, with Mosiah 2:17 above him.",
        art(w, h) {
          let s = S.rays(w, h, "#d9f2d0", "#ffffff", w * 0.5, h * 0.7);
          s += lexC({ x: w * 0.5, y: h + 110, s: 1.1, expr: "peace", pose: "holdOut", hold: { r: H.sponge } });
          s += bubbles(w, h, 3, 8, 16);
          return s;
        },
        b: (w, h) => [verse("“When ye are in the service of your fellow beings ye are only in the service of your God.” — Mosiah 2:17", 14, 14, { w: w - 40, size: 17 })],
      },
      {
        alt: "Jonathan worries they gave away sixty dollars. Tony says you can't out-give the Lord.",
        art(w, h) {
          let s = S.rays(w, h, "#d6e4f5", "#ffffff", w * 0.5, h * 0.5);
          s += jon({ x: w * 0.26, y: h + 120, s: 1.05, outfit: "crew", expr: "worried", pose: "shrug" });
          s += tonyC({ x: w * 0.74, y: h + 230, s: 1.05, f: -1, expr: "happy", pose: "point" });
          return s;
        },
        b: (w, h) => [say("We just gave away like SIXTY bucks.", w * 0.24, 54, top("teen", w * 0.26, h + 120, 1.05), { w: 120 }), say("You can't out-give the Lord, buddy.", w * 0.76, 150, top("man", w * 0.74, h + 230, 1.05), { w: 120 })],
      },
      {
        alt: "Brother Wilson pulls up with his company's work vans and asks the boys to wash all ten of them every month. The boys' jaws drop.",
        art(w, h) {
          const gy = h * 0.78;
          let s = S.driveway(w, h, { k: 0.7, gy, ox: w * 1.15, drivewayWide: 1200 });
          [0.86, 0.66, 0.46].forEach((fxp, i) => (s += T(0, 0, 1, P.car(w * fxp, h * (0.82 + i * 0.08), 0.32 + i * 0.06, { kind: "van", color: "#ffffff" }))));
          s += npc("wilson", { x: w * 0.28, y: h + 110, s: 0.9, expr: "grin", pose: "point" });
          s += lexC({ x: w * 0.07, y: h + 60, s: 0.85, expr: "gasp", pose: "handsHead" });
          return s;
        },
        b: (w, h) => [
          say("My plumbing company has TEN work vans. I need somebody honest to wash them every month. Interested?", w * 0.52, 70, top("man", w * 0.28, h + 110, 0.9, { dx: 30 }), { w: 260 }),
          shout("INTERESTED?!", w * 0.12, h * 0.42, top("teen", w * 0.07, h + 60, 0.85), { w: 90, size: 20 }),
          cap("Word gets around when you're honest.", w - 300, h - 56, { w: 280 }),
        ],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 7 — A THREEFOLD CORD
  // =====================================================================
  page({
    chapter: { n: 7, title: "A Threefold Cord", color: "#c9473c" },
    rows: [
      [0.34, [1]],
      [0.33, [0.5, 0.5]],
      [0.33, [1]],
    ],
    panels: [
      {
        alt: "Washing a row of work vans in the heat, Lexington snaps at Jonathan for being on his phone.",
        art(w, h) {
          const gy = h * 0.78;
          let s = S.driveway(w, h, { k: 0.75, gy, ox: w * 1.1, time: "day" });
          s += P.car(w * 0.62, h * 0.98, 0.6, { kind: "van", color: "#ffffff", soapy: true });
          s += lexC({ x: w * 0.3, y: h + 50, s: 0.95, expr: "angry", pose: "holdOut", hold: { r: H.sponge } });
          s += jon({ x: w * 0.88, y: h + 50, s: 0.95, f: -1, outfit: "crew", expr: "angry", pose: "holdOut", hold: { r: H.phone } });
          return s;
        },
        b: (w, h) => [shout("Jonathan! You've been on your phone for TWENTY minutes!", w * 0.28, 70, top("teen", w * 0.3, h + 50, 0.95), { w: 190, size: 17 }), shout("I'm BOOKING customers! That's MY job!", w * 0.8, 70, top("teen", w * 0.88, h + 50, 0.95), { w: 160, size: 17, seed: 9 })],
      },
      {
        alt: "Lexington, angry, says he does all the hard work.",
        art(w, h) {
          let s = S.burst(w, h, "#e8a59a", "#f6d0c8", w * 0.5, h * 0.5);
          s += lexC({ x: w * 0.5, y: h + 130, s: 1.2, expr: "yell", pose: "yell" });
          return s;
        },
        b: (w, h) => [shout("I do all the HARD work!", w * 0.5, 54, top("teen", w * 0.5, h + 130, 1.2), { w: 140, size: 20 })],
      },
      {
        alt: "Jonathan, angry, says without him there wouldn't be any work.",
        art(w, h) {
          let s = S.burst(w, h, "#a8d9a0", "#d9f2d0", w * 0.5, h * 0.5);
          s += jon({ x: w * 0.5, y: h + 130, s: 1.2, f: -1, outfit: "crew", expr: "yell", pose: "yell" });
          return s;
        },
        b: (w, h) => [shout("Without me there wouldn't BE any work!", w * 0.5, 54, top("teen", w * 0.5, h + 130, 1.2), { w: 170, size: 19, seed: 5 })],
      },
      {
        alt: "Tony steps between them and reminds them they are a threefold cord.",
        art(w, h) {
          let s = S.rays(w, h, "#fff3c8", "#ffffff", w * 0.5, h * 0.5);
          s += lexC({ x: w * 0.2, y: h + 80, s: 0.95, expr: "sad", pose: "stand" });
          s += tonyC({ x: w * 0.5, y: h + 170, s: 1.0, expr: "talk", pose: "wide", la: [80, -10], ra: [80, -10] });
          s += jon({ x: w * 0.8, y: h + 80, s: 0.95, f: -1, outfit: "crew", expr: "sad", pose: "stand" });
          return s;
        },
        b: (w, h) => [
          say("Whoa. You're BOTH right. Lex builds it. Jonathan brings it in. I hold it together. That's a threefold cord.", w * 0.5, 64, top("man", w * 0.5, h + 170, 1.0), { w: 300 }),
          verse("“A threefold cord is not quickly broken.” — Ecclesiastes 4:12", w - 300, h - 66, { w: 280, size: 16 }),
        ],
      },
    ],
  });

  page({
    rows: [
      [0.36, [0.5, 0.5]],
      [0.3, [1]],
      [0.34, [1]],
    ],
    panels: [
      {
        alt: "Lexington apologizes to Jonathan.",
        art(w, h) {
          let s = S.rays(w, h, "#d9f2d0", "#ffffff", w * 0.5, h * 0.5);
          s += lexC({ x: w * 0.3, y: h + 120, s: 1.1, expr: "sheepish", pose: "handshake" });
          s += jon({ x: w * 0.72, y: h + 120, s: 1.1, f: -1, outfit: "crew", expr: "happy", pose: "handshake" });
          return s;
        },
        b: (w, h) => [say("Sorry, man. You're really good at the talking part.", w * 0.28, 60, top("teen", w * 0.3, h + 120, 1.1), { w: 150 })],
      },
      {
        alt: "Jonathan apologizes back, grinning.",
        art(w, h) {
          let s = S.rays(w, h, "#d9f2d0", "#ffffff", w * 0.5, h * 0.5);
          s += lexC({ x: w * 0.3, y: h + 120, s: 1.1, expr: "laugh", pose: "stand" });
          s += jon({ x: w * 0.72, y: h + 120, s: 1.1, f: -1, outfit: "crew", expr: "grin", pose: "thumbs" });
          return s;
        },
        b: (w, h) => [say("And you're really good at the... everything else part.", w * 0.7, 60, top("teen", w * 0.72, h + 120, 1.1), { w: 160 })],
      },
      {
        alt: "Around the kitchen table, the partners hold their first Monday business meeting with a notebook.",
        art(w, h) {
          let s = S.kitchen(w, h, { k: 0.85, gy: h * 0.97, ox: w * 0.25, table: false, time: "night" });
          s += lex({ x: w * 0.36, y: h * 0.97, s: 0.9, expr: "focus", pose: "write", seated: true, hold: { r: H.pencil } });
          s += tony({ x: w * 0.52, y: h * 0.97, s: 0.86, outfit: "casual", expr: "talk", pose: "sitHands", seated: true });
          s += jon({ x: w * 0.68, y: h * 0.97, s: 0.9, f: -1, expr: "happy", pose: "sitHands", seated: true });
          s += P.table(w * 0.52, h * 0.97 + 10, 1.45, { cloth: "#4fb3e8" });
          return s;
        },
        b: (w, h) => [say("New rule: every Monday, we meet and talk it out. Partners TALK.", w * 0.82, 60, top("man", w * 0.52, h * 0.97, 0.86, { seated: true, dx: 20 }), { w: 210 }), cap("Monday business meeting.", 16, 16, { w: 220 })],
      },
      {
        alt: "With their business savings they finally buy the foam cannon. Foam covers a car, the boys and Biscuit.",
        art(w, h) {
          const gy = h * 0.8;
          let s = S.driveway(w, h, { k: 0.8, gy, ox: w * 1.05 });
          s += P.car(w * 0.5, h * 0.98, 0.66, { color: "#c9473c", soapy: true });
          s += bubbles(w, h, 11, 40, 34);
          s += jon({ x: w * 0.14, y: h + 40, s: 0.95, outfit: "crew", expr: "joy", pose: "holdBoth", hold: { c: (x, y, sc) => P.foamCannon(x, y + 40 * sc, sc) } });
          s += lexC({ x: w * 0.82, y: h + 40, s: 0.95, f: -1, expr: "laugh", pose: "cheer" });
          s += P.dog(w * 0.94, h * 0.99, 0.8, { mood: "love", f: -1 }) + circle(w * 0.94 - 36, h * 0.99 - 80, 26, "#ffffff", { sw: 2 });
          return s;
        },
        b: (w, h) => [shout("FINALLY!", w * 0.2, h * 0.4, top("teen", w * 0.14, h + 40, 0.95), { w: 80, size: 22 }), sfx("FWOOOSH!", w * 0.5, 70, { size: 54, rot: -6, color: "#ffffff" }), cap("Put some of the profit back into the business.", w - 330, 16, { w: 310 })],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 8 — EARNED IT
  // =====================================================================
  page({
    chapter: { n: 8, title: "Earned It", color: "#e09a3e" },
    rows: [
      [0.34, [0.5, 0.5]],
      [0.33, [1]],
      [0.33, [0.5, 0.5]],
    ],
    panels: [
      {
        alt: "At the end of summer, Lexington counts his savings jar: $318.",
        art(w, h) {
          let s = S.walls(w, h, h * 0.98, "#b8d7d0", "#7d8fb3", { stripe: true });
          s += lex({ x: w * 0.3, y: h + 80, s: 1.1, expr: "joy", pose: "holdOut", hold: { r: H.jarFull } });
          s += P.calendar(w * 0.6, 40, 150, 140, { title: "AUGUST", checks: 30, color: "#e09a3e" });
          return s;
        },
        b: (w, h) => [cap("By the end of summer...", 14, 14, { w: 200 }), shout("$318!", w * 0.66, h * 0.62, top("teen", w * 0.3, h + 80, 1.1, { dx: 30 }), { w: 70, size: 26 })],
      },
      {
        alt: "At the store, Lexington is tempted by light-up headphones but puts them back: that's four cars.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.store(w, h, { k: 1, gy, sign: "ELECTRONICS  •  GADGETS" });
          s += lex({ x: w * 0.5, y: h + 60, s: 1.1, expr: "think", pose: "holdOut", hold: { r: (x, y, sc) => T(x, y, sc, path("M-20 0 Q-20 -30 0 -30 Q20 -30 20 0", "none", { sw: 5, stroke: "#e8536b" }) + rect(-26, -4, 12, 18, "#e8536b", { sw: 2, r: 4 }) + rect(14, -4, 12, 18, "#e8536b", { sw: 2, r: 4 })) } });
          s += P.sign(w * 0.7, h * 0.36, 80, 34, "$40", null, { bg: "#ffd95e", color: INK, size: 22 });
          return s;
        },
        b: (w, h) => [think("$40... that's FOUR cars. Eight hours of scrubbing. For headphones that light up?", w * 0.24, h * 0.36, top("teen", w * 0.5, h + 60, 1.1, { dx: -20 }), { w: 170 }), cap("He put them back.", w - 180, h - 54, { w: 160 })],
      },
      {
        alt: "At Tech Town, Lexington proudly pays for the 3D printer with money he earned.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#d6e4f5") + `<rect width="${w}" height="${h}" fill="url(#dotsFine)"/>`;
          s += rect(-10, 20, w + 20, 50, "#2a5a9a", { sw: 3 }) + text(w / 2, 56, "TECH TOWN", { size: 30, font: "title", fill: "#ffffff", ls: 3 });
          s += npc("clerk", { x: w * 0.78, y: h + 60, s: 0.95, f: -1, expr: "joy", pose: "stand" });
          s += lex({ x: w * 0.36, y: h + 40, s: 1.05, expr: "proud", pose: "present", hold: { r: H.money } });
          s += rect(w * 0.5, h * 0.74, w * 0.5, h * 0.3, "#8a5a3c", { sw: 3 });
          s += H.bigBox(w * 0.66, h * 0.66, 1.3, 1);
          return s;
        },
        b: (w, h) => [say("Two hundred ninety-nine dollars. And every penny is one I EARNED.", w * 0.22, 70, top("teen", w * 0.36, h + 40, 1.05, { dx: -20 }), { w: 220 })],
      },
      {
        alt: "Jonathan rides his new mountain bike, whooping.",
        art(w, h) {
          const gy = h * 0.88;
          let s = S.yard(w, h, { k: 0.6, gy: h * 0.72, ox: w * 0.5, house: false, tree: 400 });
          const bx = w * 0.55,
            bs = 1.15;
          s += P.bike(bx, gy, bs, { color: "#c9473c" });
          s += jon({ x: bx - 48 * bs, y: gy - 52 * 0.95 + 4, s: 0.95, outfit: "casual", expr: "joy", pose: "ride", lean: 14 });
          s += fx.motion(bx - 140, gy - 60, 1, 1);
          return s;
        },
        b: (w, h) => [shout("WHEEEE!", w * 0.3, 60, [w * 0.5, h * 0.4], { w: 80, size: 22 })],
      },
      {
        alt: "Tony makes a deposit at the bank for his future.",
        art(w, h) {
          let s = S.bank(w, h, { k: 0.42, gy: h * 0.8, ox: w * 0.5 });
          s += npc("teller", { x: w * 0.78, y: h + 80, s: 0.9, f: -1, expr: "happy", pose: "stand" });
          s += P.bankCounter(w * 0.55, h * 0.98, w * 0.5, 130);
          s += tony({ x: w * 0.32, y: h + 150, s: 1.0, outfit: "casual", expr: "confident", pose: "holdOut", hold: { r: H.money } });
          return s;
        },
        b: (w, h) => [say("For college... and whatever comes next.", w * 0.3, 60, top("man", w * 0.32, h + 150, 1.0), { w: 140 })],
      },
    ],
  });

  page({
    rows: [
      [0.46, [1]],
      [0.26, [1]],
      [0.28, [0.5, 0.5]],
    ],
    panels: [
      {
        alt: "In his room, Lexington and Dad watch his new 3D printer build its first gear.",
        art(w, h) {
          const gy = h * 0.95;
          let s = S.bedroom(w, h, { k: 0.95, gy, ox: w * 0.62, noChair: true, monitor: { code: true } });
          s += P.printer3d(w * 0.6, gy - 112 * 0.95 + 2, 1.15);
          s += C.gear(w * 0.6, gy - 112 * 0.95 - 60, 14, "#c9473c");
          s += lex({ x: w * 0.3, y: h + 30, s: 1.15, expr: "joy", pose: "cheer" });
          s += dad({ x: w * 0.86, y: h + 100, s: 1.05, f: -1, expr: "proud", pose: "cross" });
          return s;
        },
        b: (w, h) => [
          say("Feels different when you EARN it, huh?", w * 0.84, 60, top("man", w * 0.86, h + 100, 1.05), { w: 150 }),
          say("Totally. I'm never wasting money again. Okay... ALMOST never.", w * 0.22, 80, top("teen", w * 0.3, h + 30, 1.15, { dx: -20 }), { w: 190 }),
          sfx("whirrrr...", w * 0.6, h * 0.36, { size: 28, rot: -4, color: "#ffffff", font: "hand" }),
        ],
      },
      {
        alt: "At the kitchen table, Lexington suggests giving an extra fast offering to help someone in need. Jonathan and Tony agree.",
        art(w, h) {
          let s = S.kitchen(w, h, { k: 0.8, gy: h * 0.98, ox: w * 0.25, table: false });
          s += jon({ x: w * 0.4, y: h * 0.98, s: 0.85, expr: "happy", pose: "sitHands", seated: true }) + lex({ x: w * 0.55, y: h * 0.98, s: 0.85, expr: "talk", pose: "sitHands", seated: true }) + tony({ x: w * 0.7, y: h * 0.98, s: 0.8, f: -1, outfit: "casual", expr: "proud", pose: "thumbs", seated: true });
          s += P.table(w * 0.55, h * 0.98 + 10, 1.35, { cloth: "#4fb3e8" });
          return s;
        },
        b: (w, h) => [
          verse("“Before ye seek for riches, seek ye for the kingdom of God... and ye will seek them for the intent to do good.” — Jacob 2:18–19", 14, 14, { w: w * 0.32, size: 15 }),
          say("This month, let's give extra fast offering. Somebody out there needs help, like we got help.", w * 0.82, 70, top("teen", w * 0.55, h * 0.98, 0.85, { seated: true, dx: 20 }), { w: 260 }),
        ],
      },
      {
        alt: "At sunset the three partners sit on the hood of a sparkling car. Lexington asks what the best part of the summer was.",
        art(w, h) {
          let s = S.driveway(w, h, { k: 0.6, gy: h * 0.6, ox: w * 0.95, time: "sunset" });
          s += P.car(w * 0.5, h * 1.06, 0.6, { color: "#c9473c", shine: true });
          const seat = h * 0.98 - 150 * 0.6;
          s += jon({ x: w * 0.24, y: seat + 52, s: 0.82, outfit: "crew", expr: "grin", pose: "sitHands", seated: true }) + lexC({ x: w * 0.48, y: seat + 52, s: 0.82, expr: "peace", pose: "sitHands", seated: true }) + tonyC({ x: w * 0.74, y: seat + 70, s: 0.78, f: -1, expr: "happy", pose: "sitHands", seated: true });
          return s;
        },
        b: (w, h) => [say("Know what the best part of this summer was?", w * 0.5, 62, top("teen", w * 0.48, h * 0.98 - 90 + 52, 0.82, { seated: true }), { w: 160 }), say("The MONEY?", w * 0.14, 120, top("teen", w * 0.24, h * 0.98 - 90 + 52, 0.82, { seated: true }), { w: 70 })],
      },
      {
        alt: "Lexington says doing it together. Tony adds: and the money. They all laugh. The End.",
        art(w, h) {
          let s = S.sky(w, h, "sunset") + P.sun(w * 0.5, h * 0.8, 60) + fx.rays(w * 0.5, h * 0.8, 600, "#fff3b8", 18, 0.4);
          s += jon({ x: w * 0.22, y: h + 70, s: 0.95, outfit: "crew", expr: "laugh", pose: "cheer" }) + lexC({ x: w * 0.5, y: h + 60, s: 1.0, expr: "laugh", pose: "cheer" }) + tonyC({ x: w * 0.8, y: h + 130, s: 0.95, f: -1, expr: "laugh", pose: "cheer" });
          return s;
        },
        b: (w, h) => [say("Doing it TOGETHER.", w * 0.5, 40, top("teen", w * 0.5, h + 60, 1.0), { w: 100 }), say("...And the money.", w * 0.84, 110, top("man", w * 0.8, h + 130, 0.95), { w: 90 })],
      },
    ],
  });

  // =====================================================================
  // BACK PAGES
  // =====================================================================
  page({
    alt: "The Suds Brothers' Money Rules: ten lessons about earning, giving, saving and working hard, with scriptures, plus a teaser for Issue 3.",
    full(W, Hh) {
      let s = `<rect width="${W}" height="${Hh}" fill="#4fb3e8"/><rect width="${W}" height="${Hh}" fill="url(#dotsWhite)"/>`;
      s += bubbles(W, Hh, 21, 18, 26);
      s += text(W / 2 + 6, 120, "THE MONEY RULES", { size: 96, font: "title", fill: INK, stroke: INK, sw: 12, ls: 3 });
      s += text(W / 2, 114, "THE MONEY RULES", { size: 96, font: "title", fill: "#ffd95e", stroke: INK, sw: 8, ls: 3 });
      s += text(W / 2, 160, "according to the Suds Brothers", { size: 26, font: "hand", fill: "#ffffff" });
      s += rect(42, 190, 916, 1060, "#fffaf0", { sw: 5, r: 18 });
      const rules = [
        ["Find a problem. Solve it.", "Money is what people pay you for helping them."],
        ["Count the cost in hours.", "$299 = 30 cars = 60 hours. Every dollar is hard work."],
        ["Pay the Lord first.", "Tithing comes off the top. — Malachi 3:10"],
        ["Pay back what you borrow.", "Borrowed money isn't yours yet."],
        ["Save before you spend.", "Tithe, mission, save, THEN spend."],
        ["Tell the truth, even when it costs you.", "Honesty brings customers for life."],
        ["Do it right, or do it twice.", "Rushed work isn't finished work."],
        ["Keep the Sabbath day holy.", "Six days of work. One day for the Lord. — Exodus 20:9–10"],
        ["Serve for free sometimes.", "“In the service of your fellow beings.” — Mosiah 2:17"],
        ["Partners talk it out.", "A threefold cord is not quickly broken. — Ecclesiastes 4:12"],
      ];
      rules.forEach(([a, b], i) => {
        const y = 250 + i * 100;
        s += circle(100, y + 14, 30, ["#c9473c", "#2a8f86", "#f0b429", "#3f6fb5", "#3f9b5a"][i % 5], { sw: 3 }) + text(100, y + 26, String(i + 1), { size: 34, font: "title", fill: "#ffffff" });
        s += text(152, y + 16, a, { size: 32, font: "title", anchor: "start", ls: 1 }) + text(152, y + 50, b, { size: 21, anchor: "start", weight: 400 });
      });
      s += `<g transform="rotate(-2 ${W / 2} 1340)">${rect(120 + 6, 1290 + 6, 760, 120, INK, { sw: 0 })}${rect(120, 1290, 760, 120, "#2b2350", { sw: 5 })}${text(W / 2, 1340, "COMING IN ISSUE #3...", { size: 40, font: "title", fill: "#ffd95e", ls: 2 })}${text(W / 2, 1386, "Lexington discovers a power that's been inside him all along.", { size: 24, fill: "#ffffff" })}</g>`;
      return s;
    },
  });

  page({
    noNumber: true,
    alt: "Start Your Own Business: a fill-in worksheet for planning a kid's business, including tithing, savings and how many hours of work a goal will take.",
    full(W, Hh) {
      let s = `<rect width="${W}" height="${Hh}" fill="#fffaf0"/>`;
      s += `<rect width="${W}" height="150" fill="#2a8f86"/><rect width="${W}" height="150" fill="url(#dotsWhite)"/>` + line(0, 150, W, 150, { sw: 5 });
      s += text(W / 2 + 5, 86, "START YOUR OWN BUSINESS", { size: 62, font: "title", fill: INK, stroke: INK, sw: 9, ls: 2 });
      s += text(W / 2, 81, "START YOUR OWN BUSINESS", { size: 62, font: "title", fill: "#ffd95e", stroke: INK, sw: 6, ls: 2 });
      s += text(W / 2, 126, "Copy this page. Fill it in. Pray about it. Get to work.", { size: 22, fill: "#ffffff" });
      const field = (y, label, lines) => {
        let o = text(56, y, label, { size: 26, font: "title", anchor: "start", fill: "#2a5a9a", ls: 1 });
        for (let i = 0; i < (lines || 1); i++) o += line(56, y + 40 + i * 36, W - 56, y + 40 + i * 36, { sw: 2, stroke: "#c9c3b5" });
        return o;
      };
      let y = 200;
      s += field(y, "MY BUSINESS NAME", 1);
      y += 92;
      s += field(y, "WHAT PROBLEM DO I SOLVE?", 2);
      y += 128;
      s += field(y, "WHO ARE MY CUSTOMERS?", 1);
      y += 92;
      s += field(y, "WHAT WILL I CHARGE?", 1);
      y += 92;
      s += field(y, "SUPPLIES I NEED (AND WHAT THEY COST)", 2);
      y += 128;
      s += field(y, "WHO WILL I BORROW FROM? HOW WILL I PAY IT BACK?", 1);
      y += 100;
      s += text(56, y, "MY MONEY PLAN", { size: 26, font: "title", anchor: "start", fill: "#2a5a9a", ls: 1 });
      [["TITHING (10%)", "#ffe0b0"], ["MISSION / SAVINGS", "#bfe8ff"], ["SPEND", "#ffd1dc"]].forEach(([t, c], i) => (s += rect(56 + i * 300, y + 18, 280, 90, c, { sw: 3, r: 10 }) + text(196 + i * 300, y + 50, t, { size: 20, font: "title", ls: 1 }) + text(110 + i * 300, y + 92, "$", { size: 28, font: "title" }) + line(130 + i * 300, y + 94, 300 + i * 300, y + 94, { sw: 2, stroke: "#8a8478" })));
      y += 150;
      s += field(y, "MY GOAL", 1);
      y += 92;
      s += text(56, y, "HOW MANY HOURS OF WORK IS MY GOAL?", { size: 26, font: "title", anchor: "start", fill: "#c9473c", ls: 1 });
      s += text(56, y + 46, "Goal $ ______  ÷  I earn $ ______ an hour  =  ______ hours of work", { size: 26, font: "hand", anchor: "start", weight: 400 });
      y += 110;
      s += text(56, y, "PARTNERS (SIGN HERE)", { size: 26, font: "title", anchor: "start", fill: "#2a5a9a", ls: 1 });
      [0, 1, 2].forEach((i) => (s += line(56 + i * 300, y + 56, 316 + i * 300, y + 56, { sw: 2, stroke: "#8a8478" })));
      s += C.lexCrew({ x: 925, y: Hh - 10, s: 0.55, f: -1, expr: "grin", pose: "thumbs" });
      return s;
    },
  });

  // ---------- extra pages (bring the book to KDP's 24-page paperback minimum) ----------
  const header = (W, title, sub, color) =>
    `<rect width="${W}" height="150" fill="${color}"/><rect width="${W}" height="150" fill="url(#dotsWhite)"/>` +
    line(0, 150, W, 150, { sw: 5 }) +
    text(W / 2 + 5, 86, title, { size: 62, font: "title", fill: INK, stroke: INK, sw: 9, ls: 2 }) +
    text(W / 2, 81, title, { size: 62, font: "title", fill: "#ffd95e", stroke: INK, sw: 6, ls: 2 }) +
    text(W / 2, 126, sub, { size: 22, fill: "#ffffff" });

  page({
    noNumber: true,
    alt: "This comic belongs to: a name line, with Lexington, Jonathan and Big Tony waving, and the copyright notice.",
    full(W, Hh) {
      let s = `<rect width="${W}" height="${Hh}" fill="#fffaf0"/>`;
      s += bubbles(W, Hh * 0.6, 31, 16, 22);
      s += text(W / 2 + 5, 236, "THIS COMIC BELONGS TO", { size: 70, font: "title", fill: INK, stroke: INK, sw: 10, ls: 2 });
      s += text(W / 2, 230, "THIS COMIC BELONGS TO", { size: 70, font: "title", fill: "#4fb3e8", stroke: INK, sw: 7, ls: 2 });
      s += rect(140, 290, 720, 110, "#ffffff", { sw: 5, r: 14 }) + line(180, 370, 820, 370, { sw: 3, stroke: "#c9c3b5" });
      s += frect(0, 900, W, 20, "#c9c3b5") + line(0, 900, W, 900, { sw: 3 });
      s += jon({ x: 250, y: 900, s: 1.25, outfit: "crew", expr: "joy", pose: "wave" });
      s += lexC({ x: 500, y: 905, s: 1.35, expr: "grin", pose: "thumbs" });
      s += tonyC({ x: 760, y: 905, s: 1.2, f: -1, expr: "happy", pose: "wave" });
      const notes = [
        "Lexington, Issue #2: Down to Business",
        "Story and art © 2026 Verdant Life LLC. All rights reserved.",
        "No part of this book may be reproduced without written permission,",
        "except short quotations in reviews.",
        "",
        "This is a work of fiction. Names, characters and events are imaginary.",
        "Scripture is quoted from the King James Version of the Bible",
        "and the Book of Mormon.",
        "This book is not an official publication of",
        "The Church of Jesus Christ of Latter-day Saints.",
      ];
      notes.forEach((t, i) => (s += text(W / 2, 1030 + i * 34, t, { size: 22, weight: i === 0 ? 700 : 400, fill: i === 0 ? INK : "#4a4658" })));
      return s;
    },
  });
  // the "belongs to" page goes right after the cover
  C.STORY.splice(1, 0, C.STORY.pop());

  page({
    alt: "My Business Ideas: a notes page with prompts for brainstorming a business.",
    full(W, Hh) {
      let s = `<rect width="${W}" height="${Hh}" fill="#fffaf0"/>`;
      s += header(W, "MY BUSINESS IDEAS", "Every business starts with one good idea. Write yours down.", "#e09a3e");
      const prompts = ["Things I'm good at:", "Problems I see around me:", "People who might pay me to help:", "My best idea:"];
      let y = 210;
      prompts.forEach((p) => {
        s += text(56, y, p, { size: 28, font: "title", anchor: "start", fill: "#c9473c", ls: 1 });
        for (let i = 0; i < 4; i++) s += line(56, y + 44 + i * 44, W - 56, y + 44 + i * 44, { sw: 2, stroke: "#c9c3b5" });
        y += 44 * 4 + 90;
      });
      s += jon({ x: 900, y: Hh - 30, s: 0.6, f: -1, outfit: "crew", expr: "think", pose: "think" });
      return s;
    },
  });

  page({
    alt: "My Money Tracker: a ledger page with columns for date, job, money earned, tithing, savings and spending.",
    full(W, Hh) {
      let s = `<rect width="${W}" height="${Hh}" fill="#fffaf0"/>`;
      s += header(W, "MY MONEY TRACKER", "Write down every job. Watch your hard work add up.", "#3f9b5a");
      const cols = [["DATE", 120], ["JOB", 270], ["EARNED", 130], ["TITHING", 130], ["SAVE", 120], ["SPEND", 118]];
      const x0 = 46,
        y0 = 200,
        rh = 46,
        rows = 24;
      let x = x0;
      cols.forEach(([t, w], i) => {
        s += rect(x, y0, w, 52, ["#4fb3e8", "#2a8f86", "#3f9b5a", "#f0b429", "#3f6fb5", "#e85d75"][i], { sw: 3 }) + text(x + w / 2, y0 + 36, t, { size: 22, font: "title", fill: "#ffffff", ls: 1 });
        for (let r = 0; r < rows; r++) s += rect(x, y0 + 52 + r * rh, w, rh, r % 2 ? "#ffffff" : "#f3eedf", { sw: 1.6, stroke: "#c9c3b5" });
        x += w;
      });
      s += rect(x0, y0, x - x0, 52 + rows * rh, "none", { sw: 3 });
      s += text(x0, y0 + 52 + rows * rh + 46, "TOTAL SAVED: $ __________", { size: 30, font: "title", anchor: "start", fill: "#2a8f86", ls: 1 });
      s += tonyC({ x: 900, y: Hh - 18, s: 0.55, f: -1, expr: "confident", pose: "holdBoth", hold: { c: H.clipboard } });
      return s;
    },
  });
})();
