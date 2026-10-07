#!/usr/bin/env node
/* Builds KDP paperback interiors and Kindle ebook files. For each book it writes to kdp/:
     <name>-KDP-Paperback-Interior.pdf   6.875 x 10.5 in pages (6.75 x 10.25 trim with bleed)
     <name>-Kindle-eBook.pdf             2:3 pages, cover left out (Kindle adds it)
     <name>-Kindle-Pages/page-NN.jpg     the same ebook pages as 1800 x 2700 images
     <name>-Kindle-Cover.jpg             1600 x 2560 Kindle cover
   Usage (from the lexington-comic folder):
     node tools/kdp-interiors.cjs              all three books
     node tools/kdp-interiors.cjs --book=issue2 */
"use strict";
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  })
);
const BOOKS = {
  original: "Lexington-The-Turnaround",
  caucasian: "Lexington-The-Turnaround-Caucasian",
  issue2: "Lexington-Issue-2-Down-to-Business",
};
const list = args.book ? [args.book] : Object.keys(BOOKS);
const outDir = path.join(root, "kdp");
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const base = pathToFileURL(path.join(root, "kdp-interior.html")).href;
  const open = async (book, mode, scale, viewport) => {
    const page = await browser.newPage({ viewport: viewport || { width: 1200, height: 1100 }, deviceScaleFactor: scale || 1 });
    page.on("pageerror", (e) => console.error("pageerror:", e.message));
    await page.goto(`${base}?book=${book}&mode=${mode}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.KDP_READY === true, null, { timeout: 30000 });
    await page.waitForTimeout(400);
    return page;
  };
  for (const book of list) {
    const name = BOOKS[book];
    if (!name) throw new Error(`unknown book: ${book}`);

    // paperback interior
    let page = await open(book, "print");
    const pages = await page.evaluate(() => window.KDP_INFO.pages);
    const interior = path.join(outDir, `${name}-KDP-Paperback-Interior.pdf`);
    await page.pdf({ path: interior, width: "6.875in", height: "10.5in", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    await page.close();
    try {
      execFileSync("python3", [path.join(__dirname, "fix-pdf-size.py"), interior, "6.875", "10.5"]);
    } catch (e) {
      console.warn("Could not set the exact PDF size (install pypdf).");
    }

    // ebook PDF + page images
    page = await open(book, "ebook", 1800 / 640);
    const ebook = path.join(outDir, `${name}-Kindle-eBook.pdf`);
    await page.pdf({ path: ebook, width: "6.6667in", height: "10in", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    const imgDir = path.join(outDir, `${name}-Kindle-Pages`);
    fs.rmSync(imgDir, { recursive: true, force: true });
    fs.mkdirSync(imgDir);
    const sheets = await page.$$(".sheet > svg");
    for (let i = 0; i < sheets.length; i++) {
      await sheets[i].screenshot({ path: path.join(imgDir, `page-${String(i + 1).padStart(2, "0")}.jpg`), type: "jpeg", quality: 90 });
    }
    await page.close();

    // Kindle cover
    page = await open(book, "kcover", 2);
    await (await page.$(".sheet > svg")).screenshot({ path: path.join(outDir, `${name}-Kindle-Cover.jpg`), type: "jpeg", quality: 92 });
    await page.close();

    console.log(`${name}: paperback ${pages} pages, ebook ${sheets.length} pages`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
