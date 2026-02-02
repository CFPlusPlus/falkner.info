# falkner.info – persönliche Webseite

Das ist der Quellcode meiner persönlichen One‑Pager‑Webseite **falkner.info**.
Sie ist bewusst schlank gehalten: Links, Projekte, Interessen und eine Bilder‑Galerie (Carousel + Lightbox).

## Stack

- **Astro** (Static Site)
- **Tailwind CSS**
- **Tabler Icons**
- **Prettier** (inkl. `prettier-plugin-astro`)
- **ESLint** (Astro + TypeScript)
- **/check** (Type/Template Checks)

## Voraussetzungen

- **Node.js**
- **npm**

## Schnellstart

```bash
npm run dev           # Dev‑Server (Hot Reload)
npm run build         # Production Build nach ./dist
npm run preview       # Production Build lokal testen
npm run format        # Prettier (Check)
npm run format:write  # Prettier (Write)
npm run lint          # ESLint
npm run check         # Astro Check (Types/Templates)
```

## Inhalte bearbeiten

Die meisten Texte/Links/Bilder werden zentral in **`src/lib/site.ts`** gepflegt:

- `site`: Titel, Beschreibung, Canonical, E‑Mail
- `socialLinks`: Social/Profil‑Links
- `spotlightProject` + `projects`: Projekte auf der Startseite
- `interests`: Interessen‑Karten
- `pcBuildPhotos` / `hikePhotos`: Bilder für die Galerien inkl. Captions

### Bilder (Galerie / Lightbox)

Die Galerie nutzt `astro:assets` für optimierte Bilder (responsive Größen + AVIF/WebP).
Lege deine Fotos hier ab:

- `src/assets/gallery/pc/…` (PC‑Systeme)
- `src/assets/gallery/touren/…` (Tagestouren)

In `src/lib/site.ts` importierst du die Bilder oben und fügst sie dann in die Arrays ein.
Beispiel:

```ts
import pc6 from "../assets/gallery/pc/pc-6.webp";

export const pcBuildPhotos = [
  // ... bestehende Einträge
  galleryImage(pc6, "Hauptrechner (2024)", "Kurze Caption…"),
];
```

Tipp: **WEBP** ist ideal. JPG/PNG funktionieren grundsätzlich auch.

### Minecraft-Server-Status (Spieler online)

Die Anzeige holt sich den Status clientseitig über **mcsrvstat.us**.
Die Server‑Adresse wird aktuell hier gesetzt:

- `src/pages/index.astro` → Prop `serverAddress="minecraft-gilde.de"` (ggf. mit Port `:25565`)

Komponente:

- `src/components/MinecraftServerStatus.astro`

## Projektstruktur

- `src/pages/…` – Seiten (z. B. `index.astro`, `datenschutz.astro`)
- `src/components/…` – UI‑Komponenten (Navbar, Footer, Galerie/Lightbox, etc.)
- `src/layouts/…` – Layouts (Meta/SEO, Grundlayout)
- `src/styles/global.css` – globale Styles
- `public/…` – statische Assets (Icons, Bilder)

## SEO: Sitemap & strukturierte Daten (JSON-LD)

- **Sitemap** wird automatisch beim Build generiert über `@astrojs/sitemap`.
  - Output: `dist/sitemap-index.xml` und `dist/sitemap-0.xml`.
  - In `public/robots.txt` ist `sitemap-index.xml` bereits eingetragen.
- **JSON-LD** ist global im `BaseLayout` integriert (WebSite + Person + WebPage).
  - Optional kannst du pro Seite zusätzliches Schema über `jsonLd` an `BaseLayout` übergeben.

## Deployment

`npm run build` erzeugt eine statische Ausgabe in **`dist/`**.
Den Ordner `dist/` kann dann auf den Webserver hochladen werden.
