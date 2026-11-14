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
  isLocked?: () => boolean;
};

function getScrollLock(): ScrollLockApi | null {
  return window.__scrollLock ?? null;
}

let controller: AbortController | null = null;

export function initNavbar(): void {
  // Alte Listener entfernen (z.B. nach astro:page-load)
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  const btn = document.getElementById("menuBtn") as HTMLButtonElement | null;
  const menu = document.getElementById("mobileMenu") as HTMLElement | null;
  const dialog = document.getElementById("mobileMenuDialog");
  const overlay = document.getElementById("menuOverlay") as HTMLElement | null;
  const header = document.getElementById("siteHeader") as HTMLElement | null;

  if (!btn || !menu || !dialog) return;

  const scrollLock = getScrollLock();
  const lockScroll = () => scrollLock?.lock?.();
  const unlockScroll = () => scrollLock?.unlock?.();

  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  let isOpen = false;
  const inertElements: HTMLElement[] = [];

  const syncMenuOffset = () => {
    const top = header?.getBoundingClientRect().bottom ?? 0;
    menu.style.setProperty("--mobile-menu-top", `${top}px`);
  };

  const getFocusables = () => {
    return Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.getClientRects().length > 0 && !el.closest("[inert]"));
  };

  const trapTab = (e: KeyboardEvent) => {
    if (!isOpen || e.key !== "Tab") return;
    const focusables = getFocusables();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    const outside = !focusables.some((el) => el === active);

    if (e.shiftKey && (active === first || outside)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || outside)) {
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
    if (isOpen || window.getComputedStyle(btn).display === "none") return;
    isOpen = true;

    syncMenuOffset();

    menu.classList.remove("hidden");
    menu.setAttribute("aria-hidden", "false");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "mobileMenuTitle");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Menü schließen");

    // Bestehende Inert-Zustände beim Schließen beibehalten.
    Array.from(document.body.children).forEach((el) => {
      if (el instanceof HTMLElement && !el.contains(dialog) && !el.inert) {
        el.inert = true;
        inertElements.push(el);
      }
    });

    // Scroll-Lock (refcount, damit Lightbox & Menü nicht kollidieren)
    lockScroll();

    // Der Button liegt im Dialog; der erste Tab führt zum ersten Menülink.
    btn.focus({ preventScroll: true });

    window.addEventListener("keydown", onKey, { signal });
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;

    inertElements.forEach((el) => (el.inert = false));
    inertElements.length = 0;
    dialog.removeAttribute("role");
    dialog.removeAttribute("aria-modal");
    dialog.removeAttribute("aria-labelledby");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Menü öffnen");

    // Auf dem Desktop ist der Menübutton verborgen; dort den Startseitenlink fokussieren.
    const focusTarget =
      window.getComputedStyle(btn).display === "none"
        ? dialog.querySelector<HTMLAnchorElement>("a[href]")
        : btn;
    focusTarget?.focus({ preventScroll: true });

    menu.classList.add("hidden");
    menu.setAttribute("aria-hidden", "true");

    unlockScroll();
    window.removeEventListener("keydown", onKey);
  };

  syncMenuOffset();

  btn.addEventListener("click", () => (isOpen ? close() : open()), { signal });
  overlay?.addEventListener("click", close, { signal });
  window.addEventListener(
    "resize",
    () => {
      if (window.getComputedStyle(btn).display === "none") close();
      syncMenuOffset();
    },
    { signal },
  );
  signal.addEventListener("abort", close, { once: true });

  // Nach Klick auf einen Link schließen
  menu
    .querySelectorAll<HTMLElement>("[data-mobile-link]")
    .forEach((a) => a.addEventListener("click", close, { signal }));

  // --- Aktiven Abschnitt markieren (IntersectionObserver) ---
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"),
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
      if (match) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  };

  const obs = new IntersectionObserver(
    (entries) => {
      // Die sichtbarste Sektion gewinnt
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0),
        );

      const id = (visible[0]?.target as HTMLElement | undefined)?.id;
      if (id) setActive(id);
    },
    {
      root: null,
      rootMargin: "-20% 0px -65% 0px",
      threshold: prefersReduced ? 0.1 : [0.1, 0.2, 0.35, 0.5],
    },
  );

  sections.forEach((s) => obs.observe(s));
  signal.addEventListener("abort", () => obs.disconnect(), { once: true });
}
