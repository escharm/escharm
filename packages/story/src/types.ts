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
  rect?: IRect;
  offfsetRect?: IRect;
}

export interface IFlatHierarchy extends IFlatStructure<IHierarchy> {}

export interface IGroup {
  selectedHierarchyIds: string[];
  selectedRects: IFlatStructure<IRect>;
  rect: IRect;
  manualData: {
    offfsetRect: IRect;
  };
}

export interface IStory {
  name: string;
  data: Record<string, unknown>;
}

export interface IStoryData {
  stories: IStory[];
  groups: Record<string, IGroup | undefined>;
  hierarchies: IFlatHierarchy;
}

export interface IPluginParams {
  staticPath?: { prefix: string };
  previewPath?: { prefix: string };
  storyPath?: { prefix: string; test: RegExp };
  fixturesPath?: (path: string) => string;
  homeTemplate?: (
    componentPath: string,
    story: IStory,
    hierarchy: IFlatHierarchy,
  ) => string;
}
