import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// RFX — Recruiting Future Exchange
// Vite build configuration tuned for a heavy WebGL + motion frontend.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Split the heavyweight 3D/animation libraries so the initial
        // HTML/CSS shell paints fast and the universe streams in.
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei"],
          motion: ["gsap", "framer-motion"],
        },
      },
    },
  },
});
