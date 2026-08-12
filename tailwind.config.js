/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // "ink" now names the light-surface scale (was dark, now light-on-white).
        ink: {
          950: "#ffffff", // page background
          900: "#fbfbfc", // sidebar / subtle panel background
          850: "#f5f6f8",
          800: "#eef0f3", // code header / table header background
          700: "#e2e5eb", // hairline dividers
          600: "#d5d9e0", // default borders
          500: "#b7bdc9", // emphasis borders / structural lines
          400: "#9aa1b0",
        },
        // "mist" now names the text scale (was light-on-dark, now dark-on-white).
        mist: {
          200: "#171a21", // headings / primary text
          300: "#363c48", // secondary text / code
          400: "#5b6472", // muted body text
          500: "#7c8494", // eyebrows / very muted labels
        },
        classical: {
          DEFAULT: "#c07f28",
          soft: "#96611c",
          dim: "#f3ddb8",
        },
        quantum: {
          DEFAULT: "#1090a8",
          soft: "#0b6f83",
          dim: "#cdeef3",
          violet: "#6a5acd",
        },
        signal: {
          good: "#1a8a5c",
          warn: "#b3760f",
          bad: "#c23a34",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(23,26,33,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(23,26,33,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      boxShadow: {
        edge: "0 0 0 1px rgba(23,26,33,0.08)",
      },
    },
  },
  plugins: [],
};
