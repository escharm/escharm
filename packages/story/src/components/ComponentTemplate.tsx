import React from "react";

import { useStory } from "./hierarchy";

const ComponentTemplate = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const Component = React.lazy(
    () => import(/* @vite-ignore */ urlSearchParams.get("path") ?? ""),
  );
  const story = useStory();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component {...story.data} />
    </React.Suspense>
  );
};

export default ComponentTemplate;
