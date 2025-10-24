/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grocery-green': '#4CAF50',
        'grocery-yellow': '#F4D03F',
        'grocery-red': '#E74C3C',
        'grocery-light': '#FAFAFA',
        'grocery-dark': '#333333',
        'grocery-background': '#F9FFF6',
        'grocery-card': '#FFFFFF',
        'grocery-shadow': '#E0E0E0',
      },
    },
  },
  plugins: [],
}