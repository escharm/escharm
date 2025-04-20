import { proxy, useSnapshot } from "valtio";

export const panelProxy = proxy<{
  selected: string | null;
}>({
  selected: null,
});

export const useSelectedPanel = () => {
  return useSnapshot(panelProxy).selected;
};
