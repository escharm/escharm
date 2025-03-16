import type { FastifyInstance } from "fastify";
import { defineConfig, PluginOption, transformWithEsbuild } from "vite";

export interface IParams {
  staticPath?: { prefix: string; test: RegExp };
  previewPath?: { prefix: string; test: RegExp };
  storyPath?: { prefix: string; test: RegExp };
}

const vitePlugin = (params?: IParams) => {
  const defaultStaticPathPrefix = "/static";
  const staticPathPrefix =
    params?.staticPath?.prefix ?? defaultStaticPathPrefix;
  const staticPathTest =
    params?.staticPath?.test ?? new RegExp(`^${defaultStaticPathPrefix}`);

  const defaultPreviewPathPrefix = "/preview";
  const previewPathPrefix =
    params?.previewPath?.prefix ?? defaultPreviewPathPrefix;
  const previewPathTest =
    params?.previewPath?.test ?? new RegExp(`^${defaultPreviewPathPrefix}`);

  const defaultStoryPathPrefix = "/story";
  const storyPathPrefix = params?.storyPath?.prefix ?? defaultStoryPathPrefix;
  const storyPathTest =
    params?.storyPath?.test ?? new RegExp(`^${defaultStoryPathPrefix}`);

  return {
    name: "fastify",
    async load(source) {
      if (storyPathTest.test(source)) {
        const url = new URL(source, "http://localhost");
        const componentPath =
          url.searchParams.get("path") || "/src/client/App.tsx";

        const code = `
        import { createRoot } from 'react-dom/client';
        import Component from '${componentPath}';
        
        const root = createRoot(document.getElementById('root'));
        root.render(<Component />)`;

        let transformed;
        try {
          transformed = await transformWithEsbuild(code, source, {
            jsx: "automatic",
            jsxDev: true,
          });
        } catch (error) {
          console.error("test test error", source, error);
          return null;
        }
        return transformed.code;
      }
      return null;
    },
    config: () => {
      return {
        build: {
          ssr: "./src/server/main.ts",
          rollupOptions: {
            input: "./src/server/main.ts",
          },
        },
      };
    },
    configureServer: (server) => {
      server.middlewares.use(async (req, res, next) => {
        const { createApp } = await server.ssrLoadModule("./src/server/app.ts");
        const app: FastifyInstance = createApp({
          staticPath: {
            prefix: staticPathPrefix,
            test: staticPathTest,
          },
          previewPath: {
            prefix: previewPathPrefix,
            test: previewPathTest,
          },
          storyPath: {
            prefix: storyPathPrefix,
            test: storyPathTest,
          },
          viteServer: server,
        });

        await app.ready();

        const reqUrl = req.url;

        if (
          reqUrl &&
          (staticPathTest.test(reqUrl) ||
            previewPathTest.test(reqUrl) ||
            storyPathTest.test(reqUrl))
        ) {
          app.routing(req, res);
        } else {
          next();
        }
      });
    },
  } satisfies PluginOption;
};

export default defineConfig({
  plugins: [
    vitePlugin({
      staticPath: {
        prefix: "/static",
        test: new RegExp(`^/static`),
      },
      previewPath: {
        prefix: "/preview",
        test: new RegExp(`^/preview`),
      },
      storyPath: {
        prefix: "/hello3",
        test: new RegExp(`^/hello3`),
      },
    }),
  ],
  resolve: {
    alias: {},
  },
});
