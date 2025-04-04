import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        primary: {
          50: '#fdf4f1',
          100: '#fae8e2',
          200: '#f5d1c5',
          300: '#efb7a6',
          400: '#ea9c86',
          500: '#e5764f',
          600: '#d56a47',
          700: '#b2583c',
          800: '#8e4730',
          900: '#733a27',
          950: '#3d1e15',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
