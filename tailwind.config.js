/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: {
            50: '#f0f4f9',
            100: '#dce5f1',
            200: '#bdcfe3',
            300: '#91b1d1',
            400: '#608ebc',
            500: '#3f70a5',
            600: '#2e5687',
            700: '#26456e',
            800: '#1b3252',
            900: '#0f2038',
            950: '#081222',
          },
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
            950: '#042f2e',
          },
          gold: {
            500: '#eab308',
            600: '#ca8a04',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
