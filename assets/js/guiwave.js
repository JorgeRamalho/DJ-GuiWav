(() => {
  "use strict";

  const CONSENT_KEY = "guiwave-consent-v1";
  const root = document.body.dataset.base || "./";

  function url(path) {
    return root + String(path || "").replace(/^\//, "");
  }

  const pages = [
    { href: url(""), id: "index", label: "Início" },
    { href: url("sobre/"), id: "sobre", label: "Artista" },
    { href: url("lp/"), id: "lp", label: "SINAL" },
    { href: url("agenda/"), id: "agenda", label: "Agenda" },
    { href: url("locais/"), id: "locais", label: "Casas" },
    { href: url("press-kit/"), id: "press-kit", label: "Press Kit" },
    { href: url("campanhas/"), id: "campanhas", label: "Campanhas" },
    { href: url("contato/"), id: "contato", label: "Booking" }
  ];

  const current = document.body.dataset.page || "";

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function renderChrome() {
    const header = $("#app-header");
    const footer = $("#app-footer");
    if (header) {
      header.innerHTML = `
        <header class="site-header" data-header>
          <nav class="nav" data-nav aria-label="Principal">
            <a class="brand" href="${url("")}">
              <img src="${url("assets/img/brand/logo.svg")}" alt="" width="38" height="38">
              <img class="brand-word" src="${url("assets/img/brand/wordmark.svg")}" alt="GUIWAVE">
            </a>
            <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu" data-toggle>
              <span></span><span class="sr-only">Abrir menu</span>
            </button>
            <ul class="nav-links" id="menu">
              ${pages.map((p) => `
                <li><a href="${p.href}" ${p.id === current ? 'aria-current="page"' : ""}>${p.label}</a></li>
              `).join("")}
            </ul>
          </nav>
        </header>`;
    }
    if (footer) {
      footer.innerHTML = `
        <footer class="site-footer">
          <div class="wrap footer-grid">
            <div>
              <p class="kicker">Curitiba · Frequência −25</p>
              <p>DJ GuiWave — Guilherme do Nascimento. Minimal e Tech House. CEO da WAV Fest. Vice-campeão da 3ª etapa do Circuito 2026.</p>
            </div>
            <div class="stack">
              <strong>Navegar</strong>
              <a href="${url("lp/")}">LP SINAL</a>
              <a href="${url("press-kit/")}">Press kit / EPKs</a>
              <a href="${url("campanhas/")}">Políticas de campanha</a>
              <a href="${url("contato/")}">Booking</a>
            </div>
            <div class="stack">
              <strong>Legal e redes</strong>
              <a href="${url("privacidade/")}">Privacidade, cookies e permissões</a>
              <button type="button" data-open-prefs>Preferências de cookies</button>
              <a href="https://www.instagram.com/gui_wav/" rel="noopener noreferrer">Instagram @gui_wav</a>
              <a href="https://soundcloud.com/guilherme-694223527" rel="noopener noreferrer">SoundCloud</a>
            </div>
          </div>
          <p class="wrap muted" style="margin-top:1.5rem">© ${new Date().getFullYear()} DJ GuiWave. Identidade e site para divulgação profissional em Curitiba.</p>
        </footer>`;
    }
  }

  function navBehavior() {
    const nav = $("[data-nav]");
    const toggle = $("[data-toggle]");
    const header = $("[data-header]");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    let lastY = 0;
    window.addEventListener("scroll", () => {
      if (!header) return;
      const y = window.scrollY;
      header.classList.toggle("is-hidden", y > 80 && y > lastY);
      lastY = y;
    }, { passive: true });
  }

  function defaultConsent() {
    return { necessary: true, analytics: false, marketing: false, embeds: false, updatedAt: null };
  }

  function readConsent() {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_KEY)) || null;
    } catch {
      return null;
    }
  }

  function writeConsent(data) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...data, necessary: true, updatedAt: new Date().toISOString() }));
    document.dispatchEvent(new CustomEvent("guiwave:consent", { detail: data }));
  }

  function renderConsent() {
    const root = $("#consent-root");
    if (!root) return;
    root.innerHTML = `
      <div class="consent-bar" data-banner role="dialog" aria-label="Aviso de cookies">
        <p>Este site usa cookies necessários para funcionar e, se você permitir, embeds de som, analytics e campanhas. <a href="${url("privacidade/")}">Política completa</a>.</p>
        <div class="row">
          <button class="btn btn-primary" type="button" data-accept-all>Aceitar tudo</button>
          <button class="btn btn-ghost" type="button" data-reject>Só essenciais</button>
          <button class="btn btn-ghost" type="button" data-open-prefs>Configurar</button>
        </div>
      </div>
      <div class="consent-modal" data-modal>
        <div class="consent-panel" role="dialog" aria-labelledby="pref-title">
          <h2 id="pref-title">Permissões, cookies e privacidade</h2>
          <p class="muted">Você controla o que o site pode carregar. Os essenciais não podem ser desligados.</p>
          <label class="switch"><span>Essenciais — navegação, segurança e preferências</span><input type="checkbox" checked disabled></label>
          <label class="switch"><span>Analytics — medir páginas e campanhas (desligado por padrão)</span><input type="checkbox" data-pref="analytics"></label>
          <label class="switch"><span>Marketing — pixels e remarketing de divulgação</span><input type="checkbox" data-pref="marketing"></label>
          <label class="switch"><span>Embeds — SoundCloud, Instagram e YouTube</span><input type="checkbox" data-pref="embeds"></label>
          <div class="row" style="margin-top:1rem">
            <button class="btn btn-primary" type="button" data-save-prefs>Salvar escolhas</button>
            <button class="btn btn-ghost" type="button" data-close-prefs>Fechar</button>
          </div>
        </div>
      </div>`;

    const banner = $("[data-banner]", root);
    const modal = $("[data-modal]", root);
    const saved = readConsent();
    if (!saved) banner.classList.add("is-open");
    syncPrefs(saved || defaultConsent());

    root.addEventListener("click", (event) => {
      const t = event.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.matches("[data-accept-all]")) {
        writeConsent({ necessary: true, analytics: true, marketing: true, embeds: true });
        banner.classList.remove("is-open");
        modal.classList.remove("is-open");
      }
      if (t.matches("[data-reject]")) {
        writeConsent(defaultConsent());
        banner.classList.remove("is-open");
        modal.classList.remove("is-open");
      }
      if (t.matches("[data-open-prefs]")) modal.classList.add("is-open");
      if (t.matches("[data-close-prefs]")) modal.classList.remove("is-open");
      if (t.matches("[data-save-prefs]")) {
        writeConsent(collectPrefs());
        banner.classList.remove("is-open");
        modal.classList.remove("is-open");
      }
    });

    document.addEventListener("click", (event) => {
      const t = event.target;
      if (t instanceof HTMLElement && t.matches("[data-open-prefs]")) {
        modal.classList.add("is-open");
      }
    });
  }

  function collectPrefs() {
    const get = (name) => Boolean(document.querySelector(`[data-pref="${name}"]`)?.checked);
    return { necessary: true, analytics: get("analytics"), marketing: get("marketing"), embeds: get("embeds") };
  }

  function syncPrefs(data) {
    ["analytics", "marketing", "embeds"].forEach((key) => {
      const el = document.querySelector(`[data-pref="${key}"]`);
      if (el) el.checked = Boolean(data[key]);
    });
  }

  function applyEmbeds() {
    const consent = readConsent();
    document.querySelectorAll("[data-embed]").forEach((slot) => {
      if (!(slot instanceof HTMLElement)) return;
      if (consent?.embeds) {
        slot.innerHTML = slot.dataset.embed || "";
      } else {
        slot.innerHTML = `<div class="embed-slot"><p>O player está bloqueado até você autorizar embeds nas preferências de cookies.</p><button class="btn btn-ghost" type="button" data-open-prefs>Liberar players</button></div>`;
      }
    });
  }

  function countdown() {
    const root = $("[data-countdown]");
    if (!root || !window.GUIWAVE) return;
    const target = new Date(window.GUIWAVE.lp.release).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff / 3600000) % 24;
      const m = Math.floor(diff / 60000) % 60;
      const s = Math.floor(diff / 1000) % 60;
      root.innerHTML = [
        ["Dias", d],
        ["Horas", h],
        ["Min", m],
        ["Seg", s]
      ].map(([label, n]) => `<b>${String(n).padStart(2, "0")}<span>${label}</span></b>`).join("");
    };
    tick();
    window.setInterval(tick, 1000);
  }

  function carousel() {
    const root = $("[data-carousel]");
    if (!root) return;

    const slides = [...root.querySelectorAll(".stage-slide")];
    const thumbs = [...root.querySelectorAll("[data-thumb]")];
    const count = $("[data-carousel-count]", root);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = 6500;
    let index = 0;
    let timer = 0;
    let touchX = 0;

    const paint = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      thumbs.forEach((thumb, i) => {
        const on = i === index;
        thumb.setAttribute("aria-current", on ? "true" : "false");
        thumb.style.animation = "none";
        void thumb.offsetWidth;
        thumb.style.animation = "";
      });
      if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      restart();
    };

    const restart = () => {
      window.clearTimeout(timer);
      if (!reduce) timer = window.setTimeout(() => paint(index + 1), hold);
    };

    root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => paint(index - 1));
    root.querySelector("[data-carousel-next]")?.addEventListener("click", () => paint(index + 1));
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => paint(Number(thumb.dataset.thumb)));
    });

    root.addEventListener("pointerdown", (event) => { touchX = event.clientX; });
    root.addEventListener("pointerup", (event) => {
      const delta = event.clientX - touchX;
      if (Math.abs(delta) > 50) paint(index + (delta < 0 ? 1 : -1));
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") paint(index + 1);
      if (event.key === "ArrowLeft") paint(index - 1);
    });
    root.tabIndex = 0;

    root.addEventListener("mouseenter", () => window.clearTimeout(timer));
    root.addEventListener("mouseleave", restart);

    paint(0);
  }

  function paintWave() {
    const canvas = $("[data-wave]");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.clearRect(0, 0, width, height);
      const colors = ["#ff2ec8", "#00e8ff", "#e8b84a"];
      colors.forEach((color, i) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 2;
        for (let x = 0; x <= width; x += 4) {
          const y = height / 2 + Math.sin((x + frame * (1.4 + i)) * 0.018 + i) * (28 + i * 10);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      if (!reduce) {
        frame += 1;
        requestAnimationFrame(draw);
      }
    };
    draw();
  }

  function renderLists() {
    const data = window.GUIWAVE;
    if (!data) return;
    const events = $("[data-events]");
    if (events) {
      events.innerHTML = data.events.map((event) => `
        <article class="event">
          <time datetime="${event.date}">${event.date}</time>
          <div>
            <h3>${event.title}</h3>
            <p class="muted">${event.venue} · ${event.city}</p>
          </div>
          <span class="tag ${event.status === "vice-campeao" || event.status === "classificado" ? "gold" : "wave"}">${event.status.replace("-", " ")}</span>
        </article>
      `).join("");
    }
    const venues = $("[data-venues]");
    if (venues) {
      venues.innerHTML = data.venues.map((venue) => `
        <article class="venue">
          <p class="kicker">${venue.area}</p>
          <h3>${venue.name}</h3>
          <p>${venue.note}</p>
          ${venue.address ? `<p class="muted">${venue.address}</p>` : ""}
          <p class="wave">${venue.fit}</p>
          <div class="row">
            ${venue.site ? `<a class="btn btn-ghost" href="${venue.site}" rel="noopener noreferrer">Site</a>` : ""}
            ${venue.instagram ? `<a class="btn btn-ghost" href="${venue.instagram}" rel="noopener noreferrer">Instagram</a>` : ""}
          </div>
        </article>
      `).join("");
    }
    const tracks = $("[data-tracks]");
    if (tracks) {
      tracks.innerHTML = data.lp.tracks.map((track) => `
        <article class="track">
          <b>${track.n}</b>
          <div><strong>${track.title}</strong><p class="muted">${track.note}</p></div>
          <span class="muted">${track.time}</span>
        </article>
      `).join("");
    }
  }

  function copyButtons() {
    document.addEventListener("click", async (event) => {
      const t = event.target;
      if (!(t instanceof HTMLElement) || !t.matches("[data-copy]")) return;
      const target = document.querySelector(t.dataset.copy || "");
      if (!target) return;
      await navigator.clipboard.writeText(target.textContent || "");
      t.textContent = "Copiado";
      window.setTimeout(() => { t.textContent = "Copiar"; }, 1600);
    });
  }

  function bookingForm() {
    const form = $("[data-booking]");
    const status = $("[data-form-status]");
    if (!form || !(form instanceof HTMLFormElement)) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const privacy = form.querySelector("[name='privacy']");
      if (privacy instanceof HTMLInputElement && !privacy.checked) {
        if (status) status.textContent = "Aceite a política de privacidade para enviar.";
        return;
      }
      const payload = new FormData(form);
      payload.set("form-name", "booking");
      try {
        await fetch(url(""), {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(payload).toString()
        });
        window.location.href = url("obrigado/");
      } catch {
        if (status) status.textContent = "Não foi possível enviar agora. Chame @gui_wav no Instagram.";
      }
    });
  }

  function lightbox() {
    const root = document.createElement("div");
    root.className = "lightbox";
    root.innerHTML = `<img alt=""><span class="sr-only">Fechar imagem</span>`;
    document.body.appendChild(root);
    const img = root.querySelector("img");

    document.addEventListener("click", (event) => {
      const shot = event.target;
      if (!(shot instanceof HTMLImageElement) || !shot.closest("[data-lightbox]")) return;
      if (!img) return;
      img.src = shot.currentSrc || shot.src;
      img.alt = shot.alt;
      root.classList.add("is-open");
    });

    root.addEventListener("click", () => root.classList.remove("is-open"));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") root.classList.remove("is-open");
    });
  }

  document.addEventListener("guiwave:consent", applyEmbeds);

  renderChrome();
  navBehavior();
  renderConsent();
  renderLists();
  countdown();
  carousel();
  paintWave();
  copyButtons();
  bookingForm();
  applyEmbeds();
  lightbox();
})();
