import { useDrag } from "@use-gesture/react";
import { calc } from "@vanilla-extract/css-utils";
import { CSSProperties, useContext, useMemo } from "react";

import { DataContext } from "./DataProvider";
import { hasHierarchy, useHierarchy } from "./hooks";
import { HorizontalAnchor, VerticalAnchor } from "./types";

export const useTopLeftResizer = (hierarchyId: string | undefined) => {
  const { hierarchyProxy } = useContext(DataContext);
  const hierarchy = useHierarchy(hierarchyId);

  const topLeft: CSSProperties = useMemo(() => {
    if (!hasHierarchy(hierarchy)) {
      return {};
    }
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    switch (hierarchy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${hierarchy.relativeX}px`).toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${hierarchy.relativeX}px`)
          .add(`${hierarchy.width}px`)
          .add(hierarchy.style.width ?? "0px")
          .toString();
      default:
        break;
    }

    switch (hierarchy.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${hierarchy.relativeY}px`).toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${hierarchy.relativeY}px`)
          .add(`${hierarchy.height}px`)
          .add(hierarchy.style.height ?? "0px")
          .toString();
        break;
      default:
        break;
    }

    return style;
  }, [hierarchy]);

  const topLeftBind = useDrag(({ delta: [dx, dy] }) => {
    if (!hierarchyId) {
      return;
    }
    const hierarchy = hierarchyProxy[hierarchyId];
    if (!hierarchy) {
      return;
    }
    switch (hierarchy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        hierarchy.relativeX += dx;
        hierarchy.width -= dx;
        break;
      case HorizontalAnchor.Right:
        hierarchy.width -= dx;
        break;
      default:
        break;
    }
    switch (hierarchy.anchor?.vertical) {
      case VerticalAnchor.Top:
        hierarchy.relativeY += dy;
        hierarchy.height -= dy;
        break;
      case VerticalAnchor.Bottom:
        hierarchy.height -= dy;
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

export const useTopRightResizer = (hierarchyId: string | undefined) => {
  const { hierarchyProxy } = useContext(DataContext);
  const hierarchy = useHierarchy(hierarchyId);

  const topRight: CSSProperties = useMemo(() => {
    if (!hasHierarchy(hierarchy)) {
      return {};
    }
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    switch (hierarchy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${hierarchy.relativeX}px`)
          .add(`${hierarchy.width}px`)
          .add(hierarchy.style.width ?? "0px")
          .toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${hierarchy.relativeX}px`).toString();
      default:
        break;
    }

    switch (hierarchy.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${hierarchy.relativeY}px`).toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${hierarchy.relativeY}px`)
          .add(`${hierarchy.height}px`)
          .add(hierarchy.style.height ?? "0px")
          .toString();
        break;
      default:
        break;
    }

    return style;
  }, [hierarchy]);

  const topRightBind = useDrag(({ delta: [dx, dy] }) => {
    if (!hierarchyId) {
      return;
    }
    const hierarchy = hierarchyProxy[hierarchyId];
    if (!hierarchy) {
      return;
    }

    switch (hierarchy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        hierarchy.width += dx;
        break;
      case HorizontalAnchor.Right:
        hierarchy.relativeX -= dx;
        hierarchy.width += dx;
        break;
      default:
        break;
    }
    switch (hierarchy.anchor?.vertical) {
      case VerticalAnchor.Top:
        hierarchy.relativeY += dy;
        hierarchy.height -= dy;
        break;
      case VerticalAnchor.Bottom:
        hierarchy.height -= dy;
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

export const useBottomLeftResizer = (hierarchyId: string | undefined) => {
  const { hierarchyProxy } = useContext(DataContext);

  const hierarchy = useHierarchy(hierarchyId);
  const bottomLeft: CSSProperties = useMemo(() => {
    if (!hasHierarchy(hierarchy)) {
      return {};
    }

    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    switch (hierarchy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${hierarchy.relativeX}px`).toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${hierarchy.relativeX}px`)
          .add(`${hierarchy.width}px`)
          .add(hierarchy.style.width ?? "0px")
          .toString();
      default:
        break;
    }

    switch (hierarchy.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${hierarchy.relativeY}px`)
          .add(`${hierarchy.height}px`)
          .add(hierarchy.style.height ?? "0px")
          .toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${hierarchy.relativeY}px`).toString();
        break;
      default:
        break;
    }

    return style;
  }, [hierarchy]);

  const bottomLeftBind = useDrag(({ delta: [dx, dy] }) => {
    if (!hierarchyId) {
      return;
    }
    const hierarchy = hierarchyProxy[hierarchyId];
    if (!hierarchy) {
      return;
    }

    switch (hierarchy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        hierarchy.relativeX += dx;
        hierarchy.width -= dx;
        break;
      case HorizontalAnchor.Right:
        hierarchy.width -= dx;
        break;
      default:
        break;
    }

    switch (hierarchy.anchor?.vertical) {
      case VerticalAnchor.Top:
        hierarchy.height += dy;
        break;
      case VerticalAnchor.Bottom:
        hierarchy.relativeY -= dy;
        hierarchy.height += dy;
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

export const useBottomRightResizer = (hierarchyId: string | undefined) => {
  const { hierarchyProxy } = useContext(DataContext);
  const hierarchy = useHierarchy(hierarchyId);

  const bottomRight: CSSProperties = useMemo(() => {
    if (!hasHierarchy(hierarchy)) {
      return {};
    }

    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    switch (hierarchy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${hierarchy.relativeX}px`)
          .add(`${hierarchy.width}px`)
          .add(hierarchy.style.width ?? "0px")
          .toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${hierarchy.relativeX}px`).toString();
      default:
        break;
    }

    switch (hierarchy.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${hierarchy.relativeY}px`)
          .add(`${hierarchy.height}px`)
          .add(hierarchy.style.height ?? "0px")
          .toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${hierarchy.relativeY}px`).toString();
        break;
      default:
        break;
    }

    return style;
  }, [hierarchy]);

  const bottomRightBind = useDrag(({ delta: [dx, dy] }) => {
    if (!hierarchyId) {
      return;
    }
    const hierarchy = hierarchyProxy[hierarchyId];
    if (!hierarchy) {
      return;
    }
    switch (hierarchy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        hierarchy.width += dx;
        break;
      case HorizontalAnchor.Right:
        hierarchy.relativeX -= dx;
        hierarchy.width += dx;
        break;
      default:
        break;
    }

    switch (hierarchy.anchor?.vertical) {
      case VerticalAnchor.Top:
        hierarchy.height += dy;
        break;
      case VerticalAnchor.Bottom:
        hierarchy.relativeY -= dy;
        hierarchy.height += dy;
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

export const useResizeRect = (hierarchyId: string) => {
  const { topLeft, topLeftBind } = useTopLeftResizer(hierarchyId);
  const { bottomRight, bottomRightBind } = useBottomRightResizer(hierarchyId);
  const { topRight, topRightBind } = useTopRightResizer(hierarchyId);
  const { bottomLeft, bottomLeftBind } = useBottomLeftResizer(hierarchyId);

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
