/// <reference types="@escharm/layout-core/custom" />
import "@escharm/sns-react";
import "valtio";

declare module "@escharm/sns-react" {
  interface Slot extends ISlot {
    addListener(event: "ready", listener: (...args: unknown[]) => void): this;
    addListener(
      event: LayoutNodeActionType.POPIN,
      listener: (data: { panelNode: PanelNode }) => void,
    ): this;

    addListener(
      event: LayoutNodeActionType.ADD_PANEL,
      listener: (data: AddPanelData) => void,
    ): this;
    addListener(
      event: LayoutNodeActionType.MOVE_PANEL,
      listener: (data: MovePanelData) => void,
    ): this;
    addListener(
      event: LayoutNodeActionType.MOVE_SPLITTER,
      listener: (data: MoveSplitterData) => void,
    ): this;
    addListener(
      event: LayoutNodeActionType.REMOVE_PANEL,
      listener: (data: RemovePanelData) => void,
    ): this;
    addListener(
      event: LayoutNodeActionType.SELECT_TAB,
      listener: (data: SelectTabData) => void,
    ): this;
  }

  interface Sns extends ISns {
    send(
      target: string | number,
      event: LayoutNodeActionType.POPIN,
      data?: unknown,
    ): this;

    send(
      target: string | number,
      event: LayoutNodeActionType.ADD_PANEL,
      data: AddPanelData,
    ): this;
    send(
      target: string | number,
      event: LayoutNodeActionType.MOVE_PANEL,
      data: MovePanelData,
    ): this;
    send(
      target: string | number,
      event: LayoutNodeActionType.MOVE_SPLITTER,
      data: MoveSplitterData,
    ): this;
    send(
      target: string | number,
      event: LayoutNodeActionType.REMOVE_PANEL,
      data: RemovePanelData,
    ): this;
    send(
      target: string | number,
      event: LayoutNodeActionType.SELECT_TAB,
      data: SelectTabData,
    ): this;
  }
}

declare global {
  declare module "valtio" {
    function useSnapshot<T extends object>(p: T): T;
  }

  declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module "*.svg" {
    import React from "react";
    export const ReactComponent: React.FunctionComponent<
      React.SVGProps<SVGSVGElement>
    >;
  }
}
