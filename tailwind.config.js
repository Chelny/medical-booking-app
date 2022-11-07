/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  // darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      serif: ['Bitter', 'serif'],
    },
    colors: {
      transparent: 'transparent',
      black: '#222222',
      white: '#DFDFDF',
      warning: '#C95C28',
      error: '#D61C4E',
      success: '#379237',
      'primary-day': {
        tint: '#8858A6',
        DEFAULT: '#5B4B8A',
        shade: '#4C3575',
      },
      'primary-night': {
        tint: '#7B4B8A',
        DEFAULT: '#4C3575',
        shade: '#371B58',
      },
      secondary: {
        tint: '#FF8787',
        DEFAULT: '#F96666',
        shade: '#CC4141',
      },
      light: {
        tint: '#FBFBFB',
        DEFAULT: '#F4F4F4',
        shade: '#E7E9EB',
      },
      medium: {
        tint: '#CFD8DC',
        DEFAULT: '#898D93',
        shade: '#5D6066',
      },
      dark: {
        tint: '#393E46',
        DEFAULT: '#1B1C22',
        shade: '#151515',
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
    },
    extend: {
      backgroundImage: {
        landing: 'linear-gradient(to top, #4C3575ba, #5B4B8Acc), url(/assets/images/backgrounds/landing.jpg)',
        dropdown: 'url(/assets/images/icons/chevron-down.svg)',
      },
      backgroundPosition: {
        dropdown: 'calc(100% - 12px) center',
      },
      backgroundSize: {
        dropdown: '16px',
      },
      gridTemplateRows: {
        'app-layout': '1fr auto',
        main: 'minmax(max-content, calc(100vh/3.7)) auto',
        'main-md': '100%',
      },
      gridTemplateColumns: {
        'app-layout': '100%',
        'main-md': 'minmax(max-content, calc(100vh/2.5)) auto',
      },
    },
  },
  plugins: [],
}
