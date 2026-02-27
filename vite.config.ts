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

          const isReactCore =
            id.includes("/node_modules/react/") ||
            id.includes("\\node_modules\\react\\") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("\\node_modules\\react-dom\\") ||
            id.includes("/node_modules/react-router-dom/") ||
            id.includes("\\node_modules\\react-router-dom\\");

          const isChartsVendor =
            id.includes("/node_modules/recharts/") ||
            id.includes("\\node_modules\\recharts\\") ||
            id.includes("/node_modules/recharts-scale/") ||
            id.includes("\\node_modules\\recharts-scale\\") ||
            id.includes("/node_modules/victory-vendor/") ||
            id.includes("\\node_modules\\victory-vendor\\") ||
            id.includes("/node_modules/chart.js/") ||
            id.includes("\\node_modules\\chart.js\\");

          if (isReactCore) {
            return "react-vendor";
          }

          if (id.includes("@radix-ui")) return "radix-vendor";
          if (id.includes("framer-motion") || id.includes("gsap") || id.includes("lottie-react")) {
            return "motion-vendor";
          }
          if (isChartsVendor) return "charts-vendor";
          if (id.includes("@tanstack/react-query")) return "query-vendor";
          if (id.includes("axios") || id.includes("zod") || id.includes("jotai")) {
            return "utils-vendor";
          }
        },
      },
    },
  },
});
