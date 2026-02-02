import js from "@eslint/js";
import globals from "globals";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  // Basisregeln
  js.configs.recommended,

  // TypeScript (ohne harte Style-Regeln, dafür mit soliden Defaults)
  ...tseslint.configs.recommended,

  // Astro Best-Practices
  ...astro.configs.recommended,

  // Astro-Dateien: TS-Parser für <script> Blöcke aktivieren
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astro.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
      },
    },
  },

  // Globale Umgebungen (Browser + Node)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Build/Cache/Deps ausschließen
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];
