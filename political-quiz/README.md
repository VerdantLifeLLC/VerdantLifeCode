# Left or Right? — Political Quiz

A web app that asks two rounds of multiple-choice questions:

1. **Part 1 (Ideology):** 10 questions picked at random from a bank of 24 tell you whether you're **liberal** or **conservative**.
2. **Part 2 (Party):** 5 questions picked at random from a bank of 12 tell you whether you're a **Democrat** or **Republican**.

Results can be shared to X, Facebook, Threads, Bluesky, Reddit, LinkedIn, WhatsApp, or email, or through the phone's share menu. You can also copy a link or save a 1080×1080 result image for Instagram and TikTok.

It uses plain HTML, CSS, and JavaScript, with no build step, dependencies, or server. Answers never leave the user's device.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page layout and social link-preview tags |
| `styles.css` | Styling (mobile-first, supports dark mode) |
| `questions.js` | Question banks. Edit this file to add or change questions |
| `app.js` | Quiz flow, scoring, results, and sharing |
| `og-image.png` | Preview image shown when the link is posted on social media |

## Run locally

```bash
cd political-quiz
python3 -m http.server 8000
# open http://localhost:8000
```

You can also open `index.html` directly in a browser. Share links need the app to be hosted, though.

## Publish it (free) with GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**, choose **Deploy from a branch**, then pick your branch and the `/ (root)` folder.
3. The app will be live at `https://<username>.github.io/<repo>/political-quiz/`.
4. **Important for link previews:** Facebook, X, and other sites need a full web address for the preview image. In `index.html`, change `content="og-image.png"` to the full URL, e.g. `https://<username>.github.io/<repo>/political-quiz/og-image.png`.

Netlify, Vercel, and Cloudflare Pages also work: drag and drop the `political-quiz` folder.

## How scoring works

- Each answer has a score from **-2 to +2**.
  - In Part 1, negative means liberal and positive means conservative.
  - In Part 2, negative means Democrat and positive means Republican.
- Answer order is shuffled, so the most liberal answer isn't always in the same position.
- Each round's total is turned into a score from **-100 to +100**.
- The **party** result is 70% Part 2 answers and 30% Part 1 ideology.
- Labels:
  - A score of 60 or more either way gets **"Strong"**.
  - A score from 25 to 59 gets just the name, e.g. "Liberal".
  - A score from 1 to 24 gets **"Moderate"** (ideology) or **"Lean"** (party).
  - Exactly 0 gets **Centrist** or **Independent**.

## Sharing

A shared link looks like `…/political-quiz/?i=45&p=62`. Opening it shows that person's result card with a **"Take the quiz yourself"** button, which helps the quiz spread.

## Adding questions

Add an entry to `IDEOLOGY_QUESTIONS` or `PARTY_QUESTIONS` in `questions.js`:

```js
{
  text: "Your question?",
  answers: [
    { text: "Most liberal / Democratic answer", score: -2 },
    { text: "Leaning liberal / Democratic answer", score: -1 },
    { text: "Leaning conservative / Republican answer", score: 1 },
    { text: "Most conservative / Republican answer", score: 2 },
  ],
},
```

To change how many questions each round asks, edit `IDEOLOGY_COUNT` and `PARTY_COUNT` at the top of `app.js`.
