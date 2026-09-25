/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nutri: {
          a: '#1b8a43', // Grade A - Dark Green
          b: '#85bb2f', // Grade B - Light Green
          c: '#fecb02', // Grade C - Yellow
          d: '#ee8100', // Grade D - Orange
          e: '#e63e11', // Grade E - Red
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      },
      screens: {
        'xs': '400px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
