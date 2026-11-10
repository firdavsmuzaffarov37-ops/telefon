/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F5F5F4',
          card: '#FFFFFF',
          orange: '#FF7900',
          orangeHover: '#EA6E00',
          orangeLight: '#FFF4EB',
          orangeGlow: 'rgba(255, 121, 0, 0.15)',
          dark: '#171717',
          darkNav: '#1E1E1E',
          muted: '#888888',
          subtle: '#6B7280',
          border: '#EAEAEA',
          borderSubtle: '#F0F0F0',
          success: '#16A36A',
          successLight: '#EDFDF5',
          warning: '#F5A623',
          warningLight: '#FEF8EC',
          danger: '#E5484D',
          dangerLight: '#FDF1F2',
          blueBadge: '#0284C7',
          blueLight: '#E0F2FE',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 10px -3px rgba(0, 0, 0, 0.04)',
        'panel': '-4px 0 24px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}

