import {
  createContext,
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useContext,
} from "react";

import { IPortal } from "./PopoutManager";

type ContextType = {
  portalsRef: RefObject<IPortal[]>;
  portals: IPortal[];
  setPortals: Dispatch<SetStateAction<IPortal[]>>;
} | null;

const PortalsContext = createContext<ContextType>(null);

export const PortalsProvider: FC<
  React.PropsWithChildren<NonNullable<ContextType>>
> = (props) => {
  const { children, portalsRef, portals, setPortals } = props;
  return (
    <PortalsContext.Provider value={{ portalsRef, portals, setPortals }}>
      {children}
    </PortalsContext.Provider>
  );
};

export const usePortals = () => {
  const ctx = useContext(PortalsContext);
  if (ctx == null) {
    throw new Error("no portals context found");
  }
  return ctx;
};
