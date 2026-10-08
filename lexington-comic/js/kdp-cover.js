/* Lexington — paperback wraparound cover (back + spine + front).
   Units: 144 px per inch.
   KDP (default):     trim 6.75 x 10.25 in, 0.125 in bleed, 0.25 in safe zone, premium color spine.
   Lulu (?printer=lulu): comic book trim 6.625 x 10.25 in, saddle stitch (no spine),
                      0.125 in bleed, 0.5 in safety margin. */
(function () {
  "use strict";
  const C = window.Comic;
  const { n, text, rect, frect, path, line, circle, T, INK } = C;
  const fx = C.fx;

  const DPI = 144;
  const q = new URLSearchParams(location.search);
  const LULU = q.get("printer") === "lulu";
  const TRIM_W = (LULU ? 6.625 : 6.75) * DPI,
    TRIM_H = 10.25 * DPI,
    BLEED = 0.125 * DPI,
    SAFE = (LULU ? 0.5 : 0.25) * DPI;
  const PER_PAGE = LULU ? 0 : 0.002347; // KDP premium color, white paper (inches per page); saddle stitch has no spine
  const book = window.KDP_BOOK || "original";
  const BOOKS = {
    original: {
      pages: 26,
      bg: "#ef8f45",
      ray: "#ffb877",
      title: "THE TURNAROUND",
      hook: "SMART KID. DUMB CHOICES. ONE BIG TURNAROUND.",
      blurb:
        "Lexington is thirteen and brilliant. He built a working robot out of his mom's vacuum cleaner in one weekend. But he can't remember to shower, brush his teeth, or listen to his parents, and the trouble never stops. Then one night he opens the Bible he forgot he had, and for the first time he prays on his own. Day by day, Lexington learns to listen, take care of himself, work hard, and grow into a young man of faith... until he can't remember the last time he got in trouble.",
      panels: ["Lexington's messy bedroom", "In the moonlight, Lexington kneels", "At the Youth Business Expo"],
      inside: ["11 chapters of funny, heartfelt storytelling", "Real lessons on hygiene, listening and responsibility", "Scripture woven through the story (KJV)", "Bonus: a printable Daily Checklist"],
    },
    caucasian: {
      pages: 28,
      bg: "#ef8f45",
      ray: "#ffb877",
      title: "THE TURNAROUND",
      hook: "SMART KID. DUMB CHOICES. ONE BIG TURNAROUND.",
      blurb:
        "Lexington is thirteen and brilliant. He built a working robot out of his mom's vacuum cleaner in one weekend. But he can't remember to shower, brush his teeth, or listen to his parents, and the trouble never stops. Then one night he opens the Bible he forgot he had, and for the first time he prays on his own. With a little help from his big brother, Big Tony, Lexington learns day by day to listen, take care of himself, work hard, and grow into a young man of faith... until he can't remember the last time he got in trouble.",
      panels: ["Lexington's messy bedroom", "In the moonlight, Lexington kneels", "At the Youth Business Expo"],
      inside: ["Funny, heartfelt storytelling in 11 chapters", "Real lessons on hygiene, listening and responsibility", "Scripture woven through the story (KJV)", "Bonus: a printable Daily Checklist"],
    },
    issue2: {
      pages: 24,
      bg: "#3f9ad6",
      ray: "#6fbbea",
      title: "DOWN TO BUSINESS",
      hook: "THREE PARTNERS. ONE BUCKET. A LOT TO LEARN.",
      blurb:
        "Lexington wants a 3D printer. He has two dollars and a library card. So Lexington, his best friend Jonathan, and his big brother Big Tony start the Suds Brothers Car Wash. They borrow from Dad and pay him back, stick to a budget, hunt for customers, and return a fifty-dollar bill they find under a truck seat. They pay their tithing, keep the Sabbath, serve the missionaries, and work out their first big partner fight. Along the way, Lexington learns what every dollar really costs: honest, hard work.",
      panels: ["Saturday at eight", "The car wash in full swing", "In his room, Lexington and Dad watch"],
      inside: ["8 chapters of funny, heartfelt storytelling", "Real money lessons: loans, budgets, saving, honesty", "Scripture from the Bible and the Book of Mormon", "Bonus: The Money Rules + a business worksheet"],
    },
  };
  const B = BOOKS[book] || BOOKS.original;
  const pages = Math.max(LULU ? 4 : 24, parseInt(q.get("pages") || B.pages, 10));
  const SPINE = pages * PER_PAGE * DPI;
  const W = BLEED + TRIM_W + SPINE + TRIM_W + BLEED,
    H = BLEED + TRIM_H + BLEED;
  const FOLD_BACK = BLEED + TRIM_W,
    FOLD_FRONT = FOLD_BACK + SPINE;
  C.KDP = { W, H, DPI, SPINE, pages, printer: LULU ? "lulu" : "kdp", inches: { w: W / DPI, h: H / DPI, spine: SPINE / DPI } };

  function findPanel(prefix) {
    for (const pg of C.STORY) {
      if (!pg.panels) continue;
      const rects = C.layout(pg);
      for (let i = 0; i < pg.panels.length; i++) {
        const p = pg.panels[i];
        const alt = String(p.alt || "");
        if (alt.startsWith(prefix) && rects[i]) return { p, r: rects[i] };
      }
    }
    return null;
  }
  function thumb(x, y, w, h, prefix, rot) {
    const f = findPanel(prefix);
    if (!f) return "";
    const { p, r } = f;
    // art only: cropping a panel to the thumbnail shape would cut through its lettering
    const inner = p.art(r.w, r.h);
    let s = `<g transform="rotate(${rot} ${n(x + w / 2)} ${n(y + h / 2)})">`;
    s += frect(x + 9, y + 9, w, h, INK);
    s += `<svg x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" viewBox="0 0 ${r.w} ${r.h}" preserveAspectRatio="xMidYMid slice" overflow="hidden"><rect width="${r.w}" height="${r.h}" fill="#ffffff"/>${inner}</svg>`;
    s += rect(x, y, w, h, "none", { sw: 6, stroke: "#ffffff" }) + rect(x - 3, y - 3, w + 6, h + 6, "none", { sw: 3 });
    return s + `</g>`;
  }

  // The back-cover layout is drawn in KDP coordinates (content between x 54 and 954, y 40 and 1450)
  // and scaled into a smaller safe area when the printer needs wider margins.
  const KDP_L = 0.125 * DPI + 0.25 * DPI,
    KDP_R = 0.125 * DPI + 6.75 * DPI - 0.25 * DPI,
    KDP_TOP = 40,
    KDP_BOTTOM = 1450;
  function back() {
    const cxBg = (BLEED + FOLD_BACK) / 2;
    let bg = frect(0, 0, FOLD_BACK + 1, H, B.bg) + fx.rays(cxBg, H * 0.45, 1500, B.ray, 24, 0.55) + `<rect width="${n(FOLD_BACK + 1)}" height="${n(H)}" fill="url(#dotsWhite)"/>`;
    const content = backContent();
    if (!LULU) return bg + content;
    const sl = BLEED + SAFE,
      sr = FOLD_BACK - SAFE,
      st = BLEED + SAFE,
      sb = H - BLEED - SAFE;
    const k = Math.min((sr - sl) / (KDP_R - KDP_L), (sb - st) / (KDP_BOTTOM - KDP_TOP));
    const tx = sl + (sr - sl - (KDP_R - KDP_L) * k) / 2 - KDP_L * k,
      ty = st + (sb - st - (KDP_BOTTOM - KDP_TOP) * k) / 2 - KDP_TOP * k;
    return bg + `<g transform="translate(${n(tx)} ${n(ty)}) scale(${k.toFixed(4)})">${content}</g>`;
  }
  function backContent() {
    const L = KDP_L,
      R = KDP_R,
      cx = (L + R) / 2;
    let s = "";
    // series logo
    s += text(cx + 7, 150, "LEXINGTON", { size: 118, font: "title", fill: INK, stroke: INK, sw: 12, ls: 4 });
    s += text(cx, 143, "LEXINGTON", { size: 118, font: "title", fill: "#e65a45", stroke: INK, sw: 9, ls: 4 });
    s += `<g transform="rotate(-2 ${n(cx)} 184)">${rect(cx - 210 + 6, 158 + 6, 420, 52, INK, { sw: 0 })}${rect(cx - 210, 158, 420, 52, "#ffd95e", { sw: 4 })}${text(cx, 197, B.title, { size: 36, font: "title", ls: 3 })}</g>`;
    // hook + blurb
    s += C.balloon({ t: B.hook, x: cx, y: 268, k: "cap", w: 820, size: 30, font: "title", align: "center", bg: "#ffffff" });
    s += C.balloon({ t: B.blurb, x: L + 6, y: 312, k: "cap", tl: true, w: R - L - 40, size: 23, bg: "#fffaf0" });
    // panel thumbnails
    const ty = 575,
      tw = (R - L - 40) / 3,
      th = 330;
    B.panels.forEach((pre, i) => (s += thumb(L + i * (tw + 20), ty, tw, th, pre, [-3, 2, -2][i])));
    // inside list
    const iy = 990;
    s += `<rect x="${n(L + 7)}" y="${n(iy + 7)}" width="560" height="200" fill="${INK}"/>` + rect(L, iy, 560, 200, "#ffffff", { sw: 4 });
    s += text(L + 20, iy + 40, "INSIDE THIS BOOK", { size: 28, font: "title", anchor: "start", fill: "#c9473c", ls: 2 });
    B.inside.forEach((t, i) => (s += fx.sparkle(L + 32, iy + 76 + i * 34, 9, "#ffd23f") + text(L + 52, iy + 84 + i * 34, t, { size: 20, anchor: "start" })));
    // ages badge, imprint, tagline
    const by = 1300;
    s += `<g transform="rotate(-8 ${n(L + 70)} ${n(by + 70)})">${circle(L + 70, by + 70, 66, "#2a8f86", { sw: 5 })}${text(L + 70, by + 62, "AGES", { size: 26, font: "title", fill: "#ffffff", ls: 2 })}${text(L + 70, by + 104, "9–14", { size: 40, font: "title", fill: "#ffd95e", stroke: INK, sw: 4 })}</g>`;
    s += text(L + 160, by + 52, "Every young man has more power", { size: 24, font: "hand", anchor: "start", fill: "#ffffff", weight: 400, stroke: INK, sw: 3 });
    s += text(L + 160, by + 82, "inside him than he knows.", { size: 24, font: "hand", anchor: "start", fill: "#ffffff", weight: 400, stroke: INK, sw: 3 });
    s += text(L + 160, by + 130, "A VERDANT LIFE COMIC", { size: 22, font: "title", anchor: "start", fill: "#ffffff", stroke: INK, sw: 4, ls: 2 });
    // Lexington pointing at the list (kept clear of the barcode box)
    const lexFn = book === "issue2" ? C.lexCrew : C.lex;
    s += lexFn({ x: L + 650, y: 1262, s: 0.82, f: -1, expr: "grin", pose: "thumbs" });
    return s;
  }

  function front() {
    const fw = W - FOLD_BACK; // front art also covers the spine, so small fold drift never shows a seam
    const pg = C.STORY[0];
    // Lulu's 0.5 in margin: shrink the title a little, tuck the issue badge beside it and the
    // corner badge under it (positions are relative to the 1000-wide cover design)
    const luluFront = { insetX: 48, insetY: 40, titleScale: 0.85, badges: { l: { dx: 27, dy: 53, s: 0.85 }, r: { dx: fw - 1000 - 38, dy: 222, s: 0.7 } } };
    const inner = pg.full(fw, H, LULU ? luluFront : { insetX: SAFE + 6, insetY: BLEED + 8 });
    return `<svg x="${n(FOLD_BACK)}" y="0" width="${n(fw)}" height="${n(H)}" viewBox="0 0 ${n(fw)} ${n(H)}" overflow="hidden">${inner}</svg>`;
  }

  function guides() {
    let g = "";
    const dash = { sw: 2, dash: "10 6" };
    g += rect(BLEED, BLEED, W - 2 * BLEED, H - 2 * BLEED, "none", Object.assign({ stroke: "#e0282e" }, dash));
    g += rect(BLEED + SAFE, BLEED + SAFE, TRIM_W - 2 * SAFE, TRIM_H - 2 * SAFE, "none", Object.assign({ stroke: "#1f6fe0" }, dash));
    g += rect(FOLD_FRONT + SAFE, BLEED + SAFE, TRIM_W - 2 * SAFE, TRIM_H - 2 * SAFE, "none", Object.assign({ stroke: "#1f6fe0" }, dash));
    g += line(FOLD_BACK, 0, FOLD_BACK, H, { sw: 2, stroke: "#18a558" }) + line(FOLD_FRONT, 0, FOLD_FRONT, H, { sw: 2, stroke: "#18a558" });
    const bw = LULU ? 1.8 : 2,
      bh = LULU ? 1.08 : 1.2;
    const bx = FOLD_BACK - SAFE - bw * DPI,
      byy = H - BLEED - SAFE - bh * DPI;
    g += rect(bx, byy, bw * DPI, bh * DPI, "#ffffff", { sw: 3, stroke: "#f08a00", op: 0.85 }) + text(bx + (bw / 2) * DPI, byy + (bh * 0.55) * DPI, "BARCODE AREA", { size: 22, font: "title", fill: "#f08a00" });
    g += text(W / 2, 30, LULU ? `Lulu saddle stitch · trim (red) · 0.5 in safety (blue) · fold (green) · ${pages} pages` : `trim (red) · safe zone (blue) · spine ${(SPINE / DPI).toFixed(4)} in (green) · ${pages} pages`, { size: 20, fill: "#e0282e", stroke: "#ffffff", sw: 4 });
    return g;
  }

  function render() {
    let s = back() + front();
    if (q.get("guides")) s += guides();
    const el = document.getElementById("cover");
    el.innerHTML = C.defs() + `<svg xmlns="http://www.w3.org/2000/svg" width="${(W / DPI).toFixed(4)}in" height="${(H / DPI).toFixed(4)}in" viewBox="0 0 ${n(W)} ${n(H)}">${s}</svg>`;
    window.KDP_READY = true;
  }

  const fonts = ["700 20px 'Comic Neue'", "400 20px 'Comic Neue'", "20px 'Bangers'", "italic 500 20px 'Lora'", "500 20px 'Lora'", "20px 'Patrick Hand'"];
  let done = false;
  const go = () => {
    if (!done) {
      done = true;
      render();
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    if (document.fonts && document.fonts.load) Promise.all(fonts.map((f) => document.fonts.load(f).catch(() => null))).then(go, go);
    else go();
    setTimeout(go, 4000);
  });
})();
