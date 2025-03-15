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

const app = (
  process.env.HTTP2 === "true" ? http2() : http()
) as FastifyInstance<
  Http2SecureServer | Server,
  IncomingMessage | Http2ServerRequest,
  ServerResponse | Http2ServerResponse
>;

app.register(routes);

app.register(fastifyStatic, {
  root: path.join(__dirname, "../../"),
  index: false,
  prefixAvoidTrailingSlash: true,
  list: {
    format: "html",
    render: (dirs, files) => {
      let html = "<h1>Directory Listing</h1><ul>";

      // 添加父目录链接
      html += `<li><a href="../">../</a></li>`;

      // 添加目录项
      for (const dir of dirs) {
        html += `<li><a href="${dir.name}/">${dir.name}</a></li>`;
      }

      // 添加文件项
      for (const file of files) {
        html += `<li><a href="${file.name}">${file.name}</a></li>`;
      }

      html += "</ul>";
      return html;
    },
  },
});

export default app;

export { app as viteNodeApp };
