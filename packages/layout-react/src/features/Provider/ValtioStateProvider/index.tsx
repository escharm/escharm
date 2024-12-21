import {
    ILayout,
    IPanel,
    ISplitter,
} from "@escharm/layout-core";
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useRef,
} from "react";
import { proxy } from "valtio";

const context = createContext(
    proxy({
        layouts: [] as ILayout[],
        panels: [] as IPanel[],
        splitters: [] as ISplitter[],
    })
);

const ValtioStateProvider = (props: PropsWithChildren<{}>) => {
    const { children } = props;
    const state = useRef(
        proxy({
            layouts: [] as ILayout[],
            panels: [] as IPanel[],
            splitters: [] as ISplitter[],
        })
    ).current;

    return <context.Provider value={state}>{children}</context.Provider>;
};

export default ValtioStateProvider;

export const useValtioState = () => {
    return useContext(context);
};

export * from "./layouts";
export * from "./panels";
export * from "./splitters";
