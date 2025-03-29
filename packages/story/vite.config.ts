import { defineConfig } from "vite";

import { reactStoryPlugin } from "./src/react";

export default defineConfig({
  plugins: [
    reactStoryPlugin({
      staticPath: {
        prefix: "/static",
      },
      previewPath: {
        prefix: "/preview",
      },
      storyPath: {
        prefix: "/story",
        test: new RegExp(`^/story`),
      },
      fixturesPath(path) {
        return `${path.replace("/src", "/src/stories")}.json`;
      },
    }),
  ],
  resolve: {
    alias: {},
  },
});
