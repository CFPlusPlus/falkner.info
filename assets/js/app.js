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
      const count = data.players && typeof data.players.online === "number"
        ? ` • ${data.players.online} Spieler` : "";
      label.textContent = "Online" + count;
    } else {
      el.classList.remove("online");
      label.textContent = "Offline";
    }
  } catch {
    label.textContent = "Status unbekannt";
  }
})();

// --- Theme-Toggle (Light → Dark → Auto) ---
(() => {
  const KEY = "theme-choice"; // "light" | "dark" | "auto"
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const icon = btn ? btn.querySelector("i") : null;
  const order = ["light", "dark", "auto"];

  function setIcon(choice) {
    if (!icon) return;
    icon.className = "fa-solid " + (choice === "light" ? "fa-sun" : choice === "dark" ? "fa-moon" : "fa-circle-half-stroke");
  }
  function apply(choice) {
    if (choice === "light") root.setAttribute("data-theme", "light");
    else if (choice === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme"); // "auto" → System
  }
  function label(choice) {
    return choice === "auto" ? "Darstellung: Automatisch" :
           choice === "light" ? "Darstellung: Hell" : "Darstellung: Dunkel";
  }

  // Initial
  const saved = localStorage.getItem(KEY) || "auto";
  apply(saved);
  setIcon(saved);
  if (btn) {
    btn.setAttribute("aria-label", label(saved));
    btn.title = "Hell/Dunkel/Auto (" + saved + ")";
    btn.addEventListener("click", () => {
      const cur = localStorage.getItem(KEY) || "auto";
      const next = order[(order.indexOf(cur) + 1) % order.length];
      localStorage.setItem(KEY, next);
      apply(next);
      setIcon(next);
      btn.setAttribute("aria-label", label(next));
      btn.title = "Hell/Dunkel/Auto (" + next + ")";
    });
  }

  // Auf OS-Änderungen reagieren, wenn Auto aktiv
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const reactToSystem = () => {
    if ((localStorage.getItem(KEY) || "auto") === "auto") {
      apply("auto");
      setIcon("auto");
    }
  };
  mq.addEventListener ? mq.addEventListener("change", reactToSystem) : mq.addListener(reactToSystem);
})();

(function () {
    const light = '#fafaff';
    const dark  = '#1a0b2e';

    function ensureMeta() {
      let m = document.querySelector('meta[name="theme-color"][data-managed]');
      if (!m) {
        m = document.createElement('meta');
        m.name = 'theme-color';
        m.setAttribute('data-managed', 'true');
        document.head.appendChild(m);
      }
      return m;
    }
    function applyThemeColor() {
      const mode = document.documentElement.getAttribute('data-theme');
      const m = ensureMeta();
      m.content = mode === 'light' ? light : mode === 'dark' ? dark : (matchMedia('(prefers-color-scheme: dark)').matches ? dark : light);
    }
    // Initial
    applyThemeColor();
    // Re-apply on changes (z. B. wenn dein Toggle das Attribut setzt)
    const obs = new MutationObserver(applyThemeColor);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // Optional: auf Systemwechsel hören, falls "auto"
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyThemeColor);
  })();