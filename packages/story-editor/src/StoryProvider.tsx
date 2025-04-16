import React, { useCallback, useEffect, useRef } from "react";
import { createContext } from "react";
import { proxy } from "valtio";

import { IFlatHierarchy, IStoryContext, IUpdateTWStyleParams } from "./types";

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
    styledContainer: {},
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
  const styleRef = useRef<HTMLStyleElement>(null);

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

  const onUpdateTWDevStyle = useCallback((params: IUpdateTWStyleParams) => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      styleRef.current.id = "escharm-story-tw-dev-style";
      if (params.content) {
        styleRef.current.innerHTML = params.content;
      }
      document.head.appendChild(styleRef.current);
    } else {
      if (params.content) {
        styleRef.current.innerHTML = params.content;
      }
    }
  }, []);

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

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on("UPDATE_TW_DEV_STYLE", onUpdateTWDevStyle);
      return () => {
        import.meta.hot?.off("UPDATE_TW_DEV_STYLE", onUpdateTWDevStyle);
      };
    }
  });

  return (
    <StoryContext.Provider value={defaultValueRef.current}>
      {children}
    </StoryContext.Provider>
  );
};

export default StoryProvider;
