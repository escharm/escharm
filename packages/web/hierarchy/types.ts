import { CSSProperties } from "react";

import TokenList from "./TokenList";

export enum HorizontalAnchor {
  Left = "Left",
  Right = "Right",
}

export enum VerticalAnchor {
  Top = "Top",
  Bottom = "Bottom",
}

export enum HierarchyType {
  Page = "Page",
  Component = "Component",
}

export interface IAnchor {
  horizontal: HorizontalAnchor;
  vertical: VerticalAnchor;
}

export interface IState<V = unknown> {
  val: V;
}

export interface IHierarchy {
  id: string;
  childIds: string[];
  parentId: string | null;
  type: HierarchyType;
  /**
   * ------- Node Data
   */
  classList: TokenList;
  style: CSSProperties;
  width: number;
  height: number;
  relativeX: number;
  relativeY: number;
  anchor: IAnchor | null;
  states: IFlatStructure<IState>;
}

export interface IHierarchyEditor {
  id: string;
  selected: string[];
}

export interface IFlatHierarchy extends IFlatStructure<IHierarchy> {}

export interface ISelectedRect
  extends Pick<IHierarchy, "relativeX" | "relativeY" | "width" | "height"> {}

export interface IGroupedRect
  extends Pick<
    IHierarchy,
    "style" | "anchor" | "relativeX" | "relativeY" | "width" | "height"
  > {
  selectedHierarchyIds: string[];
  selectedRects: IFlatStructure<ISelectedRect>;
}

export interface IFlatStructure<T = unknown> {
  [id: string]: T | undefined;
}
