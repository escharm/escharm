import { CSSProperties } from "react";

export interface IFlatStructure<T = unknown> {
  [id: string]: T | undefined;
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IHierarchy {
  id: string;
  name: string;
  childIds: string[];
  parentId: string | null;
  // original rect,style data from HTMLElement
  originData: {
    rect: IRect;
    style: Record<string, string | undefined>;
  };
  // updated rect,style data from HTMLElement
  updateData: {
    rect: IRect;
    style: Record<string, string | undefined>;
  };
  // manual changed rect,style data
  manualData: {
    rect: IRect;
    style: Record<string, string | undefined>;
    className?: string;
  };
}

export interface IFlatHierarchy extends IFlatStructure<IHierarchy> {}

export interface IGroup {
  selectedHierarchyIds: string[];
  selectedRects: IFlatStructure<IRect>;
  rect: IRect;
  manualData: {
    rect: IRect;
  };
}

export interface IStory {
  name: string;
  data: Record<string, unknown>;
  group: IGroup;
}

export interface IFixture {
  hierarchies: IFlatHierarchy;
  stories: Record<string, IStory | undefined>;
}

export interface IPluginParams {
  staticPath?: { prefix: string };
  previewPath?: { prefix: string };
  storyPath?: { prefix: string; test: RegExp };
  fixturesPath?: (path: string) => string;
  homeTemplate?: () => string;
  tailwindCSS?: string;
}

export interface ISaveHierarchyParams {
  searchId: string;
  hierarchy: IHierarchy;
}
