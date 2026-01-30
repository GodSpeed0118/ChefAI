/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dae3fd',
          300: '#bdcbfa',
          400: '#94a7f7',
          500: '#6479f1',
          600: '#4655e8',
          700: '#3841d1',
          800: '#3237a9',
          900: '#2d3287',
          950: '#1e214f', // Deep indigo for backgrounds
        },
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1', // Template indigo
          600: '#4f46e5',
          700: '#4338ca',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981', // Template green
          600: '#059669',
          700: '#047857',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
