import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        gold: "#D4AF37",
        amber: "#FF9F1C",
        soft: "#F5F5F5"
      }
    }
  },
  plugins: []
};

export default config;
