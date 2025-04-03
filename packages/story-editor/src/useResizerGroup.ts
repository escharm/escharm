import { useDrag } from "@use-gesture/react";
import { calc } from "@vanilla-extract/css-utils";
import { CSSProperties, useContext, useMemo } from "react";

import { useGroup, useSelectedHierarchyIds } from "./hierarchy";
import { StoryContext } from "./StoryProvider";

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

    storyProxy.group.manualData.offsetRect.x += dx;
    storyProxy.group.manualData.offsetRect.width -= dx;
    storyProxy.group.manualData.offsetRect.y += dy;
    storyProxy.group.manualData.offsetRect.height -= dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateRect.x += dx;
        hierarchyProxy.updateRect.width -= dx;
        hierarchyProxy.updateRect.y += dy;
        hierarchyProxy.updateRect.height -= dy;
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

    storyProxy.group.manualData.offsetRect.width += dx;
    storyProxy.group.manualData.offsetRect.y += dy;
    storyProxy.group.manualData.offsetRect.height -= dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateRect.width += dx;
        hierarchyProxy.updateRect.y += dy;
        hierarchyProxy.updateRect.height -= dy;
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

    storyProxy.group.manualData.offsetRect.x += dx;
    storyProxy.group.manualData.offsetRect.width -= dx;
    storyProxy.group.manualData.offsetRect.height += dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateRect.x += dx;
        hierarchyProxy.updateRect.width -= dx;
        hierarchyProxy.updateRect.height += dy;
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

    storyProxy.group.manualData.offsetRect.width += dx;
    storyProxy.group.manualData.offsetRect.height += dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateRect.width += dx;
        hierarchyProxy.updateRect.height += dy;
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
    storyProxy.group.manualData.offsetRect.x += dx;
    storyProxy.group.manualData.offsetRect.y += dy;

    selectedHierarchyIds.forEach((hierarchyId) => {
      const hierarchyProxy = storyProxy.hierarchies[hierarchyId];
      if (hierarchyProxy) {
        hierarchyProxy.updateRect.x += dx;
        hierarchyProxy.updateRect.y += dy;
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
