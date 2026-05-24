import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(218 22% 18%)',
        input: 'hsl(218 22% 18%)',
        ring: 'hsl(208 100% 70%)',
        background: 'hsl(224 46% 6%)',
        foreground: 'hsl(210 40% 98%)',
        primary: {
          DEFAULT: 'hsl(191 92% 55%)',
          foreground: 'hsl(224 46% 6%)',
        },
        secondary: {
          DEFAULT: 'hsl(225 22% 14%)',
          foreground: 'hsl(210 40% 96%)',
        },
        muted: {
          DEFAULT: 'hsl(222 20% 12%)',
          foreground: 'hsl(215 20% 72%)',
        },
        accent: {
          DEFAULT: 'hsl(260 92% 66%)',
          foreground: 'hsl(210 40% 98%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84% 60%)',
          foreground: 'hsl(210 40% 98%)',
        },
        card: {
          DEFAULT: 'rgba(13, 18, 38, 0.72)',
          foreground: 'hsl(210 40% 98%)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56,189,248,0.18), 0 20px 60px rgba(10,15,30,0.45)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(56,189,248,0.25), transparent 32%), radial-gradient(circle at 20% 10%, rgba(139,92,246,0.24), transparent 28%), linear-gradient(180deg, #050816 0%, #09101F 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
