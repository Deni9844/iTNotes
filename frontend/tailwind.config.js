/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'black-opacity-30': 'rgba(0,0,0,0.3)',
        'black-opacity-20': 'rgba(0,0,0,0.2)',
        'black-opacity-10': 'rgba(0,0,0,0.1)',
        'black-opacity-80': 'rgba(0,0,0,0.8)',
        'secondary':'#5967E5'
      },
      boxShadow: {
        'custom': '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      }
    },

  },
  plugins: [],
}

