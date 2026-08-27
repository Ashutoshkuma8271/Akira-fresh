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
          950: '#06170E',
          900: '#0B2B1B', // Primary Deep Forest Green
          850: '#0E3723', // Rich Forest Green
          800: '#13462D',
          750: '#185437',
          700: '#1D613F',
          600: '#2A8257',
        },
        // Fallback aliases ensuring older templates never render transparent
        navy: {
          950: '#061e14',
          900: '#0B2B1B',
          850: '#0E3723',
          800: '#13462D',
          750: '#185437',
          700: '#1D613F',
        },
        lime: {
          300: '#BEF264',
          400: '#A3E635',
          500: '#84CC16', // Fresh Vibrant Olive/Lime
          600: '#65A30D',
        },
        leaf: {
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // Fresh Produce Green
          600: '#16A34A',
          700: '#15803D',
        },
        gold: {
          400: '#A3E635',
          500: '#84CC16',
          600: '#15803D',
          700: '#166534',
        },
        ivory: {
          50: '#FDFCF9',
          100: '#FBF9F4', // Warm Ivory Background
          200: '#F5F1E8',
          300: '#EDE5D5',
        },
        cream: {
          50: '#FDFCF9',
          100: '#FBF9F4',
          200: '#F5F1E8',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E8EFE9', // Soft Sage Tone
          200: '#D2E0D5',
          300: '#B8CCBD',
          800: '#2C4435',
          900: '#1A2C21',
        },
        charcoal: {
          950: '#0E1712',
          900: '#13231B', // Deep Charcoal Typography
          800: '#1E3328',
          700: '#34473D',
          600: '#52665B',
        },
        brand: {
          dark: '#13231B',
          muted: '#63796D',
          border: '#E3ECE5',
          lightBorder: '#233F31',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'leaf-glow': '0 0 25px rgba(34, 197, 94, 0.35)',
        'leaf-sm': '0 2px 10px rgba(34, 197, 94, 0.2)',
        'gold-sm': '0 2px 10px rgba(132, 204, 22, 0.3)',
        'forest-card': '0 10px 30px -5px rgba(11, 43, 27, 0.12)',
        'premium': '0 20px 40px -15px rgba(11, 43, 27, 0.18)',
        'soft-float': '0 15px 35px -5px rgba(19, 70, 45, 0.15), 0 5px 15px rgba(0, 0, 0, 0.05)',
        'elevated': '0 25px 50px -12px rgba(6, 23, 14, 0.25)',
      },
      backgroundImage: {
        'leaf-gradient': 'linear-gradient(135deg, #4ADE80 0%, #22C55E 50%, #16A34A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #A3E635 0%, #84CC16 50%, #65A30D 100%)',
        'navy-gradient': 'linear-gradient(145deg, #061e14 0%, #092b1d 50%, #0d3b27 100%)',
        'forest-gradient': 'linear-gradient(145deg, #0E3723 0%, #0B2B1B 100%)',
        'hero-organic': 'radial-gradient(circle at 75% 45%, #1D613F 0%, #0E3723 50%, #0B2B1B 100%)',
        'soft-sage-gradient': 'linear-gradient(180deg, #FBF9F4 0%, #E8EFE9 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(163, 230, 53, 0.15), transparent)',
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

