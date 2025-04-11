/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors : {
        primary: "#3B71FE",
        secondary: "#FFC83A",
      },

      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'],
        serif: ['"Merriweather"', 'serif'],
        code: ['source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace']
      },
    },
  },
  plugins: [],
}
