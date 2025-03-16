import fastifyStatic from "@fastify/static";
import type { FastifyInstance } from "fastify";
import path from "path";
import { defineConfig, PluginOption } from "vite";

const __dirname = import.meta.dirname;

export interface IParams {
  staticPath?: { prefix: string; test: RegExp };
}

const vitePlugin = (params?: IParams) => {
  const defaultStaticPathPrefix = "/files";
  const staticPathPrefix =
    params?.staticPath?.prefix ?? defaultStaticPathPrefix;
  const staticPathTest =
    params?.staticPath?.test ?? new RegExp(`${defaultStaticPathPrefix}`);

  return {
    name: "fastify",
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
          },
        });

        await app.ready();

        const reqUrl = req.url;
        if (reqUrl && staticPathTest.test(reqUrl)) {
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
        prefix: "/hello",
        test: new RegExp(`/hello`),
      },
    }),
  ],
  resolve: {
    alias: {},
  },
});
