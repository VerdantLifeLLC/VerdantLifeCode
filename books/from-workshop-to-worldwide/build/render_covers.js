// Render cover HTML to print PDF (paperback) and JPG/PNG (eBook, previews).
// usage: node render_covers.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'output');
(async () => {
  const meta = JSON.parse(fs.readFileSync(path.join(__dirname, '_cover-meta.json'), 'utf8'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const key of Object.keys(meta)) {
    const m = meta[key];
    for (const g of ['', '-guides']) {
      const page = await browser.newPage();
      await page.goto('file://' + path.join(__dirname, `_cover-${key}${g}.html`));
      await page.waitForFunction(() => document.body.dataset.ready === '1');
      const name = g ? path.join(__dirname, `_cover-${key}-guides.pdf`) : path.join(OUT, m.out);
      await page.pdf({ path: name, width: m.width_in + 'in', height: m.height_in + 'in', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
      await page.close();
    }
  }
  const page = await browser.newPage({ viewport: { width: 1600, height: 2560 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, '_ebook-cover.html'));
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  await page.screenshot({ path: path.join(OUT, 'Cover-eBook-1600x2560.jpg'), type: 'jpeg', quality: 95 });
  await page.close();
  await browser.close();
  console.log('covers rendered');
})();
