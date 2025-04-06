import fsPromise from "node:fs/promises";

import { IFixture, IPluginParams } from "@escharm/story-editor";
import {
  compile,
  env,
  Features,
  Instrumentation,
  normalizePath,
  optimize,
} from "@tailwindcss/node";
import { clearRequireCache } from "@tailwindcss/node/require-cache";
import { Scanner } from "@tailwindcss/oxide";
import fs from "fs";
import path from "path";
import {
  PluginOption,
  ResolvedConfig,
  transformWithEsbuild,
  ViteDevServer,
} from "vite";

import { getFixturesPath } from "../utils";
import { getProps } from "./getProps";
import defaultHomeTemplate from "./homeTemplate";
import { addDataIdToHtmlTags } from "./htmlMatcher";
import { parseToHierarchy } from "./parseToHierarchy";
import { saveHierarchyChange } from "./saveHierarchyChange";
import DefaultMap from "./TWDefaultMap";
import Root from "./TWRoot";

// tailwindcss

const DEBUG = process.env.DEBUG;
const SPECIAL_QUERY_RE = /[?&](?:worker|sharedworker|raw|url)\b/;
const COMMON_JS_PROXY_RE = /\?commonjs-proxy/;
const INLINE_STYLE_ID_RE = /[?&]index=\d+\.css$/;

function getExtension(id: string) {
  const [filename] = id.split("?", 2);
  return path.extname(filename).slice(1);
}

function isPotentialCssRootFile(id: string) {
  if (id.includes("/.vite/")) return;
  const extension = getExtension(id);
  const isCssFile =
    (extension === "css" ||
      id.includes("&lang.css") ||
      id.match(INLINE_STYLE_ID_RE)) &&
    // Don't intercept special static asset resources
    !SPECIAL_QUERY_RE.test(id) &&
    !COMMON_JS_PROXY_RE.test(id);
  return isCssFile;
}

export const reactStoryPlugin = (params?: IPluginParams): PluginOption => {
  const defaultStaticPathPrefix = "/static";
  const staticPathPrefix =
    params?.staticPath?.prefix ?? defaultStaticPathPrefix;

  const defaultPreviewPathPrefix = "/preview";
  const previewPathPrefix =
    params?.previewPath?.prefix ?? defaultPreviewPathPrefix;

  const defaultStoryPathPrefix = "/story";
  const storyPathPrefix = params?.storyPath?.prefix ?? defaultStoryPathPrefix;
  const storyPathTest =
    params?.storyPath?.test ?? new RegExp(`^${defaultStoryPathPrefix}`);

  // tailwindcss
  let config: ResolvedConfig | null = null;
  let isSSR = false;
  const servers: ViteDevServer[] = [];

  const roots: DefaultMap<string, Root> = new DefaultMap((id) => {
    const cssResolver = config!.createResolver({
      ...config!.resolve,
      extensions: [".css"],
      mainFields: ["style"],
      conditions: ["style", "development|production"],
      tryIndex: false,
      preferRelative: true,
    });
    function customCssResolver(id: string, base: string) {
      return cssResolver(id, base, true, isSSR);
    }

    const jsResolver = config!.createResolver(config!.resolve);
    function customJsResolver(id: string, base: string) {
      return jsResolver(id, base, true, isSSR);
    }
    return new Root(id, config!.root, customCssResolver, customJsResolver);
  });

  return [
    {
      name: "@escharm/story/react",
      async load(source) {
        if (storyPathTest.test(source)) {
          const queryStringMatch = source.match(/\?(.+)$/);
          const queryString = queryStringMatch?.[1];
          const searchParams = new URLSearchParams(queryString);
          const componentPath = searchParams.get("path");

          if (!componentPath) {
            return null;
          }

          const fixturesPath =
            params?.fixturesPath?.(componentPath) ??
            getFixturesPath(componentPath);

          const mockFilePath = path.join(process.cwd(), fixturesPath);

          const rawCode = fs.readFileSync(
            path.join(process.cwd(), componentPath),
            "utf-8",
          );

          const processedCode = addDataIdToHtmlTags(rawCode);
          fs.writeFileSync(
            path.join(process.cwd(), componentPath),
            processedCode,
            "utf-8",
          );

          // 获取层级数据
          const hierarchy = parseToHierarchy(processedCode);

          let fixture: IFixture = {
            stories: {},
            hierarchies: hierarchy,
          };

          if (fs.existsSync(mockFilePath)) {
            try {
              fixture = JSON.parse(fs.readFileSync(mockFilePath, "utf-8"));
            } catch (err) {
              console.error("Failed to read mock data:", err);
            }
          } else {
            const props = getProps(rawCode);
            fixture.stories.autoCreate = {
              name: "autoCreate",
              data:
                props?.reduce(
                  (acc, prop) => {
                    acc[prop.key] = prop.type;
                    return acc;
                  },
                  {} as Record<string, unknown>,
                ) || {},
              group: {
                selectedHierarchyIds: [],
                selectedRects: {},
                rect: {
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0,
                },
                manualData: {
                  rect: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                  },
                },
              },
            };
            try {
              fs.mkdirSync(path.dirname(mockFilePath), { recursive: true });
              fs.writeFileSync(
                mockFilePath,
                JSON.stringify(fixture, null, 2),
                "utf-8",
              );
            } catch (err) {
              console.error("Failed to write mock data:", err);
            }
          }

          const code = params?.homeTemplate
            ? params.homeTemplate()
            : defaultHomeTemplate();

          let transformed;
          try {
            transformed = await transformWithEsbuild(code, source, {
              loader: "tsx",
              jsx: "automatic",
              jsxDev: true,
            });
          } catch (error) {
            console.error(
              "react story plugin transform code error:",
              source,
              error,
            );
            return null;
          }
          return transformed;
        }
        return null;
      },
      configureServer: (server) => {
        server.middlewares.use(staticPathPrefix, async (req, res, next) => {
          const originalUrl = req.url || "";
          const urlWithoutPrefix = originalUrl.startsWith(staticPathPrefix)
            ? originalUrl.slice(staticPathPrefix.length)
            : originalUrl;

          const normalizedUrl = urlWithoutPrefix.startsWith("/")
            ? urlWithoutPrefix
            : "/" + urlWithoutPrefix;

          const filePath = path.join(process.cwd(), normalizedUrl);

          try {
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
              interface DirItem {
                name: string;
                href: string;
              }

              const dirs: DirItem[] = [];
              const files: DirItem[] = [];

              fs.readdirSync(filePath).forEach((item) => {
                const itemPath = path.join(filePath, item);
                const isDir = fs.statSync(itemPath).isDirectory();

                // 修复：使用 path.posix.join 确保生成的路径使用正斜杠
                let relativePath = path.posix.join(normalizedUrl, item);
                // 确保路径以 / 开头
                relativePath = relativePath.startsWith("/")
                  ? relativePath
                  : "/" + relativePath;
                const href = `${staticPathPrefix}${relativePath}`;

                if (isDir) {
                  dirs.push({ name: item, href });
                } else {
                  files.push({ name: item, href });
                }
              });

              // 生成目录列表 HTML
              const html = `
                <html><body>
                <ul>
                  ${dirs.map((dir) => `<li><a href="${dir.href}">${dir.name}/</a></li>`).join("\n  ")}
                  ${files
                    .map((file) => {
                      const isTsx = file.name.endsWith(".tsx");
                      // 修复：使用更可读的URL格式
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

              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(html);
            } else {
              // 处理静态文件
              next();
            }
          } catch (err) {
            console.error("static service:", err);
            next();
          }
        });

        server.middlewares.use(previewPathPrefix, async (req, res) => {
          try {
            const reqUrl = req.originalUrl;
            if (!reqUrl) {
              res.writeHead(400);
              res.end("Missing URL");
              return;
            }

            const transformed = await server.transformRequest(
              reqUrl.replace(previewPathPrefix, storyPathPrefix),
            );

            if (!transformed || !transformed.code) {
              res.writeHead(404);
              res.end("Resource not found or cannot be transformed");
              return;
            }

            const content = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Preview</title>
              </head>
              <body>
                <div id="root"></div>
                <script type="module">
                  ${transformed.code}
                </script>
              </body>
            </html>`;

            const transformedContent = await server.transformIndexHtml(
              req.url || "",
              content,
            );

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(transformedContent);
          } catch (err) {
            console.error("preview service:", err);
            res.writeHead(500);
            res.end("Internal Server Error");
          }
        });

        server.ws.on("LOAD_STORY_CONTEXT", (data) => {
          const searchParams = new URLSearchParams(data.search);
          const componentPath = searchParams.get("path");
          const name = searchParams.get("name");

          if (componentPath) {
            const fixturesPath = path.join(
              process.cwd(),
              params?.fixturesPath?.(componentPath) ??
                getFixturesPath(componentPath),
            );

            try {
              const fixture = JSON.parse(
                fs.readFileSync(fixturesPath, "utf-8"),
              ) as IFixture;

              const story = !name ? null : fixture.stories[name];
              const baseContext = {
                hierarchies: fixture.hierarchies,
                storyNames: Object.keys(fixture.stories),
              };

              const storyContext = story
                ? { ...story, ...baseContext }
                : baseContext;

              server.ws.send<"SET_STORY_CONTEXT">(
                "SET_STORY_CONTEXT",
                storyContext,
              );
            } catch (err) {
              console.error("Failed to read mock data:", err);
            }
          }
        });

        server.ws.on("SAVE_STORY_CONTEXT", saveHierarchyChange(roots));
      },
      handleHotUpdate() {
        return [];
      },
    },
    {
      // Step 1: Scan source files for candidates
      name: "@tailwindcss/vite:scan",
      enforce: "pre",

      configureServer(server) {
        servers.push(server);
      },

      async configResolved(_config) {
        config = _config;
        isSSR = config.build.ssr !== false && config.build.ssr !== undefined;
      },
    },
    {
      // Step 2 (serve mode): Generate CSS
      name: "@tailwindcss/vite:generate:serve",
      apply: "serve",
      enforce: "pre",

      async transform(src, id, options) {
        console.log("test test transform", src, id, options);
        if (!isPotentialCssRootFile(id)) return;

        using I = new Instrumentation();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        DEBUG && I.start("[@tailwindcss/vite] Generate CSS (serve)");

        const root = roots.get(id);

        const generated = await root.generate(
          src,
          (file) => this.addWatchFile(file),
          I,
        );
        if (!generated) {
          roots.delete(id);
          return src;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        DEBUG && I.end("[@tailwindcss/vite] Generate CSS (serve)");
        // console.log("test test", generated);
        return { code: generated };
      },
    },
  ] satisfies PluginOption;
};
