import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import seoPlugin from "./scripts/seo-plugin.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",
  plugins: [react(), seoPlugin()],
  resolve: {
    alias: {
      "@": root,
    },
  },
});
