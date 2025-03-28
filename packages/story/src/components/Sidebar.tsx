import React, { useContext } from "react";
import { useSnapshot } from "valtio";

import { IFlatHierarchy, IHierarchy } from "../types";
import { useSelectedHierarchyIds } from "./hierarchy";
import { useSetSelectedHierarchyId } from "./hierarchy";
import { StoryContext } from "./StoryProvider";

interface IProps {
  item: IHierarchy;
  hierarchy: IFlatHierarchy;
}

const HierarchyItem = (props: IProps) => {
  const { item, hierarchy } = props;
  const selectedIds = useSelectedHierarchyIds();
  const isSelected = selectedIds.includes(item.id);
  const setSelectedHierarchyId = useSetSelectedHierarchyId();
  const children = Object.values(hierarchy).filter(
    (child) => child?.parentId === item.id,
  ) as IHierarchy[];

  const handleClick = () => {
    setSelectedHierarchyId(item.id);
  };

  return (
    <div style={{ marginLeft: "16px" }}>
      <div
        style={{
          backgroundColor: isSelected ? "#e3f2fd" : "transparent",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
        onClick={handleClick}
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
  const storyProxy = useContext(StoryContext);
  const story = useSnapshot(storyProxy);
  const hierarchies = story.hierarchies;
  const rootItems = Object.values(hierarchies).filter(
    (item) => item?.parentId === null,
  ) as IHierarchy[];

  Object.values(hierarchies).filter((item) => {
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
        <HierarchyItem key={item.id} item={item} hierarchy={hierarchies} />
      ))}
    </div>
  );
};

export default Sidebar;
