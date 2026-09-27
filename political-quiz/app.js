(() => {
  "use strict";

  const IDEOLOGY_COUNT = 10;
  const PARTY_COUNT = 5;
  const MAX_ANSWER_SCORE = 2;
  // How much the ideology result counts toward the party result (the rest comes from Part 2).
  const IDEOLOGY_WEIGHT_IN_PARTY = 0.3;

  const $ = (id) => document.getElementById(id);

  const state = {
    round: "ideology", // "ideology" | "party"
    questions: [],
    answers: [], // chosen score per question index
    index: 0,
    ideologyScore: 0, // -100 (liberal) .. +100 (conservative)
    partyScore: 0, // -100 (Democrat) .. +100 (Republican)
  };

  // ---------- Helpers ----------

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pickQuestions(bank, count) {
    return shuffle(bank)
      .slice(0, count)
      .map((q) => ({ text: q.text, answers: shuffle(q.answers) }));
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  // Converts summed answer scores into a -100..100 percentage.
  function toPercent(scores) {
    const total = scores.reduce((sum, s) => sum + s, 0);
    return Math.round((total / (scores.length * MAX_ANSWER_SCORE)) * 100);
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  let toastTimer;
  function toast(message) {
    const el = $("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  // ---------- Result descriptions ----------

  function describeIdeology(score) {
    if (score === 0) return { label: "Centrist", short: "a Centrist", color: "purple" };
    const side = score < 0 ? "Liberal" : "Conservative";
    const color = score < 0 ? "blue" : "red";
    const mag = Math.abs(score);
    const prefix = mag >= 60 ? "Strong " : mag >= 25 ? "" : "Moderate ";
    const label = prefix + side;
    return { label, short: (/^[AEIOU]/i.test(label) ? "an " : "a ") + label, color };
  }

  function describeParty(score) {
    if (score === 0) return { label: "Independent", short: "an Independent", color: "purple" };
    const side = score < 0 ? "Democrat" : "Republican";
    const color = score < 0 ? "blue" : "red";
    const mag = Math.abs(score);
    const prefix = mag >= 60 ? "Strong " : mag >= 25 ? "" : "Lean ";
    const label = prefix + side;
    return { label, short: prefix === "Lean " ? `leaning ${side}` : `a ${label}`, color };
  }

  function blurbFor(ideology, party) {
    const i = describeIdeology(ideology);
    const p = describeParty(party);
    const mixed = ideology !== 0 && party !== 0 && Math.sign(ideology) !== Math.sign(party);
    if (mixed) {
      return `Interesting mix! Your views lean ${ideology < 0 ? "liberal" : "conservative"}, but you side with ${
        party < 0 ? "Democrats" : "Republicans"
      } on party loyalty. You don't fit neatly in a box.`;
    }
    if (ideology === 0 && party === 0) {
      return "You sit right in the middle — a true independent thinker who weighs each issue on its own.";
    }
    const strong = Math.abs(ideology) >= 60 && Math.abs(party) >= 60;
    if (strong) {
      return `You're a committed ${i.label.replace("Strong ", "").toLowerCase()} and a reliable ${p.label.replace(
        "Strong ",
        ""
      )} — your views line up closely with your party.`;
    }
    return `You lean ${ideology < 0 ? "left" : ideology > 0 ? "right" : "center"} on the issues, and your party instincts point toward the ${
      party < 0 ? "Democrats" : party > 0 ? "Republicans" : "middle"
    }.`;
  }

  // Meter from -100 (left) to +100 (right).
  function renderMeter(container, score, leftLabel, rightLabel) {
    container.innerHTML = `
      <div class="meter">
        <div class="meter-track"><div class="meter-marker" style="left:50%"></div></div>
        <div class="meter-labels"><span class="l">${leftLabel}</span><span class="r">${rightLabel}</span></div>
      </div>`;
    const marker = container.querySelector(".meter-marker");
    // Let the browser paint at center first so the marker animates into place.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        marker.style.left = `${(clamp(score, -100, 100) + 100) / 2}%`;
      })
    );
  }

  function setLabel(el, desc) {
    el.textContent = desc.label;
    el.className = `result-label ${desc.color}`;
  }

  // ---------- Quiz flow ----------

  function startRound(round) {
    state.round = round;
    state.questions =
      round === "ideology"
        ? pickQuestions(IDEOLOGY_QUESTIONS, IDEOLOGY_COUNT)
        : pickQuestions(PARTY_QUESTIONS, PARTY_COUNT);
    state.answers = new Array(state.questions.length).fill(null);
    state.index = 0;
    $("round-label").textContent = round === "ideology" ? "Part 1 of 2 · Ideology" : "Part 2 of 2 · Party";
    showScreen("screen-quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = state.questions[state.index];
    const total = state.questions.length;
    $("progress-text").textContent = `${state.index + 1} / ${total}`;
    const pct = (state.index / total) * 100;
    $("progress-bar").style.width = `${pct}%`;
    document.querySelector(".progress").setAttribute("aria-valuenow", String(Math.round(pct)));
    $("question-text").textContent = q.text;
    $("btn-back").disabled = state.index === 0;

    const list = $("answers");
    list.innerHTML = "";
    q.answers.forEach((a, i) => {
      const btn = document.createElement("button");
      btn.className = "answer";
      btn.type = "button";
      if (state.answers[state.index] === i) btn.classList.add("selected");
      btn.innerHTML = `<span class="answer-key">${i + 1}</span><span></span>`;
      btn.lastChild.textContent = a.text;
      btn.addEventListener("click", () => choose(i));
      list.appendChild(btn);
    });
  }

  let advancing = false;
  function choose(answerIndex) {
    if (advancing) return;
    advancing = true;
    state.answers[state.index] = answerIndex;
    $("answers").children[answerIndex].classList.add("selected");

    // Short pause so the selection is visible before moving on.
    setTimeout(() => {
      advancing = false;
      if (state.index < state.questions.length - 1) {
        state.index++;
        renderQuestion();
      } else {
        finishRound();
      }
    }, 220);
  }

  function goBack() {
    if (state.index > 0 && !advancing) {
      state.index--;
      renderQuestion();
    }
  }

  function roundScores() {
    return state.questions.map((q, i) => q.answers[state.answers[i]].score);
  }

  function finishRound() {
    $("progress-bar").style.width = "100%";
    if (state.round === "ideology") {
      state.ideologyScore = toPercent(roundScores());
      const desc = describeIdeology(state.ideologyScore);
      setLabel($("halftime-label"), desc);
      showScreen("screen-halftime");
      renderMeter($("halftime-meter"), state.ideologyScore, "Liberal", "Conservative");
    } else {
      const partyRaw = toPercent(roundScores());
      state.partyScore = Math.round(
        partyRaw * (1 - IDEOLOGY_WEIGHT_IN_PARTY) + state.ideologyScore * IDEOLOGY_WEIGHT_IN_PARTY
      );
      showResults(state.ideologyScore, state.partyScore, false);
      history.replaceState(null, "", shareUrl());
    }
  }

  // ---------- Results & sharing ----------

  function showResults(ideology, party, isShared) {
    state.ideologyScore = ideology;
    state.partyScore = party;
    const i = describeIdeology(ideology);
    const p = describeParty(party);

    $("result-eyebrow").textContent = isShared ? "A friend's results — how do you compare?" : "Your results";
    $("share-block").hidden = isShared;
    $("btn-retake").textContent = isShared ? "Take the quiz yourself" : "Take the quiz again";

    setLabel($("result-ideology"), i);
    setLabel($("result-party"), p);
    $("result-blurb").textContent = blurbFor(ideology, party);
    showScreen("screen-result");
    renderMeter($("meter-ideology"), ideology, "Liberal", "Conservative");
    renderMeter($("meter-party"), party, "Democrat", "Republican");
    if (!isShared) updateShareLinks();
  }

  function baseUrl() {
    return location.origin + location.pathname;
  }

  function shareUrl() {
    const params = new URLSearchParams({ i: state.ideologyScore, p: state.partyScore });
    return `${baseUrl()}?${params}`;
  }

  function shareText() {
    const i = describeIdeology(state.ideologyScore);
    const p = describeParty(state.partyScore);
    return `I took the Left or Right? quiz: I'm ${i.short} and ${p.short}! 🗳️ Find out where you stand:`;
  }

  function updateShareLinks() {
    const url = encodeURIComponent(shareUrl());
    const text = encodeURIComponent(shareText());
    const both = encodeURIComponent(`${shareText()} ${shareUrl()}`);
    const title = encodeURIComponent("Left or Right? Political Quiz");
    const links = {
      x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      threads: `https://www.threads.net/intent/post?text=${both}`,
      bluesky: `https://bsky.app/intent/compose?text=${both}`,
      reddit: `https://www.reddit.com/submit?url=${url}&title=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${both}`,
      email: `mailto:?subject=${title}&body=${both}`,
    };
    document.querySelectorAll("a.share-btn").forEach((a) => {
      a.href = links[a.dataset.share];
    });
    $("btn-native-share").hidden = !navigator.share;
  }

  async function copyLink() {
    const text = `${shareText()} ${shareUrl()}`;
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard!");
    } catch {
      // Fallback for browsers without clipboard permission.
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast("Copied to clipboard!");
    }
  }

  // Draws a square result card suitable for Instagram/TikTok/stories.
  function drawResultImage() {
    const size = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const BLUE = "#2563eb";
    const RED = "#dc2626";
    const PURPLE = "#7c3aed";
    const colorOf = (c) => (c === "blue" ? BLUE : c === "red" ? RED : PURPLE);

    // Background
    const bg = ctx.createLinearGradient(0, 0, size, size);
    bg.addColorStop(0, "#0f172a");
    bg.addColorStop(1, "#1e293b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // Top stripe
    const stripe = ctx.createLinearGradient(0, 0, size, 0);
    stripe.addColorStop(0, BLUE);
    stripe.addColorStop(0.5, PURPLE);
    stripe.addColorStop(1, RED);
    ctx.fillStyle = stripe;
    ctx.fillRect(0, 0, size, 18);

    ctx.textAlign = "center";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 72px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("Left or Right?", size / 2, 150);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 34px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("My political quiz results", size / 2, 205);

    const drawSection = (y, kicker, desc, score, left, right) => {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "700 30px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
      ctx.fillText(kicker.toUpperCase(), size / 2, y);
      ctx.fillStyle = colorOf(desc.color);
      // Shrink the label if it would overflow the card.
      let fontSize = 84;
      do {
        ctx.font = `800 ${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
        fontSize -= 4;
      } while (ctx.measureText(desc.label).width > size - 120 && fontSize > 40);
      ctx.fillText(desc.label, size / 2, y + 95);

      // Meter
      const x0 = 160;
      const w = size - 320;
      const my = y + 150;
      const grad = ctx.createLinearGradient(x0, 0, x0 + w, 0);
      grad.addColorStop(0, BLUE);
      grad.addColorStop(0.5, "#a78bfa");
      grad.addColorStop(1, RED);
      ctx.fillStyle = grad;
      roundRect(ctx, x0, my, w, 24, 12);
      ctx.fill();
      const mx = x0 + ((clamp(score, -100, 100) + 100) / 200) * w;
      ctx.beginPath();
      ctx.arc(mx, my + 12, 24, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#0f172a";
      ctx.stroke();

      ctx.font = "700 28px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = BLUE;
      ctx.fillText(left, x0, my + 75);
      ctx.textAlign = "right";
      ctx.fillStyle = RED;
      ctx.fillText(right, x0 + w, my + 75);
      ctx.textAlign = "center";
    };

    drawSection(330, "Ideology", describeIdeology(state.ideologyScore), state.ideologyScore, "Liberal", "Conservative");
    drawSection(650, "Party", describeParty(state.partyScore), state.partyScore, "Democrat", "Republican");

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "600 34px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("Where do you stand? Take the quiz:", size / 2, 975);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 28px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(baseUrl().replace(/^https?:\/\//, "").replace(/\/index\.html$/, "/"), size / 2, 1025);

    return canvas;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function imageBlob() {
    return new Promise((resolve) => drawResultImage().toBlob(resolve, "image/png"));
  }

  async function saveImage() {
    const blob = await imageBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "left-or-right-results.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Image saved!");
  }

  async function nativeShare() {
    const data = { title: "Left or Right? Political Quiz", text: shareText(), url: shareUrl() };
    try {
      const blob = await imageBlob();
      const file = new File([blob], "left-or-right-results.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        data.files = [file];
      }
      await navigator.share(data);
    } catch (err) {
      if (err && err.name !== "AbortError") copyLink();
    }
  }

  // ---------- Startup ----------

  function readSharedResult() {
    const params = new URLSearchParams(location.search);
    if (!params.has("i") || !params.has("p")) return null;
    const i = Number.parseInt(params.get("i"), 10);
    const p = Number.parseInt(params.get("p"), 10);
    if (!Number.isFinite(i) || !Number.isFinite(p)) return null;
    return { i: clamp(i, -100, 100), p: clamp(p, -100, 100) };
  }

  function reset() {
    history.replaceState(null, "", baseUrl());
    startRound("ideology");
  }

  $("btn-start").addEventListener("click", () => startRound("ideology"));
  $("btn-continue").addEventListener("click", () => startRound("party"));
  $("btn-back").addEventListener("click", goBack);
  $("btn-retake").addEventListener("click", reset);
  $("btn-copy").addEventListener("click", copyLink);
  $("btn-image").addEventListener("click", saveImage);
  $("btn-native-share").addEventListener("click", nativeShare);

  document.addEventListener("keydown", (e) => {
    if (!$("screen-quiz").classList.contains("active")) return;
    const n = Number.parseInt(e.key, 10);
    if (n >= 1 && n <= state.questions[state.index].answers.length) choose(n - 1);
    else if (e.key === "Backspace" || e.key === "ArrowLeft") goBack();
  });

  const shared = readSharedResult();
  if (shared) showResults(shared.i, shared.p, true);
})();
