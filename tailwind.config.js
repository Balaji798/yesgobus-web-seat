/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fd5901",
        success: "#00f06e",
        error: "#ff0000",
        warning: "#faad14",
        info: "#13c2c2",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
