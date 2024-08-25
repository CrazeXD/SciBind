import type { Config } from 'tailwindcss';

const main_colors = {
  primary: '#4f46e5',
  secondary: '#64748b',
  accent: '#8b5cf6',
  neutral: '#334155',
  'base-100': '#1e293b',
  info: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
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
