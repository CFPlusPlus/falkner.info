# falkner.info – persönliche Webseite (Astro + Tailwind)

Das ist der Quellcode meiner persönlichen One‑Pager‑Webseite **falkner.info**.
Sie ist bewusst schlank gehalten: Links, Projekte, Interessen und eine Bilder‑Galerie (Carousel + Lightbox).

## Stack

- **Astro** (Static Site)
- **Tailwind CSS**
- **Tabler Icons**
- **Prettier** (inkl. `prettier-plugin-astro`)

## Voraussetzungen

- **Node.js**
- **npm**

## Schnellstart

```bash
npm install
npm run dev
```

Danach läuft die Seite lokal unter: `http://localhost:4321`

## Wichtige Commands

Alle Befehle werden im Projekt‑Root ausgeführt:

```bash
npm run dev      # Dev‑Server (Hot Reload)
npm run build    # Production Build nach ./dist
npm run preview  # Production Build lokal testen
npm run format   # Prettier auf das ganze Projekt
```

## Footer: letzter Commit anzeigen

Im Footer kann optional der **letzte Commit** angezeigt werden.

- Der Commit-Hash wird beim Build automatisch ermittelt (GitHub Actions via `GITHUB_SHA`, lokal via `git rev-parse`).
- Für klickbare Links (Repo + Commit) setze die Umgebungsvariable:

```bash
PUBLIC_REPO_URL="https://github.com/USER/REPO"
```

Wenn `PUBLIC_REPO_URL` nicht gesetzt ist, wird nur der Hash als Text angezeigt.

## Inhalte bearbeiten

Die meisten Texte/Links/Bilder werden zentral in **`src/lib/site.ts`** gepflegt:

- `site`: Titel, Beschreibung, Canonical, E‑Mail
- `socialLinks`: Social/Profil‑Links
- `spotlightProject` + `projects`: Projekte auf der Startseite
- `interests`: Interessen‑Karten
- `pcBuildPhotos` / `hikePhotos`: Bilder für die Galerien inkl. Captions

### Bilder (Galerie / Lightbox)

Bilder werden hier abgelegt:

- `public/images/gallery/pc/…` (PC‑Systeme)
- `public/images/gallery/touren/…` (Tagestouren)

In `src/lib/site.ts` können beliebig viele Bilder hinzugefügt werden. Jede Karte unterstützt:

```ts
{ src: "/images/gallery/pc/pc-1.webp", alt: "PC-System 1", caption: "Custom Loop – RTX/…" }
```

Tipp: **WEBP** ist ideal. JPG/PNG funktionieren grundsätzlich auch.

### Minecraft-Server-Status (Spieler online)

Die Anzeige holt sich den Status clientseitig über **mcsrvstat.us**.
Die Server‑Adresse wird aktuell hier gesetzt:

- `src/pages/index.astro` → Prop `serverAddress="minecraft-gilde.de"` (ggf. mit Port `:25565`)

Komponente:

- `src/components/MinecraftServerStatus.astro`

## Projektstruktur (Kurz)

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
