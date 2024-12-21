import { IPoint } from "@escharm/dnd-react";
import {
  AddPanelData,
  LayoutNodeActionType,
  MASK_PART,
  PanelNode,
  RemovePanelData,
} from "@escharm/layout-core";
import { useSlot, useSns } from "@escharm/sns-react";
import { nanoid } from "nanoid";
import { useCallback, useMemo } from "react";

import { ROOTID } from "../constant";
import {
  useLayoutSymbol,
  useMainLayoutSymbol,
  usePanel,
  usePortals,
} from "../features";

const usePopout = (nodeId: string): [boolean, (screen?: IPoint) => void] => {
  const layoutSymbol = useLayoutSymbol();
  const sns = useSns();
  const slot = useSlot(nodeId);
  const panel = usePanel(nodeId);
  const mainLayoutSymbol = useMainLayoutSymbol();
  const { portals, setPortals } = usePortals();

  const inPopout = useMemo(
    () => portals.map((p) => p.id).includes(layoutSymbol),
    [layoutSymbol, portals],
  );

  const popoutReady = useCallback(
    (data: { layoutSymbol: string | number }) => {
      console.debug("[Debug] popout ready", data);
      const panelNode = new PanelNode(panel!);
      slot?.removeListener("ready", popoutReady);
      sns.send(layoutSymbol, LayoutNodeActionType.REMOVE_PANEL, {
        search: panelNode.id,
        mask: MASK_PART.CENTER,
        target: ROOTID,
      } as RemovePanelData);

      sns.send(data.layoutSymbol, LayoutNodeActionType.ADD_PANEL, {
        panelNode: panelNode,
        mask: MASK_PART.CENTER,
        target: ROOTID,
      } as AddPanelData);
    },
    [layoutSymbol, panel, slot, sns],
  );

  const popout = useCallback(
    (screen?: IPoint) => {
      console.debug("[Debug] inPopout", inPopout);

      if (inPopout) {
        console.debug("[Debug] popin", mainLayoutSymbol);
        const panelNode = new PanelNode(panel!);

        sns.send(layoutSymbol, LayoutNodeActionType.REMOVE_PANEL, {
          search: nodeId,
        });

        sns.send(mainLayoutSymbol, LayoutNodeActionType.POPIN, {
          panelNode: panelNode,
        });
      } else {
        console.debug("[Debug] popout");
        slot?.addListener("ready", popoutReady);
        setPortals((s) => {
          return [...s, { id: nanoid(), left: screen?.x, top: screen?.y }];
        });
      }
    },
    [
      inPopout,
      mainLayoutSymbol,
      panel,
      sns,
      layoutSymbol,
      nodeId,
      slot,
      popoutReady,
      setPortals,
    ],
  );

  return [inPopout, popout];
};

export default usePopout;
