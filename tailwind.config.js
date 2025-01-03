/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0864ce",
        second: "#f1f7fc",
        textColor: "#3a3a3a"
      },
      backgroundImage: {
        "theme-login": "url('/src/assets/pictures/theme_logo.svg')",
        'custom-gradient': 'radial-gradient(100% 1111.11% at 100% 51.11%, #00d8b0 0%, #00de92 100%)',
      },
      height: {
        'screen-minus-50': 'calc(100vh - 66px)',
        'screen-minus-pay': 'calc(100vh - 56px)',
      },
    },
  },
  plugins: [],
};
