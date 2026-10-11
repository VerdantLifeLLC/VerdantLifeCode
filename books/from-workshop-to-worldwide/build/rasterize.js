// Rasterize SVG illustrations to PNG with Chromium (accurate fonts).
// usage: node rasterize.js <svgdir> <outdir> <targetWidthPx> [names...]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const FD = path.join(__dirname, '..', 'fonts');
const FACES = [['Regular',400],['Medium',500],['SemiBold',600],['Bold',700],['ExtraBold',800],['Black',900]]
  .map(([n,w]) => `@font-face{font-family:'Montserrat';src:url('file://${FD}/Montserrat-${n}.ttf');font-weight:${w}}`).join('') +
  [['Regular',400,'normal'],['Italic',400,'italic'],['Bold',700,'normal'],['BoldItalic',700,'italic']]
  .map(([n,w,st]) => `@font-face{font-family:'Source Serif 4';src:url('file://${FD}/SourceSerif4-${n}.ttf');font-weight:${w};font-style:${st}}`).join('');
(async () => {
  const [svgdir, outdir, tw, ...names] = process.argv.slice(2);
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const files = fs.readdirSync(svgdir).filter(f => f.endsWith('.svg') && (!names.length || names.includes(f.replace('.svg', ''))));
  for (const f of files) {
    const svg = fs.readFileSync(path.join(svgdir, f), 'utf8');
    const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    const w = +m[1], h = +m[2];
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: (+tw) / w });
    await page.goto('file://' + FD + '/');
    await page.setContent(`<html><head><style>${FACES}html,body{margin:0;background:white}</style></head><body>${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(outdir, f.replace('.svg', '.png')), clip: { x: 0, y: 0, width: w, height: h } });
    await page.close();
  }
  await browser.close();
  console.log('rasterized', files.length);
})();
