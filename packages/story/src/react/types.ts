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
export interface IFlatStructure<T = unknown> {
  [id: string]: T | undefined;
}

export interface IGrouped {
  selectedHierarchyIds: string[];
  selectedRects: IFlatStructure<IRect>;
  rect: IRect;
  offfsetRect: IRect;
}
