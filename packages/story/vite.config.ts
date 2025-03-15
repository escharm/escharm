import type { FastifyInstance } from "fastify";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3100,
  },
  plugins: [
    {
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
        server.middlewares.use(async (req, res) => {
          const module = await server.ssrLoadModule("./src/server/app.ts");
          const app = module.default as FastifyInstance;
          await app.ready();
          app.routing(req, res);
        });
      },
    },
  ],
  resolve: {
    alias: {},
  },
});
