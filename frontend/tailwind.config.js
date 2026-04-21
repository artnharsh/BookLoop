/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
            light: '#f3f4f6',
            dark: '#07111f',
            accent: '#34d399',
        }
      },
      backdropBlur: {
        md: '12px',
        lg: '24px',
      }
    },
  },
  plugins: [],
}