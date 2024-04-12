/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      width: {
        '5.5/12': '45.833333%', // This is (5.5 / 12 * 100) to get the percentage
      }
    }
  },
  // Add any other customizations here
};
