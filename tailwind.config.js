const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './*/index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      // Every color reads a CSS variable (RGB channels) so the light/dark themes
      // in src/input.css can swap the whole palette without changing any markup.
      colors: {
        ink: { DEFAULT: v('ink'), 900: v('ink'), 800: v('ink-800'), 700: v('ink-700'), 600: v('ink-600') },
        cream: v('cream'),
        mist: v('mist'),
        ember: v('ember'),
        blush: v('blush'),
        iris: v('iris'),
        lime: v('lime'),
        white: v('line'), // used only for hairlines and glass overlays
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        mega: ['clamp(4rem, 13vw, 12.5rem)', { lineHeight: '0.86', letterSpacing: '-0.055em' }],
        giant: ['clamp(3rem, 8vw, 7.5rem)', { lineHeight: '0.92', letterSpacing: '-0.045em' }],
        huge: ['clamp(2.4rem, 5vw, 4.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(110deg, rgb(var(--c-ember)) 0%, rgb(var(--c-blush)) 45%, rgb(var(--c-iris)) 100%)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        aurora: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(6%,-8%,0) scale(1.12)' },
          '66%': { transform: 'translate3d(-6%,6%,0) scale(0.94)' },
        },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
        shine: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
        'word-in': {
          from: { transform: 'translateY(105%) rotate(4deg)', opacity: '0' },
          to: { transform: 'translateY(0) rotate(0)', opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        'aurora-slow': 'aurora 26s ease-in-out infinite reverse',
        float: 'float 6s ease-in-out infinite',
        'float-late': 'float 7s ease-in-out 1.2s infinite',
        blink: 'blink 1.4s steps(2) infinite',
        'spin-slow': 'spin 18s linear infinite',
        shine: 'shine 6s linear infinite',
      },
      transitionTimingFunction: { expo: 'cubic-bezier(.16,1,.3,1)' },
    },
  },
  plugins: [],
};
