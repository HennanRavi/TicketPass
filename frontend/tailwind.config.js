/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandBlue:  "#006CBF",
        brandGreen: "#48A732",
        brandYellow:"#FFD900",
      },
      maxWidth: { container: "1400px" }
    }
  },
  plugins: []
};
