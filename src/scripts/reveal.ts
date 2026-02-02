// Scroll-Reveal + Copy-to-Clipboard (globale UI-Helfer)
//
// Ziel:
// - Große Inline-Skripte aus dem Layout herausziehen
// - Logik zentral halten und bei Astro View Transitions sauber neu initialisieren

function initReveal(): void {
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // --- Scroll-Reveal (IntersectionObserver) ---
  const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
  if (!els.length) return;

  // Bereits sichtbare Elemente nicht erneut anfassen
  const targets = els.filter((el) => !el.classList.contains("is-in") && el.dataset.revealBound !== "true");

  if (!prefersReduced && "IntersectionObserver" in window && targets.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement;
            t.classList.add("is-in");
            obs.unobserve(t);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    targets.forEach((el) => {
      el.dataset.revealBound = "true";
      obs.observe(el);
    });
  } else {
    // Fallback: ohne IO / bei Reduced Motion sofort anzeigen
    els.forEach((el) => el.classList.add("is-in"));
  }
}

function initClipboard(): void {
  const copyBtn = document.querySelector<HTMLElement>("[data-copy]");
  const status = document.querySelector<HTMLElement>("[data-copy-status]");
  if (!copyBtn || !status) return;

  // Mehrfach-Bindings verhindern (z.B. bei View Transitions)
  if (copyBtn.dataset.copyBound === "true") return;
  copyBtn.dataset.copyBound = "true";

  copyBtn.addEventListener("click", async () => {
    const value = copyBtn.getAttribute("data-copy-value") || "";
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = "Kopiert.";
      copyBtn.setAttribute("data-copied", "true");
      window.setTimeout(() => copyBtn.removeAttribute("data-copied"), 1200);
    } catch {
      status.textContent = "Konnte nicht kopieren — bitte manuell markieren.";
    }
    window.setTimeout(() => (status.textContent = ""), 1600);
  });
}

function init(): void {
  initReveal();
  initClipboard();
}


export function initGlobalUI(): void {
  initReveal();
  initClipboard();
}
