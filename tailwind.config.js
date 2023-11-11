/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-left":
          "linear-gradient(to right, transparent, transparent), linear-gradient(to right, #your_color_here)",
        "gradient-right":
          "linear-gradient(to left, transparent, transparent), linear-gradient(to left, #your_color_here)",
      },
    },
  },
  plugins: [],
};
