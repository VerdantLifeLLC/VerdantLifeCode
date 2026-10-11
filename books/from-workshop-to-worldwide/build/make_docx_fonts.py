"""Create style-linked font families for the Word document (so Word can embed and link R/B/I/BI)."""
import os
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "fonts")
DST = os.path.join(HERE, "docx-fonts")
FAMILIES = {
    "Source Serif 4": {"Regular": "SourceSerif4-Regular.ttf", "Bold": "SourceSerif4-Bold.ttf",
                       "Italic": "SourceSerif4-Italic.ttf", "Bold Italic": "SourceSerif4-BoldItalic.ttf"},
    "Montserrat": {"Regular": "Montserrat-Medium.ttf", "Bold": "Montserrat-Bold.ttf"},
    "Montserrat ExtraBold": {"Regular": "Montserrat-ExtraBold.ttf", "Bold": "Montserrat-Black.ttf"},
}


def rename(path, family, style, out):
    f = TTFont(path)
    name = f["name"]
    full = family if style == "Regular" else f"{family} {style}"
    ps = (family + "-" + style).replace(" ", "")
    for rec in list(name.names):
        if rec.nameID in (16, 17, 21, 22, 25):
            name.removeNames(nameID=rec.nameID)
    for nid, val in ((1, family), (2, style), (3, ps + "-VL"), (4, full), (6, ps)):
        name.setName(val, nid, 3, 1, 0x409)
        name.setName(val, nid, 1, 0, 0)
    os2 = f["OS/2"]
    bold, ital = "Bold" in style, "Italic" in style
    os2.fsSelection = (os2.fsSelection & ~0b1100001) | (0x20 if bold else 0) | (0x01 if ital else 0) | (0x40 if not bold and not ital else 0)
    f["head"].macStyle = (1 if bold else 0) | (2 if ital else 0)
    os2.usWeightClass = 700 if bold else 400
    f.save(out)


os.makedirs(DST, exist_ok=True)
for fam, styles in FAMILIES.items():
    for sty, fn in styles.items():
        out = os.path.join(DST, f"{fam.replace(' ', '')}-{sty.replace(' ', '')}.ttf")
        rename(os.path.join(SRC, fn), fam, sty, out)
        print(out)
