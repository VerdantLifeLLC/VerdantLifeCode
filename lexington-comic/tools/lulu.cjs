#!/usr/bin/env node
/* Builds print files for Lulu's Comic Book format (6.625 x 10.25 in trim, saddle stitch, premium color).
   For each book it writes to lulu/:
     <name>-Lulu-Interior.pdf   6.875 x 10.5 in pages (trim + 0.125 in bleed on all sides),
                                content inside the 0.5 in safety margin, page count a multiple of 4
     <name>-Lulu-Cover.pdf      one-piece cover, back + front, 13.5 x 10.5 in (saddle stitch has no spine)
     <name>-Lulu-Cover-guides.png  preview with trim, safety margin, fold and barcode area marked
   Every page is a flattened 300 PPI image, so there is no live transparency and no font to embed.
   Usage (from the lexington-comic folder):
     node tools/lulu.cjs                 all three books
     node tools/lulu.cjs --book=issue2 */
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
  original: "Lexington-Book-1-The-Turnaround",
  caucasian: "Lexington-Book-1-The-Turnaround-Caucasian",
  issue2: "Lexington-Book-2-Down-to-Business",
};
const list = args.book ? [args.book] : Object.keys(BOOKS);
const outDir = path.join(root, "lulu");
fs.mkdirSync(outDir, { recursive: true });
const DSF = 300 / 96; // CSS inches are 96 px

async function imagePdf(browser, images, wIn, hIn, file) {
  const page = await browser.newPage();
  const body = images.map((b) => `<img src="data:image/jpeg;base64,${b.toString("base64")}" style="display:block;width:${wIn}in;height:${hIn}in;break-after:page">`).join("");
  await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;padding:0}@page{margin:0}</style></head><body>${body}</body></html>`, { waitUntil: "load" });
  await page.pdf({ path: file, width: `${wIn}in`, height: `${hIn}in`, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await page.close();
  try {
    execFileSync("python3", [path.join(__dirname, "fix-pdf-size.py"), file, String(wIn), String(hIn)]);
  } catch (e) {
    console.warn("Could not set the exact PDF size (install pypdf).");
  }
}

(async () => {
  const browser = await chromium.launch();
  const open = async (url, scale, viewport) => {
    const page = await browser.newPage({ viewport: viewport || { width: 1400, height: 1100 }, deviceScaleFactor: scale });
    page.on("pageerror", (e) => console.error("pageerror:", e.message));
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.KDP_READY === true, null, { timeout: 30000 });
    await page.waitForTimeout(400);
    return page;
  };
  for (const book of list) {
    const name = BOOKS[book];
    if (!name) throw new Error(`unknown book: ${book}`);

    // interior
    const ip = await open(`${pathToFileURL(path.join(root, "kdp-interior.html")).href}?book=${book}&mode=lulu`, DSF);
    const pages = await ip.evaluate(() => window.KDP_INFO.pages);
    const shots = [];
    for (const el of await ip.$$(".sheet > svg")) shots.push(await el.screenshot({ type: "jpeg", quality: 95 }));
    await ip.close();
    await imagePdf(browser, shots, 6.875, 10.5, path.join(outDir, `${name}-Lulu-Interior.pdf`));

    // cover
    const coverUrl = `${pathToFileURL(path.join(root, "kdp-cover.html")).href}?book=${book}&printer=lulu&pages=${pages}`;
    const cp = await open(coverUrl, DSF);
    const info = await cp.evaluate(() => window.Comic.KDP);
    const cover = await (await cp.$("#cover > svg:last-child")).screenshot({ type: "jpeg", quality: 95 });
    await cp.close();
    await imagePdf(browser, [cover], Number(info.inches.w.toFixed(4)), Number(info.inches.h.toFixed(4)), path.join(outDir, `${name}-Lulu-Cover.pdf`));
    const gp = await open(`${coverUrl}&guides=1`, 1);
    await (await gp.$("#cover > svg:last-child")).screenshot({ path: path.join(outDir, `${name}-Lulu-Cover-guides.png`) });
    await gp.close();

    console.log(`${name}: interior ${pages} pages, cover ${info.inches.w.toFixed(3)} x ${info.inches.h.toFixed(3)} in`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
