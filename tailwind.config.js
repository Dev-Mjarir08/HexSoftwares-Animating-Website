/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        bg: "#0F0F0F",
        card: "#181818",
        primary: "#F5F5F5",
        secondary: "#B5B5B5",
        accent: "#C8A96A",
        border: "rgba(255,255,255,.08)",
      },
      fontFamily: {
        heading: ["Bebas Neue", "sans-serif"],
        sub: ["Syne", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      screens: {
        xs: "375px",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [],
};
