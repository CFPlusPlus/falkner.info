// Minecraft Server Status (mcsrvstat.us API v3)
//
// Ziele:
// - Kein Inline-JS in MinecraftServerStatus.astro
// - DOM-Hooks ueber data-Attribute
// - Lazy-Load nur bei Sichtbarkeit
// - Saubere Re-Initialisierung bei Astro View Transitions

type State = "online" | "offline" | "unknown";

const POLL_INTERVAL_MS = 300000;

let controller: AbortController | null = null;
let observer: IntersectionObserver | null = null;
let intervals = new Map<HTMLElement, number>();
let visibleRoots = new Set<HTMLElement>();

function setState(
  root: HTMLElement,
  state: State,
  valueText: string,
  infoText = "",
): void {
  const dotEl = root.querySelector<HTMLElement>("[data-mc-dot]");
  const valueEl = root.querySelector<HTMLElement>("[data-mc-value]");
  const textEl = root.querySelector<HTMLElement>("[data-mc-text]");
  if (!dotEl || !valueEl || !textEl) return;

  dotEl.classList.remove("bg-emerald-500/80", "bg-red-500/80", "bg-border");
  if (state === "online") dotEl.classList.add("bg-emerald-500/80");
  else if (state === "offline") dotEl.classList.add("bg-red-500/80");
  else dotEl.classList.add("bg-border");

  valueEl.textContent = valueText;
  textEl.textContent = infoText;
}

function fmtPlayers(online: unknown, max: unknown): string {
  if (typeof online === "number" && typeof max === "number") {
    return `${online}/${max}`;
  }
  if (typeof online === "number") return String(online);
  return "-";
}

async function fetchStatus(root: HTMLElement, apiUrl: string): Promise<void> {
  try {
    const res = await fetch(apiUrl, {
      cache: "force-cache",
      referrerPolicy: "no-referrer",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data?.online) {
      const online = data?.players?.online;
      const max = data?.players?.max;
      setState(root, "online", fmtPlayers(online, max), "online");
      return;
    }

    if (data?.online === false) {
      setState(root, "offline", "0", "offline");
      return;
    }

    setState(root, "unknown", "-", "nicht verfuegbar");
  } catch {
    setState(root, "unknown", "-", "nicht verfuegbar");
  }
}

function clearPolling(root: HTMLElement): void {
  const id = intervals.get(root);
  if (id === undefined) return;

  window.clearInterval(id);
  intervals.delete(root);
}

function startPolling(root: HTMLElement, apiUrl: string): void {
  if (intervals.has(root)) return;

  void fetchStatus(root, apiUrl);
  const id = window.setInterval(() => {
    void fetchStatus(root, apiUrl);
  }, POLL_INTERVAL_MS);
  intervals.set(root, id);
}

function clearAll(): void {
  controller?.abort();
  controller = null;
  observer?.disconnect();
  observer = null;

  intervals.forEach((id) => window.clearInterval(id));
  intervals = new Map<HTMLElement, number>();
  visibleRoots = new Set<HTMLElement>();
}

export function initMinecraftStatus(): void {
  clearAll();

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-mc-status]"),
  );
  if (roots.length === 0) return;

  controller = new AbortController();
  const { signal } = controller;

  if (!("IntersectionObserver" in window)) {
    roots.forEach((root) => {
      const apiUrl = root.getAttribute("data-api-url");
      if (!apiUrl) return;
      startPolling(root, apiUrl);
    });
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const root = entry.target;
        if (!(root instanceof HTMLElement)) return;

        const apiUrl = root.getAttribute("data-api-url");
        if (!apiUrl) return;

        if (entry.isIntersecting) {
          visibleRoots.add(root);
          startPolling(root, apiUrl);
        } else {
          visibleRoots.delete(root);
          clearPolling(root);
        }
      });
    },
    { threshold: 0.1 },
  );

  roots.forEach((root) => observer?.observe(root));

  // Optional: Polling pausieren/fortsetzen, wenn die Tab-Sichtbarkeit wechselt.
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        roots.forEach(clearPolling);
        return;
      }

      visibleRoots.forEach((root) => {
        const apiUrl = root.getAttribute("data-api-url");
        if (!apiUrl) return;
        startPolling(root, apiUrl);
      });
    },
    { signal },
  );
}
