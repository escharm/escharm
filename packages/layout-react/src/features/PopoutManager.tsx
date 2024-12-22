import { PropsWithChildren } from "react";
import { Fragment } from "react";

import Popout from "./Popout";
import { usePortals } from "./portals";
import { ILayoutProviderProps } from "./Provider";

export interface IPortal {
  id: string | number;
  top?: number;
  left?: number;
  height?: number;
  width?: number;
}

interface IProps extends Partial<ILayoutProviderProps> {}

const PopoutManager = (props: PropsWithChildren<IProps>) => {
  const { children, ...layoutProviderProps } = props;
  const { portals } = usePortals();
  return (
    <Fragment>
      {portals.map((p) => {
        return (
          <Popout
            key={p.id}
            portalId={p.id}
            left={p.left}
            top={p.top}
            {...layoutProviderProps}
          >
            {children}
          </Popout>
        );
      })}
    </Fragment>
  );
};

export default PopoutManager;
