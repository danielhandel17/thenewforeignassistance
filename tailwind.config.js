/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        ink: '#1c2e4a',
        'ink-light': '#2e4060',
        amber: '#b8682a',
        'amber-mid': '#9a5620',
        'toc-muted': '#be9a7a',
        'toc-rail': '#e6d9d0',
        cream: '#f7f3ed',
        'cream-warm': '#F6EFEA',
        'footer-bg': '#FFFAF7',
        'footer-strip': '#FFF3EA',
        'footer-border': '#EECDB2',
        bone: '#f4ede0',
        'bg-soft': '#faf7f0',
        banner: '#1e3452',
        'chart-legend': '#6B9AE3',
      },
      fontFamily: {
        newsreader: ['Newsreader', 'Georgia', 'serif'],
        libertinus: ['"Libertinus Serif Display"', 'Newsreader', 'Georgia', 'serif'],
      },
      letterSpacing: {
        nav: '0.2em',
        eyebrow: '0.2em',
      },
      maxWidth: {
        page: '1728px',
        prose: '680px',
      },
      screens: {
        'mobile-small': { max: '390px' },
        mobile: { min: '391px' },
        desktop: '860px',
        wide: '1100px',
      },
    },
  },
  plugins: [],
};
