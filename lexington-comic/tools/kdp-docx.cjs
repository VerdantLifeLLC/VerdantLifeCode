#!/usr/bin/env node
/* Builds Word (.docx) versions of each comic, one comic page per Word page:
     <name>-KDP-Paperback.docx   6.75 x 10.25 in pages; each comic page is a 300 DPI image
                                 6.0 x 9.0 in, kept 0.375 in inside the edges (KDP takes bleed only
                                 from PDFs, so the Word version has no bleed). Same page count as the PDF.
     <name>-Kindle-eBook.docx    6.6667 x 10 in pages, cover left out (Kindle adds it).
   Usage (from the lexington-comic folder):
     node tools/kdp-docx.cjs              all three books
     node tools/kdp-docx.cjs --book=issue2 */
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");
const { Document, Packer, Paragraph, ImageRun, AlignmentType } = require("docx");

const root = path.resolve(__dirname, "..");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  })
);
const BOOKS = {
  original: { file: "Lexington-The-Turnaround", title: "Lexington: The Turnaround" },
  caucasian: { file: "Lexington-The-Turnaround-Caucasian", title: "Lexington: The Turnaround" },
  issue2: { file: "Lexington-Issue-2-Down-to-Business", title: "Lexington: Down to Business" },
};
const list = args.book ? [args.book] : Object.keys(BOOKS);
const outDir = path.join(root, "kdp");
const IN = 1440; // DXA per inch
const PX = 96; // docx image sizes are in pixels at 96 per inch

function build(title, images, page, img) {
  const paragraphs = images.map(
    (data, i) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        pageBreakBefore: i > 0,
        children: [new ImageRun({ type: "jpg", data, transformation: { width: Math.round(img.w * PX), height: Math.round(img.h * PX) }, altText: { title: `${title}, page ${i + 1}`, description: `${title}, page ${i + 1}`, name: `page-${i + 1}` } })],
      })
  );
  return new Document({
    title,
    creator: "Verdant Life",
    sections: [
      {
        properties: {
          page: {
            size: { width: Math.round(page.w * IN), height: Math.round(page.h * IN) },
            margin: { top: Math.round(page.mv * IN), bottom: Math.round(page.mv * IN), left: Math.round(page.mh * IN), right: Math.round(page.mh * IN), header: 0, footer: 0, gutter: 0 },
          },
        },
        children: paragraphs,
      },
    ],
  });
}

(async () => {
  const browser = await chromium.launch();
  const base = pathToFileURL(path.join(root, "kdp-interior.html")).href;
  for (const book of list) {
    const b = BOOKS[book];
    if (!b) throw new Error(`unknown book: ${book}`);
    // every page, cover included, as 1800 x 2700 JPEGs (300 DPI at 6 x 9 in)
    const page = await browser.newPage({ viewport: { width: 1200, height: 1100 }, deviceScaleFactor: 1800 / 640 });
    page.on("pageerror", (e) => console.error("pageerror:", e.message));
    await page.goto(`${base}?book=${book}&mode=ebook&cover=1`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.KDP_READY === true, null, { timeout: 30000 });
    await page.waitForTimeout(400);
    const sheets = await page.$$(".sheet > svg");
    const images = [];
    for (const el of sheets) images.push(await el.screenshot({ type: "jpeg", quality: 92 }));
    await page.close();

    const paper = build(b.title, images, { w: 6.75, h: 10.25, mh: 0.375, mv: 0.6 }, { w: 6.0, h: 9.0 });
    fs.writeFileSync(path.join(outDir, `${b.file}-KDP-Paperback.docx`), await Packer.toBuffer(paper));
    const ebook = build(b.title, images.slice(1), { w: 6.6667, h: 10, mh: 0.25, mv: 0.25 }, { w: 6.1667, h: 9.25 });
    fs.writeFileSync(path.join(outDir, `${b.file}-Kindle-eBook.docx`), await Packer.toBuffer(ebook));
    console.log(`${b.file}: paperback ${images.length} pages, ebook ${images.length - 1} pages`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
