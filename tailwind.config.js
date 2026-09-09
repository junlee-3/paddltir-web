/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Deep Slate / Navy
        background: "#FAFAFA", // Off-White / Cream
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '4px',
        xl: '6px',
        '2xl': '8px',
        '3xl': '12px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
