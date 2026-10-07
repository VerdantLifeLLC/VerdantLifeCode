/* Lexington: The Turnaround — page layout and reader UI. */
(function () {
  "use strict";
  const C = window.Comic;
  const { n, INK } = C;
  const PW = 1000,
    PH = 1500,
    M = 34,
    G = 16,
    BANNER = 104;
  C.PAGE = { PW, PH, M, G };

  function layout(page) {
    let top = M + (page.chapter ? BANNER : 0);
    const bottom = PH - M - 22;
    const rows = page.rows || [[1, [1]]];
    const H = bottom - top - G * (rows.length - 1);
    const rects = [];
    let y = top;
    rows.forEach(([rh, cols]) => {
      const h = Math.round(H * rh);
      cols = cols || [1];
      const W = PW - 2 * M - G * (cols.length - 1);
      let x = M;
      cols.forEach((cf, i) => {
        const w = i === cols.length - 1 ? PW - M - x : Math.round(W * cf);
        rects.push({ x, y, w, h });
        x += w + G;
      });
      y += h + G;
    });
    return rects;
  }

  function banner(ch) {
    const y = M;
    let s = "";
    s += `<path d="M${M} ${y + 10} L${PW - M} ${y} L${PW - M - 12} ${y + 84} L${M + 8} ${y + 90} Z" fill="${ch.color || "#c9473c"}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<path d="M${M + 14} ${y + 18} L${PW - M - 14} ${y + 10}" stroke="#ffffff" stroke-width="3" opacity=".35"/>`;
    s += `<rect x="${M + 22}" y="${y + 18}" width="150" height="56" rx="6" fill="#ffd95e" stroke="${INK}" stroke-width="3" transform="rotate(-3 ${M + 97} ${y + 46})"/>`;
    s += C.text(M + 97, y + 41, "CHAPTER", { size: 18, font: "title", ls: 2, rot: -3 });
    s += C.text(M + 97, y + 68, String(ch.n), { size: 30, font: "title", rot: -3 });
    s += C.text(M + 200, y + 66, ch.title.toUpperCase(), { size: 50, font: "title", anchor: "start", fill: "#ffffff", stroke: INK, sw: 7, ls: 1.5 });
    return s;
  }

  function renderPanelInner(p, w, h) {
    let art = "";
    try {
      art = p.art ? p.art(w, h) : "";
    } catch (e) {
      console.error("panel art failed", e);
      art = C.text(w / 2, h / 2, "art error: " + e.message, { size: 14 });
    }
    const bl = typeof p.b === "function" ? p.b(w, h) : p.b || [];
    let balloons = "";
    bl.forEach((b) => {
      try {
        balloons += C.balloon(b);
      } catch (e) {
        console.error("balloon failed", b, e);
      }
    });
    return art + balloons;
  }

  function panelSvg(p, r, standalone) {
    const inner = renderPanelInner(p, r.w, r.h);
    const border = `<rect x="1.5" y="1.5" width="${r.w - 3}" height="${r.h - 3}" fill="none" stroke="${INK}" stroke-width="5"/>`;
    if (standalone) {
      return `<svg class="panel-svg" viewBox="0 0 ${r.w} ${r.h}" role="img" aria-label="${C.esc(p.alt || "")}" xmlns="http://www.w3.org/2000/svg"><rect width="${r.w}" height="${r.h}" fill="${p.bg || "#ffffff"}"/><svg width="${r.w}" height="${r.h}" overflow="hidden">${inner}</svg>${border}</svg>`;
    }
    return `<svg x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" viewBox="0 0 ${r.w} ${r.h}" overflow="hidden"><rect width="${r.w}" height="${r.h}" fill="${p.bg || "#ffffff"}"/>${inner}${border}</svg>`;
  }

  function pageSvg(page, num) {
    let s = `<rect width="${PW}" height="${PH}" fill="${page.paper || C.PAPER}"/>`;
    if (page.full) {
      s += page.full(PW, PH);
      if (page.b) (typeof page.b === "function" ? page.b(PW, PH) : page.b).forEach((b) => (s += C.balloon(b)));
    } else {
      if (page.chapter) s += banner(page.chapter);
      const rects = layout(page);
      page.panels.forEach((p, i) => {
        if (rects[i]) s += panelSvg(p, rects[i]);
      });
    }
    if (num && !page.noNumber) s += C.text(PW / 2, PH - 18, String(num), { size: 18, font: "title", fill: "#6a6478" });
    return `<svg class="page-svg" viewBox="0 0 ${PW} ${PH}" role="img" aria-label="${C.esc(page.alt || (page.chapter ? "Chapter " + page.chapter.n + ": " + page.chapter.title : "Page " + num))}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  }

  // ---------- reader UI ----------
  const state = { view: "pages" };
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem("lexington-comic:" + key);
      localStorage.setItem("lexington-comic:" + key, val);
    } catch (e) {
      return null;
    }
  }

  function render() {
    const book = document.getElementById("book");
    const pages = C.STORY;
    let html = "";
    let num = 0;
    pages.forEach((pg, i) => {
      num++;
      const anchor = pg.chapter ? ` id="ch${pg.chapter.n}"` : i === 0 ? ' id="cover"' : "";
      if (state.view === "pages" || pg.full) {
        html += `<section class="page${pg.full ? " full" : ""}"${anchor} data-page="${num}">${pageSvg(pg, i === 0 ? 0 : num)}</section>`;
      } else {
        const rects = layout(pg);
        html += `<section class="strip"${anchor} data-page="${num}">`;
        if (pg.chapter) html += `<h2 class="strip-title"><span>Chapter ${pg.chapter.n}</span>${C.esc(pg.chapter.title)}</h2>`;
        pg.panels.forEach((p, j) => {
          const r = rects[j];
          if (r) html += `<figure class="panel">${panelSvg(p, r, true)}</figure>`;
        });
        html += `</section>`;
      }
    });
    book.innerHTML = C.defs() + html;
    book.dataset.view = state.view;
  }

  function buildJump() {
    const sel = document.getElementById("jump");
    if (!sel) return;
    let opts = `<option value="cover">Cover</option>`;
    C.STORY.forEach((pg) => {
      if (pg.chapter) opts += `<option value="ch${pg.chapter.n}">${pg.chapter.n}. ${C.esc(pg.chapter.title)}</option>`;
    });
    opts += `<option value="extras">Then &amp; Now + Checklist</option>`;
    sel.innerHTML = opts;
    sel.addEventListener("change", () => {
      const el = sel.value === "extras" ? document.querySelector("[data-extras]") || document.querySelector(".page:last-child") : document.getElementById(sel.value);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function buildLook() {
    const skinBox = document.getElementById("skin-swatches");
    const hairBox = document.getElementById("hair-swatches");
    if (!skinBox || !hairBox) return;
    const mk = (box, table, key, prop) => {
      box.innerHTML = Object.entries(table)
        .map(
          ([id, v]) =>
            `<button type="button" class="swatch" data-${key}="${id}" aria-pressed="${C.family[key] === id}" title="${v.label}" style="--sw:${v[prop]}"><span class="sr">${v.label}</span></button>`
        )
        .join("");
      box.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-" + key + "]");
        if (!b) return;
        C.family[key] = b.dataset[key];
        store(key, C.family[key]);
        box.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        const y = window.scrollY;
        render();
        window.scrollTo(0, y);
      });
    };
    mk(skinBox, C.SKINS, "skin", "skin");
    mk(hairBox, C.HAIRS, "hair", "hair");
  }

  function buildView() {
    const group = document.getElementById("view-toggle");
    if (!group) return;
    group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === state.view)));
    group.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-view]");
      if (!b || b.dataset.view === state.view) return;
      state.view = b.dataset.view;
      store("view", state.view);
      group.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    });
  }

  C.boot = function () {
    const params = new URLSearchParams(location.search);
    const skin = params.get("skin") || store("skin");
    const hair = params.get("hair") || store("hair");
    if (skin && C.SKINS[skin]) C.family.skin = skin;
    if (hair && C.HAIRS[hair]) C.family.hair = hair;
    const savedView = params.get("view") || store("view");
    state.view = savedView === "panels" || savedView === "pages" ? savedView : window.matchMedia("(max-width: 640px)").matches ? "panels" : "pages";
    if (params.has("print")) {
      state.view = "pages";
      document.documentElement.classList.add("print");
    }
    const go = () => {
      buildView();
      buildLook();
      buildJump();
      render();
      document.documentElement.classList.add("ready");
    };
    // Balloons are sized by measuring text, so the lettering fonts must be loaded first.
    let done = false;
    const once = () => {
      if (!done) {
        done = true;
        go();
      }
    };
    if (document.fonts && document.fonts.load) {
      Promise.all(
        ["700 20px 'Comic Neue'", "400 20px 'Comic Neue'", "20px 'Bangers'", "italic 500 20px 'Lora'", "500 20px 'Lora'", "20px 'Patrick Hand'"].map((f) =>
          document.fonts.load(f).catch(() => null)
        )
      ).then(once, once);
      setTimeout(once, 3500);
    } else once();
  };
  C.pageSvg = pageSvg;
  C.layout = layout;
})();
