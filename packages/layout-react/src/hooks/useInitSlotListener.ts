import {
  AddPanelData,
  findNodeByRules,
  LayoutNodeActionType,
  MASK_PART,
  MovePanelData,
  MoveSplitterData,
  PanelNode,
  RemovePanelData,
  SelectTabData,
} from "@escharm/layout-core";
import { useSlot, useSns } from "@escharm/sns-react";
import { useCallback, useEffect } from "react";

import { ROOTID } from "../constant";
import { useLayoutNode, useLayoutSymbol, usePortals } from "../features";
import { rules } from "../lib/constant";
import useRect from "./useRect";
import useUpdate from "./useUpdate";

const useInitSlotListener = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [rect] = useRect(ref);
  const layoutNode = useLayoutNode();
  const layoutSymbol = useLayoutSymbol();
  const sns = useSns();
  const slot = useSlot(layoutSymbol);
  const { portalsRef } = usePortals();

  const update = useUpdate();

  const addPanel = useCallback(
    (data: AddPanelData) => {
      console.debug("[Debug] addPanel", data);
      layoutNode.doAction({
        type: LayoutNodeActionType.ADD_PANEL,
        payload: data,
      });
      update(rect);
    },
    [layoutNode, rect, update],
  );

  const removePanel = useCallback(
    (data: RemovePanelData) => {
      layoutNode.doAction({
        type: LayoutNodeActionType.REMOVE_PANEL,
        payload: data,
      });
      update(rect);
    },
    [layoutNode, rect, update],
  );

  const movePanel = useCallback(
    (data: MovePanelData) => {
      layoutNode.doAction({
        type: LayoutNodeActionType.MOVE_PANEL,
        payload: data,
      });
      update(rect);
    },
    [layoutNode, rect, update],
  );

  const moveSplitter = useCallback(
    (data: MoveSplitterData) => {
      layoutNode.doAction({
        type: LayoutNodeActionType.MOVE_SPLITTER,
        payload: data,
      });
      update(rect);
    },
    [layoutNode, rect, update],
  );

  const selectTab = useCallback(
    (data: SelectTabData) => {
      layoutNode.doAction({
        type: LayoutNodeActionType.SELECT_TAB,
        payload: data,
      });
      update(rect);
    },
    [layoutNode, rect, update],
  );

  const popinListener = useCallback(
    (e: { panelNode: PanelNode }) => {
      const inPopout = portalsRef.current
        .map((p) => p.id)
        .includes(layoutSymbol);
      if (inPopout) {
        return;
      }
      try {
        const target = findNodeByRules(layoutNode, rules);
        console.debug("[Debug] target is", target);
        if (target) {
          layoutNode.doAction({
            type: LayoutNodeActionType.ADD_PANEL,
            payload: {
              panelNode: e.panelNode,
              mask: target.rule.part,
              target: target.layoutNode,
            },
          });
        } else {
          if (layoutNode.layoutNodes.length === 0) {
            layoutNode.doAction({
              type: LayoutNodeActionType.ADD_PANEL,
              payload: {
                panelNode: e.panelNode,
                mask: MASK_PART.CENTER,
                target: ROOTID,
              },
            });
          }
        }
        update(rect);
      } catch (error) {
        console.error(error);
      }
    },
    [layoutNode, layoutSymbol, portalsRef, rect, update],
  );

  useEffect(() => {
    if (slot) {
      slot.addListener(LayoutNodeActionType.ADD_PANEL, addPanel);
      slot.addListener(LayoutNodeActionType.REMOVE_PANEL, removePanel);
      slot.addListener(LayoutNodeActionType.MOVE_PANEL, movePanel);
      slot.addListener(LayoutNodeActionType.MOVE_SPLITTER, moveSplitter);
      slot.addListener(LayoutNodeActionType.SELECT_TAB, selectTab);
      slot.addListener("popin", popinListener);
      sns.broadcast("ready", { layoutSymbol });

      update(rect);
    }

    return () => {
      slot?.removeListener(LayoutNodeActionType.ADD_PANEL, addPanel);
      slot?.removeListener(LayoutNodeActionType.REMOVE_PANEL, removePanel);
      slot?.removeListener(LayoutNodeActionType.MOVE_PANEL, movePanel);
      slot?.removeListener(LayoutNodeActionType.MOVE_SPLITTER, moveSplitter);
      slot?.removeListener(LayoutNodeActionType.SELECT_TAB, selectTab);
      slot?.removeListener("popin", popinListener);
    };
  }, [
    addPanel,
    layoutNode,
    layoutSymbol,
    movePanel,
    moveSplitter,
    popinListener,
    rect,
    removePanel,
    selectTab,
    slot,
    sns,
    update,
  ]);
};

export default useInitSlotListener;
