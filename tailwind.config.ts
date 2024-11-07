import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        platform: "#1f1f1f",
      },
      borderColor: {
        edge: "#6b7280",
        edge2: "#4b5563",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
