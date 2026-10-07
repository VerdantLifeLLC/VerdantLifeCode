/* Lexington: The Turnaround — script part 3: chapters 6–11 and back pages. */
(function () {
  "use strict";
  const C = window.Comic;
  const { text, rect, frect, path, line, circle, fcircle, ellipse, fellipse, T, INK } = C;
  const S = C.scene,
    P = C.prop,
    H = C.held,
    fx = C.fx;
  const { say, shout, think, whisper, pray, cap, verse, note, sfx, top, yFor, page, ghost, sepia } = C.kit;
  const lex = C.lex,
    mom = C.mom,
    dad = C.dad,
    npc = C.npc,
    sub = C.sub;

  // ---------- props for these chapters ----------
  const reportCard = (x, y, s, rot) =>
    T(x, y, s, `<g transform="rotate(${rot || 0})">${rect(-62, -46, 124, 92, "#ffffff", { sw: 2.6 })}${frect(-60, -44, 120, 20, "#2a8f86")}${text(0, -29, "REPORT CARD", { size: 12, font: "title", fill: "#fff", ls: 1 })}${["MATH", "SCIENCE", "ENGLISH", "HISTORY"].map((t, i) => text(-50, -6 + i * 14, t, { size: 11, anchor: "start" }) + text(46, -5 + i * 14, "A", { size: 14, font: "title", fill: "#c9473c" })).join("")}</g>`);
  H.flowers = (x, y, s, f) =>
    T(x, y, s, `${path("M-6 10 L-14 -30 M0 10 L0 -36 M6 10 L14 -30", "none", { sw: 3, stroke: "#4a8a3a" })}${[[-14, -34, "#e8536b"], [0, -42, "#f4c542"], [14, -34, "#9b59b6"], [-6, -48, "#ff8fb8"], [8, -50, "#ffffff"]].map(([a, b, c]) => circle(a, b, 9, c, { sw: 2 }) + fcircle(a, b, 3, "#f0b429")).join("")}${path("M-14 -8 L14 -8 L8 16 L-8 16 Z", "#bfe0f0", { sw: 2.2 })}`);
  H.laptopBox = (x, y, s, f) => T(x, y, s, `${rect(-50, -36, 100, 66, "#e9edf2", { sw: 2.8, r: 4 })}${rect(-30, -22, 60, 34, "#2a2f3f", { sw: 2, r: 3 })}${frect(-26, -18, 52, 26, "#7fd3ff")}${text(0, 24, "LAPTOP", { size: 11, font: "title", ls: 1 })}`);
  H.bulletin = (x, y, s, f) => T(x, y, s, `${rect(-16, -22, 32, 44, "#fffaf0", { sw: 2.2 })}${path("M-2 -14 h4 v6 h6 v4 h-6 v12 h-4 v-12 h-6 v-4 h6 Z", "#b5843c", { sw: 1 })}`);
  H.pan = (x, y, s, f) => T(x, y, s, `<g transform="scale(${f} 1)">${line(0, 0, 40, -6, { sw: 6, stroke: "#3a3a4a" })}${ellipse(-30, 2, 34, 10, "#3a3a4a", { sw: 2.6 })}${fellipse(-38, -2, 11, 5, "#ffffff")}${fcircle(-37, -2, 4, "#f4c542")}${fellipse(-20, 2, 10, 5, "#ffffff")}${fcircle(-20, 1, 4, "#f4c542")}</g>`);
  H.shirtFold = (x, y, s, f) => T(x, y, s, `${rect(-30, -10, 60, 22, "#2a8f86", { sw: 2.4, r: 3 })}${line(-30, 0, 30, 0, { sw: 1.4, stroke: "#1d6b63" })}`);
  H.jarFull = (x, y, s, f) => P.jar(x, y + 50 * s, s * 0.6, "SAVE", 0.95, "#bfe8ff");
  const birds = (x, y, s) => [0, 1, 2].map((i) => path(`M${x + i * 40 * s} ${y + (i % 2) * 14 * s} q${8 * s} ${-8 * s} ${16 * s} 0 q${8 * s} ${-8 * s} ${16 * s} 0`, "none", { sw: 2.6 })).join("");
  const partyHat = (x, y, s) => T(x, y, s, `${path("M-14 0 L0 -36 L14 0 Z", "#e8536b", { sw: 2.4 })}${fcircle(0, -38, 5, "#f4c542")}${line(-8, -10, 8, -14, { sw: 2.4, stroke: "#ffffff" })}`);
  const boardGame = (x, y, s) => {
    let o = rect(-90, -14, 180, 18, "#ffffff", { sw: 2.4 });
    const cols = ["#e8536b", "#f4c542", "#4fb3e8", "#7cc35a"];
    for (let i = 0; i < 9; i++) o += frect(-84 + i * 19, -11, 15, 12, cols[i % 4]);
    o += rect(70, -40, 18, 18, "#ffffff", { sw: 2, r: 3 }) + fcircle(76, -34, 2, INK) + fcircle(82, -28, 2, INK);
    o += path("M-40 -14 l6 -22 l6 22 Z", "#c9473c", { sw: 1.8 }) + path("M20 -14 l6 -22 l6 22 Z", "#2a8f86", { sw: 1.8 });
    return T(x, y, s, o);
  };
  const steps = (x, y, w, n2, sh, color) => {
    let o = "";
    for (let i = 0; i < n2; i++) o += rect(x - i * 18, y + i * sh, w + i * 36, sh, i % 2 ? color : C.shade(color, 0.08), { sw: 3 });
    return o;
  };
  const stove = (x, y, s) => T(x, y, s, `${rect(-70, -120, 140, 120, "#e9edf2", { sw: 3 })}${rect(-70, -128, 140, 10, "#3a3a4a", { sw: 2.4 })}${rect(-56, -96, 112, 60, "#2a2f3f", { sw: 2.4, r: 4 })}${[-40, -20, 20, 40].map((d) => fcircle(d, -110, 4, "#9aa3b5")).join("")}`);

  // =====================================================================
  // CHAPTER 6 — THINGS GET EASIER
  // =====================================================================
  page({
    chapter: { n: 6, title: "Things Get Easier", color: "#2a9d5a" },
    rows: [
      [0.37, [1]],
      [0.31, [0.5, 0.5]],
      [0.32, [1]],
    ],
    panels: [
      {
        alt: "On a sunny morning, a clean and happy Lexington walks to school with Biscuit trotting beside him.",
        art(w, h) {
          const gy = h * 0.8;
          let s = S.yard(w, h, { k: 0.85, gy, ox: w * 0.7, houseX: -560, tree: 260, sidewalk: true, fence: [-160, 200] });
          s += birds(w * 0.42, 70, 1) + birds(w * 0.6, 110, 0.7);
          s += lex({ x: w * 0.45, y: h * 0.97, s: 1.05, expr: "joy", pose: "walk", sparkle: true });
          s += P.dog(w * 0.62, h * 0.98, 0.95, { mood: "happy" });
          return s;
        },
        b: (w, h) => [
          cap("And then a funny thing happened.", 16, 16, { w: 330 }),
          cap("Life got... EASIER.", 16, 66, { w: 200 }),
          think("Huh. Nobody's yelled my name in a WEEK.", w * 0.3, 150, top("teen", w * 0.45, h * 0.97, 1.05, { dx: -20 }), { w: 170 }),
        ],
      },
      {
        alt: "In class, Lexington's friend leans over and sniffs, impressed.",
        art(w, h) {
          const y = h + 40;
          let s = S.school(w, h, { k: 0.8, gy: h * 0.92, ox: w * 0.1, board: ["H₂O + soap = clean", "Hygiene = science!", "✓"] });
          s += npc("friend2", { x: 110, y, s: 1.2, expr: "surprised", pose: "sniff", seated: true });
          s += lex({ x: 330, y, s: 1.2, f: -1, expr: "grin", pose: "sitHands", sparkle: true });
          s += S.schoolDesk(330, y - 10, 1.2) + S.schoolDesk(110, y - 10, 1.2);
          return s;
        },
        b: (w, h) => [say("Bro... you smell GOOD now.", 110, 54, top("teen", 110, h + 40, 1.2, { seated: true }), { w: 130 }), say("It's called soap. Highly recommend.", 340, 110, top("teen", 330, h + 40, 1.2, { seated: true }), { w: 140 })],
      },
      {
        alt: "The teacher hands Lexington a report card full of A's.",
        art(w, h) {
          const gy = h * 0.95;
          let s = S.school(w, h, { k: 0.75, gy: h * 0.92, ox: w * 0.55 });
          s += npc("teacher", { x: 110, y: h + 60, s: 0.92, expr: "proud", pose: "holdOut" });
          s += reportCard(220, h * 0.55, 1.15, -6);
          s += lex({ x: 350, y: h + 50, s: 1.0, f: -1, expr: "joy", pose: "cheer" });
          return s;
        },
        b: (w, h) => [say("Straight A's, Lexington. You've really GROWN this year.", 130, 60, top("woman", 110, h + 60, 0.92, { dx: 10 }), { w: 170 })],
      },
      {
        alt: "Family game night: Mom, Dad and Lexington laugh around a board game. Biscuit wears a party hat.",
        art(w, h) {
          const gy = h * 0.98,
            k = 0.9;
          let s = S.living(w, h, { k, gy, ox: w * 0.5, couch: false, time: "night" });
          s += `<ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${w * 0.4}" ry="${h * 0.5}" fill="url(#lampGlow)" opacity=".5"/>`;
          s += dad({ x: w * 0.3, y: gy, s: 0.85, expr: "laugh", pose: "sitHands", seated: true });
          s += lex({ x: w * 0.5, y: gy, s: 0.92, expr: "laugh", pose: "cheer", seated: true });
          s += mom({ x: w * 0.7, y: gy, s: 0.85, f: -1, expr: "laugh", pose: "sitHands", seated: true });
          s += P.table(w * 0.5, gy + 14, 1.15, { cloth: "#2a8f86" });
          s += boardGame(w * 0.5, gy - 104, 1.1);
          s += P.dog(w * 0.1, gy, 0.9, { mood: "love" }) + partyHat(w * 0.1 + 40, gy - 78, 0.9);
          return s;
        },
        b: (w, h) => [
          cap("No yelling. No whoopings. Just peace.", 16, 16, { w: 300 }),
          cap("Turns out when you do the right thing the FIRST time, there's a lot more time left for fun.", w - 330, h - 90, { w: 300, bg: "#ffffff" }),
          shout("UNO... I mean, I WIN!", w * 0.52, 70, top("teen", w * 0.5, h * 0.98, 0.92, { seated: true }), { w: 140, size: 18 }),
        ],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 7 — A FAITH OF HIS OWN
  // =====================================================================
  page({
    chapter: { n: 7, title: "A Faith of His Own", color: "#b5843c" },
    rows: [
      [0.38, [1]],
      [0.31, [0.5, 0.5]],
      [0.31, [1]],
    ],
    panels: [
      {
        alt: "At sunrise, Lexington kneels at his bed and prays on his own while Mom watches, touched, from the doorway.",
        art(w, h) {
          const gy = h * 0.99;
          let s = S.walls(w, h, gy, "#b8d7d0", "#7d8fb3", { stripe: true });
          s += P.window(w * 0.55, 40, 190, 180, { time: "dawn", curtains: "#e8c35a" });
          s += fx.rays(w * 0.55 + 95, 130, 600, "#fff3b8", 14, 0.25);
          s += P.goalBoard(w - 210, 50, 170, 160, { title: "GOALS", goals: [{ t: "Pray daily", done: true }, { t: "Read Proverbs" }] });
          s += P.door(30, 40, 150, gy - 40, { color: "#b07a4a" });
          s += frect(30, 40, 54, gy - 40, "#f3dfb5");
          s += mom({ x: 70, y: h + 60, s: 0.95, expr: "touched", pose: "heart" });
          s += rect(84, 40, 96, gy - 40, "#b07a4a", { sw: 3 });
          const bt = gy - 150;
          s += lex({ x: w * 0.6, y: bt + 175, s: 1.15, expr: "pray", pose: "kneelPray" });
          s += path(`M${w * 0.3} ${bt + 8} Q${w * 0.55} ${bt - 8} ${w + 20} ${bt + 6} L${w + 20} ${h + 20} L${w * 0.3} ${h + 20} Z`, "#3f6fb5", { sw: 3.2 });
          s += path(`M${w * 0.4} ${bt + 60} q60 -16 120 0 M${w * 0.7} ${bt + 50} q60 -14 130 6`, "none", { sw: 2.4, stroke: "#2c4f86" });
          return s;
        },
        b: (w, h) => [
          cap("Nobody told him to pray. He just started... on his own.", 200, 16, { w: 300 }),
          pray("Thank You for today, Lord. Help me be a blessing to somebody.", w * 0.42, 150, [w * 0.55, h * 0.4], { w: 200 }),
        ],
      },
      {
        alt: "At his desk, Lexington writes in a scripture journal with highlighters and an open Bible.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#e9dcc2") + `<rect width="${w}" height="${h}" fill="url(#dotsFine)"/>`;
          s += P.journal(w * 0.5, h * 0.6, 1.08, { rot: -4, left: ["Proverbs 3:5-6", "Trust in the LORD", "with all thine heart;", "and lean not unto", "thine own", "understanding."], right: ["What I learned:", "Even smart people", "need God's wisdom.", "Ask Him FIRST,", "then decide."] });
          s += P.highlighters(w * 0.8, h * 0.98, 1.1);
          s += T(w * 0.16, h * 0.96, 1, H.pencil(0, 0, 1.4, 1));
          return s;
        },
        b: (w, h) => [cap("He started reading a chapter of Proverbs every single day.", 14, 14, { w: 260 })],
      },
      {
        alt: "At dinner, Lexington explains a Bible verse to Dad, who looks impressed.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.kitchen(w, h, { k: 0.8, gy, ox: w * 0.3, table: false });
          s += dad({ x: 110, y: gy, s: 0.85, expr: "surprised", pose: "sitHands", seated: true });
          s += lex({ x: 340, y: gy, s: 0.92, f: -1, expr: "talk", pose: "point", seated: true });
          s += P.table(w * 0.5, gy + 10, 1.0, { cloth: "#e8536b" });
          return s;
        },
        b: (w, h) => [
          say("Where'd you learn THAT?", 110, 50, top("man", 110, h * 0.98, 0.85, { seated: true }), { w: 120 }),
          say("Proverbs 3. Trust God and don't lean on your own understanding. Even smart people need that.", 300, 110, top("teen", 340, h * 0.98, 0.92, { seated: true }), { w: 190 }),
        ],
      },
      {
        alt: "The family holds hands around the dinner table while Lexington says grace.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.kitchen(w, h, { k: 0.85, gy, ox: w * 0.3, table: false, time: "night" });
          s += mom({ x: w * 0.3, y: gy, s: 0.85, expr: "touched", pose: "sitHands", seated: true });
          s += lex({ x: w * 0.5, y: gy, s: 0.92, expr: "pray", pose: "sitPray", seated: true });
          s += dad({ x: w * 0.7, y: gy, s: 0.85, f: -1, expr: "pray", pose: "sitHands", seated: true });
          s += P.table(w * 0.5, gy + 12, 1.35, { cloth: "#e8536b" });
          s += T(w * 0.5, gy - 125, 1, ellipse(0, 0, 40, 12, "#ffffff", { sw: 2.4 }) + fellipse(0, -6, 26, 10, "#c9673c") + fx.steam(0, -14, 0.4));
          s += T(w * 0.36, gy - 124, 1, ellipse(0, 0, 26, 8, "#ffffff", { sw: 2 })) + T(w * 0.64, gy - 124, 1, ellipse(0, 0, 26, 8, "#ffffff", { sw: 2 }));
          return s;
        },
        b: (w, h) => [
          say("Lex, would you bless the food tonight?", w * 0.82, 60, top("man", w * 0.7, h * 0.98, 0.85, { seated: true, dx: 10 }), { w: 170 }),
          pray("Lord, thank You for this food, for Mom and Dad... and for second chances. Amen.", w * 0.4, 70, top("teen", w * 0.5, h * 0.98, 0.92, { seated: true }), { w: 260 }),
        ],
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
        alt: "Flashback in old sepia tones: Lexington slumps asleep in a church pew with his phone while Mom glares at him.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.church(w, h, { k: 0.6, gy: h * 0.62, ox: w * 0.78, pulpit: false });
          s += npc("pastor", { x: w * 0.78, y: h * 0.62, s: 0.55, expr: "talk", pose: "wave" });
          s += P.pulpit(w * 0.78, h * 0.62, 0.6);
          s += mom({ x: w * 0.3, y: gy, s: 0.95, expr: "stern", pose: "sitHands", seated: true, outfit: "church" });
          s += lex({ x: w * 0.47, y: gy + 10, s: 1.0, messy: true, expr: "asleep", pose: "sitSlump", seated: true, lean: 14, stink: false, hold: { r: H.phone } });
          s += npc("boy3", { x: w * 0.64, y: gy, s: 0.98, f: -1, expr: "laugh", pose: "sitHands", seated: true });
          s += P.pew(-20, gy + 30, w + 40, {});
          return C.kit.sepia(s);
        },
        b: (w, h) => [cap("Church used to look like this...", 16, 16, { w: 260, bg: "#e9d6b0" }), sfx("SNORRRE", 320, 120, { size: 34, rot: -8, color: "#e9d6b0" })],
      },
      {
        alt: "Now Lexington sits up straight in church in a shirt and tie, Bible open, taking notes, between proud parents.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.church(w, h, { k: 0.55, gy: h * 0.6, ox: w * 0.5, light: true });
          s += mom({ x: 80, y: gy, s: 0.85, expr: "proud", pose: "sitHands", seated: true, outfit: "church" });
          s += lex({ x: 230, y: gy + 6, s: 0.95, outfit: "church", expr: "focus", pose: "sitRead", seated: true, hold: { c: H.bookOpen } });
          s += dad({ x: 380, y: gy, s: 0.85, f: -1, expr: "proud", pose: "sitHands", seated: true, outfit: "church" });
          s += P.pew(-20, gy + 30, w + 40, {});
          return s;
        },
        b: (w, h) => [cap("Now it looks like THIS.", 14, 14, { w: 200 })],
      },
      {
        alt: "Lexington greets Mother Johnson in her big purple church hat, handing her a bulletin.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.church(w, h, { k: 0.6, gy: h * 0.75, ox: w * 0.2, pulpit: false });
          s += lex({ x: 130, y: h + 40, s: 1.0, outfit: "church", expr: "joy", pose: "handshake", hold: { r: H.bulletin } });
          s += npc("motherJ", { x: 340, y: h + 80, s: 0.95, f: -1, expr: "joy", pose: "heart" });
          return s;
        },
        b: (w, h) => [say("Good morning, Mother Johnson! Welcome!", 120, 56, top("teen", 130, h + 40, 1.0), { w: 150 }), say("My, my! What a FINE young man!", 350, 120, top("woman", 340, h + 80, 0.95, { dx: 30 }), { w: 130 })],
      },
      {
        alt: "After the service, the pastor shakes Lexington's hand while Mom and Dad watch proudly.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.church(w, h, { k: 0.7, gy: h * 0.75, ox: w * 0.5, light: true, pulpit: false });
          s += mom({ x: w * 0.12, y: h + 70, s: 0.85, expr: "proud", pose: "heart", outfit: "church" });
          s += dad({ x: w * 0.24, y: h + 80, s: 0.85, expr: "proud", pose: "stand", outfit: "church" });
          s += lex({ x: w * 0.45, y: h + 40, s: 0.98, outfit: "church", expr: "happy", pose: "handshake" });
          s += npc("pastor", { x: w * 0.66, y: h + 80, s: 0.92, f: -1, expr: "happy", pose: "handshake" });
          return s;
        },
        b: (w, h) => [
          verse("“Let no man despise thy youth; but be thou an example of the believers.” — 1 Timothy 4:12", w - 340, 16, { w: 310 }),
          say("Son, you're becoming that example.", w * 0.86, 170, top("man", w * 0.66, h + 80, 0.92, { dx: 30 }), { w: 150 }),
          say("Thank you, Pastor. I'm trying every day.", w * 0.28, 60, top("teen", w * 0.45, h + 40, 0.98, { dx: -10 }), { w: 170 }),
        ],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 8 — LEXINGTON ENTERPRISES
  // =====================================================================
  page({
    chapter: { n: 8, title: "Lexington Enterprises", color: "#3f8f5a" },
    rows: [
      [0.34, [0.55, 0.45]],
      [0.32, [0.5, 0.5]],
      [0.34, [1]],
    ],
    panels: [
      {
        alt: "In the garage, Lexington scrubs his own sneakers until they shine. A before-and-after pair sits on the bench.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.garage(w, h, { k: 0.75, gy, ox: w * 0.75, noSign: true });
          s += P.workbench(-20, gy, w + 40);
          s += lex({ x: w * 0.42, y: h + 60, s: 1.05, expr: "focus", pose: "holdBoth", hold: { l: H.sneaker, r: H.brushTool }, handsOver: true });
          s += fx.sparkle(w * 0.52, h * 0.5, 12) + fellipse(w * 0.36, h * 0.66, 10, 8, "#ffffff", 0.9) + fellipse(w * 0.42, h * 0.62, 8, 6, "#ffffff", 0.9);
          s += C.held.sneakerDirty(w * 0.8, gy - 120, 0.9, 1) + C.held.sneaker(w * 0.92, gy - 116, 0.9, 1) + fx.sparkle(w * 0.95, gy - 150, 9);
          return s;
        },
        b: (w, h) => [cap("Lexington discovered two things he LOVED. Making old things look brand new...", 14, 14, { w: 300 })],
      },
      {
        alt: "Wearing goggles, Lexington fixes a bike chain with a wrench.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.garage(w, h, { k: 0.7, gy, ox: w * 0.1, noSign: true });
          s += P.bike(w * 0.6, gy, 1.3, { color: "#e8536b" });
          s += lex({ x: w * 0.3, y: h + 50, s: 1.0, expr: "focus", pose: "holdOut", goggles: true, hold: { r: H.wrench } });
          return s;
        },
        b: (w, h) => [cap("...and FIXING stuff.", 14, 14, { w: 180 }), say("Bikes are easy. It's just physics.", w * 0.62, 80, top("teen", w * 0.3, h + 50, 1.0, { dx: 20 }), { w: 140 })],
      },
      {
        alt: "Lexington's friend holds out his dirty sneakers and asks Lexington to clean them. A lightbulb pops over Lexington's head.",
        art(w, h) {
          const gy = h * 0.97;
          let s = S.yard(w, h, { k: 0.7, gy: h * 0.8, ox: w * 0.5, house: false, tree: 300 });
          s += npc("friend", { x: 110, y: h + 50, s: 1.0, expr: "talk", pose: "present", hold: { r: H.sneakerDirty } });
          s += lex({ x: 350, y: h + 50, s: 1.0, f: -1, expr: "confident", pose: "think" });
          s += fx.bulb(350, top("teen", 350, h + 50, 1.0)[1] - 10, 0.8);
          return s;
        },
        b: (w, h) => [say("Yo, how are your kicks SO clean? Can you do mine?", 140, 56, top("teen", 110, h + 50, 1.0, { dx: 10 }), { w: 170 }), say("...For ten bucks?", 400, 190, top("teen", 350, h + 50, 1.0, { dx: 30 }), { w: 90 })],
      },
      {
        alt: "Lexington designs flyers for his businesses on a laptop while Dad looks over his shoulder.",
        art(w, h) {
          const gy = h * 0.98;
          let s = frect(0, 0, w, h, "#d6e4f5") + `<rect width="${w}" height="${h}" fill="url(#dotsFine)"/>`;
          s += dad({ x: w * 0.82, y: h + 110, s: 0.88, f: -1, expr: "proud", pose: "cross" });
          s += lex({ x: w * 0.26, y: h + 40, s: 1.0, expr: "focus", pose: "sitRead", seated: true });
          s += rect(-10, h * 0.8, w + 20, 30, "#b07a4a", { sw: 3 });
          s += P.laptop(w * 0.54, h * 0.8, 1.0, { flyer: true });
          const fx0 = 16,
            fy0 = 16;
          s += `<g transform="rotate(-3 ${fx0 + 85} ${fy0 + 70})">${rect(fx0, fy0, 180, 138, "#ffffff", { sw: 3 })}${frect(fx0 + 2, fy0 + 2, 176, 26, "#2a8f86")}${text(fx0 + 90, fy0 + 21, "LEX'S FRESH KICKS", { size: 15, font: "title", fill: "#fff", ls: 1 })}${text(fx0 + 90, fy0 + 47, "Clean ........ $10", { size: 14, font: "hand", weight: 400 })}${text(fx0 + 90, fy0 + 64, "Restore ...... $25", { size: 14, font: "hand", weight: 400 })}${frect(fx0 + 2, fy0 + 74, 176, 24, "#c9473c")}${text(fx0 + 90, fy0 + 92, "LEX'S BIKE FIX", { size: 15, font: "title", fill: "#fff", ls: 1 })}${text(fx0 + 90, fy0 + 116, "Flat tire $8 • Tune-up $15", { size: 14, font: "hand", weight: 400 })}</g>`;
          return s;
        },
        b: (w, h) => [say("Pricing? A business plan? Son, I'm impressed.", w * 0.72, 70, top("man", w * 0.82, h + 110, 0.88, { dx: -6 }), { w: 150 })],
      },
      {
        alt: "Lexington's garage workshop is open for business. Neighborhood kids line up with sneakers and bikes while Lexington works in his apron and Biscuit stands guard.",
        art(w, h) {
          const gy = h * 0.96;
          let s = S.garage(w, h, { k: 0.8, gy, ox: w * 0.32, open: true, display: true });
          s += P.workbench(w * 0.04, gy, 240);
          s += lex({ x: w * 0.16, y: gy + 4, s: 0.95, outfit: "apron", expr: "grin", pose: "thumbs" });
          s += P.dog(w * 0.3, gy + 6, 0.8, { mood: "happy" }) + rect(w * 0.3 + 4, gy - 48, 26, 12, "#f4c542", { sw: 1.6, r: 2 });
          const q = [
            ["girl", { pose: "holdOut", hold: { r: H.sneakerDirty } }],
            ["boy3", { pose: "stand" }],
            ["girl2", { pose: "holdBoth", hold: { c: H.sneakerDirty } }],
            ["friend", { pose: "wave" }],
            ["kid2", { pose: "stand" }],
          ];
          q.forEach(([who, o], i) => {
            const x = w * 0.46 + i * 100;
            if (i === 1) s += P.bike(x + 30, gy + 6, 0.75, { color: "#4fb3e8" });
            s += npc(who, Object.assign({ x, y: gy + 6 + (i % 2) * 6, s: who === "kid2" ? 0.85 : 0.82, f: -1, expr: i % 2 ? "happy" : "talk" }, o));
          });
          return s;
        },
        b: (w, h) => [cap("Lexington Enterprises was open for business.", w * 0.42, h - 62, { w: 340 }), say("Next customer!", w * 0.08, 150, top("teen", w * 0.16, h * 0.96 + 4, 0.95, { dx: -6 }), { w: 110 })],
      },
    ],
  });

  page({
    rows: [
      [0.36, [1]],
      [0.32, [0.5, 0.5]],
      [0.32, [0.5, 0.5]],
    ],
    panels: [
      {
        alt: "At his desk, Lexington sorts his earnings into three jars labeled Give, Save and Spend.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.walls(w, h, gy, "#b8d7d0", "#7d8fb3", { stripe: true });
          s += P.goalBoard(w * 0.05, 120, 200, 210, { goals: [{ t: "Save $1,000", done: false }, { t: "Tithe first", done: true }] });
          s += lex({ x: w * 0.6, y: h + 40, s: 1.1, expr: "happy", pose: "holdBoth", hold: { c: H.money } });
          s += rect(-10, h * 0.8, w + 20, 30, "#b07a4a", { sw: 3 });
          s += P.jar(w * 0.32, h * 0.8, 1.0, "GIVE", 0.35, "#ffe0b0") + P.jar(w * 0.44, h * 0.8, 1.0, "SAVE", 0.6, "#bfe8ff") + P.jar(w * 0.78, h * 0.8, 1.0, "SPEND", 0.3, "#c9f2c0");
          return s;
        },
        b: (w, h) => [
          verse("“Seest thou a man diligent in his business? he shall stand before kings.” — Proverbs 22:29", w - 360, 16, { w: 330 }),
          say("Ten percent to God first. Then save. THEN spend.", w * 0.75, 170, top("teen", w * 0.6, h + 40, 1.1, { dx: 20 }), { w: 180 }),
        ],
      },
      {
        alt: "At church, Lexington drops his tithe envelope into the offering plate with a smile.",
        art(w, h) {
          let s = S.church(w, h, { k: 0.55, gy: h * 0.6, ox: w * 0.5, light: true });
          s += lex({ x: w * 0.35, y: h + 70, s: 1.1, outfit: "church", expr: "peace", pose: "holdOut", hold: { r: H.envelope } });
          s += P.offeringPlate(w * 0.7, h * 0.8, 1.3);
          s += fx.sparkle(w * 0.72, h * 0.62, 12);
          return s;
        },
        b: (w, h) => [cap("God gets the first slice. Always.", 14, 14, { w: 230 })],
      },
      {
        alt: "A laptop chart of Lexington's earnings climbing month by month.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#203a5a") + `<rect width="${w}" height="${h}" fill="url(#dotsWhite)"/>`;
          const x0 = 60,
            y0 = h - 70,
            cw = w - 110,
            ch = h - 170;
          s += rect(x0 - 20, 90, cw + 40, ch + 40, "#ffffff", { sw: 3, r: 8 });
          const vals = [120, 260, 410];
          vals.forEach((v, i) => {
            const bh = (v / 450) * (ch - 30),
              bx = x0 + 20 + i * (cw / 3);
            s += rect(bx, y0 - bh, cw / 3 - 40, bh, ["#7cc35a", "#2a9d5a", "#1d7a44"][i], { sw: 2.6 });
            s += text(bx + (cw / 3 - 40) / 2, y0 - bh - 10, "$" + v, { size: 22, font: "title" });
            s += text(bx + (cw / 3 - 40) / 2, y0 + 26, "MONTH " + (i + 1), { size: 15, font: "title" });
          });
          s += line(x0, y0, x0 + cw, y0, { sw: 3 });
          s += path(`M${x0 + 40} ${y0 - 70} L${x0 + cw * 0.45} ${y0 - 140} L${x0 + cw * 0.8} ${y0 - 220}`, "none", { sw: 5, stroke: "#c9473c" }) + path(`M${x0 + cw * 0.8 - 18} ${y0 - 222} L${x0 + cw * 0.8 + 6} ${y0 - 226} L${x0 + cw * 0.8 - 2} ${y0 - 202}`, "#c9473c", { sw: 2 });
          return s;
        },
        b: (w, h) => [say("Up and to the right!", w * 0.62, 50, [w + 30, 60], { w: 130 })],
      },
      {
        alt: "Lexington surprises Mom with flowers he bought with his own money.",
        art(w, h) {
          let s = S.rays(w, h, "#ffe3c2", "#fff6e6", w * 0.4, h * 0.4);
          s += mom({ x: w * 0.3, y: h + 120, s: 1.05, expr: "touched", pose: "heart" });
          s += lex({ x: w * 0.72, y: h + 50, s: 1.05, f: -1, expr: "happy", pose: "present", hold: { r: H.flowers } });
          s += fx.heart(w * 0.46, 120, 12) + fx.heart(w * 0.52, 90, 8);
          return s;
        },
        b: (w, h) => [say("You bought these? With YOUR money?", w * 0.26, 60, top("woman", w * 0.3, h + 120, 1.05), { w: 140 }), say("You deserve them, Mom.", w * 0.78, 110, top("teen", w * 0.72, h + 50, 1.05), { w: 120 })],
      },
      {
        alt: "Lexington shows Dad his savings jar, stuffed with money.",
        art(w, h) {
          let s = S.rays(w, h, "#d6e4f5", "#ffffff", w * 0.5, h * 0.5);
          s += dad({ x: w * 0.28, y: h + 150, s: 1.05, expr: "proud", pose: "thumbs" });
          s += lex({ x: w * 0.72, y: h + 60, s: 1.05, f: -1, expr: "confident", pose: "holdOut", hold: { r: H.jarFull } });
          return s;
        },
        b: (w, h) => [say("That's my boy.", w * 0.24, 60, top("man", w * 0.28, h + 150, 1.05), { w: 110 }), say("Next stop: the BANK.", w * 0.78, 60, top("teen", w * 0.72, h + 60, 1.05), { w: 110 })],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 9 — GOALS & DREAMS
  // =====================================================================
  const GOALS = [
    { t: "Save $1,000 by summer" },
    { t: "Read the whole Bible this year" },
    { t: "Make the honor roll" },
    { t: "Learn to code an app" },
    { t: "Buy my own laptop (with MY money)" },
    { t: "Become an engineer + business owner" },
  ];
  page({
    chapter: { n: 9, title: "Goals & Dreams", color: "#5b7fb5" },
    rows: [
      [0.47, [1]],
      [0.27, [0.5, 0.5]],
      [0.26, [1]],
    ],
    panels: [
      {
        alt: "In his tidy bedroom, Lexington pins up a goal board listing six big goals.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.walls(w, h, gy, "#b8d7d0", "#7d8fb3", { stripe: true });
          s += P.window(40, 60, 150, 170, { time: "day", curtains: "#e8c35a" });
          s += P.shelf(40, 330, 200, { trophy: true, seed: 6 });
          s += P.goalBoard(w * 0.42, 60, 420, 440, { goals: GOALS });
          s += lex({ x: w * 0.3, y: h + 40, s: 1.25, expr: "determined", pose: "reachUp" });
          s += P.plant(w * 0.95, gy, 1);
          return s;
        },
        b: (w, h) => [verse("“Commit thy works unto the LORD, and thy thoughts shall be established.” — Proverbs 16:3", 16, h - 120, { w: 300 })],
      },
      {
        alt: "Late at night, Lexington learns to code on a laptop.",
        art(w, h) {
          let s = frect(0, 0, w, h, "#2b3260");
          s += `<ellipse cx="${w * 0.5}" cy="${h * 0.7}" rx="200" ry="150" fill="url(#screenGlow)" opacity=".6"/>`;
          s += lex({ x: w * 0.3, y: h + 60, s: 1.0, expr: "focus", pose: "sitRead", seated: true });
          s += rect(-10, h * 0.82, w + 20, 30, "#b07a4a", { sw: 3 });
          s += P.monitor(w * 0.68, h * 0.82, 1.15, { code: true });
          return s;
        },
        b: (w, h) => [cap("Coding lessons: 30 minutes a day.", 14, 14, { w: 230 })],
      },
      {
        alt: "Lexington daydreams about his future self: a grown-up engineer in a suit in front of a building called Lexington Engineering.",
        art(w, h) {
          let s = S.rays(w, h, "#fff3c8", "#ffffff", w * 0.6, h * 0.4);
          s += lex({ x: 70, y: h + 70, s: 0.95, expr: "hopeful", pose: "think" });
          const bx = w * 0.6,
            by = h * 0.45;
          s += C.balloon({ t: " ", x: bx, y: by, k: "think", minW: 240, minH: 190, tail: [110, h * 0.55] });
          s += `<svg x="${bx - 150}" y="${by - 120}" width="300" height="240" viewBox="0 0 300 240"><g opacity=".98">`;
          s += rect(150, 30, 120, 190, "#9fc3e6", { sw: 2.6 });
          for (let r2 = 0; r2 < 5; r2++) for (let c2 = 0; c2 < 3; c2++) s += rect(160 + c2 * 36, 44 + r2 * 32, 26, 20, "#e6f4fa", { sw: 1.6 });
          s += rect(140, 8, 140, 22, "#2a8f86", { sw: 2.2 }) + text(210, 24, "LEXINGTON ENG.", { size: 14, font: "title", fill: "#fff", ls: 1 });
          s += lex({ x: 90, y: 236, s: 0.68, outfit: "adult", expr: "confident", pose: "hips" });
          s += `</g></svg>`;
          return s;
        },
        b: (w, h) => [cap("Engineer. Business owner. One day, a husband and a dad.", w - 230, h - 76, { w: 210, bg: "#ffffff" })],
      },
      {
        alt: "Lexington checks off two goals and pumps his fist, holding a new laptop box he bought himself.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.rays(w, h, "#c9f2c0", "#ffffff", w * 0.5, h * 0.6);
          s += `<g transform="rotate(-3 ${w * 0.22} ${h * 0.5})">${rect(w * 0.06, 50, 300, 66, "#c9f2c0", { sw: 2.4 })}${rect(w * 0.06 + 14, 68, 28, 28, "#fff", { sw: 2.4 })}${path(`M${w * 0.06 + 18} 82 l8 10 l18 -22`, "none", { sw: 4, stroke: "#2a9d5a" })}${text(w * 0.06 + 56, 92, "Make the honor roll", { size: 24, font: "hand", anchor: "start" })}</g>`;
          s += `<g transform="rotate(2 ${w * 0.22} ${h * 0.75})">${rect(w * 0.06, 150, 330, 66, "#ffe0b0", { sw: 2.4 })}${rect(w * 0.06 + 14, 168, 28, 28, "#fff", { sw: 2.4 })}${path(`M${w * 0.06 + 18} 182 l8 10 l18 -22`, "none", { sw: 4, stroke: "#2a9d5a" })}${text(w * 0.06 + 56, 192, "Buy my own laptop", { size: 24, font: "hand", anchor: "start" })}</g>`;
          s += lex({ x: w * 0.68, y: h + 20, s: 0.95, expr: "joy", pose: "fistPump", hold: { l: (x, y, sc, f) => H.laptopBox(x - 20, y - 20, sc, f) } });
          return s;
        },
        b: (w, h) => [shout("WITH MY OWN MONEY!", w * 0.88, 64, top("teen", w * 0.68, h + 20, 0.95, { dx: 20 }), { w: 140, size: 20 })],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 10 — STANDING TALL
  // =====================================================================
  function mirrorScene(w, h, reflection, lexExpr) {
    const gy = h * 0.98;
    let s = frect(0, 0, w, h, "#dff0f3") + `<rect width="${w}" height="${h}" fill="url(#tiles)"/>`;
    const mx = w * 0.46,
      my = 60,
      mw = w * 0.5,
      mh = h * 0.62;
    s += rect(mx - 10, my - 10, mw + 20, mh + 20, "#c9b38a", { sw: 3, r: 12 });
    s += `<svg x="${mx}" y="${my}" width="${mw}" height="${mh}" viewBox="0 0 ${mw} ${mh}" overflow="hidden"><rect width="${mw}" height="${mh}" fill="#cfe8f2"/>${reflection(mw, mh)}<path d="M20 30 L80 10 M14 70 L130 20" stroke="#ffffff" stroke-width="5" opacity=".7"/></svg>`;
    s += rect(mx, my, mw, mh, "none", { sw: 2.6 });
    s += lex({ x: w * 0.28, y: h + 80, s: 1.15, expr: lexExpr, pose: lexExpr === "shock" ? "handsHead" : "hips" });
    s += rect(-10, gy - 40, w + 20, 60, "#e9e4da", { sw: 3 });
    return s;
  }
  page({
    chapter: { n: 10, title: "Standing Tall", color: "#c9473c" },
    rows: [
      [0.42, [0.5, 0.5]],
      [0.58, [1]],
    ],
    panels: [
      {
        alt: "Lexington looks in the bathroom mirror and sees his old, messy, smelly self staring back. He jumps.",
        art: (w, h) => mirrorScene(w, h, (mw, mh) => lex({ x: mw * 0.5, y: mh + 230, s: 1.3, f: -1, messy: true, expr: "sly", pose: "slump", flies: 2 }), "shock"),
        b: (w, h) => [sfx("WHOA!", 90, 70, { size: 46, rot: -10, color: "#ffd23f" })],
      },
      {
        alt: "He looks again. This time the reflection is the real, confident Lexington, smiling back.",
        art: (w, h) => mirrorScene(w, h, (mw, mh) => lex({ x: mw * 0.5, y: mh + 230, s: 1.3, f: -1, expr: "confident", pose: "hips", sparkle: true }), "confident"),
        b: (w, h) => [say("Nah. That's not who I am anymore.", 120, 70, top("teen", w * 0.28, h + 80, 1.15, { dx: -10 }), { w: 150 })],
      },
      {
        alt: "At the Youth Business Expo, Lexington speaks confidently at a podium beside a chart. The crowd claps and Mom and Dad cheer from the front row.",
        art(w, h) {
          const gy = h * 0.8;
          let s = S.expo(w, h, { k: 1.0, gy, ox: w * 0.5 });
          s += `<ellipse cx="${w * 0.45}" cy="${gy - 160}" rx="240" ry="260" fill="url(#glow)" opacity=".55"/>`;
          s += lex({ x: w * 0.45, y: gy, s: 1.25, outfit: "polo", expr: "confident", pose: "wave" });
          s += P.podium(w * 0.45 + 10, gy + 10, 1.2);
          s += P.easel(w * 0.75, gy + 10, 1.25, {});
          s += S.crowd(w, h, h - 70, { clap: true });
          s += mom({ x: w * 0.1, y: h + 230, s: 0.95, expr: "joy", pose: "cheer" });
          s += dad({ x: w * 0.22, y: h + 250, s: 0.95, expr: "joy", pose: "fistPump" });
          return s;
        },
        b: (w, h) => [
          say("My name is Lexington. I'm thirteen... and I run TWO businesses.", w * 0.17, h * 0.42, top("teen", w * 0.45, h * 0.8, 1.25, { dx: -40 }), { w: 210 }),
          sfx("CLAP! CLAP! CLAP!", w * 0.72, h - 100, { size: 44, rot: -6, color: "#ffd23f" }),
          shout("THAT'S OUR SON!", w * 0.14, h - 210, top("woman", w * 0.1, h + 230, 0.95), { w: 120, size: 18 }),
        ],
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
        alt: "Lexington cooks scrambled eggs on the stove, with his lunch already packed.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.kitchen(w, h, { k: 0.8, gy, ox: w * 0.9, table: false });
          s += stove(w * 0.7, gy, 1.2);
          s += lex({ x: w * 0.4, y: h + 50, s: 1.05, expr: "happy", pose: "holdOut", hold: { r: H.pan } });
          s += fx.steam(w * 0.56, h * 0.48, 0.4);
          s += rect(w * 0.06, gy - 130, 80, 50, "#c9473c", { sw: 2.6, r: 8 }) + path(`M${w * 0.06 + 20} ${gy - 130} q20 -20 40 0`, "none", { sw: 3 });
          return s;
        },
        b: (w, h) => [cap("Breakfast? Made it himself. Lunch? Already packed.", 14, 14, { w: 250 })],
      },
      {
        alt: "Lexington folds his own laundry into neat stacks on his bed.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.walls(w, h, gy, "#b8d7d0", "#7d8fb3", { stripe: true });
          s += P.bed(w * 0.5, gy + 30, 1.25, {});
          s += lex({ x: w * 0.42, y: h + 60, s: 1.05, expr: "peace", pose: "holdBoth", hold: { c: H.shirtFold } });
          [0, 1, 2].forEach((i) => (s += H.shirtFold(w * 0.78, gy - 112 - i * 20, 1, 1)));
          [0, 1].forEach((i) => (s += T(w * 0.9, gy - 110 - i * 18, 1, rect(-24, -8, 48, 18, "#ffffff", { sw: 2.2, r: 3 }))));
          return s;
        },
        b: (w, h) => [cap("Laundry? Washed, dried, folded. By him.", 14, 14, { w: 230 })],
      },
      {
        alt: "At the bank, Lexington makes his first deposit while Dad stands proudly behind him.",
        art(w, h) {
          const gy = h * 0.98;
          let s = S.bank(w, h, { k: 0.42, gy: h * 0.8, ox: w * 0.5 });
          s += npc("teller", { x: w * 0.78, y: h + 80, s: 0.9, f: -1, expr: "happy", pose: "stand" });
          s += P.bankCounter(w * 0.55, gy, w * 0.5, 130);
          s += dad({ x: w * 0.14, y: h + 120, s: 0.95, expr: "proud", pose: "cross" });
          s += lex({ x: w * 0.38, y: h + 40, s: 1.0, expr: "confident", pose: "holdOut", hold: { r: H.money } });
          return s;
        },
        b: (w, h) => [say("Your first deposit, Mr. Lexington?", w * 0.74, 56, top("man", w * 0.78, h + 80, 0.9), { w: 160 }), say("Five hundred dollars. For my future.", w * 0.3, 90, top("teen", w * 0.38, h + 40, 1.0, { dx: -10 }), { w: 150 })],
      },
      {
        alt: "Lexington checks his own schedule on a clipboard. No reminders needed.",
        art(w, h) {
          let s = S.rays(w, h, "#e6d4ff", "#ffffff", w * 0.4, h * 0.5);
          s += lex({ x: w * 0.3, y: h + 60, s: 1.1, expr: "determined", pose: "holdBoth", hold: { c: H.clipboard } });
          s += `<g transform="rotate(3 ${w * 0.72} ${h * 0.5})">${rect(w * 0.52, h * 0.24, 190, 200, "#ffffff", { sw: 3 })}${frect(w * 0.52 + 2, h * 0.24 + 2, 186, 30, "#7a5a8a")}${text(w * 0.52 + 95, h * 0.24 + 24, "MY SCHEDULE", { size: 18, font: "title", fill: "#fff", ls: 1 })}`;
          ["4:00  Homework", "5:00  2 sneaker orders", "6:00  Dinner + dishes", "7:00  Youth group", "9:00  Bible + bed"].forEach((t, i) => (s += text(w * 0.52 + 12, h * 0.24 + 60 + i * 30, t, { size: 18, font: "hand", anchor: "start", weight: 400 })));
          s += `</g>`;
          return s;
        },
        b: (w, h) => [cap("He kept his own schedule. No reminders needed.", 14, 14, { w: 260 })],
      },
      {
        alt: "Lexington rides his bike past Ms. Pearl's fence, delivering sneakers. She waves.",
        art(w, h) {
          const gy = h * 0.92;
          let s = S.yard(w, h, { k: 0.85, gy, ox: w * 0.3, houseX: -360, tree: 760, sidewalk: false });
          s += npc("pearl", { x: w * 0.14, y: h + 40, s: 0.9, expr: "joy", pose: "wave" });
          s += P.fence(-10, gy + 10, w * 0.32, 100);
          const bx = w * 0.62,
            bs = 1.25;
          s += P.bike(bx, gy + 20, bs, { color: "#2a8f86" });
          s += lex({ x: bx - 48 * bs, y: gy + 20 - 52 * 0.98 + 4, s: 0.98, expr: "joy", pose: "ride", lean: 14 });
          s += T(bx + 70 * bs, gy + 20 - 126 * bs, 1, rect(-6, 0, 40, 34, "#f4c542", { sw: 2.4, r: 4 }) + C.held.sneaker(14, 8, 0.4, 1));
          s += fx.motion(bx - 140, gy - 60, 1, 1);
          return s;
        },
        b: (w, h) => [
          say("Well, if it isn't Lexington! You know... I haven't heard your name yelled in MONTHS.", w * 0.24, 70, top("woman", w * 0.14, h + 40, 0.9, { dx: 20 }), { w: 230 }),
          say("Yes, ma'am! Have a blessed day, Ms. Pearl!", w * 0.72, 70, [w * 0.6, h * 0.36], { w: 180 }),
        ],
      },
    ],
  });

  // =====================================================================
  // CHAPTER 11 — THE LAST TIME
  // =====================================================================
  page({
    chapter: { n: 11, title: "The Last Time", color: "#e09a3e" },
    rows: [
      [0.37, [1]],
      [0.3, [0.5, 0.5]],
      [0.33, [1]],
    ],
    panels: [
      {
        alt: "At sunset, Lexington sits on the porch steps with his little cousin Jace and Biscuit.",
        art(w, h) {
          const gy = h * 0.62;
          let s = S.porch(w, h, { k: 0.9, gy, ox: w * 0.5, sunX: 380 });
          s += steps(w * 0.2, gy, w * 0.6, 4, (h - gy) / 4, "#b8a38a");
          s += lex({ x: w * 0.42, y: gy + 150, s: 0.95, expr: "peace", pose: "sitHands", seated: true });
          s += npc("kid", { x: w * 0.58, y: gy + 150, s: 0.95, f: -1, expr: "talk", pose: "sitHands", seated: true });
          s += P.dog(w * 0.74, gy + 60, 0.85, { mood: "sleep", f: -1 });
          return s;
        },
        b: (w, h) => [cap("One evening, Lexington's little cousin Jace came over.", 16, 16, { w: 300 }), say("Hey Lex... when's the last time you got in trouble?", w * 0.74, 90, top("child", w * 0.58, h * 0.62 + 150, 0.95, { seated: true, dx: 10 }), { w: 200 })],
      },
      {
        alt: "Lexington thinks hard. His thought bubble is full of cobwebs and dust.",
        art(w, h) {
          let s = S.rays(w, h, "#ffcf6e", "#ffe7a8", w * 0.5, h * 0.8);
          s += lex({ x: w * 0.56, y: h + 200, s: 1.3, expr: "think", pose: "think" });
          const bx = w * 0.42,
            by = 96;
          s += C.balloon({ t: " ", x: bx, y: by, k: "think", minW: 220, minH: 100, tail: [w * 0.52, 205] });
          s += path(`M${bx - 120} ${by - 60} L${bx - 60} ${by - 10} M${bx - 120} ${by - 60} L${bx - 80} ${by + 20} M${bx - 120} ${by - 60} L${bx - 40} ${by - 50} M${bx - 100} ${by - 42} Q${bx - 84} ${by - 34} ${bx - 90} ${by - 20} M${bx - 80} ${by - 28} Q${bx - 64} ${by - 24} ${bx - 70} ${by - 6}`, "none", { sw: 1.6, stroke: "#8a8478" });
          s += circle(bx + 30, by + 20, 18, "#cfc8b8", { sw: 1.8 }) + circle(bx + 50, by + 14, 12, "#cfc8b8", { sw: 1.6 }) + text(bx + 10, by - 6, "???", { size: 30, font: "title", fill: "#8a8478" });
          return s;
        },
        b: (w, h) => [],
      },
      {
        alt: "Lexington shrugs and says he honestly can't remember. Jace is shocked.",
        art(w, h) {
          let s = S.porch(w, h, { k: 0.8, gy: h * 0.6, ox: w * 0.5, sunX: 200 });
          s += lex({ x: w * 0.32, y: h + 60, s: 1.1, expr: "happy", pose: "shrug" });
          s += npc("kid", { x: w * 0.74, y: h + 40, s: 1.15, f: -1, expr: "gasp", pose: "handsHead" });
          return s;
        },
        b: (w, h) => [say("Honestly? I can't even remember.", w * 0.3, 60, top("teen", w * 0.32, h + 60, 1.1), { w: 140 }), shout("WHAT?!", w * 0.8, 70, top("child", w * 0.74, h + 40, 1.15), { w: 80, size: 26 })],
      },
      {
        alt: "With his arm around Jace, Lexington explains how his life turned around.",
        art(w, h) {
          const gy = h * 0.66;
          let s = S.porch(w, h, { k: 0.85, gy, ox: w * 0.5, sunX: 420 });
          s += steps(w * 0.1, gy, w * 0.8, 3, (h - gy) / 3, "#b8a38a");
          s += lex({ x: w * 0.45, y: h + 40, s: 1.1, expr: "peace", pose: "sitHands", seated: true, ra: C.ik(110, -150) });
          s += npc("kid", { x: w * 0.58, y: h + 30, s: 1.05, f: -1, expr: "surprised", pose: "sitHands", seated: true });
          return s;
        },
        b: (w, h) => [
          say("Why would I even WANT to be in trouble? Life's too good now.", w * 0.2, 70, top("teen", w * 0.45, h + 40, 1.1, { seated: true, dx: -20 }), { w: 200 }),
          say("But how'd you DO it?", w * 0.7, 50, top("child", w * 0.58, h + 30, 1.05, { seated: true }), { w: 120 }),
          say("I prayed. I listened. I kept getting back up, day by day. God did the heavy lifting. I just stopped fighting Him.", w * 0.8, 180, top("teen", w * 0.45, h + 40, 1.1, { seated: true, dx: 30 }), { w: 230 }),
        ],
      },
    ],
  });

  page({
    rows: [
      [0.62, [1]],
      [0.38, [1]],
    ],
    panels: [
      {
        alt: "From the doorway, Mom and Dad hold each other and watch Lexington and Jace on the porch steps in the sunset.",
        art(w, h) {
          const gy = h * 0.55;
          let s = S.sky(w, h, "sunset") + P.sun(w * 0.15, h * 0.32, 70);
          s += `<rect x="${w * 0.42}" y="0" width="${w * 0.6}" height="${gy}" fill="url(#siding)" stroke="${INK}" stroke-width="3"/>`;
          s += rect(w * 0.5, gy - 380, 210, 380, "#2a1f2f", { sw: 4 }) + rect(w * 0.5 - 14, gy - 394, 238, 18, "#f6f1e6", { sw: 3 });
          s += `<rect x="${w * 0.5}" y="${gy - 380}" width="210" height="380" fill="#ffd27a" opacity=".55"/>`;
          s += mom({ x: w * 0.5 + 70, y: gy, s: 0.95, expr: "touched", pose: "heart" });
          s += dad({ x: w * 0.5 + 150, y: gy + 4, s: 0.95, f: -1, expr: "proud", pose: "stand", ra: C.ik(46, -258) });
          s += P.window(w * 0.82, gy - 330, 120, 140, { time: "sunset" });
          s += frect(0, gy, w, h - gy, "#b8a38a") + line(0, gy, w, gy, { sw: 3 });
          s += steps(w * 0.05, gy + 40, w * 0.5, 4, (h - gy - 40) / 4, "#b8a38a");
          s += rect(w * 0.42 - 14, 0, 22, gy, "#f6f1e6", { sw: 3 });
          s += lex({ x: w * 0.24, y: h * 0.99, s: 1.15, expr: "peace", pose: "sitHands", seated: true });
          s += npc("kid", { x: w * 0.4, y: h * 0.99, s: 1.1, f: -1, expr: "happy", pose: "sitHands", seated: true });
          s += P.dog(w * 0.62, h * 0.97, 1.1, { mood: "love", f: -1 });
          s += `<rect width="${w}" height="${h}" fill="#ff9a5a" opacity=".12"/>`;
          return s;
        },
        b: (w, h) => [
          say("That's our son.", w * 0.86, 90, top("man", w * 0.5 + 150, h * 0.55 + 4, 0.95, { dx: 10 }), { w: 120 }),
          say("God answered every single prayer.", w * 0.32, 90, top("woman", w * 0.5 + 70, h * 0.55, 0.95, { dx: -10 }), { w: 170 }),
        ],
      },
      {
        alt: "Lexington stands tall in the golden sunset with Biscuit beside him.",
        art(w, h) {
          let s = S.sky(w, h, "sunset") + fx.rays(w * 0.5, h * 0.7, 1200, "#fff3b8", 24, 0.5);
          s += `<path d="M0 ${h * 0.82} Q${w * 0.5} ${h * 0.68} ${w} ${h * 0.82} L${w} ${h} L0 ${h} Z" fill="#69a94f" stroke="${INK}" stroke-width="3"/>`;
          s += lex({ x: w * 0.5, y: h * 0.99, s: 1.4, expr: "confident", pose: "cheer", sparkle: true });
          s += P.dog(w * 0.64, h * 0.99, 1.0, { mood: "love", f: -1 });
          return s;
        },
        b: (w, h) => [
          verse("“Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.” — 2 Corinthians 5:17", 16, 16, { w: 300 }),
          sfx("THE END", w * 0.82, h * 0.42, { size: 70, rot: -6, color: "#ffffff" }),
          sfx("...is just the beginning.", w * 0.8, h * 0.58, { size: 30, rot: -6, color: "#ffd95e", font: "hand" }),
        ],
      },
    ],
  });

  // =====================================================================
  // BACK PAGES
  // =====================================================================
  function statCard(x, y, w, h, o) {
    let s = `<rect x="${x + 8}" y="${y + 8}" width="${w}" height="${h}" rx="18" fill="${INK}"/>`;
    s += rect(x, y, w, h, "#ffffff", { sw: 5, r: 18 });
    s += `<path d="M${x} ${y + 18} Q${x} ${y} ${x + 18} ${y} L${x + w - 18} ${y} Q${x + w} ${y} ${x + w} ${y + 18} L${x + w} ${y + 70} L${x} ${y + 70} Z" fill="${o.color}" stroke="${INK}" stroke-width="5"/>`;
    s += text(x + w / 2, y + 52, o.title, { size: 46, font: "title", fill: "#ffffff", stroke: INK, sw: 6, ls: 2 });
    const ph = h * 0.5;
    s += `<svg x="${x + 16}" y="${y + 84}" width="${w - 32}" height="${ph}" viewBox="0 0 ${w - 32} ${ph}" overflow="hidden"><rect width="${w - 32}" height="${ph}" fill="${o.bg}"/><rect width="${w - 32}" height="${ph}" fill="url(#dots)"/>${o.art(w - 32, ph)}</svg>`;
    s += rect(x + 16, y + 84, w - 32, ph, "none", { sw: 3.5 });
    let ty = y + 84 + ph + 28;
    o.stats.forEach(([label, val, col]) => {
      s += text(x + 22, ty + 14, label, { size: 17, font: "title", anchor: "start", ls: 1 });
      for (let i = 0; i < 10; i++) s += rect(x + 160 + i * ((w - 190) / 10), ty, (w - 190) / 10 - 4, 18, i < val ? col : "#ece6da", { sw: 2, r: 3 });
      ty += 30;
    });
    return s;
  }
  page({
    noNumber: false,
    alt: "Then and Now: Lexington's stats before and after his turnaround, plus his favorite verses.",
    full(W, Hh) {
      let s = `<rect width="${W}" height="${Hh}" fill="#3f6fb5"/><rect width="${W}" height="${Hh}" fill="url(#dotsWhite)"/>`;
      s += text(W / 2 + 6, 120, "THEN & NOW", { size: 100, font: "title", fill: INK, stroke: INK, sw: 12, ls: 3 });
      s += text(W / 2, 114, "THEN & NOW", { size: 100, font: "title", fill: "#ffd95e", stroke: INK, sw: 8, ls: 3 });
      const stats = (v) => [
        ["BRAINS", v[0], "#2a8f86"],
        ["LISTENING", v[1], v[1] > 5 ? "#2a9d5a" : "#c9473c"],
        ["HYGIENE", v[2], v[2] > 5 ? "#2a9d5a" : "#c9473c"],
        ["FAITH", v[3], "#f0b429"],
        ["CONFIDENCE", v[4], "#f0b429"],
        ["TROUBLE", v[5], v[5] > 5 ? "#c9473c" : "#2a9d5a"],
      ];
      s += statCard(42, 160, 440, 760, { title: "THEN", color: "#7a7590", bg: "#d9d6e0", art: (w, h) => ghost(lex({ x: w / 2, y: h + 180, s: 1.5, messy: true, expr: "gloom", pose: "slump", flies: 3 }), 0.9), stats: stats([10, 2, 1, 3, 4, 10]) });
      s += statCard(518, 160, 440, 760, { title: "NOW", color: "#2a9d5a", bg: "#c9f2c0", art: (w, h) => lex({ x: w / 2, y: h + 180, s: 1.5, expr: "confident", pose: "hips", sparkle: true }), stats: stats([10, 10, 10, 9, 9, 0]) });
      s += rect(42, 960, 916, 470, "#fbf1d6", { sw: 5, r: 18 });
      s += text(W / 2, 1012, "LEXINGTON'S WORDS TO LIVE BY", { size: 38, font: "title", fill: "#c9473c", ls: 2 });
      const vv = [
        ["Ephesians 6:1", "Children, obey your parents in the Lord: for this is right."],
        ["Philippians 4:13", "I can do all things through Christ which strengtheneth me."],
        ["Galatians 6:9", "Let us not be weary in well doing: for in due season we shall reap."],
        ["Proverbs 3:5", "Trust in the LORD with all thine heart; and lean not unto thine own understanding."],
        ["1 Timothy 4:12", "Let no man despise thy youth; but be thou an example of the believers."],
        ["2 Corinthians 5:17", "If any man be in Christ, he is a new creature."],
      ];
      vv.forEach(([ref, t], i) => {
        const y = 1060 + i * 60;
        s += text(76, y, ref, { size: 22, font: "title", anchor: "start", fill: "#2a8f86", ls: 1 });
        s += text(76, y + 26, t, { size: 19, font: "verse", italic: true, anchor: "start", weight: 500 });
      });
      return s;
    },
  });

  page({
    noNumber: true,
    alt: "Lexington's Daily Checklist: a printable routine for mornings, the bathroom, after school and bedtime, with boxes for each day of the week.",
    full(W, Hh) {
      let s = `<rect width="${W}" height="${Hh}" fill="#fffaf0"/>`;
      s += `<rect width="${W}" height="150" fill="#2a8f86"/><rect width="${W}" height="150" fill="url(#dotsWhite)"/>` + line(0, 150, W, 150, { sw: 5 });
      s += text(W / 2 + 5, 86, "LEXINGTON'S DAILY CHECKLIST", { size: 58, font: "title", fill: INK, stroke: INK, sw: 9, ls: 2 });
      s += text(W / 2, 81, "LEXINGTON'S DAILY CHECKLIST", { size: 58, font: "title", fill: "#ffd95e", stroke: INK, sw: 6, ls: 2 });
      s += text(W / 2, 126, "Print it. Post it. Check it. Nobody has to remind you.", { size: 22, fill: "#ffffff" });
      const days = ["M", "T", "W", "T", "F", "S", "S"];
      const sections = [
        ["MORNING", "#e09a3e", ["Get up with the alarm", "Pray", "Brush teeth: 2 minutes", "Shower", "Deodorant", "Clean clothes + socks", "Make the bed"]],
        ["BATHROOM, EVERY TIME", "#3f6fb5", ["Go when you first feel it", "Wipe until the paper is clean", "Flush", "Wash hands: soap, 20 seconds"]],
        ["AFTER SCHOOL", "#3f8f5a", ["Homework first", "Chores: trash, dishes, laundry", "Feed Biscuit", "Business + hobby time"]],
        ["BEDTIME", "#7a3f8f", ["Read a Bible chapter", "Lay out tomorrow's clothes", "Brush teeth", "Pray + lights out"]],
      ];
      let y = 186;
      const gx = 560,
        cell = 43;
      s += days.map((d, i) => text(gx + i * cell + cell / 2, y + 4, d, { size: 24, font: "title" })).join("");
      y += 20;
      sections.forEach(([title, col, items]) => {
        s += rect(36, y, W - 72, 40, col, { sw: 3, r: 6 }) + text(54, y + 30, title, { size: 26, font: "title", anchor: "start", fill: "#ffffff", ls: 1.5 });
        y += 50;
        items.forEach((it) => {
          s += text(56, y + 30, it, { size: 23, font: "hand", anchor: "start", weight: 400 });
          for (let i = 0; i < 7; i++) s += rect(gx + i * cell + 7, y + 6, cell - 14, cell - 14, "#ffffff", { sw: 2.4, r: 5 });
          s += line(50, y + cell - 2, W - 50, y + cell - 2, { sw: 1, stroke: "#e2dccd" });
          y += cell;
        });
        y += 10;
      });
      s += lex({ x: 925, y: Hh - 12, s: 0.62, f: -1, expr: "grin", pose: "thumbs" });
      s += text(380, Hh - 40, "“I can do all things through Christ.” — Phil. 4:13", { size: 22, font: "verse", italic: true });
      return s;
    },
  });
})();
