/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-elevated":
          "rgb(var(--color-surface-elevated) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--color-accent-soft) / <alpha-value>)",
        accent2: "rgb(var(--color-accent-soft) / <alpha-value>)",
        cool: "rgb(var(--color-cool) / <alpha-value>)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        hair: "0 0 0 1px rgb(var(--color-border) / 0.7)",
        soft: "0 14px 36px rgb(0 0 0 / 0.28)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translate3d(0, 6px, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "line-in": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 460ms ease-out both",
        "line-in": "line-in 700ms ease-out both",
      },
    },
  },
  plugins: [],
};
