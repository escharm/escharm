import React from "react";
import { IHierarchy } from "../types";

interface SingleElementStylePanelProps {
  hierarchy: IHierarchy;
}

export const SingleElementStylePanel = ({
  hierarchy,
}: SingleElementStylePanelProps) => {
  const { style } = hierarchy.updateData;

  return (
    <div className="single-element-panel">
      <h4>{hierarchy.name}</h4>
      <div className="style-properties">
        {Object.entries(style).map(([property, value]) => (
          <div key={property} className="style-property">
            <span className="property-name">{property}:</span>
            <span className="property-value">{value || "未设置"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
