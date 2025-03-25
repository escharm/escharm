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

export interface IGrouped {
  selectedHierarchyIds: string[];
  selectedRects: IFlatStructure<IRect>;
  rect: IRect;
  manualData: {
    offfsetRect: IRect;
  };
}

export interface IStoryData {
  stories: {
    name: string;
    data: Record<string, unknown>;
    grouped: IGrouped;
  }[];
  hierarchies: IFlatHierarchy;
}

export interface IPluginParams {
  staticPath?: { prefix: string };
  previewPath?: { prefix: string };
  storyPath?: { prefix: string; test: RegExp };
  fixturesPath?: (path: string) => string;
  homeTemplate?: (
    componentPath: string,
    mockData: {
      name: string;
      data: Record<string, unknown>;
    }[],
    hierarchy: IFlatHierarchy,
  ) => string;
}
