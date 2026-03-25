module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        dark: '#1f2937',
        light: '#f9fafb',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in',
        fadeOut: 'fadeOut 0.3s ease-out',
        slideInUp: 'slideInUp 0.3s ease-out',
        slideInDown: 'slideInDown 0.3s ease-out',
        slideOutUp: 'slideOutUp 0.3s ease-in',
        slideOutDown: 'slideOutDown 0.3s ease-in',
        spin3d: 'spin3d 1s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        shimmer: 'shimmer 2s infinite',
        gradient: 'gradient 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideInDown: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideOutUp: {
          '0%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
        },
        slideOutDown: {
          '0%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
        },
        spin3d: {
          '0%': {
            transform: 'rotateX(0deg) rotateY(0deg)',
          },
          '100%': {
            transform: 'rotateX(360deg) rotateY(360deg)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
        gradient: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      },
      backgroundImage: {
        'gradient-anim': 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      },
      backgroundSize: {
        'gradient-size': '400% 400%',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 60px rgba(59, 130, 246, 0.7)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
      backdropFilter: {
        'glass': 'blur(10px)',
      },
      perspective: {
        '1000': '1000px',
      },
      transformOrigin: {
        'center': 'center',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-blue-500',
    'text-green-600',
    'text-red-600',
    'text-yellow-600',
    'text-blue-600',
    'border-green-200',
    'border-red-200',
    'border-yellow-200',
    'border-blue-200',
  ],
}
