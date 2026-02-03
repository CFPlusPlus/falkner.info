// Hilfsfunktionen für strukturierte Daten (JSON-LD)
// Ziel: minimal, sauber, ohne zusätzliche Abhängigkeiten.

type SchemaBase = {
  "@context": "https://schema.org";
  "@type": string | string[];
};

export type WebSiteJsonLdInput = {
  url: string;
  name: string;
  description?: string;
  inLanguage?: string;
  /** Optional: alternative Kurzform(en) für "Site Names" in Google */
  alternateName?: string | string[];
};

export function buildWebSiteJsonLd(
  input: WebSiteJsonLdInput,
): SchemaBase & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${input.url}#website`,
    url: input.url,
    name: input.name,
    ...(input.alternateName ? { alternateName: input.alternateName } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.inLanguage
      ? { inLanguage: input.inLanguage }
      : { inLanguage: "de-DE" }),
  };
}

export type PersonJsonLdInput = {
  url: string;
  name: string;
  logoUrl?: string;
  sameAs?: string[];
  email?: string;
};

// Für eine private Website ist "Person" meistens passender als "Organization".
// Der Helper baut daher bewusst ein "Person"-Schema.
export function buildPersonJsonLd(
  input: PersonJsonLdInput,
): SchemaBase & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${input.url}#person`,
    url: input.url,
    name: input.name,
    ...(input.logoUrl
      ? { image: { "@type": "ImageObject", url: input.logoUrl } }
      : {}),
    ...(input.email ? { email: input.email } : {}),
    ...(input.sameAs && input.sameAs.length ? { sameAs: input.sameAs } : {}),
  };
}

export type WebPageJsonLdInput = {
  url: string;
  name: string;
  description?: string;
  isPartOf?: string;
  /** Referenz auf die Person/Organisation (z. B. https://example.com#person) */
  aboutId?: string;
  /** Optional: Referenz auf BreadcrumbList (@id) */
  breadcrumbId?: string;
};

export function buildWebPageJsonLd(
  input: WebPageJsonLdInput,
): SchemaBase & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.isPartOf
      ? {
          isPartOf: {
            "@id": `${input.isPartOf}#website`,
          },
        }
      : {}),
    ...(input.aboutId ? { about: { "@id": input.aboutId } } : {}),
    ...(input.breadcrumbId
      ? { breadcrumb: { "@id": input.breadcrumbId } }
      : {}),
  };
}

export type BreadcrumbListJsonLdInput = {
  /** Eigene ID der BreadcrumbList, z. B. https://example.com/impressum/#breadcrumb */
  id: string;
  items: Array<{
    name: string;
    url: string;
  }>;
};

/**
 * BreadcrumbList ist (neben FAQ/HowTo/etc.) eines der wenigen Features,
 * das der Google Rich Results Test zuverlässig erkennt – auch für "normale" Websites.
 */
export function buildBreadcrumbListJsonLd(
  input: BreadcrumbListJsonLdInput,
): SchemaBase & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": input.id,
    itemListElement: input.items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
