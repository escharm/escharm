"use client";

import { createContext, ReactNode, useContext, useRef } from "react";
import { proxy, useSnapshot } from "valtio";

import TokenList from "./TokenList";
import {
  HierarchyType,
  HorizontalAnchor,
  IFlatHierarchy,
  IFlatStructure,
  IGroupedRect,
  VerticalAnchor,
} from "./types";

const createDefaultData = () => {
  const hierarchyProxy = proxy<IFlatHierarchy>({
    root: {
      id: "root",
      parentId: null,
      type: HierarchyType.Page,
      childIds: [],
      classList: new TokenList(),
      style: {},
      width: 0,
      height: 0,
      relativeX: 0,
      relativeY: 0,
      anchor: null,
      states: {},
    },
    "page-1": {
      id: "page-1",
      parentId: null,
      type: HierarchyType.Page,
      childIds: ["1-1"],
      style: {
        height: "300px",
        width: "300px",
      },
      classList: new TokenList(),
      width: 0,
      height: 0,
      relativeX: 0,
      relativeY: 0,
      anchor: {
        vertical: VerticalAnchor.Top,
        horizontal: HorizontalAnchor.Left,
      },
      states: {},
    },
    "1-1": {
      id: "1-1",
      parentId: "page-1",
      type: HierarchyType.Component,
      childIds: [],
      style: {
        height: "20px",
        width: "20px",
      },
      classList: new TokenList(),
      width: 0,
      height: 0,
      relativeX: 0,
      relativeY: 0,
      anchor: {
        vertical: VerticalAnchor.Top,
        horizontal: HorizontalAnchor.Left,
      },
      states: {},
    },
    "page-2": {
      id: "page-2",
      parentId: null,
      type: HierarchyType.Page,
      childIds: [],
      style: {
        height: "300px",
        width: "300px",
      },
      classList: new TokenList(),
      width: 0,
      height: 0,
      relativeX: 0,
      relativeY: 0,
      anchor: {
        vertical: VerticalAnchor.Top,
        horizontal: HorizontalAnchor.Right,
      },
      states: {},
    },
    "page-3": {
      id: "page-3",
      parentId: null,
      type: HierarchyType.Page,
      childIds: [],
      style: {
        height: "300px",
        width: "300px",
      },
      classList: new TokenList(),
      width: 0,
      height: 0,
      relativeX: 0,
      relativeY: 0,
      anchor: {
        vertical: VerticalAnchor.Bottom,
        horizontal: HorizontalAnchor.Left,
      },
      states: {},
    },
    "page-4": {
      id: "page-4",
      parentId: null,
      type: HierarchyType.Page,
      childIds: [],
      style: {
        height: "300px",
        width: "300px",
      },
      classList: new TokenList(),
      width: 0,
      height: 0,
      relativeX: 0,
      relativeY: 0,
      anchor: {
        vertical: VerticalAnchor.Bottom,
        horizontal: HorizontalAnchor.Right,
      },
      states: {},
    },
  });

  const groupedRectProxy = proxy<IGroupedRect>({
    selectedHierarchyIds: [],
    width: 0,
    height: 0,
    relativeX: 0,
    relativeY: 0,
    style: {},
    anchor: {
      horizontal: HorizontalAnchor.Left,
      vertical: VerticalAnchor.Top,
    },
    selectedRects: {},
  });

  return {
    hierarchyProxy,
    groupedRectProxy,
  };
};

// 创建 Context
export const DataContext = createContext<{
  hierarchyProxy: IFlatHierarchy;
  groupedRectProxy: IGroupedRect;
}>(createDefaultData());

export function DataProvider({ children }: { children: ReactNode }) {
  const ref = useRef(createDefaultData());

  return (
    <DataContext.Provider value={ref.current}>{children}</DataContext.Provider>
  );
}

export const find = <T,>(
  hierarchyProxy: IFlatStructure<T>,
  id?: string
): Partial<T> => {
  const defaultProxy = proxy<Partial<T>>({});
  return id ? hierarchyProxy[id] ?? defaultProxy : defaultProxy;
};

export const useGroupedRect = () => {
  const { groupedRectProxy } = useContext(DataContext);
  return useSnapshot(groupedRectProxy);
};

export const useSelectedHierarchyIds = () => {
  const { groupedRectProxy } = useContext(DataContext);
  return useSnapshot(groupedRectProxy.selectedHierarchyIds);
};
