"""Post-process the docx: embed (obfuscated) TrueType fonts and turn on mirrored margins.

usage: python3 postprocess_docx.py in.docx out.docx
"""
import os
import re
import sys
import uuid
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(HERE, "docx-fonts")
EMBED = {
    "Source Serif 4": {"Regular": "SourceSerif4-Regular.ttf", "Bold": "SourceSerif4-Bold.ttf", "Italic": "SourceSerif4-Italic.ttf", "BoldItalic": "SourceSerif4-BoldItalic.ttf"},
    "Montserrat": {"Regular": "Montserrat-Regular.ttf", "Bold": "Montserrat-Bold.ttf"},
    "Montserrat ExtraBold": {"Regular": "MontserratExtraBold-Regular.ttf", "Bold": "MontserratExtraBold-Bold.ttf"},
}
FONT_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/font"


def obfuscate(data, guid):
    hexs = guid.replace("-", "").replace("{", "").replace("}", "")
    key = bytes(int(hexs[i:i + 2], 16) for i in range(30, -1, -2))
    b = bytearray(data)
    for i in range(32):
        b[i] ^= key[i % 16]
    return bytes(b)


def main(src, dst):
    zin = zipfile.ZipFile(src)
    files = {n: zin.read(n) for n in zin.namelist()}
    ft = files["word/fontTable.xml"].decode()
    rels_name = "word/_rels/fontTable.xml.rels"
    rels = files.get(rels_name, b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>').decode()
    rels = re.sub(r"<Relationships([^>]*)/>", r"<Relationships\1></Relationships>", rels)
    n = 0
    for fam, styles in EMBED.items():
        embeds = ""
        for sty, fn in styles.items():
            n += 1
            guid = "{" + str(uuid.uuid4()).upper() + "}"
            rid = f"rIdFont{n}"
            files[f"word/fonts/font{n}.odttf"] = obfuscate(open(os.path.join(FD, fn), "rb").read(), guid)
            rels = rels.replace("</Relationships>", f'<Relationship Id="{rid}" Type="{FONT_REL}" Target="fonts/font{n}.odttf"/></Relationships>')
            embeds += f'<w:embed{sty} r:id="{rid}" w:fontKey="{guid}"/>'
        entry = (f'<w:font w:name="{fam}"><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/>{embeds}</w:font>')
        # drop any existing entry for this family, then append ours
        ft = re.sub(rf'<w:font w:name="{re.escape(fam)}"[^>]*?(/>|>.*?</w:font>)', "", ft, flags=re.S)
        ft = ft.replace("</w:fonts>", entry + "</w:fonts>")
    if 'xmlns:r=' not in ft[:500]:
        ft = ft.replace("<w:fonts ", '<w:fonts xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ', 1)
    files["word/fontTable.xml"] = ft.encode()
    files[rels_name] = rels.encode()
    ct = files["[Content_Types].xml"].decode()
    if 'Extension="odttf"' not in ct:
        ct = ct.replace("<Types ", "<Types ", 1).replace("</Types>", '<Default Extension="odttf" ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont"/></Types>')
    files["[Content_Types].xml"] = ct.encode()
    st = files["word/settings.xml"].decode()
    # schema order: ... displayBackgroundShape, ..., embedTrueTypeFonts, ..., mirrorMargins, ...
    add = "<w:embedTrueTypeFonts/><w:mirrorMargins/>"
    if "<w:displayBackgroundShape/>" in st:
        st = st.replace("<w:displayBackgroundShape/>", "<w:displayBackgroundShape/>" + add, 1)
    else:
        st = re.sub(r"(<w:settings[^>]*>)", r"\1" + add, st, count=1)
    files["word/settings.xml"] = st.encode()
    with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as z:
        order = ["[Content_Types].xml"] + [k for k in files if k != "[Content_Types].xml"]
        for k in order:
            z.writestr(k, files[k])
    print("embedded", n, "font files ->", dst)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
