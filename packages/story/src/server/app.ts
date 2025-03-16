import fastifyStatic from "@fastify/static";
import { FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import {
  Http2SecureServer,
  Http2ServerRequest,
  Http2ServerResponse,
} from "http2";
import path from "path";

const __dirname = import.meta.dirname;

import { ViteDevServer } from "vite";

import http from "./http";
import http2 from "./http2";
import routes from "./routes";

export interface ICreateAppParams {
  staticPath?: { prefix: string };
  previewPath?: { prefix: string };
  storyPath?: { prefix: string };
  viteServer: ViteDevServer;
}

export const createApp = (params?: ICreateAppParams) => {
  const staticPathPrefix = params?.staticPath?.prefix;
  const previewPathPrefix = params?.previewPath?.prefix;
  const storyPathPrefix = params?.storyPath?.prefix;
  const viteServer = params?.viteServer;

  const app = (
    process.env.HTTP2 === "true" ? http2() : http()
  ) as FastifyInstance<
    Http2SecureServer | Server,
    IncomingMessage | Http2ServerRequest,
    ServerResponse | Http2ServerResponse
  >;

  app.register(routes);

  if (viteServer && staticPathPrefix && previewPathPrefix && storyPathPrefix) {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "../../"),
      index: false,
      prefixAvoidTrailingSlash: true,
      prefix: staticPathPrefix,
      list: {
        format: "html",
        render: (dirs, files) => {
          return `
              <html><body>
              <ul>
                ${dirs.map((dir) => `<li><a href="${dir.href}">${dir.name}</a></li>`).join("\n  ")}
                ${files
                  .map((file) => {
                    const isTsx = file.name.endsWith(".tsx");
                    const href = isTsx
                      ? `${previewPathPrefix}?path=${encodeURI(
                          file.href.replace(staticPathPrefix, ""),
                        )}`
                      : file.href;
                    return `<li><a href="${href}">${file.name}</a></li>`;
                  })
                  .join("\n  ")}
              </ul>
              </body></html>
          `;
        },
      },
    });

    interface IStoryQuery {
      path: string;
    }

    // 注册 previewPath 的 get 路由
    app.get<{ Querystring: IStoryQuery }>(
      previewPathPrefix,
      async (req, res) => {
        res.header("Content-Type", "text/html");

        const transformed = await viteServer.transformRequest(
          req.url.replace(previewPathPrefix, storyPathPrefix),
        );

        const content = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>Preview</title>
              <script type="module">
                ${transformed?.code}
              </script>
            </head>
            <body>
              <div id="root"></div>
            </body>
          </html>`;
        const transformedContent = await viteServer.transformIndexHtml(
          req.url,
          content,
        );

        res.send(transformedContent);
      },
    );

    interface IStoryQuery {
      path: string;
    }
  }

  return app;
};

export type CreateApp = typeof createApp;
