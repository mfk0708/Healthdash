/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
       borderColorCustom: '#e5e7eb'
      },
    },
  },
  plugins: [],
};
