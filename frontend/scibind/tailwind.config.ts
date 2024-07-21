import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  themes: [
    {
      mytheme: {
        "primary": "#0284c7",
        "secondary": "#a5f3fc",
        "accent": "#14b8a6",
        "neutral": "#374151",
        "base-100": "#1f2937",
        "info": "#0000ff",
        "success": "#4ade80",
        "warning": "#facc15",
        "error": "#ef4444",
      },
    },
    ],
  plugins: [
    require('daisyui'),
  ],
};
export default config;
