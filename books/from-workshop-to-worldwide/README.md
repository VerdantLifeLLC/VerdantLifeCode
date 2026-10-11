# From Workshop to Worldwide

*A Step-by-Step Guide to Building a Profitable Business From the Things You Make and the Services You Provide*
by **The Skill Junky** · published by **Verdant Life LLC**

148-page, 8.5 × 11 in workbook-style guide covering 21 chapters in six parts, with 34 original illustrations,
33 worksheets, 10 customer-communication templates, a 30-day launch plan, and a first-year success plan.

## Deliverables (`output/`)

| File | Use it for |
|---|---|
| `Interior-Paperback-8.5x11-BlackWhite.pdf` | **KDP paperback manuscript** (recommended: black & white ink, white paper) |
| `Interior-Paperback-8.5x11-Color.pdf` | KDP paperback manuscript if you choose color ink (higher print cost) |
| `Cover-Paperback-BlackWhiteInterior-148pages.pdf` | **KDP paperback cover**: full wrap (back + spine + front) with bleed, for the B&W interior |
| `Cover-Paperback-ColorInterior-148pages.pdf` | Paperback cover if you choose color ink (color paper is thicker, so the spine is wider) |
| `Interior-Hardcover-8.25x11-BlackWhite.pdf` | **KDP hardcover manuscript** (black & white ink) |
| `Interior-Hardcover-8.25x11-Color.pdf` | KDP hardcover manuscript if you choose premium color ink |
| `Cover-Hardcover-8.25x11-BlackWhiteInterior-148pages.pdf` | **KDP hardcover (case laminate) cover** for the B&W interior |
| `Cover-Hardcover-8.25x11-PremiumColorInterior-148pages.pdf` | Hardcover cover if you choose premium color ink |
| `Manuscript-Paperback-8.5x11.docx` | Editable Word version of the paperback (fonts embedded, mirrored margins) |
| `eBook-From-Workshop-to-Worldwide.epub` | **Kindle eBook manuscript** (EPUB 3; passes EPUBCheck with 0 errors and 0 warnings) |
| `Cover-eBook-1600x2560.jpg` | **Kindle eBook cover** (1600 × 2560 px, 1.6:1, RGB JPG) |

## Uploading to KDP

### Paperback
- **Trim size:** 8.5 × 11 in (21.59 × 27.94 cm). **Bleed:** No bleed (interior). **Cover finish:** Matte suits the design; glossy also works.
- **Ink and paper:** Black & white interior on white paper → upload the BlackWhite interior and the BlackWhiteInterior cover.
  Color interior → upload the Color interior and the ColorInterior cover. The two covers differ only in spine width.
- **Interior:** 148 pages. Margins are 0.875 in inside (gutter), 0.75 in outside, 0.85 in top and bottom. That is well above KDP's minimums. All fonts are embedded.
- **Cover:** 17.583 × 11.25 in (B&W) or 17.597 × 11.25 in (color). That includes 0.125 in bleed on every side.
  The spine is 0.333 in (B&W, white paper) or 0.347 in (color). The barcode area on the back cover (bottom right, 2 × 1.2 in) is clear for KDP's barcode.
- If you edit the book and the page count changes, rebuild (see below) so the spine width is recalculated.
- **ISBN:** use KDP's free ISBN or your own. The copyright page doesn't print an ISBN, which KDP allows. To show it, add a line to the copyright text in `build/build_print.py` and `build/build_docx.js`.

### Hardcover
- **Trim size:** 8.25 × 11 in. KDP hardcovers don't offer 8.5 × 11, so 8.25 × 11 is the closest size. **Bleed:** No bleed (interior). **Binding:** case laminate.
- **Interior:** 148 pages, reflowed for the narrower page. Margins are 0.875 in inside, 0.625 in outside, and 0.85 in top and bottom.
- **Cover:** 18.598 × 12.418 in (B&W) or 18.612 × 12.418 in (premium color). The cover is built to the usual KDP hardcover layout:
  - a 0.591 in (15 mm) wrap that folds around the boards on every outer edge
  - boards 0.197 in wider and 0.236 in taller than the trim
  - spine = page thickness + 0.189 in, which gives 0.522 in (B&W) or 0.536 in (color)
  - all text kept out of the 0.394 in hinge zone beside the spine and out of the barcode area.
- **Check before you upload:** these hardcover measurements come from published KDP cover templates and calculators, because KDP's own site couldn't be reached from here. In KDP, open **Cover Calculator / template** (Hardcover, 8.25 × 11, 148 pages, your paper) and compare its full-cover size with the PDF's page size. If they differ, change the `HC_*` values at the top of the hardcover section in `build/cover.py` and rebuild.

### Kindle eBook
- Upload `eBook-From-Workshop-to-Worldwide.epub` as the manuscript and `Cover-eBook-1600x2560.jpg` as the cover.
- In the eBook, worksheets show as questions and fields for readers to copy into a notebook. The paperback-only "Notes" page is left out.

### AI disclosure
KDP asks whether any content is AI-generated. The manuscript was expanded from the author's original material, and the illustrations and covers were created with an AI assistant (Claude).
Answer KDP's AI-content questions based on how much you review and edit before publishing.

### Listing details
The description, categories, keywords, and tips for getting the book seen are in [`output/KDP-Listing.md`](output/KDP-Listing.md).

## Editing and rebuilding

All seven deliverables are generated from one source:

- `manuscript/*.txt`: the book text in a simple markup (the directive list is at the top of `build/manuscript.py`).
- `build/figures_diagrams.py` and `build/figures_scenes.py`: the illustrations, drawn as SVG (color and grayscale).
- `build/cover.py`: the cover design.

Rebuild everything with:

```bash
pip install weasyprint fonttools
./build/build_all.sh        # needs python3, node (docx, playwright), LibreOffice and poppler-utils
```

In the Word file, the Contents page is plain text with page numbers taken from a test render.
If you edit the Word file directly and the pages shift, update those numbers by hand or rebuild.

## Photos

The book uses original vector illustrations and diagrams throughout. Real photos weren't possible here: the build environment's network policy blocked downloading full-resolution images (Canva exports, Unsplash, Pexels).
Photos of your own products and work would make strong additions. The figure pipeline currently expects SVG, so adding JPG photos needs a small build change. That change is a quick follow-up once the photos are available.

## Fonts

Source Serif 4 and Montserrat, both under the SIL Open Font License (see `fonts/OFL-*.txt`). Both may be embedded in commercial books.
