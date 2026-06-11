/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // RFX core palette — dark luxury, broadcast-grade.
        carbon: "#05060a",
        graphite: "#0b0e14",
        "graphite-2": "#10141d",
        steel: "#1a2030",
        ash: "#2a3142",
        silver: "#c7ced9",
        "silver-dim": "#8a93a6",
        electric: "#2e8bff",
        "electric-bright": "#5ba8ff",
        velocity: "#ff2d3f",
        "velocity-bright": "#ff5d6c",
        gold: "#ffce4d",
        "gold-deep": "#d99e1f",
        plasma: "#9d6bff",
        mint: "#27e0a4",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        ultra: "0.42em",
        mega: "0.28em",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(46,139,255,0.55)",
        "glow-red": "0 0 44px -8px rgba(255,45,63,0.55)",
        "glow-gold": "0 0 44px -8px rgba(255,206,77,0.5)",
        elevated: "0 30px 80px -24px rgba(0,0,0,0.9)",
        rim: "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "radial-electric":
          "radial-gradient(circle at 50% 0%, rgba(46,139,255,0.18), transparent 60%)",
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
