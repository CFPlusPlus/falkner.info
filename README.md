# falkner.info ![Astro](https://img.shields.io/badge/Astro-0b0b0c?style=flat&logo=astro&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-0b0b0c?style=flat&logo=tailwindcss&logoColor=white)

Das ist der Quellcode meiner persönlichen One‑Pager‑Webseite **falkner.info**.
Sie ist bewusst schlank gehalten: Links, Projekte, Interessen und eine Bilder‑Galerie (Carousel + Lightbox).

## Stack

- **Astro** (Static Site)
- **Tailwind CSS**
- **Tabler Icons**
- **Prettier** (inkl. `prettier-plugin-astro`)
- **ESLint** (Astro + TypeScript)
- **Astro Check** (`npm run check`, Type/Template Checks)

## Voraussetzungen

- **Node.js 26** (konkrete Version in `.nvmrc`)
- **npm 12** (konkrete Version unter `packageManager` in `package.json`)

## Schnellstart

```bash
npm ci                # Abhängigkeiten aus der Lockdatei installieren
npm run dev           # Dev‑Server (Hot Reload)
npm run build         # Production Build nach ./dist
npm run preview       # Production Build lokal testen
npm run format:check  # Formatierung prüfen
npm run format        # Dateien formatieren
npm run lint          # ESLint
npm run check         # Astro Check (Types/Templates)
npx tsc --noEmit       # TypeScript inklusive Tests
npx playwright install chromium # Testbrowser einmalig installieren
npm test              # Nach npm run build: Artefakt- und Browsertests
```

Die Tests prüfen den fertigen `dist/`-Build. Ihr lokaler Server übernimmt den
erzeugten CSP-Header aus `dist/_headers` und liefert unbekannte Pfade mit HTTP 404
aus. Geprüft werden alle Seiten bei 320 und 1440 Pixeln, Menü und Lightbox per
Tastatur, Fokus/Scrollsperre, 404-Pfade, Logo-Auflösungen, Animation und simulierte
Minecraft-Antworten einschließlich Timeout und Polling. `npm run preview` setzt
den Cloudflare-Header nicht; für eine manuelle Prüfung mit CSP kann nach dem Build
`node tests/serve-build.mjs` gestartet werden.

Prettier bindet `prettier-plugin-astro` ausdrücklich ein; `.gitattributes` und die
Prettier-Konfiguration legen LF-Zeilenenden fest.

Der gezielte `minimatch`-Override für `@typescript-eslint/typescript-estree`
schließt GHSA-g3hv-75wg-m249. Version 11 entfernt unter anderem `makeRe`; der
betroffene Verbraucher nutzt nur `minimatch(..., { dot: true })`. Der
Kompatibilitätstest führt dessen `allowDefaultProject`-Pfad tatsächlich aus.
Den Override entfernen, sobald TypeScript-ESLint selbst eine korrigierte Version
anfordert.

## Inhalte bearbeiten

Die meisten Texte/Links/Bilder werden zentral in **`src/lib/site.ts`** gepflegt:

- `site`: Titel, Beschreibung, Canonical, E‑Mail
- `socialLinks`: Social/Profil‑Links
- `spotlightProject` + `projects`: Projekte auf der Startseite
- `interests`: Interessen‑Karten
- `pcBuildPhotos` / `hikePhotos`: Bilder für die Galerien inkl. Captions

### Bilder (Galerie / Lightbox)

Die Galerie nutzt `astro:assets` für optimierte Bilder (responsive Größen + AVIF/WebP).
AVIF wird bevorzugt; das Fallbackbild wird als WebP ausgegeben, um zusätzliche PNG-Versionen zu vermeiden.
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

Das Navbar-Logo liegt separat in `public/images/navbar-logo-{28,56,84}.webp` für
28 CSS-Pixel bei 1×, 2× und 3× Pixeldichte. Die Varianten wurden aus dem vorhandenen
192-Pixel-Favicon mit sharp (WebP, Qualität 85) verkleinert; die Manifest- und
Favicon-Dateien bleiben eigenständig.

### Minecraft-Server-Status (Spieler online)

Die Anzeige holt sich den Status clientseitig über **mcsrvstat.us**.
Sie fragt bei Sichtbarkeit und anschließend alle fünf Minuten ab. Dabei werden die HTTP-Cachevorgaben der API berücksichtigt.
Anfragen werden nach zehn Sekunden abgebrochen; bei ausgeblendetem Tab oder nicht sichtbarer Anzeige pausieren die Abfragen.
Die Server‑Adresse wird aktuell hier gesetzt:

- `src/lib/site.ts` → `site.minecraft.serverAddress` (ggf. mit Port `:25565`)
- Weitergabe an die Section erfolgt in `src/pages/index.astro`

Komponente:

- `src/components/MinecraftServerStatus.astro`

## Projektstruktur

- `src/pages/…` – Seiten (z. B. `index.astro`, `datenschutz.astro`)
- `src/components/…` – UI‑Komponenten (Navbar, Footer, Galerie/Lightbox, etc.)
- `src/layouts/…` – Layouts (Meta/SEO, Grundlayout)
- `src/styles/global.css` – globale Styles
- `public/…` – statische Assets (Icons, Bilder)

### Icons

`src/components/Icon.astro` importiert einzelne SVGs aus `@tabler/icons`.
Astro rendert verwendete Icons direkt ins HTML; eine vollständige Icon-Sammlung wird nicht geladen.
Neue Icons dort importieren und in `ICONS` registrieren. Fehlt ein verwendetes Icon, bricht der Build mit einer Fehlermeldung ab.

## SEO: Sitemap & strukturierte Daten (JSON-LD)

- **Sitemap** wird automatisch beim Build generiert über `@astrojs/sitemap`.
  - Output: `dist/sitemap-index.xml` und `dist/sitemap-0.xml`.
  - Die `robots.txt` wird über `src/pages/robots.txt.ts` erzeugt und verweist auf `sitemap-index.xml`.
- **JSON-LD** ist global im `BaseLayout` integriert (WebSite + Person + WebPage).
  - Optional kannst du pro Seite zusätzliches Schema über `jsonLd` an `BaseLayout` übergeben.

## Hosting

Die Website wird über **Cloudflare Pages** bereitgestellt.
Beim Build erzeugt `scripts/emit-pages-csp.mjs` die Datei `dist/_headers` mit der Content Security Policy für Cloudflare Pages.
