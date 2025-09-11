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
        primary: '#1E88E5',
        secondary: '#0D47A1',
        accent: '#FDD835',
        success: '#43A047',
        warning: '#FB8C00',
        danger: '#E53935',
        info: '#26C6DA',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        textPrimary: '#212121',
        textSecondary: '#616161'
      },
      fontFamily: {
        sans: ['Delius', 'sans-serif'],
        heading: ['Macondo', 'sans-serif']
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
