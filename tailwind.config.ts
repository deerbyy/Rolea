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
        abyss: "#050915",
        panel: "#0a1020",
        violet: "#8b5cf6",
        ember: "#f59e0b"
      },
      boxShadow: {
        glow: "0 0 60px rgba(139, 92, 246, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
