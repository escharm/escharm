import { DND_EVENT, IDropData, useDnd } from "@escharm/dnd-react";
import {
  AddPanelData,
  MASK_PART,
  MovePanelData,
  PanelNode,
  RemovePanelData,
  LayoutNodeActionType,
} from "@escharm/layout-core";
import { useSns } from "@escharm/sns-react";
import { useCallback, useEffect, useRef } from "react";

import { useLayoutSymbol } from "../features/Provider/LayoutSymbolProvider";
import useStateRef from "./useStateRef";

const usePanelRef = <E extends Element = HTMLDivElement>(
  nodeId: string,
): [React.RefObject<E | null>, MASK_PART | null] => {
  const ref = useRef<E>(null);
  const [maskPartRef, maskPart, setMaskPart] = useStateRef<MASK_PART | null>(
    null,
  );
  const dnd = useDnd();
  const sns = useSns();
  const layoutSymbol = useLayoutSymbol();

  const onDrop = useCallback(
    (
      data: IDropData<{
        id: string;
        data: any;
        page: string;
        type: string;
        layoutSymbol: string | number;
      }>,
    ) => {
      console.debug("[Debug] onDrop", data);
      if (data.item?.type === "Tab") {
        if (maskPartRef.current != null) {
          if (data.item.layoutSymbol === layoutSymbol) {
            sns.send(layoutSymbol, LayoutNodeActionType.MOVE_PANEL, {
              search: data.item.id,
              target: nodeId,
              mask: maskPartRef.current,
            } as MovePanelData);
          } else {
            sns.send(layoutSymbol, LayoutNodeActionType.ADD_PANEL, {
              panelNode: new PanelNode({
                id: data.item.id,
                data: data.item.data,
                page: data.item.page,
              }),
              mask: maskPartRef.current,
              target: nodeId,
            } as AddPanelData);
            sns.send(
              data.item.layoutSymbol,
              LayoutNodeActionType.REMOVE_PANEL,
              {
                search: data.item.id,
              } as RemovePanelData,
            );
          }
        }
        setMaskPart(null);
      }
    },
    [layoutSymbol, maskPartRef, nodeId, setMaskPart, sns],
  );

  const onDragLeave = useCallback(
    (data: IDropData<{ type: string }>) => {
      if (data.item?.type === "Tab") {
        setMaskPart(null);
      }
    },
    [setMaskPart],
  );

  const onDragOver = useCallback(
    (data: IDropData<{ type: string }>) => {
      if (data.item?.type === "Tab") {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          if (
            data.clientPosition.x > rect.x + rect.width / 4 &&
            data.clientPosition.x < rect.x + (rect.width / 4) * 3 &&
            data.clientPosition.y > rect.y + rect.height / 4 &&
            data.clientPosition.y < rect.y + (rect.height / 4) * 3
          ) {
            setMaskPart(MASK_PART.CENTER);
            return;
          }
          if (
            data.clientPosition.x > rect.x &&
            data.clientPosition.x < rect.x + rect.width / 4
          ) {
            setMaskPart(MASK_PART.LEFT);
            return;
          }

          if (
            data.clientPosition.x > rect.x + (rect.width / 4) * 3 &&
            data.clientPosition.x < rect.x + rect.width
          ) {
            setMaskPart(MASK_PART.RIGHT);
            return;
          }

          if (
            data.clientPosition.y > rect.y &&
            data.clientPosition.y < rect.y + rect.height / 4
          ) {
            setMaskPart(MASK_PART.TOP);
            return;
          }

          if (
            data.clientPosition.y > rect.y + (rect.height / 4) * 3 &&
            data.clientPosition.y < rect.y + rect.height
          ) {
            setMaskPart(MASK_PART.BOTTOM);
            return;
          }
        }
      }
    },
    [setMaskPart],
  );

  useEffect(() => {
    try {
      const listenable = dnd
        .droppable(ref.current!, {
          crossWindow: true,
        })
        .addListener(DND_EVENT.DROP, onDrop)
        .addListener(DND_EVENT.DRAG_LEAVE, onDragLeave)
        .addListener(DND_EVENT.DRAG_OVER, onDragOver);
      return () => {
        listenable
          .removeListener(DND_EVENT.DROP, onDrop)
          .removeListener(DND_EVENT.DRAG_LEAVE, onDragLeave)
          .removeListener(DND_EVENT.DRAG_OVER, onDragOver)
          .removeEleListeners();
      };
    } catch (error) {
      console.error(error);
    }
  }, [dnd, onDragLeave, onDragOver, onDrop]);

  return [ref, maskPart];
};

export default usePanelRef;
