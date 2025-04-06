import { IHierarchy } from "@escharm/story-editor";
import {
  compile,
  env,
  Features,
  Instrumentation,
  normalizePath,
  optimize,
} from "@tailwindcss/node";

import DefaultMap from "./TWDefaultMap";
import Root from "./TWRoot";

export const saveHierarchyChange =
  (roots: DefaultMap<string, Root>) => async (hierarchy: IHierarchy) => {
    try {
      // generate tailwind css
      using I = new Instrumentation();

      // const root = roots.get(id);
      // const generated = await root.generate(
      //   src,
      //   (file) => this.addWatchFile(file),
      //   I,
      // );
    } catch (error) {
      console.error("", error);
    }
  };
