/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          elevated: 'var(--bg-elevated)',
          glass: 'var(--bg-glass)',
          'glass-card': 'var(--bg-glass-card)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
        },
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
        },
        success: {
          50: 'var(--success-50)',
          100: 'var(--success-100)',
          500: 'var(--success-500)',
          600: 'var(--success-600)',
        },
        warning: {
          50: 'var(--warning-50)',
          100: 'var(--warning-100)',
          500: 'var(--warning-500)',
          600: 'var(--warning-600)',
        },
        danger: {
          50: 'var(--danger-50)',
          100: 'var(--danger-100)',
          500: 'var(--danger-500)',
          600: 'var(--danger-600)',
        },
        info: {
          50: 'var(--info-50)',
          100: 'var(--info-100)',
          500: 'var(--info-500)',
          600: 'var(--info-600)',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'glow': 'var(--primary-glow)',
      },
      borderRadius: {
        'xs': 'var(--radius-xs)',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'full': 'var(--radius-full)',
      },
      animation: {
        'laser-gradient': 'laserGradient 6s linear infinite',
        'radar-ping': 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'card-cascade': 'cardCascadeEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'modal-spring': 'modalSpringIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'drawer-slide': 'drawerSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-pop': 'springPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float-slow': 'floatSlow 3s ease-in-out infinite',
        'shimmer': 'shimmerSweep 2.5s infinite',
        'toast-slide': 'toastSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        laserGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        radarPing: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '70%, 100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        cardCascadeEnter: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.97)' },
          '60%': { transform: 'translateY(-2px) scale(1.005)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        modalSpringIn: {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(12px)' },
          '60%': { transform: 'scale(1.02) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        drawerSlideIn: {
          '0%': { opacity: '0.4', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        springPop: {
          '0%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmerSweep: {
          '0%': { transform: 'translateX(-150%)' },
          '100%': { transform: 'translateX(150%)' },
        },
        toastSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(60px) scale(0.94)' },
          '65%': { transform: 'translateX(-6px) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
