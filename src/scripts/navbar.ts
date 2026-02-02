// Navbar-Interaktionen (Mobile-Menü + Active-State)
//
// Ziel:
// - Kein Inline-JS in Komponenten
// - Initialisierung zentral (client.ts)
// - Robust bei Astro View Transitions (astro:page-load)
//
// Cleanup:
// - Wir nutzen AbortController, damit Event-Listener beim Re-Init sauber entfernt werden.

type ScrollLockApi = {
  lock: () => void;
  unlock: () => void;
  isLocked: () => boolean;
};

function getScrollLock(): ScrollLockApi | null {
  return (window as any).__scrollLock ?? null;
}

let controller: AbortController | null = null;

export function initNavbar(): void {
  // Alte Listener entfernen (z.B. nach astro:page-load)
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  const btn = document.getElementById("menuBtn") as HTMLButtonElement | null;
  const menu = document.getElementById("mobileMenu") as HTMLElement | null;
  const closeBtn = document.getElementById("menuClose") as HTMLButtonElement | null;
  const overlay = document.getElementById("menuOverlay") as HTMLElement | null;

  if (!btn || !menu) return;

  const scrollLock = getScrollLock();
  const lockScroll = () => scrollLock?.lock?.();
  const unlockScroll = () => scrollLock?.unlock?.();

  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  let isOpen = false;
  let lastFocused: Element | null = null;

  const getFocusables = () => {
    return Array.from(
      menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  };

  const trapTab = (e: KeyboardEvent) => {
    if (!isOpen || e.key !== "Tab") return;
    const focusables = getFocusables();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    trapTab(e);
  };

  const open = () => {
    if (isOpen) return;
    isOpen = true;

    lastFocused = document.activeElement;

    menu.classList.remove("hidden");
    menu.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Menü schließen");

    // Scroll-Lock (refcount, damit Lightbox & Menü nicht kollidieren)
    lockScroll();

    // Fokus sinnvoll setzen
    const focusables = getFocusables();
    (focusables.find((el) => el.id === "menuClose") ??
      focusables[0] ??
      menu).focus();

    window.addEventListener("keydown", onKey, { signal });
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;

    menu.classList.add("hidden");
    menu.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Menü öffnen");

    unlockScroll();
    window.removeEventListener("keydown", onKey);

    // Fokus wiederherstellen
    if (lastFocused && typeof (lastFocused as any).focus === "function") {
      (lastFocused as any).focus();
    }
  };

  btn.addEventListener("click", () => (isOpen ? close() : open()), { signal });
  closeBtn?.addEventListener("click", close, { signal });
  overlay?.addEventListener("click", close, { signal });

  // Nach Klick auf einen Link schließen
  menu
    .querySelectorAll<HTMLElement>("[data-mobile-link]")
    .forEach((a) => a.addEventListener("click", close, { signal }));

  // --- Aktiven Abschnitt markieren (IntersectionObserver) ---
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")
  );
  const sections = links
    .map((a) => a.getAttribute("data-target"))
    .filter(Boolean)
    .map((id) => (id ? document.getElementById(id) : null))
    .filter((el): el is HTMLElement => Boolean(el));

  if (!("IntersectionObserver" in window) || !sections.length) return;

  const setActive = (id: string) => {
    links.forEach((a) => {
      const match = a.getAttribute("data-target") === id;
      a.setAttribute("data-active", match ? "true" : "false");
      if (match) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };

  const obs = new IntersectionObserver(
    (entries) => {
      // Die sichtbarste Sektion gewinnt
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
        );

      const id = (visible[0]?.target as HTMLElement | undefined)?.id;
      if (id) setActive(id);
    },
    {
      root: null,
      rootMargin: "-20% 0px -65% 0px",
      threshold: prefersReduced ? 0.1 : [0.1, 0.2, 0.35, 0.5],
    }
  );

  sections.forEach((s) => obs.observe(s));
}
