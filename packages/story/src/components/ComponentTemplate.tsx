import React from "react";

const ComponentTemplate = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const Component = React.lazy(() => import(urlSearchParams.get("path") ?? ""));

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component />
    </React.Suspense>
  );
};

export default ComponentTemplate;
