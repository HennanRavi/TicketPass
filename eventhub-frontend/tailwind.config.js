/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      fontSize: {
        h1: ['35px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['30px', { lineHeight: '1.2' }],
        body: ['30px', { lineHeight: '1.5' }],
        btn: ['25px', { lineHeight: '1.2' }]
      },
      colors: {
        brand: { blue: '#006CBF', green: '#48A732' },
        neutral: { 50: '#FFFFFF', 100: '#EEF3F8', 700: '#333333', 900: '#000000' },
        outline: '#E3E3E3'
      },
      borderRadius: { DEFAULT: '4px', md: '4px', lg: '4px', xl: '8px', '2xl': '12px' },
      boxShadow: { card: '0 2px 8px rgba(0,0,0,0.10)' }
    }
  },
  plugins: []
};
