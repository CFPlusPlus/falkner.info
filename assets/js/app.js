// --- Jahreszahl ---
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

// --- Minecraft: Live-Status (mcsrvstat.us) ---
(async () => {
  const el = document.getElementById("serverStatus");
  if (!el) return;
  const label = el.querySelector(".label");
  try {
    const res = await fetch("https://api.mcsrvstat.us/2/minecraft-gilde.de", { cache: "no-store" });
    const data = await res.json();
    if (data && data.online === true) {
      el.classList.add("online");
      const count = data.players && typeof data.players.online === "number" ? ` • ${data.players.online} Spieler` : "";
      label.textContent = "Online" + count;
    } else {
      el.classList.remove("online");
      label.textContent = "Offline";
    }
  } catch {
    label.textContent = "Status unbekannt";
  }
})();

(function () {
  const light = "#fafaff";
  const dark = "#1a0b2e";

  function ensureMeta() {
    let m = document.querySelector('meta[name="theme-color"][data-managed]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "theme-color";
      m.setAttribute("data-managed", "true");
      document.head.appendChild(m);
    }
    return m;
  }
  function applyThemeColor() {
    const mode = document.documentElement.getAttribute("data-theme");
    const m = ensureMeta();
    m.content =
      mode === "light"
        ? light
        : mode === "dark"
          ? dark
          : matchMedia("(prefers-color-scheme: dark)").matches
            ? dark
            : light;
  }
  // Initial
  applyThemeColor();
  // Re-apply on changes (z. B. wenn dein Toggle das Attribut setzt)
  const obs = new MutationObserver(applyThemeColor);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  // Optional: auf Systemwechsel hören, falls "auto" (Safari-Fallback: addListener)
  const mql = matchMedia("(prefers-color-scheme: dark)");
  if (mql.addEventListener) mql.addEventListener("change", applyThemeColor);
  else if (mql.addListener) mql.addListener(applyThemeColor);
})();

(function () {
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menuToggle");
  const menuIcon = document.getElementById("menuIcon");
  const expander = document.getElementById("headerExpander");

  // Falls auf einer Seite kein Header existiert, nichts tun.
  if (!header || !menuToggle || !menuIcon || !expander) return;

  const desktopBtn = document.getElementById("themeToggle");
  const mobileBtn = document.getElementById("themeToggleMobile");

  // CSS-Breakpoint ist max-width: 880px (siehe site.css)
  const mobileMql = window.matchMedia ? window.matchMedia("(max-width: 880px)") : null;

  function setOpen(open, opts = {}) {
    const { focus = false } = opts;
    header.setAttribute("data-menu", open ? "open" : "closed");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    expander.setAttribute("aria-hidden", open ? "false" : "true");

    // NEU: fokussierbar nur wenn offen
    if (open) {
      expander.removeAttribute("inert");
    } else {
      expander.setAttribute("inert", "");
    }

    // Icon wechseln (Hamburger <-> X)
    if (open) {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-xmark");
      if (focus) {
        const first = expander.querySelector("a, button");
        first && first.focus({ preventScroll: true });
      }
    } else {
      menuIcon.classList.remove("fa-xmark");
      menuIcon.classList.add("fa-bars");
      // IMPORTANT: kein programmatic focus im Normalfall.
      // Sonst ist der Burger direkt nach Seitenaufruf fokussiert ("orange").
      focus && menuToggle.focus({ preventScroll: true });
    }
  }

  // Klick auf den Toggle
  menuToggle.addEventListener("click", () => {
    const isOpen = header.getAttribute("data-menu") === "open";
    // Beim Öffnen Fokus ins Menü (A11y). Beim Schließen keinen Fokus setzen.
    setOpen(!isOpen, { focus: !isOpen });
  });

  // Menü schließen, wenn Link geklickt
  expander.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setOpen(false, { focus: false });
  });

  // Bug 4: Klick außerhalb schließt das Menü
  const onOutside = (e) => {
    if (header.getAttribute("data-menu") !== "open") return;
    const t = e.target;
    if (menuToggle.contains(t) || expander.contains(t)) return;
    setOpen(false, { focus: false });
  };
  if (window.PointerEvent) {
    document.addEventListener("pointerdown", onOutside);
  } else {
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside, { passive: true });
  }

  // ESC schließt
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false, { focus: true });
  });

  // Bug 3: Wenn man von Mobile → Desktop resized, Menü sicher schließen
  const syncToViewport = () => {
    if (!mobileMql) return;
    if (!mobileMql.matches) setOpen(false, { focus: false });
  };
  if (mobileMql) {
    if (mobileMql.addEventListener) mobileMql.addEventListener("change", syncToViewport);
    else if (mobileMql.addListener) mobileMql.addListener(syncToViewport);
  }

  // Beim Laden sicherstellen, dass es wirklich zu ist (ohne Fokus)
  setOpen(false, { focus: false });
  syncToViewport();

  /* ---------- Theme-Logik mit Icon-Update ---------- */
  function readChoice() {
    try {
      return localStorage.getItem("theme-choice") || "auto";
    } catch {
      return "auto";
    }
  }
  function applyChoice(choice) {
    const root = document.documentElement;
    root.removeAttribute("data-theme");
    if (choice === "light") root.setAttribute("data-theme", "light");
    else if (choice === "dark") root.setAttribute("data-theme", "dark");
  }
  function setToggleIcon(button, choice) {
    if (!button) return;
    const i = button.querySelector("i");
    if (!i) return;
    i.classList.remove("fa-sun", "fa-moon", "fa-circle-half-stroke");
    if (choice === "light") i.classList.add("fa-sun");
    else if (choice === "dark") i.classList.add("fa-moon");
    else i.classList.add("fa-circle-half-stroke"); // auto
  }
  function cycleChoice() {
    const order = ["light", "dark", "auto"];
    const current = readChoice();
    const next = order[(order.indexOf(current) + 1) % order.length];
    try {
      localStorage.setItem("theme-choice", next);
    } catch {}
    applyChoice(next);
    setToggleIcon(desktopBtn, next);
    setToggleIcon(mobileBtn, next);
    const t = `Modus: ${next === "auto" ? "System" : next}`;
    desktopBtn && (desktopBtn.title = t);
    mobileBtn && (mobileBtn.title = t);
  }

  desktopBtn && desktopBtn.addEventListener("click", cycleChoice);
  mobileBtn && mobileBtn.addEventListener("click", cycleChoice);

  const initialChoice = readChoice();
  applyChoice(initialChoice);
  setToggleIcon(desktopBtn, initialChoice);
  setToggleIcon(mobileBtn, initialChoice);
})();

// Scroll-to-Top
(function () {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;

  // Sichtbarkeit steuern (sanft, performant)
  let ticking = false;
  const toggleBtn = () => {
    const show = window.scrollY > 600; // Schwelle nach Geschmack anpassen
    btn.classList.toggle("scrolltop--visible", show);
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(toggleBtn);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Smooth nach oben scrollen (mit Rücksicht auf reduzierte Bewegung)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  btn.addEventListener("click", () => {
    if (prefersReduced) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
})();

const header = document.querySelector("header.site-header");
if (header) {
  const observer = new MutationObserver(() => {
    const open = header.getAttribute("data-menu") === "open";
    document.getElementById("scrollTop")?.classList.toggle("scrolltop--visible", !open && window.scrollY > 600);
  });
  observer.observe(header, { attributes: true, attributeFilter: ["data-menu"] });
}

(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getHeaderOffset() {
    const header = document.querySelector('header');
    return header ? Math.ceil(header.getBoundingClientRect().height) : 0;
  }

  function smoothScrollTo(targetEl) {
    const offset = getHeaderOffset();
    const top = targetEl.getBoundingClientRect().top + window.scrollY - offset - 8; // kleine Luft
    window.scrollTo({
      top,
      behavior: prefersReduced ? 'auto' : 'smooth'
    });
    // A11y: Fokus setzen ohne erneut zu scrollen
    if (!targetEl.hasAttribute('tabindex')) targetEl.setAttribute('tabindex', '-1');
    targetEl.focus({ preventScroll: true });
  }

  // Klicks auf In-Page-Anker abfangen
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = decodeURIComponent(a.hash || '').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    e.preventDefault();
    smoothScrollTo(target);
    // Hash in der URL aktualisieren (für Back-Button & Reload)
    history.pushState(null, '', a.hash);
  });

  // Beim Laden: vorhandenen Hash korrekt mit Offset ansteuern
  window.addEventListener('load', () => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash).slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) {
      // kurz warten, bis Layout/Fonts stehen
      setTimeout(() => smoothScrollTo(target), 0);
    }
  });
})();

;