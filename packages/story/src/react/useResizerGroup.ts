import { useDrag } from "@use-gesture/react";
import { calc } from "@vanilla-extract/css-utils";
import { CSSProperties, useContext, useMemo } from "react";

import { StoryContext, useGroupedRect } from "./StoryProvider";

export const useTopLeftResizer = () => {
  const { groupedProxy } = useContext(StoryContext);
  const groupedRect = useGroupedRect();

  const topLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${groupedRect.rect.x - 2}px`).toString();
    style.top = calc(`${groupedRect.rect.y - 2}px`).toString();

    return style;
  }, [groupedRect]);

  const topLeftBind = useDrag(({ delta: [dx, dy] }) => {
    groupedProxy.rect.x += dx;
    groupedProxy.rect.width -= dx;
    groupedProxy.rect.y += dy;
    groupedProxy.rect.height -= dy;
  });

  return {
    topLeft,
    topLeftBind,
  };
};

export const useTopRightResizer = () => {
  const { groupedProxy } = useContext(StoryContext);
  const groupedRect = useGroupedRect();

  const topRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${groupedRect.rect.x - 2}px`)
      .add(`${groupedRect.rect.width}px`)
      .toString();
    style.top = calc(`${groupedRect.rect.y - 2}px`).toString();

    return style;
  }, [groupedRect]);

  const topRightBind = useDrag(({ delta: [dx, dy] }) => {
    groupedProxy.rect.width += dx;
    groupedProxy.rect.y += dy;
    groupedProxy.rect.height -= dy;
  });

  return {
    topRight,
    topRightBind,
  };
};

export const useBottomLeftResizer = () => {
  const { groupedProxy } = useContext(StoryContext);
  const groupedRect = useGroupedRect();

  const bottomLeft: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${groupedRect.rect.x - 2}px`).toString();
    style.top = calc(`${groupedRect.rect.y - 2}px`)
      .add(`${groupedRect.rect.height}px`)
      .toString();

    return style;
  }, [groupedRect]);

  const bottomLeftBind = useDrag(({ delta: [dx, dy] }) => {
    groupedProxy.rect.x += dx;
    groupedProxy.rect.width -= dx;
    groupedProxy.rect.height += dy;
  });

  return {
    bottomLeft,
    bottomLeftBind,
  };
};

export const useBottomRightResizer = () => {
  const { groupedProxy } = useContext(StoryContext);
  const groupedRect = useGroupedRect();

  const bottomRight: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "5px",
      height: "5px",
    };

    style.left = calc(`${groupedRect.rect.x - 2}px`)
      .add(`${groupedRect.rect.width}px`)
      .toString();
    style.top = calc(`${groupedRect.rect.y - 2}px`)
      .add(`${groupedRect.rect.height}px`)
      .toString();

    return style;
  }, [groupedRect]);

  const bottomRightBind = useDrag(({ delta: [dx, dy] }) => {
    groupedProxy.rect.width += dx;
    groupedProxy.rect.height += dy;
  });

  return {
    bottomRight,
    bottomRightBind,
  };
};

export const useBodyResizer = () => {
  const { groupedProxy } = useContext(StoryContext);
  const groupedRect = useGroupedRect();

  const body = useMemo(() => {
    const style: CSSProperties = {
      width: calc(`${groupedRect.rect.width}px`).toString(),
      height: calc(`${groupedRect.rect.height}px`).toString(),
    };

    style.left = calc(`${groupedRect.rect.x}px`).toString();
    style.top = calc(`${groupedRect.rect.y}px`).toString();

    return style;
  }, [groupedRect]);
  const bodyBind = useDrag(({ delta: [dx, dy] }) => {
    groupedProxy.rect.x += dx;
    groupedProxy.rect.y += dy;
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
