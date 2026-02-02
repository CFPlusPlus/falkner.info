// Scroll-Fortschrittsleiste (oben am Viewport)
//
// Ziel:
// - Layout schlank halten
// - Performance: requestAnimationFrame + passive listeners

let controller: AbortController | null = null;

function setupScrollProgress(): void {
  const fill = document.getElementById("scrollProgressFill");
  const track = document.getElementById("scrollProgressWrap");
  if (!fill || !track) return;

  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  // Mehrfach-Initialisierungen vermeiden (z.B. bei View Transitions)
  // Hinweis: pro Element binden wir nur einmal, trotzdem aborten wir alte Listener zur Sicherheit.
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

  window.addEventListener("scroll", onScroll, { passive: true, signal });
  window.addEventListener("resize", onScroll, { passive: true, signal });

  // Initial
  update();
}

export function initScrollProgress(): void {
  setupScrollProgress();
}
