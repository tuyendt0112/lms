/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif;']
    },
    extend: {
      width: {
        main: '1380px'
      },
      colors: {
        main: '#ee3131',
        overlay: 'rgba(0,0,0,0.7)',
        "dark-purple": "#081A51",
        "light-white": "rgba(255,255,255,0.18)",
        "login": "#061027",
        "login-2": "#07386e"
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
      },
      keyframes: {
        'slide-top': {
          '0%': {
            '-webkit-transform': 'translateY(20px);',
            transform: 'translateY(40px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0px);',
            transform: 'translateY(0px);'
          }
        },
        'slide-top-sm': {
          '0%': {
            '-webkit-transform': 'translateY(8px);',
            transform: 'translateY(8px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0px);',
            transform: 'translateY(0px);'
          }
        },
        'slide-right': {
          '0%': {
            '-webkit-transform': 'translateX(-1000px);',
            transform: 'translateX(-1000px);'
          },
          '100%': {
            '-webkit-transform': 'translateX(0px);',
            transform: 'translateX(0px);'
          }
        },
        'scale-up-ver-center': {
          '0%': {
            '-webkit-transform': 'scaleY(0.4);',
            transform: 'scaleY(0.4);'
          },
          '100%': {
            '-webkit-transform': ' scaleY(1);',
            transform: 'scaleY(1);'
          }
        },
      },
      animation: {
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-top-sm': 'slide-top-sm 0.2s linear both;',
        'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'scale-up-center': 'scale-up-ver-center 0.15s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/forms'),
  ],
}