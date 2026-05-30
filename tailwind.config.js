/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#006a68',
        'primary-container': '#4fbdba',
        surface: '#f9f9ff',
        'on-surface': '#111c2c',
        'on-surface-variant': '#3d4948',
        'surface-dim': '#cfdaf1',
        'tertiary': '#006a67',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}