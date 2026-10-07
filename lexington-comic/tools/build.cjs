#!/usr/bin/env node
/* Builds the shareable versions of the comic:
     Lexington-The-Turnaround.pdf   one comic page per PDF page (7 x 10.5 in)
     Lexington-The-Turnaround.html  everything in one file, for emailing or offline sharing
     cover.png                      the cover, for link previews
   Usage (from the lexington-comic folder):  npm install playwright && node tools/build.cjs
   Optional:  --skin=tan --hair=brown  to bake a different look into the outputs. */
"use strict";
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  })
);
const look = ["skin", "hair"].filter((k) => args[k]).map((k) => `&${k}=${encodeURIComponent(args[k])}`).join("");

function singleFile() {
  let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  html = html.replace('<link rel="stylesheet" href="styles.css" />', () => `<style>\n${css}</style>`);
  html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, src) => {
    const js = fs.readFileSync(path.join(root, src), "utf8");
    return `<script>\n${js.replace(/<\/script/gi, "<\\/script")}</script>`;
  });
  return html;
}

(async () => {
  const out = path.join(root, "Lexington-The-Turnaround.html");
  fs.writeFileSync(out, singleFile());
  console.log("wrote", path.relative(root, out));

  const browser = await chromium.launch();
  const url = pathToFileURL(path.join(root, "index.html")).href;

  // PDF
  const page = await browser.newPage({ viewport: { width: 1000, height: 1500 } });
  await page.goto(`${url}?print=1${look}`, { waitUntil: "networkidle" });
  await page.waitForSelector("html.ready", { timeout: 20000 });
  await page.waitForTimeout(500);
  const pdf = path.join(root, "Lexington-The-Turnaround.pdf");
  await page.pdf({ path: pdf, width: "7in", height: "10.5in", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log("wrote", path.relative(root, pdf));

  // cover image
  const shot = await browser.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  await shot.goto(`${url}?view=pages${look}`, { waitUntil: "networkidle" });
  await shot.waitForSelector("html.ready", { timeout: 20000 });
  await shot.waitForTimeout(500);
  const cover = await shot.$("section.page");
  const png = path.join(root, "cover.png");
  await cover.screenshot({ path: png });
  console.log("wrote", path.relative(root, png));

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
