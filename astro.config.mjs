import { defineConfig } from "astro/config";
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
  // Automatische Sitemap-Generierung (erstellt standardmäßig sitemap-index.xml + sitemap-0.xml)
  // Doku: https://docs.astro.build/en/guides/integrations-guide/sitemap/
  integrations: [sitemap()],
  // Tailwind CSS v4: offizielles Setup über das Vite-Plugin.
  // Siehe: https://tailwindcss.com/docs/installation/framework-guides/astro
  vite: {
    plugins: [tailwindcss()],
    define: {
      "import.meta.env.GIT_COMMIT_HASH": JSON.stringify(GIT_COMMIT_HASH),
    },
  },
});
