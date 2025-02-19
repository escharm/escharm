import { Fragment } from "react";

import { useSelectedHierarchyIds } from "./DataProvider";
import { useResizerGroup, useResizerStyle } from "./groupedRect";

const GroupResizer = () => {
  const {
    topLeftBind,
    topRightBind,
    bottomLeftBind,
    bottomRightBind,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  } = useResizerGroup();
  const style = useResizerStyle();
  const selectedHierarchyIds = useSelectedHierarchyIds();

  if (selectedHierarchyIds.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <div style={style} className="absolute bg-blue-400 opacity-50" />
      <div
        {...topLeftBind()}
        style={topLeft}
        className="top-left absolute bg-white cursor-move"
      />
      <div
        {...topRightBind()}
        style={topRight}
        className="top-right absolute bg-white cursor-move"
      />
      <div
        {...bottomLeftBind()}
        style={bottomLeft}
        className="bottom-left absolute bg-white cursor-move"
      />
      <div
        {...bottomRightBind()}
        style={bottomRight}
        className="bottom-right absolute bg-white cursor-move"
      />
    </Fragment>
  );
};

export default GroupResizer;
