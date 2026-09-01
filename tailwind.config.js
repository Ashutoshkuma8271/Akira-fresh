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
        forest: {
          950: '#0D1512', // Deep Obsidian Truffle
          900: '#121C18', // Midnight Cold Truffle
          850: '#17241F',
          800: '#1C2E28',
          750: '#233A33',
          700: '#0B4D3C', // Deep Forest Emerald
          600: '#15803D', // Fresh Gourmet Green
        },
        // Fallback aliases ensuring older templates never render transparent
        navy: {
          950: '#0D1512',
          900: '#121C18',
          850: '#17241F',
          800: '#1C2E28',
          750: '#233A33',
          700: '#0B4D3C',
        },
        lime: {
          300: '#BEF264',
          400: '#A3E635',
          500: '#15803D', // Harmonized to Rich Gourmet Green
          600: '#0B4D3C',
        },
        leaf: {
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#15803D', // Deep Forest Emerald
          600: '#0B4D3C',
          700: '#073227',
        },
        gold: {
          400: '#FBBF24',
          500: '#EAB308',
          600: '#D97706', // Saffron Honey / Warm Amber CTA
          700: '#B45309',
        },
        ruby: {
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C', // Rich Ruby Crimson for Offer Badges
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FBFBF9', // Warm Alabaster / Crisp Porcelain
          200: '#F4F4F0',
          300: '#E6E9E6',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FBFBF9',
          200: '#F4F4F0',
        },
        sage: {
          50: '#FBFBF9',
          100: '#F4F4F0',
          200: '#E6E9E6', // Subtle 1px clean border
          300: '#D2D9D3',
          800: '#1C2E28',
          900: '#121C18',
        },
        charcoal: {
          950: '#0D1512',
          900: '#111915', // Deep Crisp Charcoal Typography
          800: '#1F2B24',
          700: '#374151',
          600: '#4B5563',
        },
        brand: {
          dark: '#0D1512',
          emerald: '#0B4D3C',
          gold: '#D97706',
          ruby: '#B91C1C',
          border: '#E6E9E6',
          lightBorder: '#1C2E28',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'leaf-glow': '0 0 25px rgba(21, 128, 61, 0.35)',
        'leaf-sm': '0 2px 10px rgba(21, 128, 61, 0.2)',
        'gold-sm': '0 2px 10px rgba(217, 119, 6, 0.3)',
        'forest-card': '0 10px 30px -5px rgba(13, 21, 18, 0.08)',
        'premium': '0 20px 40px -15px rgba(13, 21, 18, 0.12)',
        'soft-float': '0 15px 35px -5px rgba(13, 21, 18, 0.1), 0 5px 15px rgba(0, 0, 0, 0.04)',
        'elevated': '0 25px 50px -12px rgba(13, 21, 18, 0.25)',
      },
      backgroundImage: {
        'leaf-gradient': 'linear-gradient(135deg, #15803D 0%, #0B4D3C 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
        'navy-gradient': 'linear-gradient(145deg, #0D1512 0%, #121C18 50%, #1C2E28 100%)',
        'forest-gradient': 'linear-gradient(145deg, #17241F 0%, #0D1512 100%)',
        'hero-organic': 'radial-gradient(circle at 75% 45%, #0B4D3C 0%, #121C18 60%, #0D1512 100%)',
        'soft-sage-gradient': 'linear-gradient(180deg, #FBFBF9 0%, #F4F4F0 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.15), transparent)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideLeft: 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleUp: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}

