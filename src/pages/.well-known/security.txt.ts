import type { APIRoute } from "astro";

import { site } from "../../lib/site";

const SECURITY_TXT_PATH = "/.well-known/security.txt";
const EXPIRES_IN_MONTHS = 9;

const buildCanonicalUrl = () =>
  new URL(SECURITY_TXT_PATH, site.canonicalBase).toString();

const buildExpires = () => {
  const expiresAt = new Date();
  expiresAt.setUTCMonth(expiresAt.getUTCMonth() + EXPIRES_IN_MONTHS);

  return expiresAt.toISOString();
};

const buildSecurityTxt = () =>
  `Contact: mailto:${site.email}
Canonical: ${buildCanonicalUrl()}
Preferred-Languages: de, en
Expires: ${buildExpires()}
`;

export const GET: APIRoute = () =>
  new Response(buildSecurityTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
