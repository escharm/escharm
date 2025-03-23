import React from "react";

import {
  useSelectedHierarchyIds,
  useSetSelectedHierarchyId,
} from "./DataProvider";

interface CaptureProps {
  children: React.ReactNode;
}

const Capture: React.FC<CaptureProps> = ({ children }) => {
  const setSelectedHierarchyId = useSetSelectedHierarchyId();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;

    if (target.dataset.id) {
      console.log("test test", target.dataset.id);
      setSelectedHierarchyId(target.dataset.id);
    } else {
      console.error("target.dataset.id is undefined");
    }
  };

  return (
    <div
      id="escharm-story-capture"
      onClickCapture={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

export default Capture;
