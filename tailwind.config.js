/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        "xsss" : '320px',
        "xss": "375px", 
        'xs': '475px',
        "xxs" : '575px'
      },
      spacing: {
        'container-padding': '10px', 
      },
      maxWidth: {
        'container': '700px',
      },
    },
  },
  plugins: [],
}
