// module.exports = {
//   purge: [],
//   darkMode: false, // or 'media' or 'class'
//   theme: {
//     extend: {},
//   },
//   variants: {
//     extend: {},
//   },
//   plugins: [],
// }

module.exports= {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pinky: '#ff80ab', // 夢幻粉色主色
        soft: '#ffe4ed',  // 柔和粉底
        pinkk: '#ffccdd',
        backColor: '#fff0f0',

      },
      boxShadow: {
        'xl': '0 0 25px 12px rgba(158, 131, 131, 0.8)',  // 改寫原本的 shadow-xl
        'custom-glass': '0 8px 32px rgba(158, 131, 131, 0.5)', // 自訂一個陰影樣式
        'lg-soft': '0 10px 15px -3px rgba(158, 131, 131, 0.3), 0 4px 6px -4px rgba(158, 131, 131, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      }
    },
  },
  plugins: [],
}


