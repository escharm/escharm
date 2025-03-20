import React, { useContext } from "react";

import { DataContext } from "./DataProvider";
import { IFlatHierarchy, IHierarchy } from "./types";

interface IProps {
  item: IHierarchy;
  hierarchy: IFlatHierarchy;
}

const HierarchyItem = (props: IProps) => {
  const { item, hierarchy } = props;
  const children = Object.values(hierarchy).filter(
    (child) => child?.parentId === item.id,
  ) as IHierarchy[];

  return (
    <div style={{ marginLeft: "16px" }}>
      <div>{item.name}</div>
      {children.map((child) => (
        <HierarchyItem key={child.id} item={child} hierarchy={hierarchy} />
      ))}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { hierarchy } = useContext(DataContext);
  const rootItems = Object.values(hierarchy).filter(
    (item) => item?.parentId === null,
  ) as IHierarchy[];

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0" }}>层级目录</h3>
      {rootItems.map((item) => (
        <HierarchyItem key={item.id} item={item} hierarchy={hierarchy} />
      ))}
    </div>
  );
};

export default Sidebar;
