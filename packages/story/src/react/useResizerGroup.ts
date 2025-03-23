import { useDrag } from "@use-gesture/react";
import { calc } from "@vanilla-extract/css-utils";
import { CSSProperties, useContext, useMemo } from "react";

import { DataContext, useGroupedRect } from "./DataProvider";

export const useTopLeftResizer = () => {
  const { groupedRectProxy } = useContext(DataContext);
  const groupedRect = useGroupedRect();

  const topLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${groupedRect.rect.x}px`).toString();
    style.top = calc(`${groupedRect.rect.y}px`).toString();

    return style;
  }, [groupedRect]);

  const topLeftBind = useDrag(({ delta: [dx, dy] }) => {
    groupedRectProxy.rect.x += dx;
    groupedRectProxy.rect.width -= dx;
    groupedRectProxy.rect.y += dy;
    groupedRectProxy.rect.height -= dy;
  });

  return {
    topLeft,
    topLeftBind,
  };
};

export const useTopRightResizer = () => {
  const { groupedRectProxy } = useContext(DataContext);
  const groupedRect = useGroupedRect();

  const topRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${groupedRect.rect.x}px`)
      .add(`${groupedRect.rect.width}px`)
      .toString();
    style.top = calc(`${groupedRect.rect.y}px`).toString();

    return style;
  }, [groupedRect]);

  const topRightBind = useDrag(({ delta: [dx, dy] }) => {
    groupedRectProxy.rect.width += dx;
    groupedRectProxy.rect.y += dy;
    groupedRectProxy.rect.height -= dy;
  });

  return {
    topRight,
    topRightBind,
  };
};

export const useBottomLeftResizer = () => {
  const { groupedRectProxy } = useContext(DataContext);
  const groupedRect = useGroupedRect();

  const bottomLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${groupedRect.rect.x}px`).toString();
    style.top = calc(`${groupedRect.rect.y}px`)
      .add(`${groupedRect.rect.height}px`)
      .toString();

    return style;
  }, [groupedRect]);

  const bottomLeftBind = useDrag(({ delta: [dx, dy] }) => {
    groupedRectProxy.rect.x += dx;
    groupedRectProxy.rect.width -= dx;
    groupedRectProxy.rect.height += dy;
  });

  return {
    bottomLeft,
    bottomLeftBind,
  };
};

export const useBottomRightResizer = () => {
  const { groupedRectProxy } = useContext(DataContext);
  const groupedRect = useGroupedRect();

  const bottomRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${groupedRect.rect.x}px`)
      .add(`${groupedRect.rect.width}px`)
      .toString();
    style.top = calc(`${groupedRect.rect.y}px`)
      .add(`${groupedRect.rect.height}px`)
      .toString();

    return style;
  }, [groupedRect]);

  const bottomRightBind = useDrag(({ delta: [dx, dy] }) => {
    groupedRectProxy.rect.width += dx;
    groupedRectProxy.rect.height += dy;
  });

  return {
    bottomRight,
    bottomRightBind,
  };
};

export const useResizerGroup = () => {
  const { topLeft, topLeftBind } = useTopLeftResizer();
  const { topRight, topRightBind } = useTopRightResizer();
  const { bottomLeft, bottomLeftBind } = useBottomLeftResizer();
  const { bottomRight, bottomRightBind } = useBottomRightResizer();

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

export function useResizerStyle() {
  const groupedRect = useGroupedRect();
  const style = useMemo(() => {
    const style = {
      ...groupedRect.style,
      width: calc(`${groupedRect.rect.width}px`).toString(),
      height: calc(`${groupedRect.rect.height}px`).toString(),
    };

    style.left = calc(`${groupedRect.rect.x}px`).toString();
    style.top = calc(`${groupedRect.rect.y}px`).toString();

    return style;
  }, [groupedRect]);

  return style;
}
