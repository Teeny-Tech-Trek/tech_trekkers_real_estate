import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "react-vendor";
          }

          if (id.includes("@radix-ui")) return "radix-vendor";
          if (id.includes("framer-motion") || id.includes("gsap") || id.includes("lottie-react")) {
            return "motion-vendor";
          }
          if (id.includes("chart.js") || id.includes("recharts")) return "charts-vendor";
          if (id.includes("@tanstack/react-query")) return "query-vendor";
          if (id.includes("axios") || id.includes("zod") || id.includes("jotai")) {
            return "utils-vendor";
          }
        },
      },
    },
  },
});
