import {
  findNodeByRules,
  LayoutNodeActionType,
  MASK_PART,
  PanelNode,
} from "@escharm/layout-core";
import { useSlot } from "@escharm/sns-react";
import { useCallback, useEffect } from "react";

import { rules } from "../lib/constant";
import { useMainLayoutSymbol } from "./MainLayoutSymbolProvider";
import { useLayoutNode } from "./Provider/LayoutNodeProvider";
import { ROOTID } from "../constant";

const PopinListener = () => {
  const layoutNode = useLayoutNode();
  const mainlayoutSymbol = useMainLayoutSymbol();
  const slot = useSlot(mainlayoutSymbol);
  const popinListener = useCallback(
    (e: { panelNode: PanelNode }) => {
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
      } catch (error) {
        console.error(error);
      }
    },
    [layoutNode],
  );

  useEffect(() => {
    slot && slot.addListener("popin", popinListener);
    return () => {
      slot && slot.removeListener("popin", popinListener);
    };
  }, [layoutNode, popinListener, slot]);

  return null;
};

export default PopinListener;
