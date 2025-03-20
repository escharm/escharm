export interface IHierarchy {
  id: string;
  name: string;
  childIds: string[];
  parentId: string | null;
}

export interface IFlatHierarchy extends IFlatStructure<IHierarchy> {}
export interface IFlatStructure<T = unknown> {
  [id: string]: T | undefined;
}
