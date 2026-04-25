import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--surface-3) / <alpha-value>)",
        "surface-strong": "rgb(var(--surface-strong) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          ring: "rgb(var(--accent-ring) / <alpha-value>)",
          fg: "rgb(var(--accent-fg) / <alpha-value>)"
        },
        ember: "rgb(var(--ember) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        // Legacy aliases used by older components
        abyss: "#050915",
        panel: "#0a1020",
        violet: "#8b5cf6"
      },
      boxShadow: {
        glow: "0 0 60px rgb(var(--accent) / 0.25)",
        soft: "0 24px 80px rgb(0 0 0 / 0.24)",
        ring: "0 0 0 4px rgb(var(--accent) / 0.18)"
      },
      borderRadius: {
        "2xl": "1.1rem",
        "3xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
