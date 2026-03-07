import type { ImageMetadata } from "astro";

import { impressions } from "../data/impressions";
import { site as siteData, sameAsLinks } from "../data/site";
import { socialLinks } from "../data/social";

export const site = {
  ...siteData,
  minecraft: {
    serverAddress: "minecraft-gilde.de",
  },
} as const;

export { sameAsLinks, socialLinks };

export type SocialLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  meta?: string;
};

// Legacy-Exports fuer bestehende Komponenten der vorherigen Struktur.
export const spotlightProject: Project = {
  title: "Minecraft Gilde",
  summary:
    "Weiterentwicklung eines deutschsprachigen Vanilla-SMP-Projekts mit Fokus auf Stabilitaet, Community und Betrieb.",
  tags: ["Vanilla SMP", "Community", "Betrieb"],
  href: "https://minecraft-gilde.de",
  meta: "Herzensprojekt",
};

export const projects: Project[] = [
  {
    title: "falkner.info",
    summary:
      "Persoenlicher Auftritt als kuratierte Hauptbuehne mit ausgelagerten Unterseiten fuer Details.",
    tags: ["Astro", "Informationsarchitektur"],
    href: "/projekte/falkner-info",
    meta: "Website",
  },
  {
    title: "ANTI-CORONA-KARTELL",
    summary: "Community-orientiertes Webprojekt mit stabiler, wartbarer Struktur.",
    tags: ["Community", "Website"],
    href: "https://www.anti-corona-kartell.de/",
    meta: "Community",
  },
];

export type GalleryImage = {
  asset: ImageMetadata;
  src: string;
  alt: string;
  caption?: string;
};

function toGalleryImage(
  asset: ImageMetadata,
  alt: string,
  caption?: string,
): GalleryImage {
  return { asset, src: asset.src, alt, caption };
}

export const pcBuildPhotos: GalleryImage[] = impressions
  .filter((image) => image.category === "pc-builds")
  .map((image) => toGalleryImage(image.asset, image.alt, image.title));

export const hikePhotos: GalleryImage[] = impressions
  .filter((image) => image.category === "touren")
  .map((image) => toGalleryImage(image.asset, image.alt, image.title));

export type InterestCard = {
  title: string;
  summary: string;
  chips: string[];
};

export const interests: InterestCard[] = [
  {
    title: "Digitale Systeme",
    summary:
      "Interesse an stabilen, klar strukturierten Systemen mit sauberer technischer Umsetzung.",
    chips: ["Architektur", "Wartbarkeit", "Qualitaet"],
  },
  {
    title: "Gestaltung",
    summary:
      "Ruhige, reduzierte Oberflaechen mit klarer Informationsfuehrung statt visuellem Laerm.",
    chips: ["Typografie", "Komposition", "Reduktion"],
  },
];

