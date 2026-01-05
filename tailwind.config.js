/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
      },
      fontSize: {
        '2xs': '0.05rem',
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px  
        '7xl': '4.5rem',   // 72px
        '8xl': '5rem',     // 80px (your original size)
        '9xl': '6rem',     // 96px
      },
      colors: {
        'irish-navy': '#0c2340',
        'soft-green': '#4a6350',
        'muted-green': '#6a998f',
        'light-green': '#90b7a7',
        'shadow-green': '#a8c3b4',
        'irish-green': '#00823e',
      },
      spacing: {
        '200': '200px',
      },
      textShadow: {
        'green': '3px 3px 4px #a8c3b4',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-green': {
          textShadow: '3px 3px 4px #a8c3b4',
        },
      }
      addUtilities(newUtilities)
    }
  ],
  safelist: [
    'bg-irish-navy',
    'bg-irish-green',
    'text-muted-green',
    'text-irish-green',
    'font-Merriweather',
    'font-Montserrat',
    'text-shadow-green',
  ],
}