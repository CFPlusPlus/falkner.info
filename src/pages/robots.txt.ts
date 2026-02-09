import type { APIRoute } from "astro";

import { site } from "../lib/site";

const buildSitemapUrl = () =>
  new URL(
    `${import.meta.env.BASE_URL}sitemap-index.xml`,
    site.canonicalBase,
  ).toString();

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${buildSitemapUrl()}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
