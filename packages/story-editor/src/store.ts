import { proxy, useSnapshot } from "valtio";
import { useCallback, useContext } from "react";
import { StoryContext } from "./StoryProvider";

export const panelProxy = proxy<{
  selectedPanel: string | null;
  temporaryMode: boolean;
}>({
  selectedPanel: null,
  temporaryMode: false,
});

export const useSelectedPanel = () => {
  return useSnapshot(panelProxy).selectedPanel;
};

export const useTemporaryMode = () => {
  return useSnapshot(panelProxy).temporaryMode;
};

export const useToggleTemporaryMode = () => {
  const storyProxy = useContext(StoryContext);
  return useCallback(() => {
    if (panelProxy.temporaryMode) {
      storyProxy.resizers = {};
    }
    panelProxy.temporaryMode = !panelProxy.temporaryMode;
  }, [storyProxy]);
};

export const toggleTemporaryMode = () => {
  panelProxy.temporaryMode = !panelProxy.temporaryMode;
};
