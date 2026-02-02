// Hilfsfunktionen für strukturierte Daten (JSON-LD)
// Ziel: minimal, sauber, ohne zusätzliche Abhängigkeiten.

type SchemaBase = {
  "@context": "https://schema.org";
  "@type": string;
};

export type WebSiteJsonLdInput = {
  url: string;
  name: string;
  description?: string;
  inLanguage?: string;
};

export function buildWebSiteJsonLd(
  input: WebSiteJsonLdInput,
): SchemaBase & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: input.url,
    name: input.name,
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
    url: input.url,
    name: input.name,
    ...(input.logoUrl ? { image: input.logoUrl } : {}),
    ...(input.email ? { email: input.email } : {}),
    ...(input.sameAs && input.sameAs.length ? { sameAs: input.sameAs } : {}),
  };
}

export type WebPageJsonLdInput = {
  url: string;
  name: string;
  description?: string;
  isPartOf?: string;
};

export function buildWebPageJsonLd(
  input: WebPageJsonLdInput,
): SchemaBase & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: input.url,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.isPartOf
      ? {
          isPartOf: {
            "@type": "WebSite",
            url: input.isPartOf,
          },
        }
      : {}),
  };
}
