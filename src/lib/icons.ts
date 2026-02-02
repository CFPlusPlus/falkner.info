/**
 * Zentrale Icon-Zuordnung für Link-Labels.
 *
 * Warum?
 * - Dieselbe Logik wurde an mehreren Stellen genutzt (Index + Footer)
 * - Ein Ort = leichter wartbar + konsistent
 */

export function iconForLabel(label: string): string {
  const l = (label || "").toLowerCase();

  // Externe Profile
  if (l.includes("discord")) return "discord";
  if (l.includes("linkedin")) return "linkedin";
  if (l.includes("github")) return "github";
  if (l.includes("steam")) return "steam";
  if (l.includes("xbox")) return "xbox";

  // Interne Seite
  if (l.includes("datenschutz")) return "lock";

  // Default: „öffnet extern“
  return "arrow-up-right";
}
