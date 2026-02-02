// Scroll-Fortschrittsleiste (oben am Viewport)
//
// Ziel:
// - Layout schlank halten
// - Performance: requestAnimationFrame + passive listeners

function initScrollProgress(): void {
  const fill = document.getElementById("scrollProgressFill");
  const track = document.getElementById("scrollProgressWrap");
  if (!fill || !track) return;

  // Mehrfach-Initialisierungen vermeiden (z.B. bei View Transitions)
  if ((fill as HTMLElement).dataset.progressBound === "true") return;
  (fill as HTMLElement).dataset.progressBound = "true";

  let ticking = false;
  const doc = document.documentElement;

  const update = () => {
    ticking = false;

    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const y = window.pageYOffset ?? doc.scrollTop ?? 0;
    const p = Math.min(1, Math.max(0, y / max));

    // Breite statt Transform: robust gegenüber Stacking-/Transform-Kontexten
    (fill as HTMLElement).style.width = `${p * 100}%`;

    // Wenn die Seite nicht scrollt, Track leicht zurücknehmen (nicht komplett ausblenden)
    (track as HTMLElement).style.opacity = max <= 1 ? "0.65" : "1";
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // Initial
  update();
}

function init(): void {
  initScrollProgress();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

// Astro View Transitions: nach Seitenwechsel erneut initialisieren
document.addEventListener("astro:page-load", init);
