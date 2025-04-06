import { IHierarchy } from "../types";

export const saveHierarchyChange = (hierarchy: IHierarchy) => {
  import.meta.hot?.send("SAVE_HIERARCHY_CHANGE", {
    hierarchy,
  });
};
