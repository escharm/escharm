import React, { useCallback, useContext, useRef } from "react";
import { createContext } from "react";
import { proxy, useSnapshot } from "valtio";

import {
  IFlatHierarchy,
  IFlatStructure,
  IGroupedRect,
  IHierarchy,
  IRect,
} from "./types";

interface IDataContext {
  hierarchyProxy: IFlatHierarchy;
  groupedRectProxy: IGroupedRect;
}

const createDefaultData = (defaultValue?: IFlatHierarchy): IDataContext => {
  const hierarchyProxy = proxy<IFlatHierarchy>(defaultValue ?? {});

  const groupedRectProxy = proxy<IGroupedRect>({
    selectedHierarchyIds: [],
    selectedRects: {},
    rect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    offfsetRect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    style: {},
  });
  return proxy({
    hierarchyProxy,
    groupedRectProxy,
  });
};

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext<IDataContext>(createDefaultData());

interface IProps {
  defaultValue?: IFlatHierarchy;
  children: React.ReactNode;
}

const DataProvider = (props: IProps) => {
  const { children, defaultValue } = props;
  const defaultValueRef = useRef<IDataContext>(createDefaultData(defaultValue));

  return (
    <DataContext.Provider value={defaultValueRef.current}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useGroupedRect = () => {
  const { groupedRectProxy } = useContext(DataContext);
  return useSnapshot(groupedRectProxy);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSelectedHierarchyIds = () => {
  const { groupedRectProxy } = useContext(DataContext);
  return useSnapshot(groupedRectProxy).selectedHierarchyIds;
};

// eslint-disable-next-line react-refresh/only-export-components
export const find = <T,>(
  hierarchyProxy: IFlatStructure<T>,
  id?: string,
): Partial<T> => {
  const defaultProxy = proxy<Partial<T>>({});
  return id ? (hierarchyProxy[id] ?? defaultProxy) : defaultProxy;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useHierarchy(id: string | undefined): Partial<IHierarchy> {
  const { hierarchyProxy } = useContext(DataContext);

  return useSnapshot(find(hierarchyProxy, id));
}

export const useFlatHierarchy = () => {
  const { hierarchyProxy } = useContext(DataContext);
  return useSnapshot(hierarchyProxy);
};

export const useSelectHierarchy = () => {
  const { groupedRectProxy, hierarchyProxy } = useContext(DataContext);

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
  const { groupedRectProxy, hierarchyProxy } = useContext(DataContext);

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
