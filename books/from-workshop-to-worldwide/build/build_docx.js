// Build the 8.5 x 11 in Word manuscript (KDP paperback) from _book.json.
// usage: node build_docx.js <out.docx> [tocpages.json]
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, Header, Footer,
  AlignmentType, HeadingLevel, LevelFormat, BorderStyle, WidthType, ShadingType, HeightRule,
  TabStopType, PageNumber, SectionType, VerticalAlign, Tab, PageBreak, LeaderType, LineRuleType,
} = require('docx');

const HERE = __dirname;
const { book, blocks } = JSON.parse(fs.readFileSync(path.join(HERE, '_book.json'), 'utf8'));
const OUT = process.argv[2] || path.join(HERE, '..', 'output', 'Manuscript-Paperback-8.5x11.docx');
const TOC = process.argv[3] && fs.existsSync(process.argv[3]) ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : {};

const C = { G: '1F4D3A', G2: '2F6B4F', SAGE: '8DB596', LSAGE: 'DCEBDD', CREAM: 'F7F1E3', COPPER: 'C0703A', TAN: 'E8C48A', INK: '26302B', GRAY: '6E7A73', LGRAY: 'E4E7E2', WHITE: 'FFFFFF', PALE: 'EEF5EE', WARM: 'FBF3EC', LIGHT: 'FAF7EF', TPL: 'FCFAF5' };
const SERIF = 'Source Serif 4', SANS = 'Montserrat', HEAVY = 'Montserrat ExtraBold';
const TW = 9900; // text width in DXA (6.875 in)
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NOBORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };

// ---------- inline markup ----------
function runs(text, base = {}) {
  const out = [];
  const re = /\*\*(.+?)\*\*|(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])/g;
  let last = 0, m;
  text = text.replace(/\\"/g, '"');
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ ...base, text: text.slice(last, m.index) }));
    if (m[1] !== undefined) out.push(new TextRun({ ...base, text: m[1], bold: true }));
    else out.push(new TextRun({ ...base, text: m[2], italics: !base.italics }));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(new TextRun({ ...base, text: text.slice(last) }));
  return out;
}
const P = (text, opts = {}, base = {}) => new Paragraph({ ...opts, children: runs(text, base) });
const pt = (n) => n * 2; // half-points

// ---------- numbering ----------
let listInstance = 0;
const numbering = {
  config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } }, run: { color: C.COPPER } } }] },
    { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 300 } }, run: { color: C.COPPER, bold: true, font: SANS, size: pt(9.5) } } }] },
  ],
};

// ---------- images ----------
function pngSize(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
function image(id, maxWin = 6.875, maxHin = 3.7) {
  const buf = fs.readFileSync(path.join(HERE, '_png', id + '.png'));
  const { w, h } = pngSize(buf);
  let W = maxWin * 96, H = W * h / w;
  if (H > maxHin * 96) { H = maxHin * 96; W = H * w / h; }
  return new ImageRun({ type: 'png', data: buf, transformation: { width: Math.round(W), height: Math.round(H) }, altText: { title: id, description: id, name: id } });
}

// ---------- building blocks ----------
function boxTable(children, { fill = C.CREAM, left = C.COPPER, leftSize = 36, border = null, pad = 200 } = {}) {
  const b = border ? { style: BorderStyle.SINGLE, size: 12, color: border } : NONE;
  return new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [TW], borders: NOBORDERS,
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({
      width: { size: TW, type: WidthType.DXA }, shading: fill ? { fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
      borders: { top: b, bottom: b, right: b, left: left ? { style: BorderStyle.SINGLE, size: leftSize, color: left } : b },
      margins: { top: pad - 40, bottom: pad - 80, left: pad + 40, right: pad + 40 }, children,
    })] })],
  });
}
const spacer = (after = 120) => new Paragraph({ spacing: { before: 0, after }, children: [] });
const label = (t, color = C.COPPER) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: t.toUpperCase(), font: SANS, bold: true, size: pt(7.5), color, characterSpacing: 40 })] });
const cbRun = () => new TextRun({ text: '☐  ', font: 'Segoe UI Symbol', size: pt(11), color: C.G });

function fieldPara(labels) {
  const n = labels.length, seg = TW / n;
  const children = [], stops = [];
  labels.forEach((l, i) => {
    l = l.trim();
    let dollar = '';
    if (l.endsWith('$')) { dollar = '$'; l = l.slice(0, -1).trim(); }
    l = l.replace(/:$/, '') + ':';
    children.push(new TextRun({ text: l + ' ', font: SANS, bold: true, size: pt(9), color: C.INK }));
    if (dollar) children.push(new TextRun({ text: '$', font: SANS, size: pt(9), color: C.GRAY }));
    children.push(new TextRun({ children: [new Tab()] }));
    const end = Math.round((i + 1) * seg - (i < n - 1 ? 300 : 0));
    stops.push({ type: TabStopType.RIGHT, position: end, leader: LeaderType.UNDERSCORE });
    if (i < n - 1) { children.push(new TextRun({ children: [new Tab()] })); stops.push({ type: TabStopType.LEFT, position: Math.round((i + 1) * seg) }); }
  });
  return new Paragraph({ tabStops: stops, spacing: { before: 120, after: 60 }, children });
}
const writeLine = () => new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TW, leader: LeaderType.UNDERSCORE }], spacing: { before: 200, after: 0 }, children: [new TextRun({ children: [new Tab()], color: C.GRAY })] });

function wsTable(b) {
  const n = b.headers.length;
  let widths;
  if (b.numbered) { const fw = b.headers[0].length > 3 ? 820 : 560; const rest = (TW - fw) / (n - 1); widths = [fw, ...Array(n - 1).fill(Math.floor(rest))]; }
  else if (b.rows.length && b.rows[0][0]) { const first = n === 2 ? Math.round(TW * 0.55) : Math.round(TW * (n > 5 ? 0.24 : 0.3)); const rest = (TW - first) / (n - 1); widths = [first, ...Array(n - 1).fill(Math.floor(rest))]; }
  else widths = Array(n).fill(Math.floor(TW / n));
  widths[widths.length - 1] += TW - widths.reduce((a, c) => a + c, 0);
  const brd = { style: BorderStyle.SINGLE, size: 4, color: '9AA59F' };
  const borders = { top: brd, bottom: brd, left: brd, right: brd };
  const long = b.rows.length > 18;
  const head = new TableRow({ tableHeader: true, cantSplit: true, children: b.headers.map((h, i) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA }, borders, shading: { fill: C.LSAGE, type: ShadingType.CLEAR, color: 'auto' },
    margins: { top: 60, bottom: 60, left: 90, right: 90 }, verticalAlign: VerticalAlign.BOTTOM,
    children: [new Paragraph({ spacing: { after: 0, line: 240, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: h.toUpperCase(), font: SANS, bold: true, size: pt(7.5), color: C.G })] })],
  })) });
  const rows = b.rows.map((r) => new TableRow({ cantSplit: true, height: { value: long ? 318 : 410, rule: HeightRule.ATLEAST }, children: r.map((c, i) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA }, borders, verticalAlign: VerticalAlign.CENTER,
    shading: (i === 0 && c) ? { fill: C.LIGHT, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 20, bottom: 20, left: 90, right: 90 },
    children: [new Paragraph({ spacing: { after: 0, line: 240, lineRule: LineRuleType.AUTO }, alignment: (b.numbered && i === 0) ? AlignmentType.CENTER : AlignmentType.LEFT, children: [new TextRun({ text: c, font: SANS, bold: i === 0 && !!c, size: pt(8.5), color: (b.numbered && i === 0) ? C.GRAY : C.INK })] })],
  })) }));
  return new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: widths, rows: [head, ...rows] });
}

const BOX_LABEL = { tip: 'Pro Tip', example: 'Example', warning: 'Important', action: 'Try This', service: 'For Service Providers', product: 'For Makers', note: 'Note' };
const BOX_STYLE = { example: { fill: C.PALE, left: C.G2 }, service: { fill: C.PALE, left: C.G }, warning: { fill: C.WARM, left: C.COPPER } };

let figN = 0, chapLabel = '';
function render(b, inWs = false) {
  switch (b.t) {
    case 'p': return [P(b.text, inWs ? { spacing: { after: 100 } } : {}, inWs ? { size: pt(10.3) } : {})];
    case 'h2': return [P(b.text, { heading: HeadingLevel.HEADING_2 })];
    case 'h3': return inWs
      ? [new Paragraph({ spacing: { before: 240, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.LSAGE, space: 2 } }, keepNext: true, children: [new TextRun({ text: b.text.toUpperCase(), font: SANS, bold: true, size: pt(9.5), color: C.G2, characterSpacing: 16 })] })]
      : [P(b.text, { heading: HeadingLevel.HEADING_3 })];
    case 'ul': return b.items.map((i) => P(i, { numbering: { reference: 'bullets', level: 0 }, spacing: { after: 60 } }));
    case 'ol': { listInstance++; const inst = listInstance; return b.items.map((i) => P(i, { numbering: { reference: 'numbers', level: 0, instance: inst }, spacing: { after: 60 } })); }
    case 'quote': return [new Paragraph({ indent: { left: 500, right: 500 }, spacing: { before: 300, after: 300 }, border: { left: { style: BorderStyle.SINGLE, size: 36, color: C.COPPER, space: 14 } }, children: runs(b.text, { font: SERIF, italics: true, bold: true, size: pt(15), color: C.G }) })];
    case 'figure': {
      figN++;
      return [
        new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 240, after: 100 }, children: [image(b.id)] }),
        new Paragraph({ spacing: { after: 300 }, border: { left: { style: BorderStyle.SINGLE, size: 18, color: C.COPPER, space: 8 } }, indent: { left: 120 }, children: [
          new TextRun({ text: `FIGURE ${chapLabel}${figN}  `, font: SANS, bold: true, size: pt(7.5), color: C.G, characterSpacing: 20 }),
          ...runs(b.caption, { italics: true, size: pt(9.5), color: C.GRAY })] }),
      ];
    }
    case 'box': {
      const st = BOX_STYLE[b.kind] || {};
      const kids = [label(BOX_LABEL[b.kind] || 'Note', st.left || C.COPPER)];
      if (b.title) kids.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: b.title, font: HEAVY, size: pt(11), color: C.G })] }));
      b.children.forEach((c) => render(c).forEach((x) => kids.push(x)));
      return [boxTable(kids, st), spacer(200)];
    }
    case 'actions': {
      const kids = [new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'YOUR ACTION STEPS', font: HEAVY, size: pt(10.5), color: C.G, characterSpacing: 30 })] })];
      b.items.forEach((i) => kids.push(new Paragraph({ spacing: { after: 80 }, indent: { left: 400, hanging: 400 }, children: [cbRun(), ...runs(i, { size: pt(10.5) })] })));
      return [spacer(160), boxTable(kids, { fill: null, left: C.G, leftSize: 16, border: C.G }), spacer(120)];
    }
    case 'worksheet': {
      const head = boxTable([
        new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: 'WORKSHEET', font: SANS, bold: true, size: pt(7.5), color: C.TAN, characterSpacing: 50 })] }),
        new Paragraph({ spacing: { after: 30 }, children: [new TextRun({ text: b.title, font: HEAVY, size: pt(15), color: C.WHITE })] }),
        ...(b.sub ? [new Paragraph({ spacing: { after: 40 }, children: runs(b.sub, { italics: true, size: pt(10), color: C.LSAGE }) })] : []),
      ], { fill: C.G, left: null, pad: 220 });
      const out = [new Paragraph({ pageBreakBefore: true, spacing: { after: 0 }, children: [new TextRun({ text: '', size: 2 })] }), head,
        new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 36, color: C.COPPER, space: 0 } }, spacing: { after: 160 }, children: [] })];
      b.children.forEach((c) => render(c, true).forEach((x) => out.push(x)));
      return out;
    }
    case 'field': return [fieldPara([b.label])];
    case 'fieldrow': return [fieldPara(b.labels)];
    case 'lines': return Array.from({ length: b.n }, writeLine);
    case 'check': return [new Paragraph({ spacing: { after: 100 }, children: [cbRun(), new TextRun({ text: b.text, font: SANS, size: pt(9.5) })] })];
    case 'table': return [wsTable(b), spacer(200)];
    case 'day': case 'month': {
      const isM = b.t === 'month';
      const left = new TableCell({ width: { size: 1000, type: WidthType.DXA }, shading: { fill: isM ? C.COPPER : C.G, type: ShadingType.CLEAR, color: 'auto' }, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE }, verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 40, right: 40 }, children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: isM ? 'MONTH' : 'DAY', font: SANS, bold: true, size: pt(6.5), color: isM ? C.CREAM : C.TAN, characterSpacing: 30 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: b.n, font: HEAVY, bold: true, size: pt(17), color: C.WHITE })] })] });
      const goal = isM ? runs(b.detail, { size: pt(9.6), color: C.G2 }) : [new TextRun({ text: 'Goal: ', bold: true, size: pt(9.6), color: C.G2 }), ...runs(b.goal, { size: pt(9.6), color: C.G2 }), ...(b.ref ? [new TextRun({ text: '  · ' + b.ref, italics: true, size: pt(9.6), color: C.GRAY })] : [])];
      const right = new TableCell({ width: { size: TW - 1000, type: WidthType.DXA }, borders: { top: NONE, left: NONE, right: NONE, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.LGRAY } }, verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 100, left: 220, right: 60 }, children: [
        P(isM ? b.focus : b.task, { spacing: { after: 30 } }, { bold: true, size: pt(10.6) }), new Paragraph({ spacing: { after: 0 }, children: goal })] });
      return [new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [1000, TW - 1000], borders: NOBORDERS, rows: [new TableRow({ cantSplit: true, children: [left, right] })] }), spacer(100)];
    }
    case 'template': {
      const kids = [label('Template'), new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: b.title, font: HEAVY, size: pt(12), color: C.G })] })];
      let cur = [];
      const flush = () => { cur.forEach((ln, i) => kids.push(P(ln, { spacing: { after: i === cur.length - 1 ? 140 : 0 } }, { size: pt(10) }))); cur = []; };
      b.lines.concat(['']).forEach((ln) => { if (ln.trim()) cur.push(ln.trim()); else flush(); });
      return [boxTable(kids, { fill: C.TPL, left: C.SAGE, leftSize: 12, border: C.SAGE }), spacer(240)];
    }
    case 'pagebreak': return [new Paragraph({ children: [new PageBreak()] })];
  }
  throw new Error('unknown ' + b.t);
}

// ---------- headers / footers ----------
const hdrRun = (t) => new TextRun({ text: t.toUpperCase(), font: SANS, bold: true, size: pt(7.5), color: C.GRAY, characterSpacing: 28 });
const pnRun = () => new TextRun({ children: [PageNumber.CURRENT], font: SANS, bold: true, size: pt(9), color: C.G });
function hf(title) {
  return {
    headers: {
      default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [hdrRun(title)] })] }),
      even: new Header({ children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [hdrRun(book.title)] })] }),
      first: new Header({ children: [new Paragraph({ children: [] })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [pnRun()] })] }),
      even: new Footer({ children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [pnRun()] })] }),
      first: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [pnRun()] })] }),
    },
  };
}
const emptyHF = () => ({
  headers: { default: new Header({ children: [new Paragraph({ children: [] })] }), even: new Header({ children: [new Paragraph({ children: [] })] }), first: new Header({ children: [new Paragraph({ children: [] })] }) },
  footers: { default: new Footer({ children: [new Paragraph({ children: [] })] }), even: new Footer({ children: [new Paragraph({ children: [] })] }), first: new Footer({ children: [new Paragraph({ children: [] })] }) },
});
const PAGE = { size: { width: 12240, height: 15840 }, margin: { top: 1224, bottom: 1224, left: 1260, right: 1080, header: 620, footer: 620 } };

// ---------- sections ----------
const center = (children, opts = {}) => new Paragraph({ alignment: AlignmentType.CENTER, ...opts, children });
const rule = () => center([new TextRun({ text: '━━━━', color: C.COPPER, size: pt(14) })], { spacing: { before: 120, after: 280 } });

const sections = [];
// Front matter
const front = [
  center([new TextRun({ text: book.title.toUpperCase(), font: HEAVY, size: pt(24), color: C.G })], { spacing: { before: 3600 } }), rule(),
];
const title = [
  center([new TextRun({ text: 'FROM WORKSHOP', font: HEAVY, bold: true, size: pt(38), color: C.G })], { spacing: { before: 1200, after: 0 } }),
  center([new TextRun({ text: 'TO WORLDWIDE', font: HEAVY, bold: true, size: pt(38), color: C.G })], { spacing: { after: 0 } }), rule(),
  center([new TextRun({ text: book.subtitle, font: SERIF, italics: true, size: pt(14), color: C.INK })], { indent: { left: 800, right: 800 }, spacing: { after: 400 } }),
  center([image('fig-final', 4.4, 3)], { spacing: { after: 400 } }),
  center([new TextRun({ text: book.author.toUpperCase(), font: HEAVY, size: pt(14), color: C.G, characterSpacing: 60 })], { spacing: { after: 1400 } }),
  center([new TextRun({ text: '●  ' + book.publisher.toUpperCase() + '  ●', font: SANS, bold: true, size: pt(9), color: C.GRAY, characterSpacing: 80 })]),
];
const cp = (t, b = {}) => P(t, { spacing: { after: 140 } }, { size: pt(8.6), ...b });
const copyright = [
  new Paragraph({ spacing: { before: 5200, after: 140 }, children: [new TextRun({ text: book.title, font: HEAVY, size: pt(9.5), color: C.G })] }),
  cp(book.subtitle), cp(`Copyright © ${book.year} by ${book.author}. All rights reserved.`), cp(`Published by ${book.publisher}.`),
  cp('No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means — electronic, mechanical, photocopying, recording, or otherwise — without prior written permission from the publisher, except for brief quotations in reviews. Purchasers of this book may photocopy the worksheets and templates for use in their own business.'),
  cp('**Disclaimer:** This book is designed to provide general information and practical guidance about starting and running a small business. It is sold with the understanding that the author and publisher are not providing legal, tax, accounting, or financial advice. Laws, regulations, platform policies, and fees vary by location and change over time; consult qualified professionals and official sources for advice specific to your situation. Results vary, and no particular level of income is promised. The example entrepreneurs in this book, Maya and Marcus, are illustrative composites, not real individuals.'),
  cp('Product and company names mentioned in this book are the trademarks of their respective owners. Their mention does not imply endorsement by, or affiliation with, the author or publisher.'),
  cp('Illustrations created for this book.'), cp(`First Edition, ${book.year}`),
];
const dedication = [
  center(runs('For everyone who has ever been told,', { italics: true, size: pt(14), color: C.G }), { spacing: { before: 4000, after: 0 } }),
  center(runs('"You should sell these,"', { italics: true, size: pt(14), color: C.G }), { spacing: { after: 0 } }),
  center(runs('or "You should charge for that" —', { italics: true, size: pt(14), color: C.G }), { spacing: { after: 0 } }),
  center(runs('and is finally ready to do it.', { italics: true, size: pt(14), color: C.G }), { spacing: { after: 300 } }),
  center([new TextRun({ text: '✦', color: C.COPPER, size: pt(18) })]),
];
// TOC (static, page numbers from a LibreOffice render pass)
const heads = blocks.filter((b) => ['part', 'chapter', 'unnumbered'].includes(b.t));
const tocStops = [{ type: TabStopType.RIGHT, position: TW, leader: LeaderType.DOT }];
const toc = [new Paragraph({ spacing: { before: 300, after: 60 }, children: [new TextRun({ text: 'CONTENTS', font: HEAVY, bold: true, size: pt(26), color: C.G })] }),
  new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: '━━━', color: C.COPPER, size: pt(14) })] })];
heads.forEach((h) => {
  const key = h.t === 'chapter' ? 'c' + h.num : h.t === 'part' ? 'p' + h.num : 'u' + h.title;
  const pg = TOC[key] !== undefined ? String(TOC[key]) : '';
  if (h.t === 'part') toc.push(new Paragraph({ spacing: { before: 220, after: 60 }, keepNext: true, tabStops: [{ type: TabStopType.RIGHT, position: TW }], children: [new TextRun({ text: `PART ${h.num.toUpperCase()} · ${h.title.toUpperCase()}`, font: SANS, bold: true, size: pt(8.5), color: C.COPPER, characterSpacing: 30 }), new TextRun({ children: [new Tab()] }), new TextRun({ text: pg, font: SANS, bold: true, size: pt(9), color: C.COPPER })] }));
  else toc.push(new Paragraph({ spacing: { after: 50 }, tabStops: [{ type: TabStopType.LEFT, position: 520 }, ...tocStops], children: [
    new TextRun({ text: h.t === 'chapter' ? h.num : '', font: SANS, bold: true, size: pt(9.5), color: C.G2 }), new TextRun({ children: [new Tab()] }),
    new TextRun({ text: h.title, size: pt(11), italics: h.t !== 'chapter' }), new TextRun({ children: [new Tab()] }), new TextRun({ text: pg, font: SANS, bold: true, size: pt(9.5), color: C.G })] }));
});

const frontProps = (type) => ({ properties: { type, page: PAGE, titlePage: false }, ...emptyHF() });
sections.push({ ...frontProps(SectionType.NEXT_PAGE), children: front });
sections.push({ ...frontProps(SectionType.ODD_PAGE), children: title });
sections.push({ ...frontProps(SectionType.NEXT_PAGE), children: copyright });
sections.push({ ...frontProps(SectionType.NEXT_PAGE), children: dedication });
sections.push({ ...frontProps(SectionType.ODD_PAGE), children: toc });

// Main matter
let current = null, first = true;
const partKids = {};
let curPart = null;
blocks.forEach((b) => { if (b.t === 'part') { curPart = b.num; partKids[curPart] = []; } else if (b.t === 'chapter' && curPart) partKids[curPart].push(b); });
for (const b of blocks) {
  if (['part', 'chapter', 'unnumbered'].includes(b.t)) {
    figN = 0;
    const pageNumbers = first ? { start: 1 } : undefined;
    first = false;
    if (b.t === 'part') {
      current = { properties: { type: SectionType.ODD_PAGE, page: { ...PAGE, pageNumbers }, titlePage: false }, ...emptyHF(), children: [
        center([new TextRun({ text: `PART ${b.num.toUpperCase()}`, font: SANS, bold: true, size: pt(11), color: C.COPPER, characterSpacing: 90 })], { spacing: { before: 1000, after: 160 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 0 }, children: [new TextRun({ text: b.title.toUpperCase(), size: pt(36) })] }), rule(),
        center(runs(b.tagline, { italics: true, size: pt(14) }), { indent: { left: 1000, right: 1000 }, spacing: { after: 500 } }),
        center([image(b.fig, 5.2, 3.9)]),
      ] };
      sections.push(current);
      continue;
    }
    const recto = b.t === 'unnumbered' && ['Introduction', 'Final Thoughts'].includes(b.title);
    const kids = [];
    if (b.t === 'chapter') {
      chapLabel = b.num + '.';
      kids.push(new Paragraph({ spacing: { before: 200, after: 0 }, children: [new TextRun({ text: b.num, font: HEAVY, bold: true, size: pt(54), color: C.TAN })] }));
      kids.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'CHAPTER', font: SANS, bold: true, size: pt(9.5), color: C.COPPER, characterSpacing: 90 })] }));
    } else { chapLabel = ''; }
    kids.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: b.t === 'chapter' ? 0 : 300, after: 120 }, children: [new TextRun({ text: b.title })] }));
    kids.push(new Paragraph({ spacing: { after: 360 }, children: [new TextRun({ text: '━━━', color: C.COPPER, size: pt(14) })] }));
    if (b.fig) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [image(b.fig, 6.875, 3.6)] }));
    current = { properties: { type: recto ? SectionType.ODD_PAGE : SectionType.NEXT_PAGE, page: { ...PAGE, pageNumbers }, titlePage: true }, ...hf(b.title), children: kids, _lead: true };
    sections.push(current);
    continue;
  }
  const items = render(b);
  if (current._lead && b.t === 'p') { // lead paragraph styling
    current.children.push(P(b.text, { spacing: { after: 160 } }, { size: pt(12.5), color: C.G }));
    current._lead = false;
    continue;
  }
  current._lead = false;
  items.forEach((x) => current.children.push(x));
}
sections.forEach((s) => delete s._lead);

const doc = new Document({
  creator: book.author, title: book.title, subject: book.subtitle, description: `${book.title}: ${book.subtitle}. Published by ${book.publisher}.`,
  evenAndOddHeaderAndFooters: true,
  styles: {
    default: { document: { run: { font: SERIF, size: pt(11), color: C.INK }, paragraph: { spacing: { after: 130, line: 324, lineRule: LineRuleType.AUTO } } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: HEAVY, size: pt(26), color: C.G }, paragraph: { spacing: { before: 0, after: 120, line: 276, lineRule: LineRuleType.AUTO }, outlineLevel: 0, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: HEAVY, size: pt(15), color: C.G }, paragraph: { spacing: { before: 360, after: 120, line: 276, lineRule: LineRuleType.AUTO }, outlineLevel: 1, keepNext: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: SANS, bold: true, size: pt(11.5), color: C.G2 }, paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 2, keepNext: true } },
    ],
  },
  numbering,
  sections,
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(OUT, buf); console.log('wrote', OUT, (buf.length / 1e6).toFixed(1) + ' MB'); });
