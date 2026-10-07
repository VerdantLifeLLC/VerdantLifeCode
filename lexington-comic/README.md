# Lexington: The Turnaround

A 26-page illustrated comic book about Lexington, a brilliant 13-year-old who keeps making bad choices. He forgets to shower, ignores his parents, and stays in trouble. Through prayer, determination and a lot of daily practice, he turns his life around.

![Cover](cover.png)

## Read it

- **On the web:** open `index.html` in a browser. Choose **Full pages** to read like a printed comic, or **Panel by panel** for phones (phones start in this mode).
- **Print or share:** `Lexington-The-Turnaround.pdf` has one comic page per sheet at 7 × 10.5 in.
- **Email or offline:** `Lexington-The-Turnaround.html` is the whole comic in a single file.

The lettering fonts load from Google Fonts. Without an internet connection the comic still works, with system fonts.

## The story

| Chapter | Pages | What happens |
|---|---|---|
| Cover, Meet the Cast | 1–2 | Lexington, Mom, Dad and Biscuit the dog, with "before" stats |
| 1. Big Brain, Bad Choices | 3–5 | A genius who builds robots but won't shower, brush, or handle the bathroom |
| 2. Set Up for Success | 6–7 | Mom and Dad build a chore chart and a Fresh Start Kit. He does the opposite |
| 3. Trouble, Trouble, Trouble | 8–9 | Constant yelling, whoopings, and Lexington hearing his parents pray for him |
| 4. The Turning Point | 10–11 | He finds his Bible, reads Ephesians 6:1, Philippians 4:13 and Luke 2, and prays on his own |
| 5. Day by Day | 12–14 | New routines, his own bathroom checklist, chores without reminders, a slip, and getting back up |
| 6. Things Get Easier | 15 | Better grades, no yelling, family game night |
| 7. A Faith of His Own | 16–17 | Praying and studying scripture on his own, leading grace, serving at church |
| 8. Lexington Enterprises | 18–19 | Sneaker cleaning and bike repair become a business. Give, save, spend |
| 9. Goals & Dreams | 20 | A goal board, learning to code, and buying his own laptop |
| 10. Standing Tall | 21–22 | Confidence at a youth business expo, then cooking, laundry and banking on his own |
| 11. The Last Time | 23–24 | He can't remember the last time he got in trouble, or why he'd want to |
| Then & Now, Daily Checklist | 25–26 | Before/after stats, his verses, and a printable weekly routine chart |

Scripture is quoted from the King James Version.

## Change Lexington's look

Use **Lexington's look** in the reader toolbar to change the family's skin tone and hair color. Every page redraws, and the choice is remembered in that browser. You can also link straight to a look, for example `index.html?skin=tan&hair=brown`.

Skin options: `deep`, `brown`, `tan`, `light`, `fair`. Hair options: `black`, `brown`, `auburn`, `blond`.

## Files

| File | Purpose |
|---|---|
| `index.html`, `styles.css` | The reader page |
| `js/core.js` | Colors, drawing helpers and comic lettering (balloons, captions, sound effects) |
| `js/characters.js` | The posable character rig: poses, 40 facial expressions, hair, outfits, and the cast |
| `js/props.js` | Props and effects: furniture, the Bible, toothbrush, sneakers, bikes, Biscuit, stink lines, sparkles |
| `js/scenes.js` | Backgrounds: bedroom, bathroom, kitchen, church, school, garage, yard and more |
| `js/reader.js` | Page layout, the two reading modes, and the toolbar |
| `js/story-1.js` to `js/story-3.js` | The script: every page, panel, line of dialogue and caption |
| `tools/build.cjs` | Rebuilds the PDF, the single-file HTML and `cover.png` |

All artwork is drawn in code as SVG, so it stays sharp at any size.

## Edit the story

Each page in `js/story-*.js` lists its panel layout (`rows`) and its panels. A panel has an `art(w, h)` function that draws the scene and a `b(w, h)` list of balloons, for example:

```js
say("Up and at 'em!", x, y, top("teen", lexX, lexY, scale))
```

After editing, refresh `index.html` to see the change. To rebuild the PDF and single-file version:

```bash
cd lexington-comic
npm install playwright
npx playwright install chromium
node tools/build.cjs                      # default look
node tools/build.cjs --skin=tan --hair=brown
```
