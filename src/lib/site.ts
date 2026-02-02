export const site = {
  domain: "falkner.info",
  canonicalBase: "https://falkner.info",
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
  src: string;
  alt: string;
  caption?: string;
};

// Bilder: Lege deine Fotos einfach unter
// - /public/images/gallery/pc/
// - /public/images/gallery/touren/
// ab und passe die Dateinamen hier an.
export const pcBuildPhotos: GalleryImage[] = [
  // Optional: Gib jedem Foto eine kurze Caption (z. B. CPU/GPU/Loop-Info oder ein Build-Name).
  {
    src: "/images/gallery/pc/pc-1.webp",
    alt: "PC-System 1",
    caption: "PC-System 1",
  },
  {
    src: "/images/gallery/pc/pc-2.webp",
    alt: "PC-System 2",
    caption: "PC-System 2",
  },
  {
    src: "/images/gallery/pc/pc-3.webp",
    alt: "PC-System 3",
    caption: "PC-System 3",
  },
  {
    src: "/images/gallery/pc/pc-4.webp",
    alt: "PC-System 4",
    caption: "PC-System 4",
  },
  {
    src: "/images/gallery/pc/pc-5.webp",
    alt: "PC-System 5",
    caption: "PC-System 5",
  },
];

export const hikePhotos: GalleryImage[] = [
  // Optional: Caption-Idee: Tourname, Region oder ein kurzer Hinweis (z. B. "Tegernsee – Abendrunde").
  {
    src: "/images/gallery/touren/tour-1.webp",
    alt: "Tagestour 1",
    caption: "Tagestour 1",
  },
  {
    src: "/images/gallery/touren/tour-2.webp",
    alt: "Tagestour 2",
    caption: "Tagestour 2",
  },
  {
    src: "/images/gallery/touren/tour-3.webp",
    alt: "Tagestour 3",
    caption: "Tagestour 3",
  },
  {
    src: "/images/gallery/touren/tour-4.webp",
    alt: "Tagestour 4",
    caption: "Tagestour 4",
  },
  {
    src: "/images/gallery/touren/tour-5.webp",
    alt: "Tagestour 5",
    caption: "Tagestour 5",
  },
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
