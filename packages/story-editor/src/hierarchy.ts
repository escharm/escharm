import { calc } from "@vanilla-extract/css-utils";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { proxy, subscribe, useSnapshot } from "valtio";

import { IFlatHierarchy, IFlatStructure, IHierarchy, IRect } from "./types";
import { IStoryContext, StoryContext } from "./StoryProvider";
import { useAnimationEffect } from "./useAnimationEffect";

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
      storyProxy.group.selectedHierarchyIds = [hierarchyId];
      const rects: IRect[] = [];
      const rect = getHierarchyRect(hierarchyId, storyProxy.hierarchies);
      rects.push(rect);
      storyProxy.group.selectedRects[hierarchyId] = rect;

      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];

      // 同时更新 hierarchy 的 rect
      if (hierarchyProxy) {
        hierarchyProxy.originRect.x = rect.x;
        hierarchyProxy.originRect.y = rect.y;
        hierarchyProxy.originRect.width = rect.width;
        hierarchyProxy.originRect.height = rect.height;

        hierarchyProxy.updateRect.x = rect.x;
        hierarchyProxy.updateRect.y = rect.y;
        hierarchyProxy.updateRect.width = rect.width;
        hierarchyProxy.updateRect.height = rect.height;
      }
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

  return selectedHierarchy;
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

export const useUpdateElements = () => {
  const selectedHierarchies = useSelectedHierarchies();
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();
  const storyProxy = useContext(StoryContext);

  useAnimationEffect(() => {
    selectedHierarchyIds.forEach((hierarchyId) => {
      const element = document.querySelector(`[data-id="${hierarchyId}"]`);
      if (element) {
        const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
        if (hierarchyProxy) {
          hierarchyProxy.offsetRect.x = group.manualData.offsetRect.x;
          hierarchyProxy.offsetRect.y = group.manualData.offsetRect.y;
          hierarchyProxy.offsetRect.width = group.manualData.offsetRect.width;
          hierarchyProxy.offsetRect.height = group.manualData.offsetRect.height;
        }
      }
    });
  }, [
    group.manualData.offsetRect.height,
    group.manualData.offsetRect.width,
    group.manualData.offsetRect.x,
    group.manualData.offsetRect.y,
    selectedHierarchyIds,
    storyProxy.hierarchies,
  ]);

  useAnimationEffect(() => {
    const rects: IRect[] = [];

    selectedHierarchies.forEach((hierarchy) => {
      console.log(JSON.stringify(hierarchy, null, 2));
      const element = document.querySelector(`[data-id="${hierarchy.id}"]`);
      if (element) {
        const style = (element as HTMLElement).style;
        style.left = calc(`${hierarchy.updateRect.x}px`).toString();
        style.top = calc(`${hierarchy.updateRect.y}px`).toString();
        style.width = calc(`${hierarchy.updateRect.width}px`).toString();
        style.height = calc(`${hierarchy.updateRect.height}px`).toString();
      }
      const updateRect = element?.getBoundingClientRect();
      if (updateRect) {
        rects.push(updateRect);
        const hierarchyProxy = storyProxy.hierarchies[hierarchy.id];
        if (
          hierarchyProxy &&
          (updateRect.x !== hierarchy.updateRect.x ||
            updateRect.y !== hierarchy.updateRect.y ||
            updateRect.width !== hierarchy.updateRect.width ||
            updateRect.height !== hierarchy.updateRect.height)
        ) {
          hierarchyProxy.updateRect.x = updateRect.x;
          hierarchyProxy.updateRect.y = updateRect.y;
          hierarchyProxy.updateRect.width = updateRect.width;
          hierarchyProxy.updateRect.height = updateRect.height;
        }
      }
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
    }
  }, [selectedHierarchies, storyProxy.group.rect, storyProxy.hierarchies]);
};

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
    storyProxy.group.rect.x = 0;
    storyProxy.group.rect.y = 0;
    storyProxy.group.rect.width = 0;
    storyProxy.group.rect.height = 0;

    storyProxy.group.manualData.offsetRect.x = 0;
    storyProxy.group.manualData.offsetRect.y = 0;
    storyProxy.group.manualData.offsetRect.width = 0;
    storyProxy.group.manualData.offsetRect.height = 0;
  }, [storyProxy]);
};
