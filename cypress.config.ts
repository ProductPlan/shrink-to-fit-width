import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    excludeSpecPattern: ["lib/**/*.js"],
  },
});
