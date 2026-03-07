# AGENTS.md

## Mission
Dieses Repository wird zu einer hochwertigen persönlichen Website im Stil
„Editorial Tech Premium mit technischer Präzision“ umgebaut.

## Product intent
Die Website soll:
- modern
- hochwertig
- clean
- individuell statt generisch
- technisch/professionell
- visuell stark, aber nicht verspielt oder überladen

wirken.

## Core direction
Die Startseite ist eine kuratierte Hauptbühne, kein vollständiger Onepager.
Weniger Elemente, mehr Gewicht.
Weniger Cards, mehr offene Flächen, Typografie und Komposition.

## Information architecture
Die Startseite besteht aus genau diesen Hauptsektionen:
1. Hero
2. Selected Work
3. Profil
4. Impressionen
5. Kontakt

Vollständige Inhalte werden auf Unterseiten ausgelagert:
- /projekte
- /projekte/[slug]
- /impressionen
- /ueber

## Design rules
- Hero ist der wichtigste Bereich der Seite.
- Keine Begrüßungsfloskeln.
- Keine generische Card-Landschaft.
- Keine unnötigen Chips, Badges oder Dekoelemente.
- Keine verspielte Developer-Optik.
- Technik soll als Haltung sichtbar sein, nicht als Gimmick.
- Dunkle, kontrollierte Basis mit warmem Akzent.
- Kühle Töne nur sehr sparsam einsetzen.
- Typografie trägt die Wertigkeit.

## Typography
Bevorzugte Typo-Richtung:
- Headlines / Display: Space Grotesk
- Body / UI / Navigation: Geist

Nicht ohne guten Grund wechseln.

## Motion
Bewegung nur subtil:
- fade
- slight slide
- micro hover
- optional sehr leichte Hero-Parallax

Keine Effektshow. Keine aggressiven Scroll-Reveals.

## Components
Bevorzuge semantische, bereichsspezifische Komponenten statt generischer UI-Bausteine.

Gewünschte Richtung:
- components/chrome/
- components/home/
- components/primitives/

Cards nur dort einsetzen, wo sie wirklich nötig sind.

## Data architecture
Globale Metadaten gehören nach:
- src/data/site.ts

Startseiteninhalte gehören nach:
- src/data/home.ts
- src/data/impressions.ts
- src/data/navigation.ts
- src/data/social.ts

Projekte gehören als Astro Content Collection nach:
- src/content/projects/

## Implementation rules
- Bestehende Struktur gezielt refactoren, nicht blind alles neu erzeugen.
- Vorhandene sinnvolle Dateien weiterverwenden, wenn das Ergebnis sauber bleibt.
- Keine unnötigen neuen Dependencies hinzufügen.
- Bestehende Rechtsseiten und SEO-Strukturen nur anfassen, wenn nötig.
- Accessibility, Semantik und Responsive-Verhalten mitdenken.
- Mobile ist Pflicht, nicht Nacharbeit.

## Quality bar
Jede Änderung soll:
- nachvollziehbar
- reviewbar
- visuell konsistent
- responsiv
- wartbar

sein.

## Before finishing a task
- Relevante Dateien prüfen
- Bestehende Patterns im Repo berücksichtigen
- Build ausführen
- Lint ausführen, falls vorhanden
- Offene Punkte knapp dokumentieren

## Output expectations
Am Ende jedes Tasks bitte immer liefern:
1. kurze Zusammenfassung der Änderung
2. Liste der geänderten Dateien
3. offene Punkte / Risiken
4. sinnvoller nächster Task

## Qualitaet vor Abschluss

- Nach Aenderungen, wenn sinnvoll, lokal pruefen:
- `npm run check`
- `npm run lint`
- `npm run build`
- Bei rein kleinen Text-/Markup-Aenderungen mindestens `npm run check` ausfuehren.