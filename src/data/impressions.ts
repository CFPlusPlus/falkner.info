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

export type ImpressionCategory = "pc-builds" | "touren";

export type ImpressionImage = {
  id: string;
  category: ImpressionCategory;
  title: string;
  alt: string;
  asset: ImageMetadata;
};

export const impressions: readonly ImpressionImage[] = [
  {
    id: "pc-2023-front",
    category: "pc-builds",
    title: "Hauptrechner 2023",
    alt: "PC Build Hauptrechner aus 2023, Frontansicht",
    asset: pc1,
  },
  {
    id: "pc-2023-loop",
    category: "pc-builds",
    title: "Loop und Details",
    alt: "Custom-Wasserkuehlung mit sichtbarem Loop",
    asset: pc2,
  },
  {
    id: "pc-2022-upgrade",
    category: "pc-builds",
    title: "Umbauphase 2022",
    alt: "PC Build waehrend des Umbaus auf Wasserkuehlung",
    asset: pc3,
  },
  {
    id: "pc-2022-finish",
    category: "pc-builds",
    title: "Finales Setup 2022",
    alt: "Finalisiertes PC Setup mit ruhiger Beleuchtung",
    asset: pc4,
  },
  {
    id: "pc-2021-classic",
    category: "pc-builds",
    title: "Setup 2021",
    alt: "PC Build im Corsair Obsidian 500D",
    asset: pc5,
  },
  {
    id: "tour-1",
    category: "touren",
    title: "Tagestour I",
    alt: "Landschaftsaufnahme waehrend einer Tagestour",
    asset: tour1,
  },
  {
    id: "tour-2",
    category: "touren",
    title: "Tagestour II",
    alt: "Wegabschnitt und Aussicht einer Tagestour",
    asset: tour2,
  },
  {
    id: "tour-3",
    category: "touren",
    title: "Tagestour III",
    alt: "Bergpanorama einer Tagestour",
    asset: tour3,
  },
  {
    id: "tour-4",
    category: "touren",
    title: "Tagestour IV",
    alt: "Felsige Passage einer Tagestour",
    asset: tour4,
  },
  {
    id: "tour-5",
    category: "touren",
    title: "Tagestour V",
    alt: "Aussicht am Ende einer Tagestour",
    asset: tour5,
  },
] as const;
