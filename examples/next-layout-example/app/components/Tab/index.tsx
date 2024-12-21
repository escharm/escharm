import {
  useLayoutSymbol,
  usePanel,
  usePopout,
  useTabRef,
  TABCMPT,
} from "@escharm/layout-react";
import {
  RemovePanelData,
  SelectTabData,
  LayoutNodeActionType,
} from "@escharm/layout-core";
import { useSns } from "@escharm/sns-react";
import clsx from "clsx";
import { useCallback } from "react";

import Close from "../svg/Close";
import Popin from "../svg/Popin";
import Popout from "../svg/Popout";
import styles from "./index.module.css";

const Tab: TABCMPT = (props) => {
  const { nodeId } = props;

  const layoutSymbol = useLayoutSymbol();
  const sns = useSns();
  const panel = usePanel(nodeId);
  const selected = panel?.selected;
  const [inPopout, popout] = usePopout(nodeId);
  const ref = useTabRef(nodeId, popout);

  const onSelect = useCallback(() => {
    sns.send(layoutSymbol, LayoutNodeActionType.SELECT_TAB, {
      search: nodeId,
    } as SelectTabData);
  }, [layoutSymbol, nodeId, sns]);

  const onClose = useCallback(() => {
    sns.send(layoutSymbol, LayoutNodeActionType.REMOVE_PANEL, {
      search: nodeId,
    } as RemovePanelData);
  }, [layoutSymbol, nodeId, sns]);

  return (
    <div
      id={nodeId}
      className={clsx({
        [styles.tab]: true,
        [styles.tab_selected]: selected,
      })}
    >
      <div
        ref={ref}
        style={{
          lineHeight: "100%",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
        onClick={onSelect}
      >
        {nodeId}
      </div>
      <div className={styles.button} onClick={() => popout()}>
        {inPopout ? <Popin /> : <Popout />}
      </div>
      <div className={styles.button} onClick={onClose}>
        <Close />
      </div>
    </div>
  );
};

export default Tab;
