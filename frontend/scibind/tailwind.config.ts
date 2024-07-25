import type { Config } from "tailwindcss";

const colors = {
  primary: "#3b82f6",
  secondary: "#94a3b8",
  accent: "#5f73c3",
  neutral: "#1e293b",
  "base-100": "#0f172a",
  info: "#38bdf8",
  success: "#4ade80",
  warning: "#facc15",
  error: "#ef4444",
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark", {
      mytheme: colors,
    }],
  },
};

export default config;