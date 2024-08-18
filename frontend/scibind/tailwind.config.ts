import type { Config } from 'tailwindcss';

const main_colors = {
  primary: '#3b82f6',
  secondary: '#94a3b8',
  accent: '#5f73c3',
  neutral: '#1e293b',
  'base-100': '#0f172a',
  info: '#38bdf8',
  success: '#4ade80',
  warning: '#facc15',
  error: '#ef4444',
};

const doc_colors = {
  primary: '#3b82f6',
  secondary: '#34A853',
  accent: '#FBBC05',
  neutral: '#efefef',
  'base-100': '#FFFFFF',
  'base-200': '#eeeeee',
  info: '#4285F4',
  success: '#34A853',
  warning: '#FBBC05',
  error: '#EA4335',
};

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      main_colors: main_colors,
      doc_colors: doc_colors,
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'light',
      'dark',
      {
        main: main_colors,
        doc: doc_colors,
      },
    ],
  },
};

export default config;
