/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors — driven by CSS variables defined in index.css
        // All existing class names (bg-cream-50, text-forest-600, etc.)
        // automatically respond to the active theme.
        cream: {
          50: 'rgb(var(--c-bg) / <alpha-value>)',
          100: 'rgb(var(--c-bg-alt) / <alpha-value>)',
          200: 'rgb(var(--c-border) / <alpha-value>)',
          300: 'rgb(var(--c-border-strong) / <alpha-value>)',
        },
        forest: {
          50: 'rgb(var(--c-primary-light) / <alpha-value>)',
          100: 'rgb(var(--c-primary-light) / <alpha-value>)',
          200: 'rgb(var(--c-primary-light) / <alpha-value>)',
          300: 'rgb(var(--c-text-faint) / <alpha-value>)',
          400: 'rgb(var(--c-text-muted) / <alpha-value>)',
          500: 'rgb(var(--c-primary) / <alpha-value>)',
          600: 'rgb(var(--c-text) / <alpha-value>)',
          700: 'rgb(var(--c-text) / <alpha-value>)',
          800: 'rgb(var(--c-text) / <alpha-value>)',
          900: 'rgb(var(--c-overlay) / <alpha-value>)',
        },
        timber: {
          50: 'rgb(var(--c-bg-alt) / <alpha-value>)',
          100: 'rgb(var(--c-bg-alt) / <alpha-value>)',
          200: 'rgb(var(--c-text-faint) / <alpha-value>)',
          300: 'rgb(var(--c-text-faint) / <alpha-value>)',
          400: 'rgb(var(--c-text-muted) / <alpha-value>)',
          500: 'rgb(var(--c-primary) / <alpha-value>)',
        },
        gold: {
          50: 'rgb(var(--c-accent-light) / <alpha-value>)',
          100: 'rgb(var(--c-accent-light) / <alpha-value>)',
          200: 'rgb(var(--c-accent-light) / <alpha-value>)',
          300: 'rgb(var(--c-accent) / <alpha-value>)',
          400: 'rgb(var(--c-accent) / <alpha-value>)',
          500: 'rgb(var(--c-accent) / <alpha-value>)',
          600: 'rgb(var(--c-accent-hover) / <alpha-value>)',
          700: 'rgb(var(--c-accent-hover) / <alpha-value>)',
        },
        // Text on dark/photo backgrounds — always light, theme-independent
        ondark: {
          DEFAULT: 'rgb(var(--c-on-dark) / <alpha-value>)',
          muted: 'rgb(var(--c-on-dark-muted) / <alpha-value>)',
        },
        // Static colors (not theme-aware)
        terracotta: {
          400: '#C97B5B',
          500: '#B8623F',
          600: '#9C4E2F',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"LXGW WenKai TC"', '"Noto Serif TC"', '"Noto Sans TC"', '"Noto Sans SC"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Noto Sans TC"', '"Noto Sans SC"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
