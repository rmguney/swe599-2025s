/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'header-bg': 'var(--header-bg)',
        'header-text': 'var(--header-text)',
        'accent-color': 'var(--accent-color)',
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
