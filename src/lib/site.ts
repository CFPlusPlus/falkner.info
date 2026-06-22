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
    "Persönliche Seite von Christian Falkner mit Projekten, Links und Einblicken in Technik, Gaming, Community und Dinge, die gerade wichtig sind.",
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
    "Ein entspannter deutscher Vanilla-SMP-Server ohne Whitelist und mein persönliches Herzensprojekt. Für mich ist die Gilde vor allem ein Ort, an dem Technik, Inhalte und Community-Alltag zusammenpassen müssen. Vieles entsteht Schritt für Schritt, aber genau das macht den Reiz daran aus.",
  tags: ["Vanilla SMP", "Community", "minecraft-gilde.de"],
  href: "https://minecraft-gilde.de",
  meta: "Herzensprojekt",
};

export const projects: Project[] = [
  {
    title: "Diese Seite",
    summary:
      "Genau diese Seite hier. Ich halte sie bewusst schlank und persönlich: als Startpunkt für Links, Projekte und ein bisschen Kontext zu den Dingen, die mich gerade begleiten.",
    tags: ["Personal", "Astro", "Tailwind"],
    meta: "Du bist hier",
  },
  {
    title: "GAMING GILDE",
    summary:
      "Aus einer Online-Community wurde mit der Zeit ein Freundeskreis. Die Seite steht für gemeinsame Abende, viel Humor, Gespräche nebenbei und dafür, dass aus Spielen manchmal mehr entsteht als nur eine Runde am Bildschirm.",
    tags: ["Community", "Gaming"],
    href: "https://www.gaming-gilde.org",
    meta: "Freunde & Community",
  },
  {
    title: "PC Builds – Galerie",
    summary:
      "Eine kleine Sammlung von Systemen, an denen ich gebaut oder getüftelt habe. Von großen Towern bis zu Custom-Wasserkühlungen ist einiges dabei.",
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
    "Mein Hauptrechner von 2023: Core i5-13600K, RTX 3090 und 32 GB DDR5-RAM.",
  ),
  galleryImage(
    pc2,
    "Hauptrechner (2023)",
    "Bei diesem Build laufen CPU und GPU über eine Custom-Wasserkühlung.",
  ),
  galleryImage(
    pc3,
    "Hauptrechner (2022)",
    "Mein Hauptrechner von 2022: Ryzen 9 5900X, RTX 3080 und 32 GB DDR4-RAM.",
  ),
  galleryImage(
    pc4,
    "Hauptrechner (2022)",
    "Im Mai 2022 habe ich das System auf eine Custom-Wasserkühlung umgebaut.",
  ),
  galleryImage(
    pc5,
    "Hauptrechner (2021)",
    "Mein damaliger Hauptrechner im wunderschönen Corsair Obsidian 500D.",
  ),
];

export const hikePhotos: GalleryImage[] = [
  galleryImage(tour1, "Tagestour 1", "Ein ruhiger Moment unterwegs."),
  galleryImage(
    tour2,
    "Tagestour 2",
    "Aussicht, frische Luft und ein bisschen Abstand zum Alltag.",
  ),
  galleryImage(
    tour3,
    "Tagestour 3",
    "Unterwegs auf einer entspannten Tagestour.",
  ),
  galleryImage(
    tour4,
    "Tagestour 4",
    "Wege, Ausblicke und Zeit zum Durchatmen.",
  ),
  galleryImage(
    tour5,
    "Tagestour 5",
    "Ein kleiner Ausschnitt aus einer Tour draußen.",
  ),
];

export type InterestCard = {
  title: string;
  summary: string;
  chips: string[];
  icon: string;
};

export const interests: InterestCard[] = [
  {
    title: "Minecraft & Community",
    summary:
      "Mich interessiert, wie aus einem Server eine angenehme Gemeinschaft wird: klare Regeln, verlässliche Technik, ein guter Ton miteinander und gelegentlich Ideen, die wieder etwas Bewegung in den Alltag bringen.",
    chips: ["Vanilla SMP", "Server & Website", "Herzensprojekt"],
    icon: "pickaxe",
  },
  {
    title: "Computer",
    summary:
      "PC-Systeme faszinieren mich, weil am Ende viele kleine Entscheidungen zusammenpassen müssen: Gehäuse, Kühlung, Lautstärke, Leistung und manchmal auch die Fehlersuche, wenn etwas nicht direkt funktioniert. Genau dieses Tüfteln macht für mich den Reiz aus.",
    chips: ["PC-Builds", "Custom-Wasserkühlung", "Luftkühlung"],
    icon: "cpu",
  },
  {
    title: "Gaming",
    summary:
      "Gaming ist für mich vor allem Abschalten und gemeinsame Zeit. Mal ein paar entspannte Runden Forza Horizon, zwischendurch Brotato oder, wenn mehr Ruhe da ist, eine längere Session Cities: Skylines 2.",
    chips: ["Forza Horizon", "Brotato", "Cities: Skylines 2"],
    icon: "gamepad",
  },
  {
    title: "Draußen",
    summary:
      "Draußen unterwegs zu sein ist für mich der einfachste Weg, Tempo rauszunehmen. Am liebsten auf entspannten Tagestouren mit Aussicht, frischer Luft und genug Strecke, damit es sich nach einem kleinen Wechsel der Perspektive anfühlt.",
    chips: ["Tagestouren", "entspannt", "Alpen"],
    icon: "mountain",
  },
] as const;
