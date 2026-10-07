/* Lexington comics — script kit for issues that don't load Issue #1's story files.
   Same helpers as Issue #1 (story-1.js defines its own copy). */
(function () {
  "use strict";
  const C = window.Comic;
  const { rect, BODY } = C;
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
    top(type, x, y, s, o = {}) {
      const B = BODY[type];
      return [x + (o.dx || 0), y + (B.hcy - B.r * 1.35 + kit.bodyDy(type, o)) * s];
    },
    bodyDy(type, o = {}) {
      const B = BODY[type];
      return o.floorSit ? -14 - B.hy : o.seated ? -(B.sh + 14) - B.hy : o.kneel ? B.th * 0.92 : 0;
    },
    yFor(type, headTop, s, o = {}) {
      const B = BODY[type];
      return headTop - (B.hcy - 1.2 * B.r + kit.bodyDy(type, o)) * s;
    },
    page(p) {
      (C.STORY = C.STORY || []).push(p);
    },
    ghost: (inner, op) => `<g opacity="${op || 0.55}" filter="url(#desat)">${inner}</g>`,
    sepia: (inner) => `<g filter="url(#sepia)">${inner}</g>`,
    CAU: C.edition === "caucasian",
  });
  // a framed mini panel inside a panel (montages)
  C.sub = (x, y, w, h, inner, bg) =>
    `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="hidden"><rect width="${w}" height="${h}" fill="${bg || "#ffffff"}"/>${inner}</svg>` + rect(x, y, w, h, "none", { sw: 4 });
})();
