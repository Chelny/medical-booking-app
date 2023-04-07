/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      serif: ['Bitter', 'serif'],
    },
    colors: {
      transparent: 'transparent',
      black: '#292929',
      white: '#FCFCFC',
      warning: '#C95C28',
      error: '#D61C4E',
      success: '#379237',
      active: '#FC7B54',
      inactive: '#CFD1D3',
      'primary-day': {
        tint: '#AF9CB2',
        DEFAULT: '#816797',
        shade: '#5C527F',
      },
      'primary-night': {
        tint: '#7858A6',
        DEFAULT: '#4C3575',
        shade: '#291D3D',
      },
      secondary: {
        tint: '#D15555',
        DEFAULT: '#FC7B54',
        shade: '#AC2E2E',
      },
      light: {
        tint: '#F9F9F9',
        DEFAULT: '#F4F4F4',
        shade: '#DBDBDB',
      },
      medium: {
        tint: '#CFD1D3',
        DEFAULT: '#898D93',
        shade: '#7B7E84',
      },
      dark: {
        tint: '#22252a',
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
    screens: {
      sm: '640px', // => @media screen and (min-width: 640px) { ... }
      md: '768px', // => @media screen and (min-width: 768px) { ... }
      lg: '1024px', // => @media screen and (min-width: 1024px) { ... }
      xl: '1280px', // => @media screen and (min-width: 1280px) { ... }
    },
    extend: {
      gridTemplateAreas: {
        'layout-unauth': ['header', 'main', 'footer'],
        'layout-unauth-lg': ['sidebar main', 'footer footer'],
        'layout-auth': ['header', 'main', 'footer'],
        'layout-auth-lg': ['header', 'main', 'footer'],
      },
      gridTemplateRows: {
        'layout-unauth': '125px auto max-content',
        'layout-unauth-lg': 'auto max-content',
        'layout-auth': '125px auto max-content',
        'layout-auth-lg': 'max-content auto max-content',
        nav: 'auto max-content',
        main: 'auto min-content',
        'dialog-panel-sm': 'max-content auto max-content',
      },
      gridTemplateColumns: {
        'layout-unauth': '100%',
        'layout-auth': '100%',
        'layout-unauth-lg': '50%',
        'layout-auth-lg': '100%',
        'nav-lg': 'auto max-content',
        listbox: '16px max-content',
        'radio-group': '1fr 16px',
        tab: 'repeat(auto-fit, minmax(50px, 1fr))',
      },
      width: {
        'max-content': 'max-content',
      },
      minHeight: {
        'nav-expanded': 'calc(100vh - 125px)',
      },
      backgroundImage: {
        landing: 'linear-gradient(to top, #5C527Fba, #7858A6cc), url(/assets/images/backgrounds/landing.jpg)',
        dropdown: 'url(/assets/images/icons/chevron-down.svg)',
      },
      backgroundPosition: {
        dropdown: 'calc(100% - 12px) center',
      },
      backgroundSize: {
        dropdown: '16px',
      },
      fontSize: {
        sm: '0.8rem',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      aria: {
        none: 'sort="none"',
        asc: 'sort="ascending"',
        desc: 'sort="descending"',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require('@headlessui/tailwindcss')({ prefix: 'ui' }), require('@savvywombat/tailwindcss-grid-areas')],
}
