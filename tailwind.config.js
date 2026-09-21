/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-green': '#a8e6a3',
        'mint-blue': '#9fd3c7',
        'cream': '#fff8e7',
        'soft-pink': '#ffb5b5',
        'lavender': '#d4c5f9',
        'warm-yellow': '#ffeaa7',
        'midnight-blue': '#1a1a3e',
        'dino-teal': '#7ec4cf',
        'dino-green': '#5fd38f',
      },
      fontFamily: {
        'cute': ['"Quicksand"', '"Comic Sans MS"', 'system-ui', 'sans-serif'],
        'romantic': ['"Dancing Script"', '"Pacifico"', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
}
