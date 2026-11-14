// Zentrales Client-Entry
//
// Ziel:
// - Eine Stelle für alle Browser-Initialisierungen
// - Keine Inline-Skripte in Komponenten
// - Einmal pro vollständig geladener Seite initialisieren

import "./scrollLock";

import { initGlobalUI } from "./reveal";
import { initScrollProgress } from "./scrollProgress";
import { initNavbar } from "./navbar";
import { initLightboxes } from "./lightbox";
import { initMinecraftStatus } from "./minecraftStatus";
import { initBackButton } from "./backButton";

function init(): void {
  initGlobalUI();
  initScrollProgress();
  initNavbar();
  initLightboxes();
  initMinecraftStatus();
  initBackButton();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
