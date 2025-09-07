/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      // keep defaults
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",

      // your custom colors
      priBck: "#00AFF0",
      textDef: "#e5e5e5",
      whitetest: "#ededed",
      frontTest: "#00aff0",
      secondTest: "#0b8fd8",
      thirdTest: "#ffb400",
      thirdPortion: "#f6f7fb",
      textColorBottom: "#0a0a0a",
      bottomText: "#4b5867",
      testingColours: "#484b6a",
      navColor: "#e8efe8",
    },
  },
}