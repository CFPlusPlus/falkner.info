// Minecraft Server Status (mcsrvstat.us API v3)
//
// Ziel:
// - Kein Inline-JS in MinecraftServerStatus.astro
// - DOM-Hooks via data-Attribute
// - Bei View Transitions: Intervalle sauber neu starten

type State = "online" | "offline" | "unknown";

let controller: AbortController | null = null;
let intervals: number[] = [];

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

  // Status-Farbe setzen (Tailwind-Klassen)
  dotEl.classList.remove("bg-emerald-500/80", "bg-red-500/80", "bg-border");
  if (state === "online") dotEl.classList.add("bg-emerald-500/80");
  else if (state === "offline") dotEl.classList.add("bg-red-500/80");
  else dotEl.classList.add("bg-border");

  valueEl.textContent = valueText;
  textEl.textContent = infoText;
}

function fmtPlayers(online: unknown, max: unknown): string {
  if (typeof online === "number" && typeof max === "number")
    return `${online}/${max}`;
  if (typeof online === "number") return String(online);
  return "–";
}

async function fetchStatus(root: HTMLElement, apiUrl: string): Promise<void> {
  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // API v3: "online" ist boolean. Wenn online, sind players.online/max verfügbar.
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

    setState(root, "unknown", "–", "nicht verfügbar");
  } catch {
    setState(root, "unknown", "–", "nicht verfügbar");
  }
}

export function initMinecraftStatus(): void {
  // Cleanup (Intervals + Listener)
  controller?.abort();
  controller = new AbortController();
  intervals.forEach((id) => window.clearInterval(id));
  intervals = [];

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-mc-status]"),
  );
  roots.forEach((root) => {
    const apiUrl = root.getAttribute("data-api-url");
    if (!apiUrl) return;

    // Initial laden
    fetchStatus(root, apiUrl);

    // Aktualisierung alle ~2 Minuten (mcsrvstat.us ist ohnehin gecached)
    const id = window.setInterval(() => fetchStatus(root, apiUrl), 120000);
    intervals.push(id);
  });
}
