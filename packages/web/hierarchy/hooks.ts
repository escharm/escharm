import { calc } from "@vanilla-extract/css-utils";
import { useCallback, useContext, useMemo } from "react";
import { useSnapshot } from "valtio";

import { WithRequired } from "@/global";

import { DataContext, find } from "./DataProvider";
import { HorizontalAnchor, IHierarchy, VerticalAnchor } from "./types";

export function useHierarchy(
  id: string | undefined
): Partial<IHierarchy> | IHierarchy;

export function useHierarchy(id: string | undefined): Partial<IHierarchy> {
  const { hierarchyProxy } = useContext(DataContext);

  return useSnapshot(find(hierarchyProxy, id));
}

export function useHierarchyStyle(id: string) {
  const hierarchy = useHierarchy(id);

  const style = useMemo(() => {
    if (!hasHierarchy(hierarchy)) {
      return {};
    }

    const style = {
      ...hierarchy.style,
      width: calc(hierarchy.style.width ?? "0px")
        .add(`${hierarchy.width}px`)
        .toString(),
      height: calc(hierarchy.style.height ?? "0px")
        .add(`${hierarchy.height}px`)
        .toString(),
    };

    switch (hierarchy.anchor?.horizontal) {
      case HorizontalAnchor.Left:
        style.left = calc(`${hierarchy.relativeX}px`).toString();
        break;
      case HorizontalAnchor.Right:
        style.right = calc(`${hierarchy.relativeX}px`).toString();
        break;
      default:
        break;
    }

    switch (hierarchy.anchor?.vertical) {
      case VerticalAnchor.Top:
        style.top = calc(`${hierarchy.relativeY}px`).toString();
        break;
      case VerticalAnchor.Bottom:
        style.bottom = calc(`${hierarchy.relativeY}px`).toString();
        break;
      default:
        break;
    }

    return style;
  }, [hierarchy]);
  return style;
}

export const hasHierarchy = (
  hierarchy?: Partial<IHierarchy>
): hierarchy is IHierarchy => {
  if (hierarchy?.id != null) {
    return true;
  }
  return false;
};

export const useSetHierarchy = () => {
  const { hierarchyProxy } = useContext(DataContext);
  const setHierarchy = useCallback(
    (hierarchy: IHierarchy) => {
      hierarchyProxy[hierarchy.id] = hierarchy;
    },
    [hierarchyProxy]
  );

  return setHierarchy;
};

export const useAddHierarchy = () => {
  const { hierarchyProxy } = useContext(DataContext);

  const addHierarchy = useCallback(
    (hierarchy: WithRequired<IHierarchy, "parentId">) => {
      const parentId = hierarchy.parentId;
      const parent = hierarchyProxy[parentId];
      if (parent) {
        parent.childIds.push(hierarchy.id);
        hierarchyProxy[hierarchy.id] = hierarchy;
      }
    },
    [hierarchyProxy]
  );

  return addHierarchy;
};

export const useRemoveHierarchy = () => {
  const { hierarchyProxy } = useContext(DataContext);

  const removeHierarchy = useCallback(
    (parentId: string, childId: string) => {
      const parent = hierarchyProxy[parentId];
      if (parent) {
        const index = parent.childIds.indexOf(childId);
        if (index !== -1) {
          parent.childIds.splice(index, 1);
        }
      }
    },
    [hierarchyProxy]
  );

  return removeHierarchy;
};

export const useMoveHierarchy = () => {
  const { hierarchyProxy } = useContext(DataContext);

  const moveHierarchy = useCallback(
    (childId: string, toParentId: string) => {
      const child = hierarchyProxy[childId];
      const toParent = hierarchyProxy[toParentId];

      if (child && toParent) {
        // Remove from old parent
        if (child.parentId) {
          const oldParent = hierarchyProxy[child.parentId];
          if (oldParent) {
            const index = oldParent.childIds.indexOf(childId);
            if (index !== -1) {
              oldParent.childIds.splice(index, 1);
            }
          }
        }

        // Add to new parent
        toParent.childIds.push(childId);
        child.parentId = toParentId;
      }
    },
    [hierarchyProxy]
  );

  return moveHierarchy;
};
