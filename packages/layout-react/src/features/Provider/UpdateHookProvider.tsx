import { createContext, FC, useContext } from "react";

import { UPDATE_HOOK } from "../../types";

const context = createContext<UPDATE_HOOK | null>(null);
const UpdateHookProvider: FC<
  React.PropsWithChildren<{ hook?: UPDATE_HOOK }>
> = (props) => {
  const { children, hook = null } = props;
  return <context.Provider value={hook}>{children}</context.Provider>;
};

export const useUpdateHook = () => {
  return useContext(context);
};

export default UpdateHookProvider;
