import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://falkner.info",
  // Automatische Sitemap-Generierung (erstellt standardmäßig sitemap-index.xml + sitemap-0.xml)
  // Doku: https://docs.astro.build/en/guides/integrations-guide/sitemap/
  integrations: [sitemap()],
  // Tailwind CSS v4: offizielles Setup über das Vite-Plugin.
  // Siehe: https://tailwindcss.com/docs/installation/framework-guides/astro
  vite: {
    plugins: [tailwindcss()],
  },
});
