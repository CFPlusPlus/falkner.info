// Lightbox-Galerie (mehrere pro Seite möglich)
//
// Ziel:
// - Inline-JS aus LightboxGallery.astro entfernen
// - Initialisierung zentral (client.ts)
// - Scroll-Lock über window.__scrollLock (Refcount)
//
// Cleanup:
// - AbortController sorgt dafür, dass Event-Listener bei Re-Init entfernt werden.

type ScrollLockApi = {
  lock: () => void;
  unlock: () => void;
};

function getScrollLock(): ScrollLockApi | null {
  return window.__scrollLock ?? null;
}

type GalleryItem = { src: string; alt: string; caption: string };

let controller: AbortController | null = null;

export function initLightboxes(): void {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  const scrollLock = getScrollLock();
  const lockScroll = () => scrollLock?.lock?.();
  const unlockScroll = () => scrollLock?.unlock?.();

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-lightbox-root]"),
  );

  roots.forEach((root) => {
    const label = root.getAttribute("data-lb-label") || "";

    const strip = root.querySelector<HTMLElement>("[data-lb-strip]");
    const modal = root.querySelector<HTMLDialogElement>("[data-lb-modal]");
    const imgEl = root.querySelector<HTMLImageElement>("[data-lb-img]");
    const capEl = root.querySelector<HTMLElement>("[data-lb-caption]");
    const capSubEl = root.querySelector<HTMLElement>("[data-lb-caption-sub]");
    const countEl = root.querySelector<HTMLElement>("[data-lb-count]");
    const btnClose = root.querySelector<HTMLButtonElement>("[data-lb-close]");
    const btnPrev = root.querySelector<HTMLButtonElement>("[data-lb-prev]");
    const btnNext = root.querySelector<HTMLButtonElement>("[data-lb-next]");
    const btnScrollLeft = root.querySelector<HTMLButtonElement>(
      "[data-lb-scroll-left]",
    );
    const btnScrollRight = root.querySelector<HTMLButtonElement>(
      "[data-lb-scroll-right]",
    );
    const overlay = modal?.querySelector<HTMLElement>("[data-lb-overlay]");

    if (
      !strip ||
      !modal ||
      !imgEl ||
      !capEl ||
      !capSubEl ||
      !countEl ||
      !btnClose ||
      !btnPrev ||
      !btnNext
    )
      return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-lb-open]"),
    );
    const data: GalleryItem[] = items.map((el) => ({
      src: el.getAttribute("data-src") || "",
      alt: el.getAttribute("data-alt") || "",
      caption: el.getAttribute("data-caption") || "",
    }));

    if (!data.length) return;

    let index = 0;
    let isOpen = false;
    let lastFocused: HTMLElement | null = null;

    const getFocusables = () =>
      Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );

    const set = (i: number) => {
      index = (i + data.length) % data.length;
      const cur = data[index];

      imgEl.src = cur.src;
      imgEl.alt = cur.alt;

      const title = (cur.caption || cur.alt || `Foto ${index + 1}`).trim();
      capEl.textContent = title;

      const sub = [label, `Foto ${index + 1} / ${data.length}`]
        .filter(Boolean)
        .join(" · ");
      capSubEl.textContent = sub;
      capSubEl.style.display = sub ? "" : "none";

      countEl.textContent = `${index + 1} / ${data.length}`;

      // Kleiner Preload für das nächste Bild
      const nxt = data[(index + 1) % data.length];
      if (nxt?.src) {
        const pre = new Image();
        pre.src = nxt.src;
      }
    };

    const finishClose = () => {
      if (!isOpen || modal.open) return;
      isOpen = false;
      unlockScroll();
      lastFocused?.focus({ preventScroll: true });
    };

    const close = () => {
      if (!isOpen) return;
      modal.close();
      finishClose();
    };

    const onKey = (e: KeyboardEvent) => {
      if (!modal.open) return;

      // Fokus im Modal halten
      if (e.key === "Tab") {
        const focusables = getFocusables();
        if (focusables.length) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement;

          if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
            return;
          }
          if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
            return;
          }
        }
      }

      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        set(index - 1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        set(index + 1);
      }
    };

    const open = (i: number) => {
      if (isOpen) return;
      lastFocused = items[i];
      set(i);
      modal.showModal();
      isOpen = true;
      lockScroll();
      btnClose.focus();
    };

    modal.addEventListener("keydown", onKey, { signal });
    modal.addEventListener("close", finishClose, { signal });
    modal.addEventListener(
      "cancel",
      (event) => {
        event.preventDefault();
        close();
      },
      { signal },
    );
    signal.addEventListener("abort", close, { once: true });

    items.forEach((el, i) =>
      el.addEventListener("click", () => open(i), { signal }),
    );

    btnClose.addEventListener("click", close, { signal });
    overlay?.addEventListener("click", close, { signal });

    btnPrev.addEventListener("click", () => set(index - 1), { signal });
    btnNext.addEventListener("click", () => set(index + 1), { signal });

    // Scroll-Buttons für die Leiste
    const scrollByAmount = (dir: number) => {
      const amount = Math.max(220, Math.floor(strip.clientWidth * 0.85));
      strip.scrollBy({ left: dir * amount, behavior: "smooth" });
    };
    btnScrollLeft?.addEventListener("click", () => scrollByAmount(-1), {
      signal,
    });
    btnScrollRight?.addEventListener("click", () => scrollByAmount(1), {
      signal,
    });
  });
}
