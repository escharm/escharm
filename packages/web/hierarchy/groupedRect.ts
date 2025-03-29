import { useDrag } from "@use-gesture/react";
import { calc } from "@vanilla-extract/css-utils";
import { CSSProperties, useCallback, useContext, useMemo } from "react";
import { useSnapshot } from "valtio";

import { DataContext, useGroupedRect } from "./DataProvider";
import {
  HierarchyType,
  HorizontalAnchor,
  IFlatHierarchy,
  IHierarchy,
  VerticalAnchor,
} from "./types";

const useTopLeftResizer = () => {
  const { groupedRectProxy, hierarchyProxy } = useContext(DataContext);
  const groupedRect = useGroupedRect();

  const topLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    switch (groupedRect.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${groupedRect.relativeX}px`).toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${groupedRect.relativeX}px`)
          .add(`${groupedRect.width}px`)
          .add(groupedRect.style.width ?? "0px")
          .toString();
      default:
        break;
    }

    switch (groupedRect.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${groupedRect.relativeY}px`).toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${groupedRect.relativeY}px`)
          .add(`${groupedRect.height}px`)
          .add(groupedRect.style.height ?? "0px")
          .toString();
        break;
      default:
        break;
    }

    return style;
  }, [groupedRect]);

  const topLeftBind = useDrag(({ delta: [dx, dy] }) => {
    switch (groupedRectProxy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        groupedRectProxy.relativeX += dx;
        groupedRectProxy.width -= dx;
        break;
      case HorizontalAnchor.Right:
        groupedRectProxy.width -= dx;
        break;
      default:
        break;
    }
    switch (groupedRectProxy.anchor?.vertical) {
      case VerticalAnchor.Top:
        groupedRectProxy.relativeY += dy;
        groupedRectProxy.height -= dy;
        break;
      case VerticalAnchor.Bottom:
        groupedRectProxy.height -= dy;
        break;
      default:
        break;
    }
  });

  return {
    topLeft,
    topLeftBind,
  };
};

const useTopRightResizer = () => {
  const { groupedRectProxy } = useContext(DataContext);
  const groupedRect = useGroupedRect();

  const topRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    switch (groupedRect.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${groupedRect.relativeX}px`)
          .add(`${groupedRect.width}px`)
          .add(groupedRect.style.width ?? "0px")
          .toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${groupedRect.relativeX}px`).toString();
      default:
        break;
    }

    switch (groupedRect.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${groupedRect.relativeY}px`).toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${groupedRect.relativeY}px`)
          .add(`${groupedRect.height}px`)
          .add(groupedRect.style.height ?? "0px")
          .toString();
        break;
      default:
        break;
    }

    return style;
  }, [groupedRect]);

  const topRightBind = useDrag(({ delta: [dx, dy] }) => {
    switch (groupedRectProxy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        groupedRectProxy.width += dx;
        break;
      case HorizontalAnchor.Right:
        groupedRectProxy.relativeX -= dx;
        groupedRectProxy.width += dx;
        break;
      default:
        break;
    }
    switch (groupedRectProxy.anchor?.vertical) {
      case VerticalAnchor.Top:
        groupedRectProxy.relativeY += dy;
        groupedRectProxy.height -= dy;
        break;
      case VerticalAnchor.Bottom:
        groupedRectProxy.height -= dy;
        break;
      default:
        break;
    }
  });

  return {
    topRight,
    topRightBind,
  };
};

const useBottomLeftResizer = () => {
  const { groupedRectProxy } = useContext(DataContext);
  const groupedRect = useGroupedRect();

  const bottomLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    switch (groupedRect.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${groupedRect.relativeX}px`).toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${groupedRect.relativeX}px`)
          .add(`${groupedRect.width}px`)
          .add(groupedRect.style.width ?? "0px")
          .toString();
      default:
        break;
    }

    switch (groupedRect.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${groupedRect.relativeY}px`)
          .add(`${groupedRect.height}px`)
          .add(groupedRect.style.height ?? "0px")
          .toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${groupedRect.relativeY}px`).toString();
        break;
      default:
        break;
    }

    return style;
  }, [groupedRect]);

  const bottomLeftBind = useDrag(({ delta: [dx, dy] }) => {
    switch (groupedRectProxy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        groupedRectProxy.relativeX += dx;
        groupedRectProxy.width -= dx;
        break;
      case HorizontalAnchor.Right:
        groupedRectProxy.width -= dx;
        break;
      default:
        break;
    }

    switch (groupedRectProxy.anchor?.vertical) {
      case VerticalAnchor.Top:
        groupedRectProxy.height += dy;
        break;
      case VerticalAnchor.Bottom:
        groupedRectProxy.relativeY -= dy;
        groupedRectProxy.height += dy;
        break;
      default:
        break;
    }
  });

  return {
    bottomLeft,
    bottomLeftBind,
  };
};

const useBottomRightResizer = () => {
  const { groupedRectProxy } = useContext(DataContext);
  const groupedRect = useGroupedRect();

  const bottomRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    switch (groupedRect.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${groupedRect.relativeX}px`)
          .add(`${groupedRect.width}px`)
          .add(groupedRect.style.width ?? "0px")
          .toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${groupedRect.relativeX}px`).toString();
      default:
        break;
    }

    switch (groupedRect.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${groupedRect.relativeY}px`)
          .add(`${groupedRect.height}px`)
          .add(groupedRect.style.height ?? "0px")
          .toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${groupedRect.relativeY}px`).toString();
        break;
      default:
        break;
    }

    return style;
  }, [groupedRect]);

  const bottomRightBind = useDrag(({ delta: [dx, dy] }) => {
    switch (groupedRectProxy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        groupedRectProxy.width += dx;
        break;
      case HorizontalAnchor.Right:
        groupedRectProxy.relativeX -= dx;
        groupedRectProxy.width += dx;
        break;
      default:
        break;
    }

    switch (groupedRectProxy.anchor?.vertical) {
      case VerticalAnchor.Top:
        groupedRectProxy.height += dy;
        break;
      case VerticalAnchor.Bottom:
        groupedRectProxy.relativeY -= dy;
        groupedRectProxy.height += dy;
        break;
      default:
        break;
    }
  });

  return {
    bottomRight,
    bottomRightBind,
  };
};

export function useResizerStyle() {
  const groupedRect = useGroupedRect();
  const style = useMemo(() => {
    const style = {
      ...groupedRect.style,
      width: calc(groupedRect.style.width ?? "0px")
        .add(`${groupedRect.width}px`)
        .toString(),
      height: calc(groupedRect.style.height ?? "0px")
        .add(`${groupedRect.height}px`)
        .toString(),
    };

    switch (groupedRect.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${groupedRect.relativeX}px`).toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${groupedRect.relativeX}px`).toString();
        break;
      default:
        break;
    }

    switch (groupedRect.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${groupedRect.relativeY}px`).toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${groupedRect.relativeY}px`).toString();
        break;
      default:
        break;
    }

    return style;
  }, [groupedRect]);

  return style;
}

export const useResizerGroup = () => {
  const { topLeft, topLeftBind } = useTopLeftResizer();
  const { bottomRight, bottomRightBind } = useBottomRightResizer();
  const { topRight, topRightBind } = useTopRightResizer();
  const { bottomLeft, bottomLeftBind } = useBottomLeftResizer();

  return {
    topLeftBind,
    topRightBind,
    bottomLeftBind,
    bottomRightBind,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  };
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

      const rects = groupedRectProxy.selectedHierarchyIds.map((id) =>
        getHierarchyRect(id, hierarchyProxy),
      );

      rects.forEach((rect) => {
        groupedRectProxy.selectedRects[rect.id] = rect;
      });

      if (rects.length > 0) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        rects.forEach((rect) => {
          minX = Math.min(minX, rect.relativeX);
          minY = Math.min(minY, rect.relativeY);
          maxX = Math.max(maxX, rect.relativeX + rect.width);
          maxY = Math.max(maxY, rect.relativeY + rect.height);
        });

        groupedRectProxy.relativeX = minX;
        groupedRectProxy.relativeY = minY;
        groupedRectProxy.width = maxX - minX;
        groupedRectProxy.height = maxY - minY;
      } else {
        groupedRectProxy.relativeX = 0;
        groupedRectProxy.relativeY = 0;
        groupedRectProxy.width = 0;
        groupedRectProxy.height = 0;
      }
    },
    [groupedRectProxy, hierarchyProxy],
  );
  return selectedHierarchy;
};

export const useToggleSelect = () => {
  const { groupedRectProxy, hierarchyProxy } = useContext(DataContext);

  const toggleSelect = useCallback(
    (hierarchyId: string) => {
      const index = groupedRectProxy.selectedHierarchyIds.indexOf(hierarchyId);
      if (index !== -1) {
        groupedRectProxy.selectedHierarchyIds.splice(index, 1);
      } else {
        groupedRectProxy.selectedHierarchyIds.push(hierarchyId);
      }

      const rects = groupedRectProxy.selectedHierarchyIds.map((id) =>
        getHierarchyRect(id, hierarchyProxy),
      );

      rects.forEach((rect) => {
        groupedRectProxy.selectedRects[rect.id] = rect;
      });

      if (rects.length > 0) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        rects.forEach((rect) => {
          minX = Math.min(minX, rect.relativeX);
          minY = Math.min(minY, rect.relativeY);
          maxX = Math.max(maxX, rect.relativeX + rect.width);
          maxY = Math.max(maxY, rect.relativeY + rect.height);
        });

        groupedRectProxy.relativeX = minX;
        groupedRectProxy.relativeY = minY;
        groupedRectProxy.width = maxX - minX;
        groupedRectProxy.height = maxY - minY;
      } else {
        groupedRectProxy.relativeX = 0;
        groupedRectProxy.relativeY = 0;
        groupedRectProxy.width = 0;
        groupedRectProxy.height = 0;
      }
    },
    [groupedRectProxy, hierarchyProxy],
  );

  return toggleSelect;
};

export const getHierarchyRect = (
  hierarchyId: string,
  hierarchyProxy: IFlatHierarchy,
): Pick<
  IHierarchy,
  "anchor" | "relativeX" | "relativeY" | "width" | "height" | "id"
> => {
  const hierarchy = hierarchyProxy[hierarchyId];
  if (!hierarchy) {
    return {
      id: hierarchyId,
      anchor: null,
      relativeX: 0,
      relativeY: 0,
      width: 0,
      height: 0,
    };
  }

  const path: string[] = [];
  let currentId: string | null = hierarchyId;
  while (currentId) {
    path.unshift(currentId);
    currentId = hierarchyProxy[currentId]?.parentId || null;
  }

  let currentDocument: Document = document;
  let totalX = 0;
  let totalY = 0;
  let width = 0;
  let height = 0;

  // Traverse path and accumulate positions
  for (let i = 0; i < path.length; i++) {
    const currentHierarchy = hierarchyProxy[path[i]];
    if (!currentHierarchy) break;

    // Handle iframe transitions
    if (i < path.length - 1 && currentHierarchy.type === HierarchyType.Page) {
      const iframe = currentDocument.getElementById(
        currentHierarchy.id,
      ) as HTMLIFrameElement | null;
      if (!iframe || !iframe.contentWindow) break;

      // Add iframe's position to the total
      const iframeRect = iframe.getBoundingClientRect();
      totalX += iframeRect.left;
      totalY += iframeRect.top;

      currentDocument = iframe.contentWindow.document;
    }

    // For the target element, get its rect and add to totals
    if (i === path.length - 1) {
      const element = currentDocument.getElementById(currentHierarchy.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        totalX += rect.left;
        totalY += rect.top;
      }
    }
  }

  return {
    id: hierarchyId,
    anchor: hierarchy.anchor,
    relativeX: totalX,
    relativeY: totalY,
    width,
    height,
  };
};

export const useSelectedGroup = () => {
  const { groupedRectProxy } = useContext(DataContext);
  return useSnapshot(groupedRectProxy);
};
