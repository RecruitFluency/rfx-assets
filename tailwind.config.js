/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── RFX brand system ──────────────────────────────────────────
        // White · Jet Black · Matte Black · Deep Red · subtle electric blue
        white: "#ffffff",
        carbon: "#050505", // jet black — base canvas
        jet: "#050505",
        graphite: "#0b0b0d", // deep matte
        "graphite-2": "#141417", // matte black — panels
        steel: "#1c1c20",
        ash: "#2a2a30",
        matte: "#0e0e10",
        silver: "#d4d4d8", // primary light text
        "silver-dim": "#85858c", // muted text

        // Deep red — the brand's primary accent (the RFX mark)
        velocity: "#c20017",
        "velocity-bright": "#e11d2a",
        red: "#c20017",
        "red-deep": "#7c000f",

        // Subtle electric dark blue — secondary accent, used sparingly
        electric: "#2e50d4",
        "electric-bright": "#4b6eff",

        // Legacy token names remapped onto the brand (kept for class reuse)
        gold: "#cfcfd6",
        "gold-deep": "#9a9aa0",
        plasma: "#2e50d4",
        mint: "#4b6eff",
      },
      fontFamily: {
        // Inter Tight (500–900) for display, Inter for body, Space Grotesk
        // for technical labels / eyebrows (mapped onto the old `mono` token).
        display: ['"Inter Tight"', '"Inter"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        grotesk: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"Space Grotesk"', "ui-monospace", "monospace"],
      },
      // Numeric weight utilities (font-500 … font-900) for Inter Tight control
      fontWeight: {
        300: "300",
        400: "400",
        500: "500",
        600: "600",
        700: "700",
        800: "800",
        900: "900",
      },
      letterSpacing: {
        ultra: "0.42em",
        mega: "0.28em",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(46,80,212,0.5)",
        "glow-red": "0 0 44px -8px rgba(194,0,23,0.6)",
        "glow-gold": "0 0 44px -8px rgba(207,207,214,0.4)",
        elevated: "0 30px 80px -24px rgba(0,0,0,0.92)",
        rim: "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "radial-electric":
          "radial-gradient(circle at 50% 0%, rgba(46,80,212,0.16), transparent 60%)",
        "carbon-fiber":
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0 2px, transparent 2px 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.015) 0 2px, transparent 2px 4px)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        shimmer: "shimmer 3s linear infinite",
        float: "float 6s ease-in-out infinite",
        ticker: "ticker-scroll 40s linear infinite",
      },
    },
  },
  plugins: [],
};
