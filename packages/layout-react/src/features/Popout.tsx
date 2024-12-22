import { LAYOUT_DIRECTION, LayoutNode } from "@escharm/layout-core";
import PortalWindow from "@escharm/portal-window";
import { FC, useCallback, useRef } from "react";
import { useMemo } from "react";

import { ROOTID } from "../constant";
import { usePortals } from "./portals";
import Provider, { ILayoutProviderProps } from "./Provider";

interface IProps extends Partial<ILayoutProviderProps> {
  portalId: string | number;
  left?: number;
  top?: number;
}

const Popout: FC<React.PropsWithChildren<IProps>> = (props) => {
  const { children, portalId, left, top, ...layoutProviderProps } = props;
  const portalRef = useRef<{ close: () => void }>(null);
  const { portalsRef, setPortals } = usePortals();

  const ROOT = useMemo(
    () =>
      new LayoutNode({
        id: ROOTID,
        direction: LAYOUT_DIRECTION.ROOT,
      }),
    [],
  );

  const afterUpdate = useCallback(
    (layoutSymbol: string | number, layoutNode: LayoutNode) => {
      const inPopout = portalsRef.current
        .map((p) => p.id)
        .includes(layoutSymbol);
      if (inPopout) {
        console.debug("[Debug] closing popout", layoutNode.layoutNodes.length);

        if (layoutNode.layoutNodes.length === 0) {
          console.debug("[Debug] closing popout", layoutSymbol);
          portalRef.current?.close();
        }
      }
    },
    [portalsRef],
  );

  const updateHook = useMemo(
    () => ({
      after: afterUpdate,
    }),
    [afterUpdate],
  );

  const onExtBeforeUnload = useCallback(() => {
    setPortals((state) => state.filter((p) => p.id !== portalId));
  }, [portalId, setPortals]);

  const onMainBeforeunload = useCallback(() => {
    portalRef.current?.close();
  }, []);

  return (
    <Provider
      layoutNode={ROOT}
      layoutSymbol={portalId}
      updateHook={updateHook}
      {...layoutProviderProps}
    >
      <PortalWindow
        ref={portalRef}
        onExtBeforeUnload={onExtBeforeUnload}
        onMainBeforeUnload={onMainBeforeunload}
        left={left}
        top={top}
      >
        {children}
      </PortalWindow>
    </Provider>
  );
};

export default Popout;
