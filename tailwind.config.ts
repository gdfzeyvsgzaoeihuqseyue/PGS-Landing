import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0072ff',
        secondary: '#02358b',
        accent: '#ffea00',
        success: '#43A047',
        warning: '#FB8C00',
        danger: '#E53935',
        info: '#26C6DA',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        textPrimary: '#323c4f',
        textSecondary: '#616161'
      },
      fontFamily: {
        sans: ['Amaranth', 'sans-serif'],
        heading: ['Macondo', 'sans-serif'],
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
} satisfies Config
