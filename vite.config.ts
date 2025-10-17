/// <reference types="vite/client" />

// Import Vite's defineConfig helper
import { defineConfig } from "vite";

// Import React plugin for Vite
import react from "@vitejs/plugin-react";

// ============================
// Vite configuration
// ============================
// https://vitejs.dev/config/
export default defineConfig({
  
  // Enable React plugin
  plugins: [react()],
  base: "./",
  // Dev server configuration
  server: {
    port: 5173, // Specify dev server port
  },
});
