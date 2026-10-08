/* Lexington — KDP paperback interior and Kindle ebook pages.
   mode=print:  6.875 x 10.5 in pages (6.75 x 10.25 trim + bleed on top, bottom and outside edge).
                Every page sits inside the 0.375 in margin; paper colour fills out to the bleed.
   mode=ebook:  2:3 pages without the cover (Kindle adds the cover itself).
   mode=kcover: the Kindle cover at 1600 x 2560 px (1.6:1).
   mode=lulu:   Lulu comic book: 6.875 x 10.5 in pages (6.625 x 10.25 trim + 0.125 in bleed on all four
                sides), everything inside the 0.5 in safety margin, page count padded to a multiple of 4
                for saddle stitch. */
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

  // Lulu: bleed on every side, so all pages share one symmetric layout
  const LU = { trimW: 6.625 * DPI, safe: 0.5 * DPI };
  function luluPage(pg, num) {
    const liveX = BLEED + LU.safe,
      liveY = BLEED + LU.safe,
      liveW = LU.trimW - 2 * LU.safe,
      liveH = 10.25 * DPI - 2 * LU.safe;
    let s = frect(0, 0, PAGE_W, PAGE_H, PAPER);
    const page = C.pageSvg(pg, num === 1 ? 0 : num);
    if (pg.full) {
      const k = Math.min(liveW / 1000, liveH / 1500);
      const w = 1000 * k,
        h = 1500 * k,
        x = liveX + (liveW - w) / 2,
        y = liveY + (liveH - h) / 2;
      s += nest(page, x, y, w, h) + rect(x, y, w, h, "none", { sw: 4 });
    } else {
      const k = Math.min(liveW / (1000 - 2 * C.PAGE.M), liveH / (1500 - C.PAGE.M - 10));
      const w = 1000 * k;
      s += nest(page, liveX + (liveW - (1000 - 2 * C.PAGE.M) * k) / 2 - C.PAGE.M * k, liveY - C.PAGE.M * k, w, 1500 * k);
    }
    if (guides) {
      s += rect(BLEED, BLEED, LU.trimW, 10.25 * DPI, "none", { sw: 2, stroke: "#e0282e", dash: "10 6" });
      s += rect(liveX, liveY, liveW, liveH, "none", { sw: 2, stroke: "#1f6fe0", dash: "10 6" });
    }
    return `<div class="sheet"><svg xmlns="http://www.w3.org/2000/svg" width="6.875in" height="10.5in" viewBox="0 0 ${n(PAGE_W)} ${n(PAGE_H)}">${s}</svg></div>`;
  }

  // Extra pages that bring a book to a multiple of 4 for saddle stitch (Lulu only).
  function luluPad(pages) {
    const out = pages.slice();
    if (out.length % 4 === 2) {
      out.splice(1, 0, {
        noNumber: true,
        alt: "This comic belongs to page with the copyright notice.",
        full(W, Hh) {
          let s = `<rect width="${W}" height="${Hh}" fill="#fffaf0"/>`;
          s += text(W / 2 + 5, 236, "THIS COMIC BELONGS TO", { size: 70, font: "title", fill: INK, stroke: INK, sw: 10, ls: 2 });
          s += text(W / 2, 230, "THIS COMIC BELONGS TO", { size: 70, font: "title", fill: "#e65a45", stroke: INK, sw: 7, ls: 2 });
          s += rect(140, 290, 720, 110, "#ffffff", { sw: 5, r: 14 }) + line(180, 370, 820, 370, { sw: 3, stroke: "#c9c3b5" });
          s += C.fx.rays(W / 2, 700, 420, "#ffe3c2", 18, 0.6);
          s += frect(0, 900, W, 20, "#c9c3b5") + line(0, 900, W, 900, { sw: 3 });
          s += C.lex({ x: W / 2, y: 905, s: 1.45, expr: "confident", pose: "hips", sparkle: true });
          s += C.prop.dog(W / 2 + 230, 905, 1.0, { mood: "love", f: -1 });
          const notes = [
            "Lexington, Issue #1: The Turnaround",
            "Story and art © 2026 Verdant Life LLC. All rights reserved.",
            "No part of this book may be reproduced without written permission,",
            "except short quotations in reviews.",
            "",
            "This is a work of fiction. Names, characters and events are imaginary.",
            "Scripture is quoted from the King James Version of the Bible.",
          ];
          notes.forEach((t, i) => (s += text(W / 2, 1030 + i * 34, t, { size: 22, weight: i === 0 ? 700 : 400, fill: i === 0 ? INK : "#4a4658" })));
          return s;
        },
      });
    }
    while (out.length % 4) {
      out.push({
        alt: "My Goals: a notes page for writing goals.",
        full(W, Hh) {
          let s = `<rect width="${W}" height="${Hh}" fill="#fffaf0"/>`;
          s += `<rect width="${W}" height="150" fill="#c9473c"/><rect width="${W}" height="150" fill="url(#dotsWhite)"/>` + line(0, 150, W, 150, { sw: 5 });
          s += text(W / 2 + 5, 86, "MY GOALS", { size: 62, font: "title", fill: INK, stroke: INK, sw: 9, ls: 2 }) + text(W / 2, 81, "MY GOALS", { size: 62, font: "title", fill: "#ffd95e", stroke: INK, sw: 6, ls: 2 });
          s += text(W / 2, 126, "Write them down. Pray about them. Work on them every day.", { size: 22, fill: "#ffffff" });
          const prompts = ["This week I will:", "This year I will:", "Someday I will:", "Habits I'm building:"];
          let y = 210;
          prompts.forEach((p) => {
            s += text(56, y, p, { size: 28, font: "title", anchor: "start", fill: "#2a8f86", ls: 1 });
            for (let i = 0; i < 4; i++) s += line(56, y + 44 + i * 44, W - 56, y + 44 + i * 44, { sw: 2, stroke: "#c9c3b5" });
            y += 44 * 4 + 90;
          });
          s += text(W / 2, Hh - 40, "“Commit thy works unto the LORD, and thy thoughts shall be established.” — Proverbs 16:3", { size: 20, font: "verse", italic: true });
          return s;
        },
      });
    }
    return out;
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
    let count = C.STORY.length;
    if (mode === "print") C.STORY.forEach((pg, i) => (html += printPage(pg, i + 1)));
    else if (mode === "lulu") {
      const pages = luluPad(C.STORY);
      count = pages.length;
      pages.forEach((pg, i) => (html += luluPage(pg, i + 1)));
    }
    else if (mode === "ebook") C.STORY.forEach((pg, i) => (i > 0 || q.get("cover")) && (html += ebookPage(pg, i + 1)));
    else html = kindleCover();
    document.getElementById("pages").innerHTML = C.defs() + html;
    window.KDP_INFO = { pages: count };
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
