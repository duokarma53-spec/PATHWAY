import type { Config } from "tailwindcss";

const config: Config = {
  // Dark mode class configuration
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono:    ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["Inter", "var(--font-geist-sans)", "system-ui", "sans-serif"],
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

        /* Client Brand Tokens — Obsidian, Charcoal & Electric Orange */
        brand: {
          black:      "#0D0A08",
          dark:       "#15100D",
          card:       "#1D1510",
          elevated:   "#271A12",
          orange: {
            DEFAULT:  "#FF6B00",
            secondary:"#FF8A35",
            hover:    "#E05E00",
            glow:     "rgba(255, 107, 0, 0.25)",
          },
          text: {
            primary:  "#F8F5F1",
            secondary:"#BDB0A4",
            muted:    "#897B70",
          },
          border: {
            subtle:   "rgba(255, 255, 255, 0.08)",
            orange:   "rgba(255, 107, 0, 0.25)",
          },
        },

        /* Semantic palette aliases mapped to dark theme for backward compatibility */
        amber: {
          DEFAULT: "#FF6B00",
          light:   "rgba(255, 107, 0, 0.14)",
          dark:    "#E05E00",
        },
        sage: {
          DEFAULT: "#1DB874",
          light:   "rgba(29, 184, 116, 0.14)",
          dark:    "#158755",
        },
        linen: {
          DEFAULT: "#1D1510",
          dark:    "#15100D",
        },
        espresso: {
          DEFAULT: "#0D0A08",
          light:   "#BDB0A4",
        },
      },
      borderRadius: {
        lg:  "var(--radius)",
        md:  "calc(var(--radius) - 2px)",
        sm:  "calc(var(--radius) - 6px)",
        xl:  "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        glass:         "0 8px 32px -4px rgba(0, 0, 0, 0.65)",
        "glass-lg":    "0 16px 48px -6px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "orange-glow": "0 0 24px -2px rgba(255, 107, 0, 0.35)",
        "orange-sm":   "0 0 12px -2px rgba(255, 107, 0, 0.22)",
        warm:          "0 4px 20px rgba(0, 0, 0, 0.5)",
        "warm-lg":     "0 8px 32px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "grain":                 "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        "liquid-amber":          "linear-gradient(135deg, #FF6B00 0%, #E05E00 100%)",
        "liquid-sage":           "linear-gradient(135deg, #1DB874 0%, #158755 100%)",
        "orange-gradient":       "linear-gradient(135deg, #FF6B00 0%, #FF8A35 100%)",
        "orange-gradient-hover": "linear-gradient(135deg, #FF7A1A 0%, #FF994A 100%)",
        "dark-card":             "linear-gradient(145deg, #1D1510 0%, #15100D 100%)",
        "dark-elevated":         "linear-gradient(145deg, #271A12 0%, #1D1510 100%)",
        "warm-fade":             "linear-gradient(to bottom, #15100D, #0D0A08)",
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
