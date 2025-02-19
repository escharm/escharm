import { useDrag } from "@use-gesture/react";
import { calc } from "@vanilla-extract/css-utils";
import { CSSProperties, useCallback, useMemo } from "react";
import { proxy, useSnapshot } from "valtio";

import { HorizontalAnchor, IAnchor, VerticalAnchor } from "../types";

export const positionProxy = proxy<{
  relativeX: number;
  relativeY: number;
  anchor: IAnchor;
}>({
  relativeX: 0,
  relativeY: 0,
  anchor: {
    vertical: VerticalAnchor.Top,
    horizontal: HorizontalAnchor.Right,
  },
});

export const usePositionStyle = () => {
  const position = useSnapshot(positionProxy);

  const style = useMemo(() => {
    const style: CSSProperties = {};

    switch (position.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${position.relativeX}px`).toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${position.relativeX}px`).toString();
        break;
      default:
        break;
    }

    switch (position.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${position.relativeY}px`).toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${position.relativeY}px`).toString();
        break;
      default:
        break;
    }

    return style;
  }, [position]);
  return style;
};

export const useMovePanel = () => {
  const moveBind = useDrag(({ delta: [dx, dy] }) => {
    switch (positionProxy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        break;
      case HorizontalAnchor.Right:
        positionProxy.relativeX -= dx;
        break;
      default:
        break;
    }
    switch (positionProxy.anchor?.vertical) {
      case VerticalAnchor.Top:
        positionProxy.relativeY += dy;
        break;
      case VerticalAnchor.Bottom:
        break;
      default:
        break;
    }
  });

  return { moveBind };
};
