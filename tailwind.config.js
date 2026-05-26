/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Surface System ── */
        'surface':                '#f9f9f9',
        'surface-dim':            '#dadada',
        'surface-bright':         '#f9f9f9',
        'surface-container-lowest':'#ffffff',
        'surface-container-low':  '#f3f3f3',
        'surface-container':      '#eeeeee',
        'surface-container-high': '#e8e8e8',
        'surface-container-highest':'#e2e2e2',
        'surface-variant':        '#e2e2e2',
        'surface-tint':           '#5e5e5e',
        'surface-soft':           '#f7f7f5',
        'on-surface':             '#1b1b1b',
        'on-surface-variant':     '#4c4546',
        'inverse-surface':        '#303030',
        'inverse-on-surface':     '#f1f1f1',

        /* ── Primary ── */
        'primary':           '#000000',
        'on-primary':        '#ffffff',
        'primary-container': '#1b1b1b',
        'on-primary-container':'#848484',
        'inverse-primary':   '#c6c6c6',
        'primary-fixed':     '#e2e2e2',
        'primary-fixed-dim': '#c6c6c6',
        'on-primary-fixed':  '#1b1b1b',
        'on-primary-fixed-variant':'#474747',

        /* ── Secondary ── */
        'secondary':           '#5d5f5f',
        'on-secondary':        '#ffffff',
        'secondary-container': '#dfe0e0',
        'on-secondary-container':'#616363',
        'secondary-fixed':     '#e2e2e2',
        'secondary-fixed-dim': '#c6c6c7',
        'on-secondary-fixed':  '#1a1c1c',
        'on-secondary-fixed-variant':'#454747',

        /* ── Tertiary ── */
        'tertiary':           '#000000',
        'on-tertiary':        '#ffffff',
        'tertiary-container': '#1b1b1b',
        'on-tertiary-container':'#848484',
        'tertiary-fixed':     '#e2e2e2',
        'tertiary-fixed-dim': '#c6c6c6',
        'on-tertiary-fixed':  '#1b1b1b',
        'on-tertiary-fixed-variant':'#474747',

        /* ── Error ── */
        'error':             '#ba1a1a',
        'on-error':          '#ffffff',
        'error-container':   '#ffdad6',
        'on-error-container':'#93000a',

        /* ── Ink / Canvas ── */
        'ink':            '#000000',
        'canvas':         '#ffffff',
        'inverse-canvas': '#000000',
        'inverse-ink':    '#ffffff',

        /* ── Hairline / Border ── */
        'hairline':      '#e6e6e6',
        'hairline-soft': '#f1f1f1',
        'outline':       '#747878',
        'outline-variant':'#c4c7c7',

        /* ── Feature / Redesign Colors ── */
        'feature-pink': '#ff3399',
        'feature-teal': '#008080',
        'feature-lavender': '#9966ff',
        'feature-peach': '#ff9966',
        'feature-ochre': '#cc9900',

        /* ── Color Blocks ── */
        'block-lime':  '#dceeb1',
        'block-lilac': '#c5b0f4',
        'block-cream': '#f4ecd6',
        'block-pink':  '#efd4d4',
        'block-mint':  '#c8e6cd',
        'block-coral': '#f3c9b6',
        'block-navy':  '#1f1d3d',

        /* ── Accent ── */
        'accent-magenta':  '#ff3d8b',
        'semantic-success':'#1ea64a',

        /* ── Legacy (for backwards compat during migration) ── */
        'bg':     '#ffffff',
        'card':   '#f7f7f5',
        'gold':   '#000000',
        'indigo': '#c5b0f4',
        'teal':   '#1ea64a',
        'white':  '#1b1b1b',
        'grey':   '#5d5f5f',
        'border': '#e6e6e6',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        eyebrow: ['JetBrains Mono', 'monospace'],
        caption: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl':       ['86px', { lineHeight: '1.00', letterSpacing: '-1.72px', fontWeight: '340' }],
        'display-xl-mobile':['48px', { lineHeight: '1.10', letterSpacing: '-0.96px', fontWeight: '340' }],
        'display-lg':       ['64px', { lineHeight: '1.10', letterSpacing: '-0.96px', fontWeight: '340' }],
        'display-lg-mobile':['40px', { lineHeight: '1.15', letterSpacing: '-0.80px', fontWeight: '340' }],
        'headline':         ['26px', { lineHeight: '1.35', letterSpacing: '-0.26px', fontWeight: '540' }],
        'subhead':          ['26px', { lineHeight: '1.35', letterSpacing: '-0.26px', fontWeight: '340' }],
        'card-title':       ['24px', { lineHeight: '1.45', letterSpacing: '0',       fontWeight: '700' }],
        'body-lg':          ['20px', { lineHeight: '1.40', letterSpacing: '-0.14px', fontWeight: '330' }],
        'body':             ['18px', { lineHeight: '1.45', letterSpacing: '-0.26px', fontWeight: '320' }],
        'body-sm':          ['16px', { lineHeight: '1.45', letterSpacing: '-0.14px', fontWeight: '330' }],
        'button':           ['20px', { lineHeight: '1.40', letterSpacing: '-0.10px', fontWeight: '480' }],
        'eyebrow':          ['18px', { lineHeight: '1.30', letterSpacing: '0.54px',  fontWeight: '400' }],
        'caption':          ['12px', { lineHeight: '1.00', letterSpacing: '0.60px',  fontWeight: '400' }],
      },
      spacing: {
        'hair': '1px',
        'xxs':  '4px',
        'xs':   '8px',
        'sm':   '12px',
        'md':   '16px',
        'lg':   '24px',
        'xl':   '32px',
        'xxl':  '48px',
        'section': '96px',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        'lg':    '0.5rem',
        'xl':    '0.75rem',
        '2xl':   '1rem',
        '3xl':   '1.5rem',
        'full':  '9999px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-out',
        'slide-up':    'slideUp 0.6s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'marquee':     'marquee 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
        'soft':   '0 2px 8px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
