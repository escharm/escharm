import { useCallback, useContext, useMemo } from "react";
import { proxy, useSnapshot } from "valtio";

import { IFlatHierarchy, IFlatStructure, IHierarchy, IRect } from "./types";
import { StoryContext } from "./StoryProvider";

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
      const element = document.querySelector(`[data-id="${hierarchyId}"]`) as
        | HTMLElement
        | undefined;

      if (hierarchyProxy && element?.style) {
        const computedStyle = element.style;
        // 遍历所有计算样式并直接设置到originData.style
        for (let i = 0; i < computedStyle.length; i++) {
          const propertyName = computedStyle[i];
          const propertyValue = computedStyle.getPropertyValue(propertyName);
          hierarchyProxy.originData.style[propertyName] = propertyValue;
        }

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
