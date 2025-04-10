import { DND_EVENT, IDragData, useDnd } from "@escharm/dnd-react";
import {
  LAYOUT_DIRECTION,
  LayoutNodeActionType,
  MoveSplitterData,
} from "@escharm/layout-core";
import { useSns } from "@escharm/sns-react";
import { useEffect, useRef, useState } from "react";

import { useLayoutSymbol } from "../features/Provider/LayoutSymbolProvider";
import { useLayout } from "../features/Provider/ValtioStateProvider";

const useSplitterRef = (data: {
  id: string;
  parentId: string;
  primaryId: string;
  secondaryId: string;
}) => {
  const { id, parentId, primaryId, secondaryId } = data;

  const [movingOffset, setMovingOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const dnd = useDnd();

  const parent = useLayout(parentId);

  const primary = useLayout(primaryId);

  const secondary = useLayout(secondaryId);

  const layoutSymbol = useLayoutSymbol();

  const sns = useSns();

  const offsetRef = useRef(0);

  useEffect(() => {
    if (primary?.secondaryOffset != null) {
      offsetRef.current = primary.secondaryOffset;
    }
  }, [primary?.secondaryOffset]);

  useEffect(() => {
    let offset = 0;
    const onDragStart = () => {
      setDragging(true);
    };
    const onDragEnd = () => {
      sns.send(layoutSymbol, LayoutNodeActionType.MOVE_SPLITTER, {
        primary: primaryId,
        secondary: secondaryId,
        offset,
      } as MoveSplitterData);
      setDragging(false);
      setMovingOffset(0);
    };
    const onDrag = (data: IDragData) => {
      offset =
        parent?.direction === LAYOUT_DIRECTION.ROW
          ? data.offset.x
          : data.offset.y;
      if (
        ref.current != null &&
        shadowRef.current != null &&
        primary?.width != null &&
        primary.height != null &&
        secondary?.width != null &&
        secondary.height != null
      ) {
        let velocity = 0;
        let primaryValue = 0;
        let secondaryValue = 0;
        if (parent?.direction === LAYOUT_DIRECTION.ROW) {
          primaryValue = primary.width;
          secondaryValue = secondary.width;
          velocity = data.vector.x;
        } else {
          primaryValue = primary.height;
          secondaryValue = secondary.height;
          velocity = data.vector.y;
        }

        if (velocity >= 0 && secondaryValue - offset < 100) {
          offset = secondaryValue - 100;
        }

        if (velocity <= 0 && primaryValue + offset < 100) {
          offset = -(primaryValue - 100);
        }

        if (velocity >= 0 && primaryValue + offset < 100) {
          offset = -(primaryValue - 100);
        }

        if (velocity <= 0 && secondaryValue - offset < 100) {
          offset = secondaryValue - 100;
        }
        setMovingOffset(offset);
      }
    };
    const listenable = dnd
      .draggable(ref.current!, {
        crossWindow: false,
        item: {
          id: id,
        },
      })
      .addListener(DND_EVENT.DRAG_START, onDragStart)
      .addListener(DND_EVENT.DRAG_END, onDragEnd)
      .addListener(DND_EVENT.DRAG, onDrag);
    return () => {
      listenable
        .removeListener(DND_EVENT.DRAG_START, onDragStart)
        .removeListener(DND_EVENT.DRAG_END, onDragEnd)
        .removeListener(DND_EVENT.DRAG, onDrag)
        .removeEleListeners();
    };
  }, [
    dnd,
    id,
    layoutSymbol,
    parent?.direction,
    primary?.height,
    primary?.width,
    primaryId,
    secondary?.height,
    secondary?.width,
    secondaryId,
    sns,
  ]);

  return {
    ref,
    shadowRef,
    dragging,
    movingOffset,
  };
};

export default useSplitterRef;
