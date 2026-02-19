# AGENTS.md

Leitfaden fuer KI-Agenten in diesem Repository.

## Ziel

- Kleine, praezise Aenderungen bevorzugen.
- Bestehende Struktur und Stil beibehalten.
- Keine ungefragten Refactors oder Umstrukturierungen.

## Stack und Kontext

- Framework: Astro (statische Seite)
- Sprache: TypeScript
- Styling: Tailwind CSS
- Relevante Bereiche:
- `src/pages/` fuer Seiten (z. B. `404.astro`)
- `src/scripts/` fuer Browser-Logik (z. B. `client.ts`, `backButton.ts`, `minecraftStatus.ts`)
- `public/` fuer statische Dateien und Server-Konfig (z. B. `.htaccess`)

## Arbeitsregeln

- Nur aendern, was zur Aufgabe gehoert.
- Keine Secrets, Tokens oder Zugangsdaten in Code/Repo schreiben.
- Bestehende Namenskonventionen und Dateistruktur einhalten.
- Kommentare im Code immer auf Deutsch verfassen.
- Kommentare nur dort setzen, wo sie wirklich zum Verstaendnis beitragen.
- Bei Astro-APIs oder unklaren Patterns zuerst die aktuelle Astro-Dokumentation pruefen (bevor Code geaendert wird).
- Integrationen bevorzugt ueber `npx astro add <integration>` einbinden statt Konfigurationen manuell in Abhaengigkeiten/Config-Dateien nachzubauen.
- Wenn Unsicherheit zu Astro-Verhalten besteht, zuerst Doku (MCP/LLMS) pruefen und erst danach implementieren.

## Qualitaet vor Abschluss

- Nach Aenderungen, wenn sinnvoll, lokal pruefen:
- `npm run check`
- `npm run lint`
- `npm run build`
- Bei rein kleinen Text-/Markup-Aenderungen mindestens `npm run check` ausfuehren.

## Antwortformat fuer Agenten

- Kurz zusammenfassen, was geaendert wurde.
- Betroffene Dateien konkret nennen.
- Falls etwas nicht verifiziert wurde, klar benennen.
