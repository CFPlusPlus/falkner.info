/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        text: "hsl(var(--text) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        accent2: "hsl(var(--accent2) / <alpha-value>)",
      },
      borderRadius: {
        sm: "8px",
        md: "10px",
        lg: "12px",
      },
      boxShadow: {
        hair: "0 0 0 1px hsl(var(--border) / 0.7)",
        soft: "0 12px 40px hsl(0 0% 0% / 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translate3d(0, 10px, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "line-in": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 600ms ease-out both",
        "line-in": "line-in 700ms ease-out both",
      },
    },
  },
  plugins: [],
};
