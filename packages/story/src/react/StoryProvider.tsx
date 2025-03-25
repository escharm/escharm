import React, { useRef } from "react";
import { createContext } from "react";
import { proxy } from "valtio";

import {
  IFlatHierarchy,
  IFlatStructure,
  IGroup,
  IHierarchy,
  IRect,
} from "../types";

export interface IStoryContext {
  mockData?: Record<string, unknown>;
  filePath?: string;
  hierarchyProxy: IFlatHierarchy;
  groupProxy: IGroup;
}

const createDefaultData = (defaultValue?: IFlatHierarchy): IStoryContext => {
  const hierarchyProxy = defaultValue ?? {};

  const groupProxy = {
    selectedHierarchyIds: [],
    selectedRects: {},
    rect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    manualData: {
      offfsetRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    },
  };

  return proxy({
    hierarchyProxy,
    groupProxy,
  });
};

// eslint-disable-next-line react-refresh/only-export-components
export const StoryContext = createContext<IStoryContext>(createDefaultData());

interface IProps {
  defaultValue?: IFlatHierarchy;
  children: React.ReactNode;
}

const StoryProvider = (props: IProps) => {
  const { children, defaultValue } = props;
  const defaultValueRef = useRef<IStoryContext>(
    createDefaultData(defaultValue),
  );

  return (
    <StoryContext.Provider value={defaultValueRef.current}>
      {children}
    </StoryContext.Provider>
  );
};

export default StoryProvider;
