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
        hierarchyProxy.originData.rect.x = rect.x;
        hierarchyProxy.originData.rect.y = rect.y;
        hierarchyProxy.originData.rect.width = rect.width;
        hierarchyProxy.originData.rect.height = rect.height;

        hierarchyProxy.updateData.rect.x = rect.x;
        hierarchyProxy.updateData.rect.y = rect.y;
        hierarchyProxy.updateData.rect.width = rect.width;
        hierarchyProxy.updateData.rect.height = rect.height;
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
      storyProxy.group.manualData.rect.x = 0;
      storyProxy.group.manualData.rect.y = 0;
      storyProxy.group.manualData.rect.width = 0;
      storyProxy.group.manualData.rect.height = 0;
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
          hierarchyProxy.manualData.rect.x = group.manualData.rect.x;
          hierarchyProxy.manualData.rect.y = group.manualData.rect.y;
          hierarchyProxy.manualData.rect.width =
            group.manualData.rect.width;
          hierarchyProxy.manualData.rect.height =
            group.manualData.rect.height;
        }
      }
    });
  }, [
    group.manualData.rect.height,
    group.manualData.rect.width,
    group.manualData.rect.x,
    group.manualData.rect.y,
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
        style.left = calc(`${hierarchy.updateData.rect.x}px`).toString();
        style.top = calc(`${hierarchy.updateData.rect.y}px`).toString();
        style.width = calc(`${hierarchy.updateData.rect.width}px`).toString();
        style.height = calc(`${hierarchy.updateData.rect.height}px`).toString();
      }
      const updateRect = element?.getBoundingClientRect();
      if (updateRect) {
        rects.push(updateRect);
        const hierarchyProxy = storyProxy.hierarchies[hierarchy.id];
        if (
          hierarchyProxy &&
          (updateRect.x !== hierarchy.updateData.rect.x ||
            updateRect.y !== hierarchy.updateData.rect.y ||
            updateRect.width !== hierarchy.updateData.rect.width ||
            updateRect.height !== hierarchy.updateData.rect.height)
        ) {
          hierarchyProxy.updateData.rect.x = updateRect.x;
          hierarchyProxy.updateData.rect.y = updateRect.y;
          hierarchyProxy.updateData.rect.width = updateRect.width;
          hierarchyProxy.updateData.rect.height = updateRect.height;
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

    storyProxy.group.manualData.rect.x = 0;
    storyProxy.group.manualData.rect.y = 0;
    storyProxy.group.manualData.rect.width = 0;
    storyProxy.group.manualData.rect.height = 0;
  }, [storyProxy]);
};
