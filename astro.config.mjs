import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://falkner.info",
  // Tailwind CSS v4: offizielles Setup über das Vite-Plugin.
  // Siehe: https://tailwindcss.com/docs/installation/framework-guides/astro
  vite: {
    plugins: [tailwindcss()],
  },
});
