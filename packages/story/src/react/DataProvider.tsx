import React, { useRef } from "react";
import { createContext } from "react";

import { IFlatHierarchy } from "./types";

interface IDataContext {
  hierarchy: IFlatHierarchy;
  selectedId: string | null;
}

const defaultValue: IDataContext = {
  hierarchy: {},
  selectedId: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext<IDataContext>(defaultValue);

interface IProps {
  defaultValue?: Partial<IDataContext>;
  children: React.ReactNode;
}

const DataProvider = (props: IProps) => {
  const { children, defaultValue } = props;
  const defaultValueRef = useRef<IDataContext>({
    ...defaultValue,
    hierarchy: defaultValue?.hierarchy || {},
    selectedId: defaultValue?.selectedId || null,
  });

  return (
    <DataContext.Provider value={defaultValueRef.current}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
