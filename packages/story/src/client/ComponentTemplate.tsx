import React from "react";

interface IProps {
  componentUrl: string;
}

const ComponentTemplate = (props: IProps) => {
  const { componentUrl } = props;
  const Component = React.lazy(() => import(componentUrl));

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component />
    </React.Suspense>
  );
};

export default ComponentTemplate;
