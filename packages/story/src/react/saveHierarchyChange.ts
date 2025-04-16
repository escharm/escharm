import { IHierarchy, ISaveHierarchyParams } from "@escharm/story-editor";
import {
  compile,
  env,
  Features,
  Instrumentation,
  normalizePath,
  optimize,
} from "@tailwindcss/node";
import fs from "fs";
import path from "path";
import { ViteDevServer } from "vite";

import { updateHtmlTagClassNames } from "./htmlMatcher";
import DefaultMap from "./TWDefaultMap";
import Root from "./TWRoot";

export const saveHierarchyChange =
  (
    server: ViteDevServer,
    tailwindCSS: string,
    roots: DefaultMap<string, Root>,
  ) =>
  async (params: ISaveHierarchyParams) => {
    const { searchId, hierarchy } = params;

    try {
      console.log("test test", searchId, hierarchy);
      const searchParams = new URLSearchParams(searchId);
      const componentPath = searchParams.get("path");

      console.log(componentPath);

      if (!componentPath) {
        return null;
      }

      const rawCode = fs.readFileSync(
        path.join(process.cwd(), componentPath),
        "utf-8",
      );

      const value = updateHtmlTagClassNames(
        rawCode,
        hierarchy.id,
        hierarchy.manualData.className,
      );

      fs.writeFileSync(path.join(process.cwd(), componentPath), value);

      // generate tailwind css
      using I = new Instrumentation();
      const src = fs.readFileSync(tailwindCSS, "utf-8");
      const root = roots.get(tailwindCSS);
      const generated = await root.generate(src, () => {}, I);
      server.ws.send("UPDATE_TW_DEV_STYLE", {
        content: generated,
      });
      console.log("test test generated", generated);
    } catch (error) {
      console.error("", error);
    }
  };
