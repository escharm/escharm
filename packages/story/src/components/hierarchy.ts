import { useCallback, useContext, useEffect } from "react";
import { proxy, subscribe, useSnapshot } from "valtio";

import { IFlatHierarchy, IFlatStructure, IHierarchy, IRect } from "../types";
import { IStoryContext, StoryContext } from "./StoryProvider";

export const useGroupedRect = () => {
  const { groupProxy: groupedRectProxy } = useContext(StoryContext);
  return useSnapshot(groupedRectProxy);
};

export const useSelectedHierarchyIds = () => {
  const { groupProxy: groupedRectProxy } = useContext(StoryContext);
  return useSnapshot(groupedRectProxy).selectedHierarchyIds;
};

export const find = <T>(
  hierarchyProxy: IFlatStructure<T>,
  id?: string,
): Partial<T> => {
  const defaultProxy = proxy<Partial<T>>({});
  return id ? (hierarchyProxy[id] ?? defaultProxy) : defaultProxy;
};

export function useHierarchy(id: string | undefined): Partial<IHierarchy> {
  const { hierarchyProxy } = useContext(StoryContext);

  return useSnapshot(find(hierarchyProxy, id));
}

export const useFlatHierarchy = () => {
  const { hierarchyProxy } = useContext(StoryContext);
  return useSnapshot(hierarchyProxy);
};

export const useSelectHierarchy = () => {
  const { groupProxy: groupedRectProxy, hierarchyProxy } =
    useContext(StoryContext);

  const selectedHierarchy = useCallback(
    (hierarchyId: string) => {
      if (groupedRectProxy.selectedHierarchyIds.includes(hierarchyId)) {
        groupedRectProxy.selectedHierarchyIds.splice(0);
      } else {
        groupedRectProxy.selectedHierarchyIds.splice(
          0,
          groupedRectProxy.selectedHierarchyIds.length,
          hierarchyId,
        );
      }

      const rects: IRect[] = [];

      groupedRectProxy.selectedHierarchyIds.forEach((id) => {
        const rect = getHierarchyRect(id, hierarchyProxy);
        rects.push(rect);
        groupedRectProxy.selectedRects[id] = rect;
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

        groupedRectProxy.rect.x = minX;
        groupedRectProxy.rect.y = minY;
        groupedRectProxy.rect.width = maxX - minX;
        groupedRectProxy.rect.height = maxY - minY;
      } else {
        groupedRectProxy.rect.x = 0;
        groupedRectProxy.rect.y = 0;
        groupedRectProxy.rect.width = 0;
        groupedRectProxy.rect.height = 0;
      }
    },
    [groupedRectProxy, hierarchyProxy],
  );
  return selectedHierarchy;
};

export const useSetSelectedHierarchyId = () => {
  const { groupProxy: groupedRectProxy, hierarchyProxy } =
    useContext(StoryContext);

  const toggleSelect = useCallback(
    (hierarchyId: string) => {
      groupedRectProxy.selectedHierarchyIds = [hierarchyId];
      const rects: IRect[] = [];
      const rect = getHierarchyRect(hierarchyId, hierarchyProxy);
      rects.push(rect);
      groupedRectProxy.selectedRects[hierarchyId] = rect;

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

        groupedRectProxy.rect.x = minX;
        groupedRectProxy.rect.y = minY;
        groupedRectProxy.rect.width = maxX - minX;
        groupedRectProxy.rect.height = maxY - minY;
      } else {
        groupedRectProxy.rect.x = 0;
        groupedRectProxy.rect.y = 0;
        groupedRectProxy.rect.width = 0;
        groupedRectProxy.rect.height = 0;
      }
    },
    [groupedRectProxy, hierarchyProxy],
  );

  return toggleSelect;
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
      import.meta.hot.send("INIT_STORY_CONTEXT", () => {});
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
      import.meta.hot.on("INIT_STORY_CONTEXT", onInitStoryContext);
      return () => {
        import.meta.hot?.off("INIT_STORY_CONTEXT", onInitStoryContext);
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
