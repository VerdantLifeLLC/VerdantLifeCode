// Desktop (Neutralino) glue: open share links in the user's browser/mail app.
window.QUIZ_PUBLIC_URL = "https://verdantlifellc.github.io/VerdantLifeCode/political-quiz/";
Neutralino.init();
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a) return;
  const href = a.href;
  if (/^(https?:|mailto:)/.test(href) && !href.startsWith(location.origin)) {
    e.preventDefault();
    Neutralino.os.open(href);
  }
}, true);
