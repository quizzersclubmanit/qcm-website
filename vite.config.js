import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    // Allow ngrok domains through Vite's host header check
    allowedHosts: [
      "recital-emote-nimbly.ngrok-free.dev",
      ".ngrok-free.dev",
      ".ngrok-free.app",
      ".ngrok.io",
      ".ngrok.app",
    ],
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Production hygiene: strip console.* + debugger (Nav/Auth hot paths log
  // on every render; visitor consoles stay clean). Errors still propagate.
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    minify: "esbuild",
    manifest: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react-router") ||
              id.includes("/react/") ||
              id.includes("react-dom") ||
              id.includes("react-helmet")
            )
              return "react-vendor"
            if (id.includes("@reduxjs") || id.includes("react-redux"))
              return "redux"
            if (id.includes("gsap")) return "gsap"
            // NOTE: react-slick must NOT get its own chunk — splitting its CJS
            // default-export interop breaks ("type is invalid ... got: object"
            // on every /events/* route). It stays in "vendor".
            if (id.includes("appwrite") || id.includes("axios")) return "api"
            return "vendor"
          }
          return undefined
        },
      },
    },
  },
})
