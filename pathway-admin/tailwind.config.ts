import type { Config } from "tailwindcss";

const config: Config = {
  // No dark mode toggle — light-only theme
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "var(--font-geist-sans)", "sans-serif"],
        mono:    ["var(--font-geist-mono)", "monospace"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        surface:    "hsl(var(--surface))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",

        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        /* Semantic palette aliases */
        amber:    { DEFAULT: "hsl(27 55% 52%)", light: "hsl(27 55% 52% / 0.12)", dark: "hsl(27 55% 38%)" },
        sage:     { DEFAULT: "hsl(74 22% 52%)",  light: "hsl(74 22% 52% / 0.12)",  dark: "hsl(74 28% 32%)" },
        linen:    { DEFAULT: "hsl(36 28% 93%)",  dark:  "hsl(36 20% 85%)" },
        espresso: { DEFAULT: "hsl(24 18% 18%)",  light: "hsl(24 10% 48%)" },
      },
      borderRadius: {
        lg:  "var(--radius)",
        md:  "calc(var(--radius) - 2px)",
        sm:  "calc(var(--radius) - 6px)",
        xl:  "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        glass:      "var(--glass-shadow)",
        "glass-lg": "0 16px 48px rgba(80, 60, 40, 0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
        warm:       "0 4px 20px rgba(192, 120, 56, 0.18)",
        "warm-lg":  "0 8px 32px rgba(192, 120, 56, 0.28)",
      },
      backgroundImage: {
        "grain":         "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        "liquid-amber":  "linear-gradient(135deg, hsl(27 55% 52%), hsl(27 55% 44%))",
        "liquid-sage":   "linear-gradient(135deg, hsl(74 22% 52%), hsl(74 22% 42%))",
        "warm-fade":     "linear-gradient(to bottom, hsl(38 30% 96%), hsl(36 28% 93%))",
      },
      animation: {
        "liquid-float": "liquidFloat 20s ease-in-out infinite alternate",
        "shimmer":      "shimmer 1.6s ease-in-out infinite",
        "fade-up":      "fadeUp 0.4s ease-out",
        "fade-in":      "fadeIn 0.3s ease-out",
      },
      keyframes: {
        liquidFloat: {
          "0%":   { transform: "translate(0, 0) scale(1)" },
          "33%":  { transform: "translate(4%, -6%) scale(1.06)" },
          "66%":  { transform: "translate(-3%, 4%) scale(0.96)" },
          "100%": { transform: "translate(5%, 3%) scale(1.04)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
