// Minecraft Server Status (mcsrvstat.us API v3)
//
// Ziele:
// - Kein Inline-JS in MinecraftServerStatus.astro
// - DOM-Hooks ueber data-Attribute
// - Lazy-Load nur bei Sichtbarkeit
// - Laufende Abfragen und Listener bei erneuter Initialisierung aufräumen

type State = "online" | "offline" | "unknown";

const POLL_INTERVAL_MS = 300000;
const REQUEST_TIMEOUT_MS = 10000;

let controller: AbortController | null = null;
let observer: IntersectionObserver | null = null;
let intervals = new Map<HTMLElement, number>();
let visibleRoots = new Set<HTMLElement>();
const requests = new Map<HTMLElement, AbortController>();

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

  dotEl.classList.remove(
    "bg-emerald-500/80",
    "bg-red-500/80",
    "bg-border",
    "mc-dot-online",
  );
  if (state === "online") {
    dotEl.classList.add("bg-emerald-500/80", "mc-dot-online");
  } else if (state === "offline") dotEl.classList.add("bg-red-500/80");
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
  if (requests.has(root)) return;

  const request = new AbortController();
  requests.set(root, request);
  const timeout = window.setTimeout(() => request.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(apiUrl, {
      cache: "default",
      referrerPolicy: "no-referrer",
      signal: request.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Abgebrochene oder inzwischen ersetzte Anfragen dürfen den Status nicht überschreiben.
    if (request.signal.aborted || requests.get(root) !== request) return;

    if (data?.online === true) {
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
    // Absichtliches Pausieren erhält den bisherigen Status; Fehler und Timeouts werden angezeigt.
    if (requests.get(root) === request) {
      setState(root, "unknown", "-", "nicht verfuegbar");
    }
  } finally {
    window.clearTimeout(timeout);
    if (requests.get(root) === request) requests.delete(root);
  }
}

function clearPolling(root: HTMLElement): void {
  const id = intervals.get(root);
  if (id !== undefined) {
    window.clearInterval(id);
    intervals.delete(root);
  }

  const request = requests.get(root);
  requests.delete(root);
  request?.abort();
}

function startPolling(root: HTMLElement, apiUrl: string): void {
  if (document.hidden || intervals.has(root)) return;

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
  requests.forEach((request) => request.abort());
  requests.clear();
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
      visibleRoots.add(root);
      startPolling(root, apiUrl);
    });
  } else {
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
  }

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
