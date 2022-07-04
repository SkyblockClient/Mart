module.exports = {
  content: ["**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        wipe: "wipe 1s ease-in-out",
      },
      keyframes: {
        wipe: {
          "0%": {
            "clip-path": "inset(0% 100% 0% 0%)",
          },
          "100%": {
            "clip-path": "inset(0% 0% 0% 0%)",
          },
        },
      },
      boxShadow: {
        neumorphism: "5px 5px 15px #202020, -5px -5px 15px #2c2c2c",
        "neumorphism-pressed": "inset 5px 5px 15px #202020, inset -5px -5px 15px #2c2c2c",
      },
      width: {
        panel: "max(calc(33vw - 2rem), 35ch)",
      },
    },
  },
  plugins: [],
};
