/// <reference types="vite/client" />

// ============================
// Type definitions for environment variables in Vite
// ============================

// Define all expected environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;  // Optional API URL
  readonly VITE_APP_ENV?: string;  // Optional application environment (e.g., "development", "production")
  // You can add more custom environment variables here as needed
}

// Extend the ImportMeta interface to include env
interface ImportMeta {
  readonly env: ImportMetaEnv;  // Provides type-safe access to environment variables
}
