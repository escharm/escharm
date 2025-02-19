"use client";

import GroupResizer from "@/hierarchy/GroupResizer";
import Hierarchy from "@/hierarchy/Hierarchy";
import PropsPanel from "@/hierarchy/PropsPanel";

const ABoard = () => {
  return (
    <div
      className="relative h-full w-full"
      style={
        {
          // transform: "translateX(-10px) translateY(10px)",
        }
      }
    >
      <Hierarchy id={"page-1"} />

      {/* <Hierarchy id={"page-2"} /> */}
      {/* <Hierarchy id={"page-3"} /> */}
      {/* <Hierarchy id={"page-4"} /> */}
      <GroupResizer />
      <PropsPanel />
    </div>
  );
};

export default ABoard;
