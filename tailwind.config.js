/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#0c0c0c',
          navy: '#1a1a2e', 
          blue: '#16213e',
          cyan: '#00d4ff',
          orange: '#ff6b6b',
          amber: '#ffa500',
          purple: '#9b59b6'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 4s infinite',
        'bounce-gentle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'twinkle': 'twinkle 4s infinite alternate',
        'rocket-move': 'rocketMove 2s ease-in-out infinite',
        'trail': 'trail 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' }
        },
        rocketMove: {
          '0%, 100%': { transform: 'translateX(-10px) rotate(-15deg)' },
          '50%': { transform: 'translateX(10px) rotate(15deg)' }
        },
        trail: {
          '0%, 100%': { opacity: '0.3', transform: 'translateX(-20px)' },
          '50%': { opacity: '1', transform: 'translateX(20px)' }
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        'cyan-orange': 'linear-gradient(135deg, #00d4ff 0%, #ff6b6b 100%)',
        'cyan-blue': 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        'orange-red': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        'shimmer': 'linear-gradient(90deg, #333 25%, #555 50%, #333 75%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        'space': '0 25px 50px rgba(0, 0, 0, 0.3)',
        'space-lg': '0 35px 60px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
} 