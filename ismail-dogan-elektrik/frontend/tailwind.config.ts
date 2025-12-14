import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Cyber-Industrial Luxury Palette
        "cyber-dark": {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#0a1929",
        },
        "neon-blue": {
          50: "#e6f7ff",
          100: "#b3e7ff",
          200: "#80d4ff",
          300: "#4dc3ff",
          400: "#1ab2ff",
          500: "#00a3ff",
          600: "#0090e6",
          700: "#007acc",
          800: "#0066b3",
          900: "#005299",
          DEFAULT: "#00a3ff",
          glow: "#00d4ff",
        },
        "amber-alert": {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          DEFAULT: "#f59e0b",
          glow: "#fbbf24",
        },
        "electric": {
          cyan: "#00f0ff",
          blue: "#0080ff",
          purple: "#8000ff",
          spark: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Orbitron", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cyber-grid": `
          linear-gradient(rgba(0, 163, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 163, 255, 0.03) 1px, transparent 1px)
        `,
        "electric-gradient": "linear-gradient(135deg, #0a1929 0%, #102a43 50%, #0a1929 100%)",
      },
      backgroundSize: {
        "cyber-grid": "50px 50px",
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0, 163, 255, 0.5), 0 0 40px rgba(0, 163, 255, 0.3), 0 0 60px rgba(0, 163, 255, 0.1)",
        "neon-amber": "0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3), 0 0 60px rgba(245, 158, 11, 0.1)",
        "inner-glow": "inset 0 0 20px rgba(0, 163, 255, 0.1)",
        "card-hover": "0 25px 50px -12px rgba(0, 163, 255, 0.25)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "electric-flow": "electric-flow 3s linear infinite",
        "spark": "spark 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "scan-line": "scan-line 8s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.8", filter: "brightness(1.2)" },
        },
        "electric-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "spark": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      borderRadius: {
        "cyber": "2px 16px 2px 16px",
      },
    },
  },
  plugins: [],
};

export default config;
