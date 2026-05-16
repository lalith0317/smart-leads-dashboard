import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#202124",
        mist: "#EEF2F5",
        pine: "#116149",
        coral: "#D95D39",
        saffron: "#F5B841"
      },
      boxShadow: {
        soft: "0 10px 24px rgba(31, 41, 55, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
