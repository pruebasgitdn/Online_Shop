// tailwind.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [tailwindcss()],
//   theme: {
//     extend: {
//       fontFamily: {
//         manrope: ["Manrope", "sans-serif"],
//       },
//       keyframes: {
//         marquee: {
//           "0%": { transform: "translateX(0%)" },
//           "100%": { transform: "translateX(-50%)" }, // Mueve la lista hacia la izquierda
//         },
//       },
//       animation: {
//         marquee: "marquee 10s linear infinite", // Define la animación con 10s de duración
//       },
//     },
//   },
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
// });

// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 10s linear infinite",
      },
    },
  },
  plugins: [tailwindcss()],
};
