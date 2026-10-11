#!/usr/bin/env bash
# Rebuild every deliverable from the manuscript: illustrations, print PDFs, covers, Word file, and EPUB.
set -euo pipefail
cd "$(dirname "$0")"
export NODE_PATH="${NODE_PATH:-/opt/node22/lib/node_modules}"
SOFFICE="${SOFFICE:-soffice}"

python3 make_figs.py                                   # SVG illustrations (color + grayscale)
python3 build_print.py both                            # KDP paperback interiors (8.5 x 11)
PAGES=$(pdfinfo ../output/Interior-Paperback-8.5x11-BlackWhite.pdf | awk '/^Pages:/{print $2}')
rm -f ../output/Cover-Paperback-*.pdf
python3 cover.py "$PAGES"                              # cover HTML sized for this page count
node render_covers.js                                  # paperback wrap PDFs + eBook cover JPG
node rasterize.js ../illustrations/svg-color _png 2000 # print-resolution PNGs for Word
node rasterize.js ../illustrations/svg-color _png_epub 1200
python3 -c "import json; from manuscript import load, BOOK; json.dump({'book': BOOK, 'blocks': load()}, open('_book.json', 'w'))"
python3 make_docx_fonts.py >/dev/null
# Word: build once, render with LibreOffice to read page numbers for the contents page, then rebuild
node build_docx.js _draft.docx
python3 postprocess_docx.py _draft.docx _draft2.docx
$SOFFICE --headless --convert-to pdf --outdir _lo _draft2.docx >/dev/null 2>&1
python3 toc_pages.py _lo/_draft2.pdf _tocpages.json >/dev/null
node build_docx.js _draft.docx _tocpages.json
python3 postprocess_docx.py _draft.docx ../output/Manuscript-Paperback-8.5x11.docx
python3 build_epub.py                                  # Kindle eBook
echo "Done. Interior pages: $PAGES"
