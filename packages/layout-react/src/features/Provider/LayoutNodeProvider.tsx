import { LayoutNode } from "@escharm/layout-core";
import { createContext, FC, useContext } from "react";

const context = createContext<LayoutNode | null>(null);

const LayoutNodeProvider: FC<
    React.PropsWithChildren<{ layoutNode: LayoutNode }>
> = (props) => {
    const { children, layoutNode } = props;
    return <context.Provider value={layoutNode}>{children}</context.Provider>;
};

export default LayoutNodeProvider;

export const useLayoutNode = () => {
    const ctx = useContext(context);

    if (ctx == null) {
        throw new Error("Empty Context");
    }
    return ctx;
};
