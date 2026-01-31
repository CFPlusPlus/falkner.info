export const site = {
  domain: "falkner.info",
  canonicalBase: "https://falkner.info",
  title: "Christian Falkner – falkner.info",
  description:
    "Persönliche Seite von Christian Falkner – Links, Projekte und ein paar Einblicke.",
  author: "Christian Falkner",
  email: "webmaster@falkner.info",
} as const;

export const socialLinks = [
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
] as const;

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
      "Eine kleine Sammlung von Builds und Kühlungs-Setups – vor allem als Bilder und Details.",
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

// Bilder: Lege deine Fotos einfach unter /public/images/pc/ und /public/images/touren/ ab
// und passe die Dateinamen hier an.
export const pcBuildPhotos: GalleryImage[] = [
  { src: "/images/pc/pc-1.webp", alt: "PC-Build" },
  { src: "/images/pc/pc-2.webp", alt: "PC-Build" },
  { src: "/images/pc/pc-3.webp", alt: "PC-Build" },
];

export const hikePhotos: GalleryImage[] = [
  { src: "/images/touren/tour-1.webp", alt: "Wandertour" },
  { src: "/images/touren/tour-2.webp", alt: "Wandertour" },
  { src: "/images/touren/tour-3.webp", alt: "Wandertour" },
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
