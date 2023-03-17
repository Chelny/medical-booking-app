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
      black: '#292929',
      white: '#F0F0F0',
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
    extend: {
      gridTemplateRows: {
        'app-layout': 'minmax(max-content, calc(100vh/4.7)) 1fr auto',
        'app-layout-md': '1fr auto',
        main: 'minmax(max-content, calc(100vh/6.7)) auto',
        'main-lg': '100%',
      },
      gridTemplateColumns: {
        'app-layout': '100%',
        'main-lg': 'minmax(max-content, calc(100vh/2.5)) auto',
        listbox: '16px max-content',
      },
      width: {
        'max-content': 'max-content',
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
      aria: {
        none: 'sort="none"',
        asc: 'sort="ascending"',
        desc: 'sort="descending"',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require('@headlessui/tailwindcss')({ prefix: 'ui' })],
}
