import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── Font Family ────────────────────────────── */
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },

      /* ── Border Radius ─────────────────────────── */
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",   // rounded-[2.5rem] → rounded-5xl
      },

      /* ── Colors ────────────────────────────────── */
      colors: {
        // AQI grade palette (strict hex from design)
        aqi: {
          good:              "#10b981",
          "good-light":      "#f0fdf4",
          "good-border":     "#a7f3d0",
          moderate:          "#f59e0b",
          "moderate-light":  "#fffbeb",
          "moderate-border": "#fde68a",
          bad:               "#f97316",
          "bad-light":       "#fff7ed",
          "bad-border":      "#fed7aa",
          "very-bad":        "#e11d48",
          "very-bad-light":  "#fff1f2",
          "very-bad-border": "#fecdd3",
        },
        // mesh palette (from JSX meshColors)
        mesh: {
          "good-1":      "#10b981",
          "good-2":      "#38bdf8",
          "good-3":      "#6ee7b7",
          "good-4":      "#f0fdf4",
          "moderate-1":  "#f59e0b",
          "moderate-2":  "#fbbf24",
          "moderate-3":  "#bfdbfe",
          "moderate-4":  "#fffbeb",
          "bad-1":       "#f97316",
          "bad-2":       "#fb923c",
          "bad-3":       "#94a3b8",
          "bad-4":       "#fff7ed",
          "very-bad-1":  "#e11d48",
          "very-bad-2":  "#f43f5e",
          "very-bad-3":  "#475569",
          "very-bad-4":  "#fff1f2",
        },
      },

      /* ── Animations ─────────────────────────────── */
      animation: {
        "mesh":           "mesh 20s ease-in-out infinite",
        "particle":       "particleFloat linear infinite",
        "fade-in-up":     "fadeInUp 0.5s ease-out both",
        "scale-in":       "scaleIn 0.3s ease-out both",
        "spin-icon":      "spin 1s linear infinite",
      },

      keyframes: {
        mesh: {
          "0%":   { transform: "translate(0,0) scale(1)" },
          "33%":  { transform: "translate(5%,5%) scale(1.1)" },
          "66%":  { transform: "translate(-5%,2%) scale(0.95)" },
          "100%": { transform: "translate(0,0) scale(1)" },
        },
        particleFloat: {
          "0%":   { transform: "translateY(0)",      opacity: "0" },
          "20%":  { opacity: "0.6" },
          "80%":  { opacity: "0.6" },
          "100%": { transform: "translateY(-400px)", opacity: "0" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
      },

      /* ── Box Shadow ─────────────────────────────── */
      boxShadow: {
        "card":       "0 2px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.1)",
        "dark":       "0 4px 32px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
