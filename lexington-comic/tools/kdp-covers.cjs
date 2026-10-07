#!/usr/bin/env node
/* Builds KDP paperback wraparound covers (6.75 x 10.25 in trim, 0.125 in bleed, premium color spine).
   For each book it writes to kdp/:
     <name>-KDP-Cover.pdf          upload this to KDP (vector, fonts embedded)
     <name>-KDP-Cover-300dpi.png   same cover as a 300 DPI image
     <name>-KDP-Cover-guides.png   preview with trim, safe zone, spine and barcode area marked
   Usage (from the lexington-comic folder):
     node tools/kdp-covers.cjs                     all three books
     node tools/kdp-covers.cjs --book=issue2 --pages=24
   --pages is the interior page count you upload to KDP; it sets the spine width. */
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
  const base = pathToFileURL(path.join(root, "kdp-cover.html")).href;
  for (const book of list) {
    const name = BOOKS[book];
    if (!name) throw new Error(`unknown book: ${book}`);
    const qs = `book=${book}${args.pages ? `&pages=${args.pages}` : ""}`;
    const open = async (extra, scale) => {
      const page = await browser.newPage({ viewport: { width: 2100, height: 1520 }, deviceScaleFactor: scale || 1 });
      page.on("pageerror", (e) => console.error("pageerror:", e.message));
      await page.goto(`${base}?${qs}${extra}`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => window.KDP_READY === true, null, { timeout: 20000 });
      await page.waitForTimeout(300);
      return page;
    };
    const page = await open("", 1);
    const info = await page.evaluate(() => window.Comic.KDP);
    const pdfPath = path.join(outDir, `${name}-KDP-Cover.pdf`);
    await page.pdf({
      path: pdfPath,
      width: `${info.inches.w.toFixed(4)}in`,
      height: `${info.inches.h.toFixed(4)}in`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await page.close();
    // Chromium rounds custom page sizes a little; set the exact size KDP expects (needs python3 + pypdf).
    try {
      execFileSync("python3", [path.join(__dirname, "fix-pdf-size.py"), pdfPath, info.inches.w.toFixed(4), info.inches.h.toFixed(4)]);
    } catch (e) {
      console.warn("Could not set the exact PDF size (install pypdf). Check the size in KDP's previewer.");
    }
    const hi = await open("", 300 / 96); // CSS inches are 96 px
    await (await hi.$("#cover > svg:last-child")).screenshot({ path: path.join(outDir, `${name}-KDP-Cover-300dpi.png`) });
    await hi.close();
    const gd = await open("&guides=1", 1);
    await (await gd.$("#cover > svg:last-child")).screenshot({ path: path.join(outDir, `${name}-KDP-Cover-guides.png`) });
    await gd.close();
    console.log(`${name}: ${info.inches.w.toFixed(4)} x ${info.inches.h.toFixed(4)} in, ${info.pages} pages, spine ${info.inches.spine.toFixed(4)} in`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
