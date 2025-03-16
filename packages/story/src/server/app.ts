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

import http from "./http";
import http2 from "./http2";
import routes from "./routes";

export interface ICreateAppParams {
  staticPath?: { prefix: string };
}

export const createApp = (params?: ICreateAppParams) => {
  const staticPathPrefix = params?.staticPath?.prefix;

  const app = (
    process.env.HTTP2 === "true" ? http2() : http()
  ) as FastifyInstance<
    Http2SecureServer | Server,
    IncomingMessage | Http2ServerRequest,
    ServerResponse | Http2ServerResponse
  >;

  app.register(routes);

  if (staticPathPrefix) {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "../../"),
      index: false,
      prefixAvoidTrailingSlash: true,
      prefix: staticPathPrefix,
      setHeaders(res, path, stat) {
        res.setHeader("Content-Disposition", "inline");
      },
      list: {
        format: "html",
        render: (dirs, files) => {
          return `
              <html><body>
              <ul>
                ${dirs.map((dir) => `<li><a href="${dir.href}">${dir.name}</a></li>`).join("\n  ")}
                ${files.map((file) => `<li><a href="${file.href}">${file.name}</a></li>`).join("\n  ")}
              </ul>
              </body></html>
          `;
        },
      },
    });
  }

  return app;
};

export type CreateApp = typeof createApp;
