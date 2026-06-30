import type { Config } from 'tailwindcss';

/**
 * GCOS Design Tokens — TAD §14.2.
 *
 * Two token systems live side by side here:
 *  1. CSS-variable-backed tokens (background, border, primary, etc.) —
 *     these power the shadcn/ui primitives in packages/ui and are what
 *     make Dark Mode (Week 6, TAD §14.5) a CSS-variable swap with no
 *     component refactor.
 *  2. GCOS brand tokens (navy, teal, score.*, status.*) — fixed hex
 *     values straight from the TAD, used by the pattern components
 *     (ReadinessScoreBadge, StatusBadge, etc.) in packages/ui/src/patterns.
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui CSS-variable tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // GCOS brand palette — TAD §14.2
        navy: {
          DEFAULT: '#0A1F3D',
          light: '#1E3A5F',
        },
        teal: {
          DEFAULT: '#0A7A8A',
          light: '#E0F4F7',
          dark: '#065A68',
        },
        score: {
          critical: '#7F1D1D', // 0-40
          warning: '#92400E', // 41-60
          good: '#14532D', // 61-80
          excellent: '#064E3B', // 81-100
        },
        status: {
          'not-started': '#6B7280',
          'in-progress': '#1D4ED8',
          completed: '#15803D',
          blocked: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'Courier New', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionDuration: {
        '800': '800ms',
      },
      keyframes: {
        'ring-fill': {
          from: { strokeDashoffset: 'var(--ring-circumference)' },
          to: { strokeDashoffset: 'var(--ring-offset)' },
        },
      },
      animation: {
        'ring-fill': 'ring-fill 800ms ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
