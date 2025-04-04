import React, { useCallback, useEffect, useRef } from "react";
import { createContext } from "react";
import { proxy } from "valtio";

import { IFlatHierarchy, IGroup } from "./types";

export interface IStoryContext {
  data?: Record<string, unknown>;
  hierarchies: IFlatHierarchy;
  group: IGroup;
  storyNames: string[];
}

const createDefaultData = (defaultValue?: IFlatHierarchy): IStoryContext => {
  const hierarchies = defaultValue ?? {};

  const group = {
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
  };

  return proxy({
    hierarchies,
    group,
    storyNames: [],
  });
};

// eslint-disable-next-line react-refresh/only-export-components
export const StoryContext = createContext<IStoryContext>(createDefaultData());

interface IProps {
  defaultValue?: IFlatHierarchy;
  children: React.ReactNode;
}

const StoryProvider = (props: IProps) => {
  const { children, defaultValue } = props;
  const defaultValueRef = useRef<IStoryContext>(
    createDefaultData(defaultValue),
  );

  useEffect(() => {}, []);

  const onSetStoryContext = useCallback(
    (newStoryContext: Partial<IStoryContext>) => {
      (Object.keys(newStoryContext) as Array<keyof IStoryContext>).forEach(
        (key) => {
          const value = newStoryContext[key];
          (defaultValueRef.current[key] as typeof value) = value;
        },
      );
    },
    [defaultValueRef],
  );

  useEffect(() => {
    import.meta.hot?.send("LOAD_STORY_CONTEXT", {
      search: window.location.search,
    });
  }, []);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on("SET_STORY_CONTEXT", onSetStoryContext);
      return () => {
        import.meta.hot?.off("SET_STORY_CONTEXT", onSetStoryContext);
      };
    }
  }, [onSetStoryContext]);

  return (
    <StoryContext.Provider value={defaultValueRef.current}>
      {children}
    </StoryContext.Provider>
  );
};

export default StoryProvider;
