/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#222222',
          heading: '#222222',
          muted: '#3D3A37',
        },
        burnt: {
          50: '#FBF4EE',
          100: '#F6E7DE',
          200: '#ECD0C0',
          300: '#E1B19C',
          400: '#D48463',
          500: '#C65D32', // Primary burnt orange
          600: '#B64E24',
          700: '#983E1A',
          800: '#7A3216',
          900: '#5D2510',
        },
        sand: {
          50: '#FAF5EF',
          100: '#F5EBE0',
          200: '#E8B786', // Secondary sand
          300: '#DC9F63',
          400: '#CF8843',
        },
        ivory: {
          DEFAULT: '#F7F3ED', // Background
          light: '#FCFAF7',
          dark: '#EFE9DF',
        },
        paper: '#FFFFFF', // Content surfaces
        mainText: '#252525',
        secondaryText: '#706B66',
        appBorder: {
          DEFAULT: '#E7E0D8',
          subtle: '#EFE9E2',
          strong: '#D8CFC5',
        },
        success: {
          DEFAULT: '#38765C',
          light: '#EDF5F1',
          border: '#C0DCD0',
        },
        error: {
          DEFAULT: '#B93838',
          light: '#FDF1F1',
          border: '#F2C6C6',
        }
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
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
        'subtle': '0 1px 2px 0 rgba(34, 34, 34, 0.04)',
        'card': '0 2px 6px -1px rgba(34, 34, 34, 0.06), 0 1px 3px -1px rgba(34, 34, 34, 0.03)',
        'elevated': '0 8px 20px -3px rgba(34, 34, 34, 0.08), 0 3px 6px -2px rgba(34, 34, 34, 0.03)',
        'popover': '0 16px 28px -5px rgba(34, 34, 34, 0.12), 0 6px 10px -4px rgba(34, 34, 34, 0.05)',
      }
    },
  },
  plugins: [],
}
