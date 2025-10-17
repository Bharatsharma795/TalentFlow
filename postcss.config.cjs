// Import Tailwind CSS and Autoprefixer plugins
const tailwindcss = require('tailwindcss'); // Tailwind CSS framework
const autoprefixer = require('autoprefixer'); // Adds vendor prefixes automatically

// Export PostCSS configuration
module.exports = {
  plugins: {
    tailwindcss,    // Enable Tailwind CSS
    autoprefixer,   // Enable Autoprefixer
  },
};
