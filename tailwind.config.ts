import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dna: {
          primary: "#F59E0B",      // warm amber/yellow accent
          primaryHover: "#D97706",
          primaryLight: "#FEF3C7",
          dark: "#1F2937",
          darker: "#111827",
          surface: "#FFFFFF",
          surfaceSubtle: "#F9FAFB",
          border: "#E5E7EB",
          muted: "#6B7280",
          accentGreen: "#10B981",
          accentBlue: "#3B82F6",
          accentPurple: "#8B5CF6",
          accentRed: "#EF4444",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.06)",
        cardHover: "0 20px 40px -10px rgba(245, 158, 11, 0.15)",
        glow: "0 0 25px rgba(245, 158, 11, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
