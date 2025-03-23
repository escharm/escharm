import { Fragment, useCallback } from "react";

import {
  useFlatHierarchy,
  useSelectedHierarchyIds,
  useSetSelectedHierarchyId,
} from "./DataProvider";
import { useResizerGroup, useResizerStyle } from "./useResizerGroup";

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
  const setSelectedHierarchyId = useSetSelectedHierarchyId();
  const flatHierarchy = useFlatHierarchy();

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const findElementAtPoint = (
        id: string,
        point: { x: number; y: number },
      ): string | null => {
        const hierarchy = flatHierarchy[id];
        if (!hierarchy) return null;

        // 使用 querySelector 获取实际元素
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            point.x >= rect.left &&
            point.x <= rect.right &&
            point.y >= rect.top &&
            point.y <= rect.bottom
          ) {
            return id;
          }
        }

        // 递归检查子元素
        for (const childId of hierarchy.childIds) {
          const result = findElementAtPoint(childId, point);
          if (result) return result;
        }

        return null;
      };

      const childIds = selectedHierarchyIds.flatMap((id) => {
        const hierarchy = flatHierarchy[id];
        if (!hierarchy) return [];
        return hierarchy.childIds;
      });

      const point = { x: e.clientX, y: e.clientY };
      for (const id of childIds) {
        const foundId = findElementAtPoint(id, point);
        if (foundId) {
          setSelectedHierarchyId(foundId);
          return;
        }
      }
    },
    [flatHierarchy, selectedHierarchyIds, setSelectedHierarchyId],
  );

  if (selectedHierarchyIds.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <div
        className="absolute bg-blue-400 opacity-50"
        onDoubleClickCapture={handleDoubleClick}
        style={{
          position: "absolute",
          backgroundColor: "blue",
          opacity: 0.5,
          ...style,
        }}
      />
      <div
        {...topLeftBind()}
        style={{
          position: "absolute",
          backgroundColor: "black",
          ...topLeft,
        }}
        className="top-left absolute bg-black cursor-move"
      />
      <div
        {...topRightBind()}
        style={{
          position: "absolute",
          backgroundColor: "black",
          ...topRight,
        }}
        className="top-right absolute bg-black cursor-move"
      />
      <div
        {...bottomLeftBind()}
        style={{
          position: "absolute",
          backgroundColor: "black",
          ...bottomLeft,
        }}
        className="bottom-left absolute bg-black cursor-move"
      />
      <div
        {...bottomRightBind()}
        style={{
          position: "absolute",
          backgroundColor: "black",
          ...bottomRight,
        }}
        className="bottom-right absolute bg-black cursor-move"
      />
    </Fragment>
  );
};

export default GroupResizer;
