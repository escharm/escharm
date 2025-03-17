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
        const queryStringMatch = path.match(/\?(.+)$/);
        const queryString = queryStringMatch?.[1];

        const searchParams = new URLSearchParams(queryString);
        const componentPath = searchParams.get("path");

        if (componentPath) {
          return `/src/hello/fixtures${componentPath.replace("/src", "")}.json`;
        }
        return `/src/hello/fixtures${componentPath}.json`;
      },
    }),
  ],
  resolve: {
    alias: {},
  },
});
