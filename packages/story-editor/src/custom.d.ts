import "valtio";
import "vite";

import { IStoryContext } from "./src/components/StoryProvider";
declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

declare module "vite" {
  interface CustomEventMap {
    SET_STORY_CONTEXT: Partial<IStoryContext>;
  }
}
