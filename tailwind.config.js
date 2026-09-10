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
        bone: '#f4ede0',
        'bg-soft': '#faf7f0',
        banner: '#1e3452',
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
        content: '1200px',
        prose: '680px',
      },
      screens: {
        mobile: { max: '859px' },
        desktop: '860px',
      },
    },
  },
  plugins: [],
};
