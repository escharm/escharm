import { FastifyInstance } from "fastify";
import { PluginOption } from "vite";

export const vitePlugin = (): PluginOption => {
  return {
    name: "@escharm/story",
    configureServer: (server) => {
      server.middlewares.use(async (req, res) => {
        const module = await server.ssrLoadModule("./src/app.ts");
        const app = module.default as FastifyInstance;
        await app.ready();
        app.routing(req, res);
      });
    },
  };
};
