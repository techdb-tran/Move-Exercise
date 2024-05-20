/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-color': '#13D0B4',
        'primary-color-hover': '#3BE0C8',
        'primary-text-color': '#666666',
        'secondary-text-color': '#999999',
        'border-color': '#cccc',
        'primary-misc-color': '#0AB5E7',
        'secondary-misc-color': '#FF647A',
        'primary-white-color': '#FFFFFF',
        'misc-blue-color': '#0AB5E7',
        'misc-orange-color': '#FF647A',
        'misc-pink-color': '#FF7BB8',
        'primary-black-color': '#000000',
        'shadow-color': '#999999',
        'tag-background': '#EEEEEE',
        'tag-background-hover': '#E0E0E0',
        'error-border-color': '#FF8092',
        'error-background-color': '#FFEFF1',
        'error-text-color': '#ff0026',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      zIndex: {
        999: '999', // header, panel
      },
      boxShadow: {
        overview:
          '0px 6px 8px -6px rgba(0, 0, 0, 0.5), 0px -6px 8px -6px rgba(0, 0, 0, 0.5),  6px 0px 8px -6px rgba(0, 0, 0, 0.5), -6px 0px 8px -6px rgba(0, 0, 0, 0.5);',
      },
    },
  },
  plugins: [],
};
