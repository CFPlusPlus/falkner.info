import type { ImageMetadata } from "astro";

import pc1 from "../assets/gallery/pc/pc-1.webp";
import pc2 from "../assets/gallery/pc/pc-2.webp";
import pc3 from "../assets/gallery/pc/pc-3.webp";
import pc4 from "../assets/gallery/pc/pc-4.webp";
import pc5 from "../assets/gallery/pc/pc-5.webp";

import tour1 from "../assets/gallery/touren/tour-1.webp";
import tour2 from "../assets/gallery/touren/tour-2.webp";
import tour3 from "../assets/gallery/touren/tour-3.webp";
import tour4 from "../assets/gallery/touren/tour-4.webp";
import tour5 from "../assets/gallery/touren/tour-5.webp";

export const site = {
  domain: "falkner.info",
  canonicalBase: "https://falkner.info",
  repositoryUrl: "https://github.com/CFPlusPlus/falkner.info",
  title: "Christian Falkner – falkner.info",
  description:
    "Persönliche Seite von Christian Falkner – Links, Projekte und ein paar Einblicke.",
  author: "Christian Falkner",
  email: "webmaster@falkner.info",
  minecraft: {
    serverAddress: "minecraft-gilde.de",
  },
} as const;

export type SocialLink = {
  label: string;
  href: string;
};

export const socialLinks: readonly SocialLink[] = [
  { label: "Discord", href: "https://discord.minecraft-gilde.de/" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/christian-falkner-60a45537b/",
  },
  { label: "GitHub", href: "https://github.com/CFPlusPlus" },
  { label: "Steam", href: "https://steamcommunity.com/id/lestructor" },
  {
    label: "Xbox",
    href: "https://account.xbox.com/de-DE/Profile?gamerTag=QuickChrissi",
  },
];

// SEO-clean: Für JSON-LD "sameAs" bitte nur echte, öffentliche Profil-URLs verwenden.
// Discord-Invites, Xbox/Steam-Profile oder Tracking-Links sind für "sameAs" meist eher Rauschen.
// Hier halten wir es bewusst minimal (GitHub + LinkedIn).
const SAME_AS_ALLOWLIST = [
  "github.com",
  "linkedin.com",
  "www.linkedin.com",
] as const;

function normalizeSameAsUrl(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl);
    if (u.protocol !== "https:") return null;

    const host = u.hostname.toLowerCase();
    const allowed = SAME_AS_ALLOWLIST.some(
      (d) => host === d || host.endsWith(`.${d}`),
    );
    if (!allowed) return null;

    // Query/Hash entfernen (Tracking), Pfad sauber halten
    u.search = "";
    u.hash = "";

    // Trailing Slash entfernen (außer Root)
    if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, "");

    return u.toString();
  } catch {
    return null;
  }
}

export const sameAsLinks = socialLinks
  .filter((l) => l.label === "GitHub" || l.label === "LinkedIn")
  .map((l) => normalizeSameAsUrl(l.href))
  .filter((v): v is string => Boolean(v));

export type Project = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  meta?: string;
};

export const spotlightProject: Project = {
  title: "Minecraft Gilde",
  summary:
    "Ein entspannter deutscher Vanilla-SMP-Server ohne Whitelist – mein Herzensprojekt, bei dem ich Server und Website betreue und immer wieder an Details feile.",
  tags: ["Vanilla SMP", "Community", "minecraft-gilde.de"],
  href: "https://minecraft-gilde.de",
  meta: "Herzensprojekt",
};

export const projects: Project[] = [
  {
    title: "Diese Seite",
    summary:
      "Du bist gerade hier. Ich halte die Seite bewusst schlank – als Startpunkt für Links, Projekte und ein bisschen Kontext.",
    tags: ["Personal", "Astro", "Tailwind"],
    meta: "Du bist hier",
  },
  {
    title: "ANTI-CORONA-KARTELL",
    summary:
      "Eine Community aus Freunden – online entstanden, geblieben wegen Humor, Gesprächen und gemeinsamen Abenden.",
    tags: ["Community", "Gaming"],
    href: "https://www.anti-corona-kartell.de/",
    meta: "Freunde & Community",
  },
  {
    title: "PC Builds – Galerie",
    summary:
      "Eine kleine Sammlung meiner Builds und Kühlungs-Setups – von Luftkühlung bis zu Custom-Wasserkühlung.",
    tags: ["Hardware", "Galerie"],
    href: "#pc-builds",
    meta: "Bilder",
  },
];

export type GalleryImage = {
  /** Importiertes Asset (für astro:assets <Image />) */
  asset: ImageMetadata;
  /** Praktische URL (z. B. für Lightbox/JS). Entspricht i. d. R. asset.src */
  src: string;
  alt: string;
  caption?: string;
};

function galleryImage(
  asset: ImageMetadata,
  alt: string,
  caption?: string,
): GalleryImage {
  return { asset, src: asset.src, alt, caption };
}

// Galerie-Bilder:
// Lege deine Fotos unter `src/assets/gallery/...` ab und importiere sie oben.
// Vorteil: Astro kann daraus optimierte Varianten (z. B. AVIF/WebP + responsive Größen) generieren.
export const pcBuildPhotos: GalleryImage[] = [
  galleryImage(
    pc1,
    "Hauptrechner (2023)",
    "Specs: CPU: Core i5 13600K, GPU: RTX 3090, RAM: 32GB DDR5",
  ),
  galleryImage(
    pc2,
    "Hauptrechner (2023)",
    "Die CPU und GPU werden per Custom-Wasserkühlung gekühlt.",
  ),
  galleryImage(
    pc3,
    "Hauptrechner (2022)",
    "Specs: CPU: Ryzen 9 5900X, GPU: RTX 3080, RAM: 32GB DDR4",
  ),
  galleryImage(
    pc4,
    "Hauptrechner (2022)",
    "Im Mai 2022 wurde der Rechner auf Custom-Wasserkühlung umgebaut.",
  ),
  galleryImage(
    pc5,
    "Hauptrechner (2021)",
    "Mein damaliger Hauptrechner im Wunderschönen Corsair Obsidian 500D.",
  ),
];

export const hikePhotos: GalleryImage[] = [
  galleryImage(tour1, "Tagestour 1", "Tagestour 1"),
  galleryImage(tour2, "Tagestour 2", "Tagestour 2"),
  galleryImage(tour3, "Tagestour 3", "Tagestour 3"),
  galleryImage(tour4, "Tagestour 4", "Tagestour 4"),
  galleryImage(tour5, "Tagestour 5", "Tagestour 5"),
];

export type InterestCard = {
  title: string;
  summary: string;
  chips: string[];
};

export const interests: InterestCard[] = [
  {
    title: "Minecraft & Community",
    summary:
      "Mein Herzensprojekt: Ich betreue den Server und die Website der Minecraft Gilde, plane Events und feile an Performance und Details – gemeinsam macht’s am meisten Spaß.",
    chips: ["Vanilla SMP", "Server & Website", "Herzensprojekt"],
  },
  {
    title: "Computer",
    summary:
      "Ich baue richtig gern PC-Systeme – von sauberer Luftkühlung bis zur Custom-Wasserkühlung. Für mich ist das Tüfteln, bis alles genau passt.",
    chips: ["PC-Builds", "Custom-Wasserkühlung", "Luftkühlung"],
  },
  {
    title: "Gaming",
    summary:
      "Zum Abschalten: ein paar Runden Forza Horizon, zwischendurch Brotato – und wenn ich länger Zeit habe, Cities: Skylines 2.",
    chips: ["Forza Horizon", "Brotato", "Cities: Skylines 2"],
  },
  {
    title: "Draußen",
    summary:
      "Für den Kopf: entspannte Tagestouren, am liebsten mit Aussicht und ohne Stress.",
    chips: ["Tagestouren", "entspannt", "Alpen"],
  },
] as const;
