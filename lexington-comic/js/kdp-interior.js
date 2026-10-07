/* Lexington — KDP paperback interior and Kindle ebook pages.
   mode=print:  6.875 x 10.5 in pages (6.75 x 10.25 trim + bleed on top, bottom and outside edge).
                Every page sits inside the 0.375 in margin; paper colour fills out to the bleed.
   mode=ebook:  2:3 pages without the cover (Kindle adds the cover itself).
   mode=kcover: the Kindle cover at 1600 x 2560 px (1.6:1). */
(function () {
  "use strict";
  const C = window.Comic;
  const { n, rect, frect, line, text, INK } = C;
  const q = new URLSearchParams(location.search);
  const mode = q.get("mode") || "print";
  const guides = !!q.get("guides");

  const DPI = 144;
  const PAGE_W = 6.875 * DPI,
    PAGE_H = 10.5 * DPI,
    TRIM_W = 6.75 * DPI,
    BLEED = 0.125 * DPI,
    MARGIN = 0.375 * DPI;
  const LIVE_W = TRIM_W - 2 * MARGIN,
    LIVE_H = 10.25 * DPI - 2 * MARGIN;
  const PAPER = C.PAPER;

  const nest = (svg, x, y, w, h) => svg.replace('<svg class="page-svg"', `<svg x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"`);

  // one print page; num is the 1-based page number in the book
  function printPage(pg, num) {
    const recto = num % 2 === 1; // page 1 is a right-hand page: its outside (bleed) edge is on the right
    const trimX = recto ? 0 : BLEED;
    const liveX = trimX + MARGIN,
      liveY = BLEED + MARGIN;
    let s = frect(0, 0, PAGE_W, PAGE_H, PAPER);
    const page = C.pageSvg(pg, num === 1 ? 0 : num);
    if (pg.full) {
      // full-page art is framed inside the margins
      const k = Math.min(LIVE_W / 1000, LIVE_H / 1500);
      const w = 1000 * k,
        h = 1500 * k,
        x = liveX + (LIVE_W - w) / 2,
        y = liveY + (LIVE_H - h) / 2;
      s += nest(page, x, y, w, h) + rect(x, y, w, h, "none", { sw: 4 });
    } else {
      // panel pages: the panel grid fills the live area; the page's own paper margin spills outside it
      const k = LIVE_W / (1000 - 2 * C.PAGE.M);
      s += nest(page, liveX - C.PAGE.M * k, liveY - C.PAGE.M * k, 1000 * k, 1500 * k);
    }
    if (guides) {
      s += rect(trimX, BLEED, TRIM_W, 10.25 * DPI, "none", { sw: 2, stroke: "#e0282e", dash: "10 6" });
      s += rect(liveX, liveY, LIVE_W, LIVE_H, "none", { sw: 2, stroke: "#1f6fe0", dash: "10 6" });
      s += text(PAGE_W / 2, 14, `page ${num} (${recto ? "right" : "left"})`, { size: 14, fill: "#e0282e" });
    }
    return `<div class="sheet"><svg xmlns="http://www.w3.org/2000/svg" width="6.875in" height="10.5in" viewBox="0 0 ${n(PAGE_W)} ${n(PAGE_H)}">${s}</svg></div>`;
  }

  function ebookPage(pg, num) {
    return `<div class="sheet">${C.pageSvg(pg, num).replace('<svg class="page-svg"', '<svg width="6.6667in" height="10in"')}</div>`;
  }

  function kindleCover() {
    const inner = C.STORY[0].full(1000, 1600, { insetX: 16, insetY: 10 });
    return `<div class="sheet"><svg xmlns="http://www.w3.org/2000/svg" width="800" height="1280" viewBox="0 0 1000 1600">${inner}</svg></div>`;
  }

  function render() {
    let html = "";
    if (mode === "print") C.STORY.forEach((pg, i) => (html += printPage(pg, i + 1)));
    else if (mode === "ebook") C.STORY.forEach((pg, i) => i > 0 && (html += ebookPage(pg, i + 1)));
    else html = kindleCover();
    document.getElementById("pages").innerHTML = C.defs() + html;
    window.KDP_INFO = { pages: C.STORY.length };
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
