/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0EFFF',
          100: '#E5E2FF',
          500: '#5B47E0',
          600: '#4F3DC4',
          700: '#4332A8'
        },
        secondary: {
          100: '#F3F1FF',
          500: '#8B7FE8',
          600: '#7B6FE5'
        },
        accent: {
          50: '#F0FDFA',
          500: '#00D4AA',
          600: '#00BF9A'
        },
        surface: '#FFFFFF',
        background: '#F8F9FB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'xs': ['0.64rem', '1rem'],
        'sm': ['0.8rem', '1.25rem'],
        'base': ['1rem', '1.5rem'],
        'lg': ['1.25rem', '1.75rem'],
        'xl': ['1.563rem', '2rem'],
        '2xl': ['1.953rem', '2.5rem'],
        '3xl': ['2.441rem', '3rem'],
        '4xl': ['3.052rem', '3.5rem']
      },
      animation: {
        'bounce-gentle': 'bounce 0.3s ease-out',
        'scale-in': 'scale-in 0.15s ease-out',
        'scale-out': 'scale-out 0.15s ease-in',
        'slide-up': 'slide-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out'
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}