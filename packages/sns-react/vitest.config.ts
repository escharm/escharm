import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@escharm/sns-core": path.resolve(__dirname, "../sns-core/src"),
    },
  },
  test: {
    environment: "jsdom",
  },
});
