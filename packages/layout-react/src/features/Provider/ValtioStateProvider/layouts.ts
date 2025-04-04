import { ILayout } from "@escharm/layout-core";
import { useCallback, useMemo } from "react";
import { useSnapshot } from "valtio";

import { useValtioState } from "./state";

export const useLayouts = () => {
  const state = useValtioState();
  const snapshot = useSnapshot(state);
  return snapshot.layouts;
};

export const useLayout = (nodeId: string) => {
  const state = useValtioState();
  const snapshot = useSnapshot(state);
  return useMemo(
    () => snapshot.layouts.find((layout) => layout.id === nodeId),
    [nodeId, snapshot.layouts],
  );
};

export const useSetAllLayouts = () => {
  const state = useValtioState();
  return useCallback(
    (layouts: ILayout[]) => {
      state.layouts = layouts;
    },
    [state],
  );
};
