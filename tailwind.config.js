/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- Esto es lo más importante de la guía de Vite
  ],
  theme: {
    extend: {
      colors: {
        // Tu paleta personalizada de Stardew Valley
        stardew: {
          wood: '#854d0e',
          woodLight: '#a16207',
          cream: '#fef3c7',
          creamDark: '#fde68a',
          green: '#15803d',
          gold: '#eab308',
          blue: '#1e3a8a',
        }
      },
      fontFamily: {
        stardewFont: ['"Courier New"', 'Courier', 'monospace'], 
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}