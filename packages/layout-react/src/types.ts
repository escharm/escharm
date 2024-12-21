import { LayoutNode } from "@escharm/layout-core";
import { FC, PropsWithChildren } from "react";

export type TABCMPT = FC<
  PropsWithChildren<PropsWithClassName<{ nodeId: string }>>
>;

export type PropsWithClassName<P> = P & { className?: string };

export type UPDATE_HOOK = {
  before?: (layoutSymbol: string | number, layoutNode: LayoutNode) => void;
  after?: (layoutSymbol: string | number, layoutNode: LayoutNode) => void;
};
