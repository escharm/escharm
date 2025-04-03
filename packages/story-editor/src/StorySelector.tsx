import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import React, { useContext, useState } from "react";
import { useSnapshot } from "valtio";

import { StoryContext } from "./StoryProvider";

const StorySelector: React.FC = () => {
  const storyProxy = useContext(StoryContext);
  const story = useSnapshot(storyProxy);
  const { storyNames } = story;
  const [isCollapsed, setIsCollapsed] = useState(
    new URLSearchParams(window.location.search).has("name"),
  );

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
        width: "160px",
        transform: isCollapsed ? "translateX(32px)" : "translateX(0)",
        transition: "transform 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: isCollapsed ? "0" : "16px",
          cursor: "pointer",
        }}
        onClick={toggleCollapse}
      >
        {<h3 style={{ margin: 0 }}>故事列表</h3>}
        <span
          style={{
            display: "inline-flex",
            transition: "transform 0.2s ease",
            transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
            marginLeft: "auto",
          }}
        >
          <ChevronDownIcon height={16} />
        </span>
      </div>
      {!isCollapsed && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {storyNames.map((name) => (
            <li
              key={name}
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "4px",
              }}
              onClick={() => {
                const searchParams = new URLSearchParams(
                  window.location.search,
                );
                searchParams.set("name", name);
                window.location.search = decodeURIComponent(
                  searchParams.toString(),
                );
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StorySelector;
