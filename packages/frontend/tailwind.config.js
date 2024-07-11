/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: "#8A9DA4",
      },
      fontSize: {
        ["2xs"]: "0.625rem",
      },
      minWidth: {
        128: "32rem",
      },
    },
  },
  plugins: [],
};
