/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grocery-green': '#8BC34A',
        'grocery-light-green': '#7CB342',
        'grocery-yellow': '#FFC107',
        'grocery-orange': '#FF9800',
        'grocery-light': '#FFFFFF',
        'grocery-soft-background': '#F9FFF6',
        'grocery-dark': '#333333',
        'grocery-card': '#FFFFFF',
        'grocery-shadow': '#E0E0E0',
      },
    },
  },
  plugins: [],
}