// Scroll-Lock mit Referenzzählung.
//
// Problem:
// - Mehrere Overlays/Modals (z.B. Mobile-Menü + Lightbox) können parallel existieren.
// - Wenn jedes Overlay "body overflow" direkt setzt, entsperrt das zweite Overlay
//   ggf. den Scroll, obwohl das erste noch offen ist.
//
// Lösung:
// - Zentrale Zählung (refcount) auf window
// - body[data-scroll-lock="true"] steuert das CSS (siehe global.css)

declare global {
  interface Window {
    __scrollLockCount?: number;
  }
}

function setLocked(locked: boolean): void {
  if (locked) {
    document.body.setAttribute("data-scroll-lock", "true");
  } else {
    document.body.removeAttribute("data-scroll-lock");
  }
}

export function lockScroll(): void {
  if (typeof document === "undefined") return;
  const next = (window.__scrollLockCount ?? 0) + 1;
  window.__scrollLockCount = next;
  setLocked(true);
}

export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  const next = Math.max(0, (window.__scrollLockCount ?? 0) - 1);
  window.__scrollLockCount = next;
  if (next === 0) setLocked(false);
}

export function isScrollLocked(): boolean {
  return (window.__scrollLockCount ?? 0) > 0;
}

// Inline-Skripte in Astro-Komponenten können keine /src-Imports auflösen.
// Deshalb stellen wir eine kleine API auf window bereit.

if (typeof window !== "undefined") {
  window.__scrollLock = {
    lock: lockScroll,
    unlock: unlockScroll,
    isLocked: isScrollLocked,
  };
}
