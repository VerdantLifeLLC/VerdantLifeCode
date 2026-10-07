"""Set a one-page PDF's page box to an exact size in inches.
Chromium rounds custom page sizes slightly; KDP checks cover size closely.
The artwork is anchored top-left, so trimming the tiny extra margin removes only blank space.
Usage: python3 tools/fix-pdf-size.py file.pdf WIDTH_IN HEIGHT_IN"""
import sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

path, w_in, h_in = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
reader = PdfReader(path)
writer = PdfWriter()
for page in reader.pages:
    top = float(page.mediabox.top)
    w, h = w_in * 72, h_in * 72
    box = RectangleObject([0, top - h, w, top])
    page.mediabox = box
    page.cropbox = box
    page.trimbox = box
    page.bleedbox = box
    writer.add_page(page)
with open(path, "wb") as f:
    writer.write(f)
