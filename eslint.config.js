// Import ESLint configs and plugins
import js from '@eslint/js';                          // ESLint core JS config
import globals from 'globals';                        // Common global variables
import reactHooks from 'eslint-plugin-react-hooks';   // React Hooks plugin
import reactRefresh from 'eslint-plugin-react-refresh'; // React Refresh plugin
import tseslint from 'typescript-eslint';            // TypeScript ESLint plugin

// Import ESLint config helpers
import { defineConfig, globalIgnores } from 'eslint/config';

// ============================
// ESLint Configuration
// ============================
// Using defineConfig to type-check ESLint config
export default defineConfig([
  // Ignore specific folders globally
  globalIgnores(['dist']),

  // Apply rules to TypeScript and TSX files
  {
    files: ['**/*.{ts,tsx}'],

    // Extend recommended configurations from ESLint and plugins
    extends: [
      js.configs.recommended,                    // ESLint recommended JS rules
      tseslint.configs.recommended,              // TypeScript recommended rules
      reactHooks.configs['recommended-latest'], // React Hooks rules
      reactRefresh.configs.vite,                 // Vite-specific React Refresh rules
    ],

    // Language options for linting
    languageOptions: {
      ecmaVersion: 2020,        // Support modern ECMAScript syntax
      globals: globals.browser, // Use browser global variables
    },
  },
]);
