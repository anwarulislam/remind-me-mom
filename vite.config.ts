import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";

export const PWAConfig: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Remind Me Mom",
    short_name: "Remind Me Mom",
    description:
      "Remind Me Mom is a simple app to help you remember to do things.",
    theme_color: "#333333",
    icons: [
      {
        src: "pwa-192x192.jpg",
        sizes: "192x192",
        type: "image/jpg",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA(PWAConfig)],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
