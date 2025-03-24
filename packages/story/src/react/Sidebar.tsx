import React, { useContext } from "react";
import { useSnapshot } from "valtio";

import { StoryContext } from "./DataProvider";
import { useSelectedHierarchyIds } from "./DataProvider";
import { IFlatHierarchy, IHierarchy } from "./types";

interface IProps {
  item: IHierarchy;
  hierarchy: IFlatHierarchy;
}

const HierarchyItem = (props: IProps) => {
  const { item, hierarchy } = props;
  const selectedIds = useSelectedHierarchyIds();
  const isSelected = selectedIds.includes(item.id);
  const children = Object.values(hierarchy).filter(
    (child) => child?.parentId === item.id,
  ) as IHierarchy[];

  return (
    <div style={{ marginLeft: "16px" }}>
      <div
        style={{
          backgroundColor: isSelected ? "#e3f2fd" : "transparent",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        {item.name}
      </div>
      {children.map((child) => (
        <HierarchyItem key={child.id} item={child} hierarchy={hierarchy} />
      ))}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { hierarchyProxy } = useContext(StoryContext);
  const hierarchy = useSnapshot(hierarchyProxy);
  const rootItems = Object.values(hierarchy).filter(
    (item) => item?.parentId === null,
  ) as IHierarchy[];

  Object.values(hierarchy).filter((item) => {
    console.log("test test", JSON.stringify(item, null, 2));
    return item?.parentId === null;
  });

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        left: "16px",
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
