/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFCF9',
          100: '#FAF9F5',
          200: '#F4F2EC',
          300: '#E9E6DC',
          400: '#D5D1C4',
        },
        charcoal: {
          900: '#171717',
          800: '#232321',
          700: '#383835',
          600: '#52524E',
          500: '#73736C',
          400: '#9C9B94',
        },
        indigo: {
          50: '#F0F3FF',
          100: '#E0E7FE',
          200: '#C7D2FE',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#262366',
          950: '#1A1847',
        },
        border: {
          light: '#EBE9E1',
          DEFAULT: '#E2E0D8',
          strong: '#C9C6BC',
        }
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        serif: [
          'Newsreader',
          'Charter',
          'Georgia',
          'serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'elevated': '0 4px 16px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
