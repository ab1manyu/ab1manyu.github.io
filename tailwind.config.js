/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Share Tech Mono", "monospace"],
      },
      colors: {
        defense: {
          base: "#000000",
          panel: "rgba(10, 25, 15, 0.6)",
          border: "#1a332a",
          accent: "#10b981",
          muted: "#6b7280",
        },
      },
      keyframes: {
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
      },
      animation: {
        slideRight: "slideRight 2s linear infinite",
      },
    },
  },
  plugins: [],
};
