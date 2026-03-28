import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { execSync } from "node:child_process";

const GIT_COMMIT_HASH = (() => {
  // Erst GitHub Actions (GITHUB_SHA), sonst lokales git (für `npm run build`/`dev`).
  const gh = (process.env.GITHUB_SHA || "").trim();
  if (gh) return gh.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "";
  }
})();

export default defineConfig({
  site: "https://falkner.info",
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://api.mcsrvstat.us",
      ],
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Geist Sans",
      cssVariable: "--font-geist-sans",
      weights: [300, 400, 500, 600],
      styles: ["normal"],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Space Grotesk",
      cssVariable: "--font-space-grotesk",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
    },
  ],
  // Automatische Sitemap-Generierung (erstellt standardmäßig sitemap-index.xml + sitemap-0.xml)
  // Doku: https://docs.astro.build/en/guides/integrations-guide/sitemap/
  integrations: [
    sitemap({
      // 404 soll nicht in der Sitemap landen.
      // (Zusätzlich ist die Seite per Meta-Robots auf noindex gesetzt.)
      filter: (page) => {
        try {
          const { pathname } = new URL(page);
          return pathname !== "/404" && pathname !== "/404/";
        } catch {
          return (
            !String(page).endsWith("/404") && !String(page).endsWith("/404/")
          );
        }
      },
    }),
  ],
  // Tailwind CSS v4: offizielles Setup über das Vite-Plugin.
  // Siehe: https://tailwindcss.com/docs/installation/framework-guides/astro
  vite: {
    plugins: [tailwindcss()],
    define: {
      "import.meta.env.GIT_COMMIT_HASH": JSON.stringify(GIT_COMMIT_HASH),
    },
  },
});
