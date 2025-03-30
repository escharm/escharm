import React from "react";

import {
  useCleanSelectedHierarchy,
  useSetSelectedHierarchyId,
} from "./hierarchy";

interface CaptureProps {
  children: React.ReactNode;
}

const Capture: React.FC<CaptureProps> = ({ children }) => {
  const setSelectedHierarchyId = useSetSelectedHierarchyId();
  const cleanSelectedHierarchy = useCleanSelectedHierarchy();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;

    if (target.dataset.id) {
      setSelectedHierarchyId(target.dataset.id);
    } else {
      cleanSelectedHierarchy();
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
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
};

export default Capture;
