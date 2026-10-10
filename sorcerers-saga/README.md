# The Lattice Chronicles

An epic fantasy LitRPG series about two estranged brothers, Lex and Antho, the hidden System that rules their world, and the father who sealed their power away.

| Book | Chapters | Words | 6 x 9 pages |
|---|---|---|---|
| **Book One: The Sorcerer's Reckoning** | Prologue, 40 chapters (Part One: The Awakening; Part Two: The Shadow's Descent) | ~216,000 | 703 |
| **Book Two: The Sorcerer's Legacy** | Prologue, 37 chapters, an Interlude and an Epilogue (Part One: The Key of Shadows; Part Two: Echoes of the Past) | ~196,000 | 659 |

## Files

| Path | What it is |
|---|---|
| `book1/chapters/`, `book2/chapters/` | The manuscripts, one Markdown file per chapter |
| `BIBLE.md` | Series bible: the System's rules, world, characters, secrets, chapter plans (section 7b is the revised Book Two plan) |
| `CONTINUITY.md` | Running ledger of levels, stats, skills, items and plot facts, chapter by chapter |
| `ORIGINAL-OUTLINE.md` | The author's original outline both books grew from |
| `build.py` | Builds the KDP 6 x 9 paperback interiors (PDF) and Word files |
| `output/` | The built books: `*-KDP-6x9-Interior.pdf` (upload-ready interior) and `*-KDP-6x9.docx` (editable) |
| `covers.py` | Builds the covers: full-wrap KDP paperback covers (back, spine and front, 0.125 in bleed, spine sized from the interior page count), a 6 x 9 front cover and a 1600 x 2560 Kindle cover |
| `output/covers/` | The built covers |
| `fonts/` | EB Garamond, Cinzel and IBM Plex Mono (SIL Open Font License); DejaVu Sans / Sans Mono as glyph fallback (see `DejaVu-LICENSE.txt`) |

## Building

```
pip install reportlab python-docx fonttools
python3 build.py              # both books, PDF + DOCX
python3 build.py book2        # one book
python3 build.py book1 --pdf-only
python3 covers.py             # covers for both books (white paper)
python3 covers.py book2 --paper cream
```

Interior spec: 6 x 9 in trim, no bleed, mirrored margins (inside 0.85 in, outside 0.6 in, top 0.8 in, bottom 0.75 in), EB Garamond 11.5/15.2, chapters open on recto, running heads and folios. System panels (`:::system`, `:::root`, `:::error`) are set in IBM Plex Mono.

## Manuscript conventions

- Optional first line `@@PART Part One: Title` starts a new part.
- `# Title` is the chapter title. Titles beginning with Prologue, Epilogue or Interlude are unnumbered.
- `---` is a scene break. `*italic*`, `**bold**`. Lines starting with `>` are verse.
- `:::system` (silver Lattice), `:::root` (gold Root/Ember) and `:::error` (corrupted) open a boxed System panel, closed by `:::`. Keep panel lines to 44 characters or fewer.
