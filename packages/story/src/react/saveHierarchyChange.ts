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

import { updateHtmlTagClassNames } from "./htmlMatcher";
import DefaultMap from "./TWDefaultMap";
import Root from "./TWRoot";

export const saveHierarchyChange =
  (tailwindCSS: string, roots: DefaultMap<string, Root>) =>
  async (params: ISaveHierarchyParams) => {
    const { searchId, hierarchy } = params;

    try {
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
      const generated = await root.generate(src, (file) => {}, I);
      console.log("test test generated", generated);
    } catch (error) {
      console.error("", error);
    }
  };
