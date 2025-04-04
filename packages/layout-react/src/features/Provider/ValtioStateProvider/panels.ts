import { IPanel } from "@escharm/layout-core";
import { useCallback, useMemo } from "react";
import { useSnapshot } from "valtio";

import { useValtioState } from "./state";

export const usePanels = () => {
  const state = useValtioState();
  const snapshot = useSnapshot(state);
  return snapshot.panels;
};

export const usePanel = (nodeId: string) => {
  const state = useValtioState();
  const snapshot = useSnapshot(state);
  return useMemo(
    () => snapshot.panels.find((panel) => panel.id === nodeId),
    [nodeId, snapshot.panels],
  );
};

export const useSetAllPanels = () => {
  const state = useValtioState();
  return useCallback(
    (panels: IPanel[]) => {
      state.panels = panels;
    },
    [state],
  );
};
