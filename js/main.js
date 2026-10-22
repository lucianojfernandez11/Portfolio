/* =====================================================================
   Lógica del portfolio: renderiza el contenido de js/data.js y maneja
   navegación, animaciones, filtros y microinteracciones.
   Sin dependencias. Funciona abriendo index.html directamente.
   ===================================================================== */
/* ---------- Pantalla de carga ----------
   Avanza con el progreso real de la página (fuentes, estilos) pero dura
   al menos MIN_MS para que se lea, y nunca más de MAX_MS.
   Se puede saltar con clic o con Escape, y repetir con window.replayIntro().
   Avisa con el evento "loader:done" para que el inicio arranque sus animaciones. */
(function () {
  "use strict";
  const root = document.documentElement;
  const loader = document.querySelector("[data-loader]");
  if (!loader) return;

  const MIN_MS = 3300; // duración mínima de la barra (antes 1900)
  const MAX_MS = 7000;
  const pctEl = loader.querySelector("[data-loader-pct]");
  const msgEl = loader.querySelector("[data-loader-msg]");
  const draw = loader.querySelector("[data-loader-draw]");
  const STEPS = [
    [0, "Conectando"],
    [28, "Cargando proyectos"],
    [56, "Compilando estilos"],
    [84, "Casi listo"],
  ];

  let pageReady = document.readyState === "complete";
  window.addEventListener("load", () => { pageReady = true; }, { once: true });

  let run = 0;          // identifica la reproducción actual
  let active = false;
  let closeCurrent = () => {};

  const render = (p, closing) => {
    loader.style.setProperty("--p", (p / 100).toFixed(4));
    if (draw) draw.style.strokeDashoffset = String(100 - p);
    pctEl.textContent = String(Math.floor(p)).padStart(3, "0");
    if (closing) return;
    const step = STEPS.filter(([at]) => p >= at).pop();
    if (step && msgEl.textContent !== step[1]) msgEl.textContent = step[1];
  };

  const play = () => {
    const id = ++run;
    active = true;
    const start = performance.now();
    let shown = 0;
    let closing = false;
    loader.classList.remove("is-done", "is-leaving");
    render(0);

    const close = () => {
      if (closing || id !== run) return;
      closing = true;
      render(100, true);
      loader.classList.add("is-done");
      msgEl.textContent = "200 OK · Bienvenido";
      try { sessionStorage.setItem("lf-loaded", "1"); } catch (e) {}
      setTimeout(() => {
        if (id !== run) return;
        loader.classList.add("is-leaving");
        setTimeout(() => {
          if (id !== run) return;
          active = false;
          root.classList.remove("is-loading");
          loader.classList.remove("is-leaving");
          document.dispatchEvent(new Event("loader:done"));
        }, 1000);
      }, 900);
    };
    closeCurrent = close;

    const tick = (now) => {
      if (closing || id !== run) return;
      const t = now - start;
      // Curva suave hacia el 100% en MIN_MS; se frena en 92% si la página aún no terminó
      const timeP = Math.min(t / MIN_MS, 1);
      const eased = 1 - Math.pow(1 - timeP, 2.2);
      const cap = pageReady || t > MAX_MS ? 100 : 92;
      const target = Math.min(eased * 100, cap);
      shown += (target - shown) * 0.18;
      if (target - shown < 0.3) shown = target;
      render(shown);
      if (shown >= 100) close();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  loader.addEventListener("click", () => closeCurrent());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && active) closeCurrent(); });

  // Repetir la intro sin recargar (botón del pie de página)
  window.replayIntro = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    // Reinicia las animaciones de entrada del inicio
    document.querySelectorAll(".hero-intro > *, .hero-copy > *, .cube-scene").forEach((el) => {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    });
    root.classList.add("is-loading");
    play();
  };

  if (root.classList.contains("is-loading")) play();
})();

(function () {
  "use strict";

  const DATA = window.PORTFOLIO;
  if (!DATA) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Utilidades de texto ---------- */
  const escapeHTML = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const isPlaceholder = (s) => typeof s === "string" && s.includes("[COMPLETAR");

  // Devuelve HTML escapado; si es un dato temporal, lo marca visualmente.
  const txt = (s) =>
    isPlaceholder(s)
      ? `<span class="ph" title="Dato temporal: reemplazalo en js/data.js">${escapeHTML(s)}</span>`
      : escapeHTML(s);

  const hasUrl = (u) => typeof u === "string" && u.trim() !== "" && u.trim() !== "#";

  const getPath = (obj, path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);

  const ICONS = {
    github: '<svg class="icon icon-gh" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
    arrow: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    code: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5"/></svg>',
    id: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M14 10h4M14 13h3"/></svg>',
    at: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/></svg>',
    link: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
  };

  /* ---------- Render: datos simples con data-bind ---------- */
  $$("[data-bind]").forEach((el) => {
    el.innerHTML = txt(getPath(DATA, el.dataset.bind));
  });

  /* ---------- Render: sobre mí ---------- */
  $("[data-about]").innerHTML = DATA.about.paragraphs.map((p) => `<p>${txt(p)}</p>`).join("");
  $("[data-about-lead]").innerHTML = txt(DATA.about.lead || "");

  // Foto de perfil (sólo si está cargada en data.js)
  if (hasUrl(DATA.about.photo)) {
    const fig = $("[data-about-photo]");
    const img = $("[data-about-photo-img]");
    img.src = DATA.about.photo;
    img.alt = DATA.about.photoAlt || `${DATA.person.name} ${DATA.person.surname}`;
    fig.hidden = false;
  }

  // Tarjetas destacadas de "Sobre mí"
  const BADGE_ICONS = {
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
  };
  $("[data-badges]").innerHTML = (DATA.about.badges || [])
    .map((b) => {
      const num = typeof b.value === "number"
        ? `<span class="badge-num"><span class="mono-num">${escapeHTML(b.prefix || "")}<span data-count="${b.value}">${b.value}</span>${escapeHTML(b.suffix || "")}</span></span> `
        : "";
      return `
      <li class="badge">
        <span class="badge-icon"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${BADGE_ICONS[b.icon] || BADGE_ICONS.check}</svg></span>
        <span class="badge-text">
          <strong>${num}${txt(b.title)}</strong>
          ${b.text ? `<span>${txt(b.text)}</span>` : ""}
        </span>
      </li>`;
    })
    .join("");

  // Los números cuentan desde 0 cuando las tarjetas aparecen en pantalla
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const counters = $$("[data-count]");
    counters.forEach((c) => (c.textContent = "0"));
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        const el = en.target, end = Number(el.dataset.count), t0 = performance.now(), dur = 1400;
        const step = (now) => {
          const k = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }
  $("[data-facts]").innerHTML = DATA.about.facts
    .map((f) => `<div class="fact"><dt>${txt(f.label)}</dt><dd>${txt(f.value)}</dd></div>`)
    .join("");

  /* ---------- Render: proyectos ---------- */
  // Portada geométrica determinística a partir del nombre (sin imágenes externas)
  const hash = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const initials = (name) =>
    String(name).replace(/\[COMPLETAR:?\s*|\]/g, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase();

  const projectCard = (p, i) => {
    const h = hash(p.name + i);
    const hue = [142, 128, 160, 38][h % 4]; // verdes y un ámbar
    let cover;
    if (hasUrl(p.image)) {
      cover = `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.imageAlt || `Captura de ${p.name}`)}" loading="lazy" decoding="async">`;
    } else {
      cover = `<div class="cover-gen" data-initials="${escapeHTML(initials(p.name) || "P")}" style="--h:${hue};--cx:${40 + (h % 40)}%;--cy:${20 + (h % 50)}%" aria-hidden="true">
           <span class="cover-shape s1"></span><span class="cover-shape s2"></span>
         </div>`;
    }

    const extLink = (url, label) =>
      `<a class="plink" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}${ICONS.arrow}<span class="sr-only"> de ${escapeHTML(p.name)} (abre en una pestaña nueva)</span></a>`;
    let links = "";
    if (hasUrl(p.demo)) links += extLink(p.demo, p.demoLabel || "Ver demo");
    if (hasUrl(p.repo)) links += extLink(p.repo, "Código");
    if (!links) {
      links = `${p.privateNote ? `<span class="plink-note mono">${txt(p.privateNote)}</span>` : ""}
        <a class="plink" href="#contacto">Pedir una demo<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>`;
    }

    const hl = (p.highlights || []).length
      ? `<ul class="project-highlights">${p.highlights.map((x) => `<li>${txt(x)}</li>`).join("")}</ul>`
      : "";

    return `
      <article class="project${p.featured ? " is-featured" : ""}" data-tags="${escapeHTML(JSON.stringify(p.tags || []))}">
        <div class="cover">
          ${cover}
          ${p.featured ? '<span class="project-badge"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>Proyecto principal</span>' : ""}
        </div>
        <div class="project-body">
          <div class="project-meta">
            ${p.kind ? `<span class="project-kind mono">${txt(p.kind)}</span>` : ""}
            ${p.status ? `<span class="project-status"><b></b>${txt(p.status)}</span>` : ""}
          </div>
          <h3 class="project-title">${txt(p.name)}</h3>
          <p class="project-desc">${txt(p.description)}</p>
          ${hl}
          ${p.team ? `<p class="project-team mono">${txt(p.team)}</p>` : ""}
          <ul class="tags" aria-label="Tecnologías">${(p.tags || []).map((t) => `<li class="tag">${txt(t)}</li>`).join("")}</ul>
          <div class="project-links">${links}</div>
        </div>
      </article>`;
  };

  // El proyecto principal va primero
  DATA.projects.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const projectsEl = $("[data-projects]");
  projectsEl.innerHTML = DATA.projects.length
    ? DATA.projects.map(projectCard).join("")
    : '<p class="empty">Pronto vas a encontrar proyectos acá.</p>';

  /* ---------- Filtros por tecnología ---------- */
  const filtersEl = $("[data-filters]");
  const allTags = [...new Set(DATA.projects.flatMap((p) => p.tags || []))].filter((t) => !isPlaceholder(t));
  if (allTags.length > 1) {
    const btn = (value, label, pressed) =>
      `<button class="filter" type="button" data-filter="${escapeHTML(value)}" aria-pressed="${pressed}">${escapeHTML(label)}</button>`;
    filtersEl.innerHTML = btn("*", "Todos", true) + allTags.map((t) => btn(t, t, false)).join("");

    filtersEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      const value = b.dataset.filter;
      $$("[data-filter]", filtersEl).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      let visible = 0;
      $$(".project", projectsEl).forEach((card) => {
        const show = value === "*" || JSON.parse(card.dataset.tags).includes(value);
        card.hidden = !show;
        if (show) visible++;
      });
      $("[data-filter-status]").textContent =
        value === "*" ? `Mostrando los ${visible} proyectos` : `${visible} proyecto${visible === 1 ? "" : "s"} con ${value}`;
    });
  } else {
    filtersEl.remove();
  }

  // Efecto de luz que sigue al cursor en las tarjetas
  projectsEl.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".project");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  /* ---------- Render: experiencia y habilidades ---------- */
  $("[data-timeline]").innerHTML = DATA.timeline
    .map(
      (t) => `
      <li class="tl-item">
        <p class="tl-meta"><span class="tl-type">${txt(t.type)}</span><span>${txt(t.period)}</span></p>
        <h4 class="tl-title">${txt(t.title)}</h4>
        <p class="tl-place">${txt(t.place)}</p>
        ${t.description ? `<p class="tl-desc">${txt(t.description)}</p>` : ""}
      </li>`
    )
    .join("");

  $("[data-skills]").innerHTML = DATA.skills
    .map(
      (g) => `
      <div class="stack-group">
        <h4>${txt(g.group)}</h4>
        <ul class="chips">${g.items.map((s) => `<li class="chip">${txt(s)}</li>`).join("")}</ul>
      </div>`
    )
    .join("");

  /* ---------- Render: disponibilidad y compromisos del inicio ---------- */
  const P0 = DATA.person;
  const chip = $("[data-status-chip]");
  if (P0.available) {
    $("[data-availability]").innerHTML = txt(P0.availabilityText || "Disponible");
  } else {
    chip.classList.add("is-unavailable");
    $("[data-availability]").remove();
    $(".chip-sep", chip).remove();
  }
  $("[data-promises]").innerHTML = (P0.promises || []).map((p) => `<li>${txt(p)}</li>`).join("");

  /* ---------- Render: especialidades ---------- */
  const SPEC_ICONS = {
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/>',
    atom: '<ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.2"/>',
    server: '<rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><path d="M8 7h.01M8 17h.01M12 7h4M12 17h4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
  };
  $("[data-specialties]").innerHTML = (DATA.specialties || [])
    .map(
      (s) => `
      <li class="spec">
        <span class="spec-icon"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${SPEC_ICONS[s.icon] || SPEC_ICONS.spark}</svg></span>
        <span class="spec-text">
          <span class="spec-title">${txt(s.title)}${s.tech ? ` <span class="spec-tech">${txt(s.tech)}</span>` : ""}</span>
          <span class="spec-desc">${txt(s.text)}</span>
        </span>
      </li>`
    )
    .join("");

  // Botón "Ver la intro de nuevo" del pie de página
  const replayIntroBtn = $("[data-replay-intro]");
  if (reduceMotion.matches || typeof window.replayIntro !== "function") replayIntroBtn.hidden = true;
  else replayIntroBtn.addEventListener("click", () => window.replayIntro());

  /* ---------- Render: servicios y motivos ---------- */
  const SERVICE_ICONS = {
    layout: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>',
    app: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/></svg>',
    plug: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7V3M15 7V3M6 7h12v4a6 6 0 0 1-12 0zM12 17v4"/></svg>',
    wrench: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5 5l-8.4 8.4a2.1 2.1 0 0 1-3-3z"/><path d="M14.7 6.3 17 4l3 3-2.3 2.3"/></svg>',
  };
  const services = DATA.services || [];
  $("[data-services]").innerHTML = services
    .map(
      (s) => `
      <article class="service">
        <span class="service-icon">${SERVICE_ICONS[s.icon] || ICONS.code}</span>
        <h3 class="service-title">${txt(s.title)}</h3>
        <p class="service-pitch">${txt(s.pitch)}</p>
        ${s.ideal ? `<p class="service-ideal">Ideal para: ${txt(s.ideal)}</p>` : ""}
        <ul class="service-list">${(s.includes || []).map((i) => `<li>${txt(i)}</li>`).join("")}</ul>
        <a class="service-cta" href="#contacto" data-pick-service="${escapeHTML(s.id)}">
          Consultar por esto
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </article>`
    )
    .join("");

  $("[data-reasons]").innerHTML = (DATA.reasons || [])
    .map((r) => `<li class="reason"><h4>${txt(r.title)}</h4><p>${txt(r.text)}</p></li>`)
    .join("");

  /* ---------- Render: proceso ---------- */
  $("[data-process]").innerHTML = (DATA.process || [])
    .map((s) => `<li class="step"><h3>${txt(s.title)}</h3><p>${txt(s.text)}</p></li>`)
    .join("");

  /* ---------- Render: testimonios (sólo si hay) ---------- */
  const testimonials = DATA.testimonials || [];
  if (testimonials.length) {
    $("[data-testimonials]").innerHTML = testimonials
      .map(
        (t) => `
        <figure class="testimonial">
          <blockquote><p>${txt(t.quote)}</p></blockquote>
          <figcaption><strong>${txt(t.name)}</strong>${t.role ? `<span>${txt(t.role)}</span>` : ""}</figcaption>
        </figure>`
      )
      .join("");
    $("[data-testimonials-section]").hidden = false;
  }

  /* ---------- Render: preguntas frecuentes ---------- */
  $("[data-faq]").innerHTML = (DATA.faq || [])
    .map((f, i) => `
      <details class="faq-item"${i === 0 ? " open" : ""}>
        <summary>${txt(f.q)}</summary>
        <p class="faq-answer">${txt(f.a)}</p>
      </details>`)
    .join("");

  /* ---------- Render: contacto ---------- */
  const gmailCompose = ({ to, subject = "", body = "" }) =>
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(to)}` +
    (subject ? `&su=${encodeURIComponent(subject)}` : "") +
    (body ? `&body=${encodeURIComponent(body)}` : "");

  const email = DATA.contact.email;
  const emailLink = $("[data-email-link]");
  emailLink.innerHTML = txt(email);
  if (isPlaceholder(email)) {
    emailLink.removeAttribute("href");
    emailLink.setAttribute("aria-disabled", "true");
  } else {
    // Se abre Gmail en una pestaña nueva en lugar de un enlace mailto:.
    // mailto: depende de que el dispositivo tenga una app de correo y, si no
    // la encuentra (o el navegador lo bloquea), deja la página en blanco.
    emailLink.href = gmailCompose({ to: email });
    emailLink.target = "_blank";
    emailLink.rel = "noopener noreferrer";
    emailLink.setAttribute("aria-label", `Escribir a ${email} por Gmail (abre en una pestaña nueva)`);
  }

  $("[data-socials]").innerHTML = DATA.contact.links
    .map((l) => {
      const inner = `
        <span class="social-icon">${ICONS[l.icon] || ICONS.link}</span>
        <span class="social-text"><span class="social-label">${txt(l.label)}</span><span class="social-handle">${txt(l.handle)}</span></span>`;
      return hasUrl(l.url)
        ? `<li><a class="social" href="${escapeHTML(l.url)}" target="_blank" rel="noopener noreferrer">${inner}<span class="social-arrow">${ICONS.arrow}</span><span class="sr-only"> (abre en una pestaña nueva)</span></a></li>`
        : `<li><div class="social is-pending">${inner}<span class="social-handle">pendiente</span></div></li>`;
    })
    .join("");

  // Copiar email con confirmación
  const toastEl = $("[data-toast]");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
  };

  $("[data-copy-email]").addEventListener("click", async () => {
    if (isPlaceholder(email)) return toast("Primero completá tu email en js/data.js");
    try {
      await navigator.clipboard.writeText(email);
      toast("Email copiado");
    } catch {
      // Respaldo: seleccionar el texto para copiarlo a mano
      const range = document.createRange();
      range.selectNodeContents(emailLink);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      toast("Email seleccionado: presioná Ctrl+C para copiarlo");
    }
  });

  /* ---------- Armador de consultas ----------
     No hay servidor: el formulario arma el mensaje y lo abre en el
     programa de email o en WhatsApp de quien visita, listo para enviar. */
  const brief = $("[data-brief]");
  const C = DATA.contact;
  const plain = (s) => String(s).replace(/\[COMPLETAR:?\s*|\]/g, "").trim();

  const choice = (name, value, label, checked) => `
    <label class="choice">
      <input type="radio" name="${name}" value="${escapeHTML(value)}"${checked ? " checked" : ""}>
      <span>${escapeHTML(label)}</span>
    </label>`;
  $("[data-brief-services]").innerHTML =
    services.map((s) => choice("service", s.id, plain(s.title), false)).join("") +
    choice("service", "otro", "Otra cosa / no estoy seguro", false);
  $("[data-brief-timelines]").innerHTML = (C.timelines || [])
    .map((t, i) => choice("timeline", t, t, i === 1))
    .join("");

  const whatsapp = String(C.whatsapp || "").replace(/\D/g, "");
  if (whatsapp) $("[data-whatsapp-btn]").hidden = false;

  // Botón flotante "Hablemos": abre WhatsApp directo con un mensaje ya escrito
  if (whatsapp) {
    const fab = $("[data-float-cta]");
    const msg = C.whatsappMessage || `Hola ${P0.name}, vi tu portfolio y me gustaría hacerte una consulta.`;
    fab.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
    fab.target = "_blank";
    fab.rel = "noopener noreferrer";
    fab.setAttribute("aria-label", "Hablemos por WhatsApp (abre en una pestaña nueva)");
    fab.classList.add("is-whatsapp");
    $("[data-float-wa-icon]").removeAttribute("hidden");
  }

  const fields = {
    name: $("#brief-name"),
    company: $("#brief-company"),
    idea: $("#brief-idea"),
  };

  const readBrief = () => {
    const sId = brief.querySelector('input[name="service"]:checked')?.value;
    const service = sId === "otro" ? "Otra cosa / no estoy seguro" : plain(services.find((s) => s.id === sId)?.title || "");
    return {
      service,
      timeline: brief.querySelector('input[name="timeline"]:checked')?.value || "",
      name: fields.name.value.trim(),
      company: fields.company.value.trim(),
      idea: fields.idea.value.trim(),
    };
  };

  const composeBrief = (b) => {
    const lines = [
      `Hola ${P0.name}, te escribo desde tu portfolio.`,
      "",
      b.service && `Necesito: ${b.service}`,
      b.timeline && `Plazo: ${b.timeline}`,
      b.company && `Empresa o proyecto: ${b.company}`,
      "",
      b.idea || "(acá va tu idea)",
      "",
      b.name ? `Saludos, ${b.name}` : "",
    ];
    return lines.filter((l) => l !== false && l !== undefined).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  };
  const subjectFor = (b) => `Consulta: ${b.service || "nuevo proyecto"}${b.name ? ` · ${b.name}` : ""}`;

  const preview = $("[data-brief-preview]");
  const ideaCount = $("[data-idea-count]");
  const errorEl = $("[data-brief-error]");
  const updatePreview = () => {
    const b = readBrief();
    preview.textContent = composeBrief(b);
    ideaCount.textContent = fields.idea.value.length;
  };
  brief.addEventListener("input", (e) => {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) {
      e.target.removeAttribute("aria-invalid");
    }
    if (errorEl.textContent && !$('[aria-invalid="true"]', brief)) errorEl.textContent = "";
    updatePreview();
  });
  brief.addEventListener("change", updatePreview);
  updatePreview();

  const validate = () => {
    const missing = [];
    ["name", "idea"].forEach((k) => {
      const ok = fields[k].value.trim() !== "";
      fields[k].setAttribute("aria-invalid", String(!ok));
      if (!ok) missing.push(k === "name" ? "tu nombre" : "una breve descripción de la idea");
    });
    if (!missing.length) return true;
    errorEl.textContent = `Para enviar la consulta falta ${missing.join(" y ")}.`;
    fields[missing[0] === "tu nombre" ? "name" : "idea"].focus();
    return false;
  };

  brief.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    const b = readBrief();
    const body = composeBrief(b);
    const via = e.submitter?.dataset.send || "email";

    if (via === "whatsapp" && whatsapp) {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(body)}`, "_blank", "noopener");
      toast("Abriendo WhatsApp con tu mensaje");
      return;
    }
    if (isPlaceholder(email)) {
      toast("Falta configurar el email en js/data.js");
      return;
    }
    // Gmail en una pestaña nueva, con asunto y mensaje ya escritos
    const url = gmailCompose({ to: email, subject: subjectFor(b), body });
    const win = window.open(url, "_blank", "noopener");
    if (!win) {
      // Si el navegador bloquea la ventana, se copia el mensaje para no perderlo
      navigator.clipboard?.writeText(body).catch(() => {});
      toast("Mensaje copiado. Pegalo en un email a " + email);
      return;
    }
    toast("Abriendo Gmail con tu mensaje listo");
  });

  $("[data-copy-brief]").addEventListener("click", async () => {
    const text = composeBrief(readBrief());
    try {
      await navigator.clipboard.writeText(text);
      toast("Mensaje copiado. Pegalo donde prefieras");
    } catch {
      const details = $(".brief-preview");
      details.open = true;
      const range = document.createRange();
      range.selectNodeContents(preview);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      toast("Mensaje seleccionado: presioná Ctrl+C para copiarlo");
    }
  });

  // "Consultar por esto" en cada servicio: preselecciona el servicio en el formulario
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-pick-service]");
    if (!link) return;
    const input = brief.querySelector(`input[name="service"][value="${CSS.escape(link.dataset.pickService)}"]`);
    if (input) {
      input.checked = true;
      updatePreview();
      // Después del scroll, llevar el foco al primer campo vacío
      setTimeout(() => (fields.name.value ? fields.idea : fields.name).focus({ preventScroll: true }), reduceMotion.matches ? 0 : 600);
    }
  });

  // Efecto de luz en las tarjetas de servicios
  $("[data-services]").addEventListener("pointermove", (e) => {
    const card = e.target.closest(".service");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  /* ---------- Franja "Hablemos" ----------
     Duplica el grupo para que el bucle no tenga cortes, ajusta la duración
     a una velocidad constante y arranca con una palabra centrada. */
  const marquee = $("[data-marquee]");
  if (marquee && !reduceMotion.matches) {
    const track = $("[data-marquee-track]", marquee);
    const group = $("[data-marquee-group]", marquee);
    const base = group.innerHTML;
    const SPEED = 90; // píxeles por segundo
    const setup = () => {
      // El grupo tiene que ser más ancho que la pantalla para no dejar huecos
      group.innerHTML = base;
      while (group.scrollWidth < marquee.clientWidth * 1.1) group.insertAdjacentHTML("beforeend", base);
      $$("[data-marquee-clone]", track).forEach((n) => n.remove());
      const clone = group.cloneNode(true);
      clone.removeAttribute("data-marquee-group");
      clone.setAttribute("data-marquee-clone", "");
      track.appendChild(clone);

      const half = group.offsetWidth;
      const dur = half / SPEED;
      // Desfase inicial: la primera palabra arranca centrada en la franja
      const first = group.firstElementChild;
      const center = marquee.clientWidth / 2;
      const shift = (((first.offsetLeft + first.offsetWidth / 2 - center) % half) + half) % half;
      marquee.style.setProperty("--dur", `${dur.toFixed(2)}s`);
      marquee.style.setProperty("--delay", `${(-shift / SPEED).toFixed(2)}s`);
      // Reinicia la animación con los valores nuevos
      track.style.animation = "none";
      void track.offsetWidth;
      track.style.animation = "";
    };
    // Esperar a las fuentes para medir el ancho real de las palabras
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(setup);
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(setup, 200); });
  }

  /* ---------- Botón flotante de contacto ----------
     Aparece después del inicio y se oculta cuando el contacto está a la vista. */
  const floatCta = $("[data-float-cta]");
  if ("IntersectionObserver" in window) {
    let heroVisible = true, contactVisible = false;
    const sync = () => {
      // Con WhatsApp el botón sigue visible también en la sección de contacto
      const show = !heroVisible && (!contactVisible || floatCta.classList.contains("is-whatsapp"));
      floatCta.classList.toggle("is-visible", show);
      // Oculto también para teclado y lectores cuando no se ve
      floatCta.tabIndex = show ? 0 : -1;
      floatCta.setAttribute("aria-hidden", String(!show));
    };
    sync();
    new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; sync(); }, { threshold: 0.15 }).observe($("#inicio"));
    new IntersectionObserver(([en]) => { contactVisible = en.isIntersecting; sync(); }, { threshold: 0.1 }).observe($("#contacto"));
  }

  // Accesos directos a GitHub (menú y pie): toman el enlace de contact.links
  const gh = (DATA.contact.links || []).find((l) => l.icon === "github" && hasUrl(l.url));
  $$("[data-github-link]").forEach((a) => {
    if (gh) a.href = gh.url;
    else a.hidden = true;
  });

  $("[data-year]").textContent = new Date().getFullYear();

  /* ---------- Panel de respuesta HTTP (inicio) ---------- */
  const term = $("[data-terminal]");
  const P = DATA.person;
  const stack = DATA.skills.flatMap((g) => g.items).filter((s) => !isPlaceholder(s)).slice(0, 3);
  const q = (s) => `<span class="t-str">"${escapeHTML(s)}"</span>`;
  const k = (s) => `<span class="t-key">"${s}"</span><span class="t-pun">:</span> `;
  const c = '<span class="t-pun">,</span>';
  const lines = [
    `<span class="t-dim">›</span> <span class="t-method">GET</span> /perfil`,
    `<span class="t-dim">‹</span> <span class="t-ok">200 OK</span> <span class="t-dim">· application/json</span>`,
    "",
    `<span class="t-pun">{</span>`,
    `  ${k("nombre")}${q(`${P.name} ${P.surname}`)}${c}`,
    `  ${k("rol")}${q(P.role)}${c}`,
    `  ${k("base")}${q("Tucumán, AR")}${c}`,
    `  ${k("coords")}${q(P.coords)}${c}`,
    stack.length
      ? `  ${k("stack")}<span class="t-pun">[</span>${stack.map(q).join(`${c} `)}<span class="t-pun">]</span>${c}`
      : `  ${k("stack")}<span class="t-pun">[</span><span class="t-dim"> /* completar en data.js */ </span><span class="t-pun">]</span>${c}`,
    `  ${k("disponible")}<span class="t-ok">${P.available ? "true" : "false"}</span>${c}`,
    `  ${k("modalidad")}${q("freelance · remoto")}${c}`,
    `  ${k("contacto")}${q("#contacto")}`,
    `<span class="t-pun">}</span>`,
  ];
  const cursor = '<span class="t-cursor"></span>';
  const requestText = "GET /perfil";

  let termRun = 0;
  const playTerminal = () => {
    const run = ++termRun;
    if (reduceMotion.matches) {
      term.innerHTML = lines.join("\n") + "\n" + cursor;
      return;
    }
    let i = 0;
    const typeRequest = () => {
      if (run !== termRun) return;
      const typed = requestText.slice(0, i);
      const [m, ...rest] = typed.split(" ");
      term.innerHTML = `<span class="t-dim">›</span> <span class="t-method">${m}</span>${rest.length ? " " + rest.join(" ") : ""}${cursor}`;
      if (i++ < requestText.length) setTimeout(typeRequest, 45);
      else setTimeout(() => showLine(1), 260);
    };
    const showLine = (n) => {
      if (run !== termRun) return;
      term.innerHTML = lines.slice(0, n + 1).join("\n") + (n + 1 >= lines.length ? "\n" + cursor : cursor);
      if (n + 1 < lines.length) setTimeout(() => showLine(n + 1), n === 1 ? 220 : 70);
    };
    typeRequest();
  };
  // Si está la pantalla de carga, el panel se escribe recién cuando termina
  document.addEventListener("loader:done", playTerminal);
  if (!document.documentElement.classList.contains("is-loading")) playTerminal();
  $("[data-replay]").addEventListener("click", playTerminal);

  /* ---------- Cubo 3D del inicio ----------
     - Con mouse: se inclina siguiendo al cursor dentro del inicio.
     - Arrastrando (mouse o dedo): gira libremente, con inercia al soltar.
     - Teclado: flechas para girar, Enter o Espacio para volver a la posición inicial.
     Sólo anima mientras hay movimiento; en reposo no consume nada. */
  const cube = $("[data-cube]");
  if (cube) {
    // Minimapa de código de los laterales (patrón fijo, no aleatorio)
    const pattern = [62, 40, 78, 30, 55, 0, 70, 48, 85, 36, 0, 66, 44, 72, 28, 58, 0, 80, 50, 34, 68, 0, 46, 74, 38];
    const kinds = ["a", "", "", "w", "", "", "a", "", "", "", "", "w", "", "a", "", "", "", "", "a", "", "w", "", "", "", "a"];
    $$("[data-minimap]", cube).forEach((mm) => {
      mm.innerHTML = pattern
        .map((w, i) => (w ? `<i class="${kinds[i]}" style="width:${w}%"></i>` : '<i style="opacity:0"></i>'))
        .join("");
    });

    const scene = $("[data-cube-scene]");
    const hint = $("[data-cube-hint]");
    const heroEl = $("#inicio");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const BASE = { x: -10, y: -24 };
    const cur = { x: BASE.x, y: BASE.y };       // ángulo dibujado
    const spin = { x: 0, y: 0 };                // giro acumulado por arrastre/teclado
    const tilt = { x: 0, y: 0 };                // inclinación por el cursor
    const vel = { x: 0, y: 0 };                 // inercia
    let dragging = false, last = null, raf = 0, hinted = false;

    const clampX = (v) => Math.max(-70, Math.min(70, v));
    const hideHint = () => { if (!hinted) { hinted = true; hint.classList.add("is-gone"); } };

    const frame = () => {
      raf = 0;
      if (!dragging && (Math.abs(vel.x) > 0.02 || Math.abs(vel.y) > 0.02)) {
        spin.y += vel.y; spin.x = clampX(spin.x + vel.x);
        vel.x *= 0.94; vel.y *= 0.94;
      }
      const tx = clampX(BASE.x + spin.x + tilt.x);
      const ty = BASE.y + spin.y + tilt.y;
      const k = reduceMotion.matches ? 1 : 0.14;
      cur.x += (tx - cur.x) * k;
      cur.y += (ty - cur.y) * k;
      cube.style.setProperty("--rx", `${cur.x.toFixed(2)}deg`);
      cube.style.setProperty("--ry", `${cur.y.toFixed(2)}deg`);
      const moving = Math.abs(tx - cur.x) > 0.05 || Math.abs(ty - cur.y) > 0.05 || Math.abs(vel.x) > 0.02 || Math.abs(vel.y) > 0.02;
      if (moving || dragging) schedule();
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(frame); };

    // Inclinación siguiendo al cursor en todo el inicio
    heroEl.addEventListener("pointermove", (e) => {
      if (dragging || reduceMotion.matches || !fine.matches) return;
      const r = scene.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      tilt.y = Math.max(-1, Math.min(1, nx)) * 22;
      tilt.x = Math.max(-1, Math.min(1, ny)) * -14;
      schedule();
    });
    heroEl.addEventListener("pointerleave", () => { tilt.x = 0; tilt.y = 0; schedule(); });

    // Arrastre
    cube.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      dragging = true;
      last = { x: e.clientX, y: e.clientY, t: performance.now() };
      vel.x = vel.y = 0;
      cube.classList.add("is-dragging");
      cube.setPointerCapture(e.pointerId);
      hideHint();
      schedule();
    });
    cube.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      // En pantallas táctiles sólo gira en horizontal para no trabar el scroll
      const vy = e.pointerType === "touch" ? 0 : -dy * 0.35;
      spin.y += dx * 0.45;
      spin.x = clampX(spin.x + vy);
      vel.y = dx * 0.45; vel.x = vy;
      last = { x: e.clientX, y: e.clientY, t: performance.now() };
      schedule();
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      cube.classList.remove("is-dragging");
      if (reduceMotion.matches) { vel.x = vel.y = 0; }
      schedule();
    };
    cube.addEventListener("pointerup", endDrag);
    cube.addEventListener("pointercancel", endDrag);

    // Teclado
    cube.addEventListener("keydown", (e) => {
      const step = 15;
      const map = { ArrowLeft: [0, -step], ArrowRight: [0, step], ArrowUp: [step, 0], ArrowDown: [-step, 0] };
      if (map[e.key]) {
        e.preventDefault();
        spin.x = clampX(spin.x + map[e.key][0]);
        spin.y += map[e.key][1];
        hideHint();
        schedule();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Vuelve a la vuelta más cercana a la posición inicial
        spin.y = Math.round(spin.y / 360) * 360;
        spin.x = 0;
        schedule();
      }
    });
    // Doble clic: volver al frente
    cube.addEventListener("dblclick", () => {
      spin.y = Math.round(spin.y / 360) * 360; spin.x = 0; vel.x = vel.y = 0; schedule();
    });

    // Celular y tablet (sin cursor): el cubo se balancea solo mientras se ve,
    // así se aprecia el 3D sin tocarlo. Se pausa al arrastrarlo.
    if (!fine.matches) hint.lastChild.textContent = " Deslizá para girar";
    if (!fine.matches && !reduceMotion.matches && "IntersectionObserver" in window) {
      let idleRaf = 0;
      const idle = (now) => {
        if (!dragging) {
          tilt.y = Math.sin(now / 1800) * 20;
          tilt.x = Math.sin(now / 2400) * 6;
          schedule();
        }
        idleRaf = requestAnimationFrame(idle);
      };
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !idleRaf) idleRaf = requestAnimationFrame(idle);
        else if (!en.isIntersecting && idleRaf) { cancelAnimationFrame(idleRaf); idleRaf = 0; }
      }).observe(scene);
    }

    schedule();
  }

  /* ---------- Grilla de puntos del fondo (todo el sitio) ---------- */
  const canvas = $("[data-grid]");
  const ctx = canvas.getContext && canvas.getContext("2d");
  if (ctx) {
    // El canvas cubre la pantalla y queda fijo detrás de todo el sitio.
    // - El brillo sigue al cursor en cualquier sección (con un leve retardo suave).
    // - Al hacer scroll la grilla se desplaza más lento que el contenido (parallax).
    // Sólo se redibuja cuando algo cambia: no hay un bucle permanente.
    const GAP = 28;
    const RADIUS = 190;
    const PARALLAX = 0.35;
    const GREEN = "61,255,134";
    const BASE = "160,215,180";
    let w = 0, h = 0, dpr = 1, frame = 0;
    let target = null;           // posición real del cursor
    let glow = null;             // posición suavizada del brillo
    let strength = 0;            // intensidad del brillo (aparece/desaparece)
    let offset = 0;              // desplazamiento por scroll

    const motionOK = () => !reduceMotion.matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const draw = () => {
      frame = 0;
      let again = false;

      // Suavizado del brillo hacia el cursor
      if (target) {
        if (!glow) glow = { ...target };
        glow.x += (target.x - glow.x) * 0.22;
        glow.y += (target.y - glow.y) * 0.22;
        if (Math.abs(target.x - glow.x) + Math.abs(target.y - glow.y) > 0.5) again = true;
      }
      const goal = target ? 1 : 0;
      strength += (goal - strength) * 0.15;
      if (Math.abs(goal - strength) > 0.01) again = true; else strength = goal;

      ctx.clearRect(0, 0, w, h);
      const shift = motionOK() ? -((offset * PARALLAX) % GAP) : 0;
      for (let x = GAP / 2; x < w; x += GAP) {
        for (let y = GAP / 2 + shift; y < h + GAP; y += GAP) {
          let a = 0.09, r = 1;
          if (glow && strength > 0) {
            const d = Math.hypot(x - glow.x, y - glow.y);
            if (d < RADIUS) {
              const t = (1 - d / RADIUS) * strength;
              a += t * t * 0.75;
              r += t * 1.3;
            }
          }
          ctx.fillStyle = a > 0.14 ? `rgba(${GREEN},${a})` : `rgba(${BASE},${a})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (again) schedule();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    };
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("pointermove", (e) => {
      if (!motionOK() || !finePointer.matches) return;
      target = { x: e.clientX, y: e.clientY };
      schedule();
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => { target = null; schedule(); });
    window.addEventListener("blur", () => { target = null; schedule(); });

    window.addEventListener("scroll", () => {
      offset = window.scrollY;
      if (motionOK()) schedule();
    }, { passive: true });
  }

  /* ---------- Header y navegación ---------- */
  const header = $("[data-header]");
  const progressBar = $("[data-header-progress]");
  let scrollRaf = 0;
  const onScroll = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      // Barra de progreso de lectura debajo del menú
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    });
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  const toggle = $("[data-nav-toggle]");
  const menu = $("[data-nav-menu]");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? "Cerrar menú" : "Abrir menú";
    menu.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("is-open") && !e.target.closest(".nav")) setMenu(false);
  });

  // Indicador deslizante de la cápsula: va al link señalado o, si no hay, al de la sección visible
  const navLinks = $$(".nav-link");
  const pill = $("[data-nav-pill]");
  const indicator = $("[data-nav-indicator]");
  const moveIndicator = (link) => {
    if (!link || !pill.offsetParent || getComputedStyle(indicator).display === "none") {
      indicator.classList.remove("is-on");
      return;
    }
    const pr = pill.getBoundingClientRect();
    const lr = link.getBoundingClientRect();
    indicator.style.width = `${lr.width}px`;
    indicator.style.transform = `translateX(${lr.left - pr.left - 1}px)`;
    indicator.classList.add("is-on");
  };
  const currentLink = () => navLinks.find((a) => a.getAttribute("aria-current") === "true");
  let hovering = null;
  navLinks.forEach((a) => {
    a.addEventListener("pointerenter", () => { hovering = a; moveIndicator(a); });
    a.addEventListener("focus", () => moveIndicator(a));
    a.addEventListener("blur", () => moveIndicator(hovering || currentLink()));
  });
  pill.addEventListener("pointerleave", () => { hovering = null; moveIndicator(currentLink()); });
  window.addEventListener("resize", () => moveIndicator(hovering || currentLink()));
  if (document.fonts) document.fonts.ready.then(() => moveIndicator(hovering || currentLink()));

  // Resaltar la sección visible en el menú (las secciones sin link lo apagan)
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          navLinks.forEach((a) => {
            if (a.getAttribute("href") === `#${en.target.id}`) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
          if (!hovering) moveIndicator(currentLink());
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("main > section, main > aside").forEach((s) => spy.observe(s));
  }

  /* ---------- Efectos de "hover" en pantallas táctiles ----------
     Sin cursor no hay hover: en celular, la tarjeta que pasa por el centro
     de la pantalla se activa sola (franja de carga, panel verde, brillo). */
  if (window.matchMedia("(hover: none)").matches && !reduceMotion.matches && "IntersectionObserver" in window) {
    const touchIo = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.target.classList.toggle("is-active", en.isIntersecting)),
      { rootMargin: "-47% 0px -47% 0px" }
    );
    $$(".spec, .service, .project, .badge, .step, .stack-group").forEach((el) => touchIo.observe(el));
  }

  /* ---------- Aparición al desplazarse ---------- */
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const targets = $$(".section-head, .about-text, .facts, .badge, .spec, .service, .reason, .project, .cta-band-inner, .step, .tl-item, .stack-group, .testimonial, .faq-item, .contact-side, .brief");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((el) => {
      // Sólo se animan los que empiezan fuera de pantalla
      if (el.getBoundingClientRect().top > window.innerHeight) {
        const siblings = Array.from(el.parentElement.children);
        el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
        el.classList.add("reveal-armed");
        io.observe(el);
      }
    });
  }

  /* ---------- Aviso de datos temporales ---------- */
  const phCount = $$(".ph").length;
  const notice = $("[data-ph-notice]");
  let dismissed = false;
  try { dismissed = sessionStorage.getItem("ph-notice-closed") === "1"; } catch {}
  if (DATA.config && DATA.config.showPlaceholderNotice && phCount > 0 && !dismissed) {
    notice.innerHTML = `
      <p><strong>${phCount} datos temporales</strong> marcados con subrayado punteado. Reemplazalos en <code>js/data.js</code>.</p>
      <button class="ph-close" type="button" aria-label="Cerrar aviso">×</button>`;
    notice.hidden = false;
    notice.querySelector(".ph-close").addEventListener("click", () => {
      notice.hidden = true;
      try { sessionStorage.setItem("ph-notice-closed", "1"); } catch {}
    });
  }
})();
