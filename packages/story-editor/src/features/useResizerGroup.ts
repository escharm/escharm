import { useDrag } from "@use-gesture/react";
import { calc } from "@vanilla-extract/css-utils";
import { CSSProperties, useContext, useMemo } from "react";

import {
  useGroup,
  useSelectedHierarchies,
  useSelectedHierarchyIds,
} from "../hierarchy";
import { StoryContext } from "../StoryProvider";
import { IRect } from "../types";
import { useAnimationEffect } from "../useAnimationEffect";

export const useTopLeftResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();

  const topLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${group.rect.x - 2}px`).toString();
    style.top = calc(`${group.rect.y - 2}px`).toString();

    return style;
  }, [group]);

  const topLeftBind = useDrag(({ delta: [dx, dy] }) => {
    storyProxy.group.rect.x += dx;
    storyProxy.group.rect.width -= dx;
    storyProxy.group.rect.y += dy;
    storyProxy.group.rect.height -= dy;

    storyProxy.group.manualData.rect.x += dx;
    storyProxy.group.manualData.rect.width -= dx;
    storyProxy.group.manualData.rect.y += dy;
    storyProxy.group.manualData.rect.height -= dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateData.rect.x += dx;
        hierarchyProxy.updateData.rect.width -= dx;
        hierarchyProxy.updateData.rect.y += dy;
        hierarchyProxy.updateData.rect.height -= dy;

        hierarchyProxy.manualData.rect.x += dx;
        hierarchyProxy.manualData.rect.width -= dx;
        hierarchyProxy.manualData.rect.y += dy;
        hierarchyProxy.manualData.rect.height -= dy;
      }
    });
  });

  return {
    topLeft,
    topLeftBind,
  };
};

export const useTopRightResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();

  const topRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${group.rect.x - 2}px`)
      .add(`${group.rect.width}px`)
      .toString();
    style.top = calc(`${group.rect.y - 2}px`).toString();

    return style;
  }, [group]);

  const topRightBind = useDrag(({ delta: [dx, dy] }) => {
    storyProxy.group.rect.width += dx;
    storyProxy.group.rect.y += dy;
    storyProxy.group.rect.height -= dy;

    storyProxy.group.manualData.rect.width += dx;
    storyProxy.group.manualData.rect.y += dy;
    storyProxy.group.manualData.rect.height -= dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateData.rect.width += dx;
        hierarchyProxy.updateData.rect.y += dy;
        hierarchyProxy.updateData.rect.height -= dy;

        hierarchyProxy.manualData.rect.width += dx;
        hierarchyProxy.manualData.rect.y += dy;
        hierarchyProxy.manualData.rect.height -= dy;
      }
    });
  });

  return {
    topRight,
    topRightBind,
  };
};

export const useBottomLeftResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();

  const bottomLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${group.rect.x - 2}px`).toString();
    style.top = calc(`${group.rect.y - 2}px`)
      .add(`${group.rect.height}px`)
      .toString();

    return style;
  }, [group]);

  const bottomLeftBind = useDrag(({ delta: [dx, dy] }) => {
    storyProxy.group.rect.x += dx;
    storyProxy.group.rect.width -= dx;
    storyProxy.group.rect.height += dy;

    storyProxy.group.manualData.rect.x += dx;
    storyProxy.group.manualData.rect.width -= dx;
    storyProxy.group.manualData.rect.height += dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateData.rect.x += dx;
        hierarchyProxy.updateData.rect.width -= dx;
        hierarchyProxy.updateData.rect.height += dy;

        hierarchyProxy.manualData.rect.x += dx;
        hierarchyProxy.manualData.rect.height += dy;
      }
    });
  });

  return {
    bottomLeft,
    bottomLeftBind,
  };
};

export const useBottomRightResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();

  const bottomRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${group.rect.x - 2}px`)
      .add(`${group.rect.width}px`)
      .toString();
    style.top = calc(`${group.rect.y - 2}px`)
      .add(`${group.rect.height}px`)
      .toString();

    return style;
  }, [group]);

  const bottomRightBind = useDrag(({ delta: [dx, dy] }) => {
    storyProxy.group.rect.width += dx;
    storyProxy.group.rect.height += dy;

    storyProxy.group.manualData.rect.width += dx;
    storyProxy.group.manualData.rect.height += dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateData.rect.width += dx;
        hierarchyProxy.updateData.rect.height += dy;

        hierarchyProxy.manualData.rect.width += dx;
        hierarchyProxy.manualData.rect.height += dy;
      }
    });
  });

  return {
    bottomRight,
    bottomRightBind,
  };
};

export const useBodyResizer = () => {
  const storyProxy = useContext(StoryContext);
  const selectedHierarchyIds = useSelectedHierarchyIds();
  const group = useGroup();

  const body = useMemo(() => {
    const style: CSSProperties = {
      width: calc(`${group.rect.width}px`).toString(),
      height: calc(`${group.rect.height}px`).toString(),
    };

    style.left = calc(`${group.rect.x}px`).toString();
    style.top = calc(`${group.rect.y}px`).toString();

    return style;
  }, [group]);
  const bodyBind = useDrag(({ delta: [dx, dy] }) => {
    storyProxy.group.rect.x += dx;
    storyProxy.group.rect.y += dy;
    storyProxy.group.manualData.rect.x += dx;
    storyProxy.group.manualData.rect.y += dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateData.rect.x += dx;
        hierarchyProxy.updateData.rect.y += dy;

        hierarchyProxy.manualData.rect.x += dx;
        hierarchyProxy.manualData.rect.y += dy;
      }
    });
  });

  return {
    body,
    bodyBind,
  };
};

export const useResizerGroup = () => {
  const { body, bodyBind } = useBodyResizer();
  const { topLeft, topLeftBind } = useTopLeftResizer();
  const { topRight, topRightBind } = useTopRightResizer();
  const { bottomLeft, bottomLeftBind } = useBottomLeftResizer();
  const { bottomRight, bottomRightBind } = useBottomRightResizer();

  return {
    bodyBind,
    topLeftBind,
    topRightBind,
    bottomLeftBind,
    bottomRightBind,
    body,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  };
};

export const useUpdateElements = () => {
  const selectedHierarchies = useSelectedHierarchies();
  const storyProxy = useContext(StoryContext);

  useAnimationEffect(() => {
    const rects: IRect[] = [];

    selectedHierarchies.forEach((hierarchy) => {
      const element = document.querySelector(`[data-id="${hierarchy.id}"]`) as
        | HTMLElement
        | undefined;
      if (element) {
        const style = element.style;
        style.left = calc(`${hierarchy.updateData.rect.x}px`).toString();
        style.top = calc(`${hierarchy.updateData.rect.y}px`).toString();
        style.width = calc(`${hierarchy.updateData.rect.width}px`).toString();
        style.height = calc(`${hierarchy.updateData.rect.height}px`).toString();
      }
      const updateRect = element?.getBoundingClientRect();
      const hierarchyProxy = storyProxy.hierarchies[hierarchy.id];
      if (updateRect) {
        rects.push(updateRect);
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
      if (hierarchyProxy && element?.style) {
        for (let i = 0; i < element?.style.length; i++) {
          const propertyName = element?.style[i];
          const propertyValue = element?.style.getPropertyValue(propertyName);
          hierarchyProxy.updateData.style[propertyName] = propertyValue;
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
