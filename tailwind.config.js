/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#c0c1ff",
        "on-primary": "#1000a9",
        "secondary": "#ddb7ff",
        "secondary-container": "#6f00be",
        "on-secondary-container": "#d6a9ff",
        "tertiary": "#4cd7f6",
        "background": "#0b1326",
        "on-background": "#dae2fd",
        "surface-container-low": "#131b2e",
        "surface-variant": "#2d3449",
        "on-surface-variant": "#c7c4d7",
        "glass-stroke": "rgba(255,255,255,0.1)",
        "glass-fill": "rgba(15,23,42,0.6)",
        "status-done": "#10B981",
        "status-in-progress": "#3B82F6",
        "status-pending": "#F59E0B",
        "priority-urgent": "#EF4444",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
