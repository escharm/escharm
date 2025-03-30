import { useCallback, useContext, useEffect, useMemo } from "react";
import { proxy, subscribe, useSnapshot } from "valtio";

import { IFlatHierarchy, IFlatStructure, IHierarchy, IRect } from "../types";
import { IStoryContext, StoryContext } from "./StoryProvider";

export const useStory = () => {
  const storyProxy = useContext(StoryContext);
  return useSnapshot(storyProxy);
};

export const useGroup = () => {
  const story = useStory();
  return story.group;
};

export const useSelectedHierarchyIds = () => {
  const story = useStory();
  return story.group.selectedHierarchyIds;
};

export const find = <T>(
  hierarchyProxy: IFlatStructure<T>,
  id?: string,
): Partial<T> => {
  const defaultProxy = proxy<Partial<T>>({});
  return id ? (hierarchyProxy[id] ?? defaultProxy) : defaultProxy;
};

export const useHierarchies = () => {
  const story = useStory();
  return story.hierarchies;
};

export function useHierarchy(id: string | undefined): Partial<IHierarchy> {
  const hierarchies = useHierarchies();
  return useMemo(() => {
    if (!id) {
      return {};
    }
    return hierarchies[id] ?? {};
  }, [hierarchies, id]);
}

export const useSelectHierarchy = () => {
  const storyProxy = useContext(StoryContext);

  const selectedHierarchy = useCallback(
    (hierarchyId: string) => {
      if (storyProxy.group.selectedHierarchyIds.includes(hierarchyId)) {
        storyProxy.group.selectedHierarchyIds.splice(0);
      } else {
        storyProxy.group.selectedHierarchyIds.splice(
          0,
          storyProxy.group.selectedHierarchyIds.length,
          hierarchyId,
        );
      }

      const rects: IRect[] = [];
      storyProxy.group.selectedHierarchyIds.forEach((id) => {
        const rect = getHierarchyRect(id, storyProxy.hierarchies);
        rects.push(rect);
        storyProxy.group.selectedRects[id] = rect;
      });

      if (rects.length > 0) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        rects.forEach((rect) => {
          minX = Math.min(minX, rect.x);
          minY = Math.min(minY, rect.y);
          maxX = Math.max(maxX, rect.x + rect.width);
          maxY = Math.max(maxY, rect.y + rect.height);
        });

        storyProxy.group.rect.x = minX;
        storyProxy.group.rect.y = minY;
        storyProxy.group.rect.width = maxX - minX;
        storyProxy.group.rect.height = maxY - minY;
      } else {
        storyProxy.group.rect.x = 0;
        storyProxy.group.rect.y = 0;
        storyProxy.group.rect.width = 0;
        storyProxy.group.rect.height = 0;
      }
    },
    [storyProxy],
  );
  return selectedHierarchy;
};

export const useSetSelectedHierarchyId = () => {
  const storyProxy = useContext(StoryContext);

  const setSelectedHierarchyId = useCallback(
    (hierarchyId: string) => {
      storyProxy.group.selectedHierarchyIds = [hierarchyId];
      const rects: IRect[] = [];
      const rect = getHierarchyRect(hierarchyId, storyProxy.hierarchies);
      rects.push(rect);
      storyProxy.group.selectedRects[hierarchyId] = rect;

      if (rects.length > 0) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        rects.forEach((rect) => {
          minX = Math.min(minX, rect.x);
          minY = Math.min(minY, rect.y);
          maxX = Math.max(maxX, rect.x + rect.width);
          maxY = Math.max(maxY, rect.y + rect.height);
        });

        storyProxy.group.rect.x = minX;
        storyProxy.group.rect.y = minY;
        storyProxy.group.rect.width = maxX - minX;
        storyProxy.group.rect.height = maxY - minY;
      } else {
        storyProxy.group.rect.x = 0;
        storyProxy.group.rect.y = 0;
        storyProxy.group.rect.width = 0;
        storyProxy.group.rect.height = 0;
      }
      storyProxy.group.manualData.offsetRect.x = 0;
      storyProxy.group.manualData.offsetRect.y = 0;
      storyProxy.group.manualData.offsetRect.width = 0;
      storyProxy.group.manualData.offsetRect.height = 0;
    },
    [storyProxy],
  );

  return setSelectedHierarchyId;
};

export const getHierarchyRect = (
  hierarchyId: string,
  hierarchyProxy: IFlatHierarchy,
): IRect => {
  const hierarchy = hierarchyProxy[hierarchyId];
  if (!hierarchy) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  const element = document.querySelector(`[data-id="${hierarchyId}"]`);
  if (!element) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  const rect = element.getBoundingClientRect();
  return rect;
};

export const useSyncHierarchy = () => {
  const storyContext = useContext(StoryContext);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.send("LOAD_STORY", () => {});
    }
  }, []);

  const onInitStoryContext = useCallback(
    (newStoryContext: IStoryContext) => {
      (Object.keys(newStoryContext) as Array<keyof IStoryContext>).forEach(
        (key) => {
          const value = newStoryContext[key];
          (storyContext[key] as typeof value) = value;
        },
      );
    },
    [storyContext],
  );

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on("LOAD_STORY", onInitStoryContext);
      return () => {
        import.meta.hot?.off("LOAD_STORY", onInitStoryContext);
      };
    }
  }, [onInitStoryContext]);

  useEffect(() => {
    subscribe(storyContext, () => {
      if (import.meta.hot) {
        import.meta.hot.send("PUSH_STORY_CONTEXT", { value: storyContext });
      }
    });
  }, [storyContext]);
};

export const useUpdateElements = () => {};

export const useSelectedHierarchies = () => {
  const selectedIds = useSelectedHierarchyIds();
  const hierarchies = useHierarchies();

  return useMemo(() => {
    return selectedIds
      .map((id) => hierarchies[id])
      .filter(Boolean) as IHierarchy[];
  }, [selectedIds, hierarchies]);
};

export const useCleanSelectedHierarchy = () => {
  const storyProxy = useContext(StoryContext);

  return useCallback(() => {
    storyProxy.group.selectedHierarchyIds = [];
    storyProxy.group.selectedRects = {};
    storyProxy.group.rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    storyProxy.group.manualData.offsetRect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }, [storyProxy]);
};
