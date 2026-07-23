import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0F1A14',
          50: '#E8EDE9',
          900: '#0A1410',
          950: '#050A07',
        },
paper: {
  DEFAULT: '#F2EBDC',
  bright: '#FBF7EE',
  50: '#FBF7EE',
  100: '#F6F0E2',
},
        terracotta: {
          DEFAULT: '#D97706',
          dark: '#A85A04',
        },
        kivu: {
          DEFAULT: '#06A0C0',
          dark: '#047A91',
        },
        ink: '#1A1612',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-schibsted)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      letterSpacing: {
        editorial: '-0.04em',
        tightest: '-0.06em',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(-4%, 2%)' },
          '30%': { transform: 'translate(2%, -4%)' },
          '40%': { transform: 'translate(-1%, 3%)' },
          '50%': { transform: 'translate(-3%, 1%)' },
          '60%': { transform: 'translate(3%, -2%)' },
          '70%': { transform: 'translate(-2%, -1%)' },
          '80%': { transform: 'translate(2%, 3%)' },
          '90%': { transform: 'translate(-3%, -2%)' },
        },
        revealUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marqueeY: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        grain: 'grain 8s steps(10) infinite',
        revealUp: 'revealUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        marqueeY: 'marqueeY 40s linear infinite',
      },
      boxShadow: {
        warm: '0 12px 40px -12px rgba(26, 22, 18, 0.35)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
