export const site = {
  domain: "falkner.info",
  canonicalBase: "https://falkner.info",
  title: "Christian Falkner – Persönliche Webseite (falkner.info)",
  description:
    "Private Homepage von Christian Falkner – persönliche Infos, Hobbys, Minecraft-Community und Einblicke.",
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
  todo?: boolean;
};

export const spotlightProject: Project = {
  title: "Minecraft Gilde",
  summary:
    "Ein entspannter deutscher Vanilla-SMP-Server ohne Whitelist – gemeinsam bauen, austauschen und abschalten.",
  tags: ["Vanilla SMP", "Community", "minecraft-gilde.de"],
  href: "https://minecraft-gilde.de",
  meta: "Hobby-Projekt",
};

export const projects: Project[] = [
  {
    title: "falkner.info",
    summary:
      "Meine private Webseite – ein kompaktes Zuhause für Einblicke, Links und Projekte.",
    tags: ["Personal", "Web"],
    href: "https://falkner.info",
    meta: "Always evolving",
  },
  {
    title: "ANTI-CORONA-KARTELL",
    summary:
      "Community, in der Spaß und Zusammenhalt zählen – ein Ort, an dem man gerne abhängt.",
    tags: ["Community", "Gaming"],
    href: "https://www.anti-corona-kartell.de/",
    meta: "Friends & community",
  },
  {
    title: "PC-Builds & Optimierung",
    summary:
      "Eigene Systeme zusammenbauen, reparieren und optimieren – einfach weil Technik Spaß macht.",
    tags: ["Hardware", "Tuning"],
  },
];

export const stackGroups = [
  {
    title: "Interessen",
    items: [
      "Gaming",
      "Computer / Hardware",
      "Wandern (Alpen)",
      "Community: Minecraft Gilde",
    ],
  },
  {
    title: "Online",
    items: ["Minecraft Gilde", "Discord", "GitHub", "LinkedIn"],
  },
] as const;
