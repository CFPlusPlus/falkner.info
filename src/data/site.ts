import { socialLinks } from "./social";

export const site = {
  domain: "falkner.info",
  canonicalBase: "https://falkner.info",
  repositoryUrl: "https://github.com/CFPlusPlus/falkner.info",
  title: "Christian Falkner - falkner.info",
  description:
    "Persoenliche Website von Christian Falkner fuer digitale Projekte, Systeme und klare Gestaltung.",
  author: "Christian Falkner",
  email: "webmaster@falkner.info",
} as const;

const SAME_AS_ALLOWLIST = [
  "github.com",
  "linkedin.com",
  "www.linkedin.com",
] as const;

function normalizeSameAsUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") return null;

    const host = parsed.hostname.toLowerCase();
    const isAllowed = SAME_AS_ALLOWLIST.some(
      (domain) => host === domain || host.endsWith(`.${domain}`),
    );
    if (!isAllowed) return null;

    parsed.search = "";
    parsed.hash = "";
    if (parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export const sameAsLinks = socialLinks
  .filter((link) => link.label === "GitHub" || link.label === "LinkedIn")
  .map((link) => normalizeSameAsUrl(link.href))
  .filter((url): url is string => Boolean(url));
