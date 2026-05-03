import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          blue: "#00f0ff",
          pink: "#ff006e",
          purple: "#b5179e",
          yellow: "#f9c80e",
          dark: "#0a0a0f",
          card: "#16161e",
          input: "#1e1e2e",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        rajdhani: ["var(--font-rajdhani)"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "glitch": "glitch 0.3s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "flicker": "flicker 3s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff",
          },
          "50%": {
            boxShadow: "0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff",
          },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "1",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: "0.4",
          },
        },
      },
      boxShadow: {
        "neon-blue": "0 0 5px #00f0ff, 0 0 10px #00f0ff",
        "neon-pink": "0 0 5px #ff006e, 0 0 10px #ff006e",
        "neon-purple": "0 0 5px #b5179e, 0 0 10px #b5179e",
      },
    },
  },
  plugins: [],
};
export default config;
