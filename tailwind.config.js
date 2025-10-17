/** @type {import('tailwindcss').Config} */

// Tailwind CSS configuration
export default {
  // ============================
  // Specify files Tailwind should scan for class names
  // ============================
  content: [
    "./index.html",          // Include main HTML file
    "./src/**/*.{ts,tsx,js,jsx}" // Include all TS/JS/TSX/JSX files in src
  ],

  // ============================
  // Theme customization
  // ============================
  theme: {
    extend: {}, // Extend default theme if needed
  },

  // ============================
  // Tailwind plugins
  // ============================
  plugins: [], // Add plugins here (e.g., forms, typography)
};
