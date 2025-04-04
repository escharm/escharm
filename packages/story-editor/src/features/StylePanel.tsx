import React, { useMemo } from "react";
import {
  useHierarchies,
  useSelectedHierarchies,
  useSelectedHierarchyIds,
} from "../hierarchy";
import { Panel } from "../components/Panel";
import { SingleElementStylePanel } from "./SingleElementStylePanel";
import { MultiElementStylePanel } from "./MultiElementStylePanel";
import { IHierarchy } from "../types";

const StylePanel = () => {
  const selectedHierarchies = useSelectedHierarchies();

  return (
    <Panel title="样式面板" position="right" defaultCollapsed={false} top={100}>
      {selectedHierarchies.length === 0 ? (
        <div>请选择一个元素</div>
      ) : selectedHierarchies.length === 1 ? (
        <SingleElementStylePanel hierarchy={selectedHierarchies[0]} />
      ) : (
        <MultiElementStylePanel hierarchies={selectedHierarchies} />
      )}
    </Panel>
  );
};

export default StylePanel;
