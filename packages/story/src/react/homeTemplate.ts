import { IFlatHierarchy } from "./types";

const homeTemplate = (
  componentPath: string,
  mockData: {
    name: string;
    data: Record<string, unknown>;
  }[],
  hierarchy: IFlatHierarchy,
) => {
  return `
    import { createRoot } from 'react-dom/client';
    import DataProvider from '/src/react/DataProvider';
    import Sidebar from '/src/react/Sidebar';
    import GroupResizer from '/src/react/GroupResizer';
    import Capture from '/src/react/Capture';
    import Component from '${componentPath}';

    const hierarchy = ${JSON.stringify(hierarchy, null, 2)};
    
    const root = createRoot(document.getElementById('root'));
    root.render(
      <DataProvider defaultValue={hierarchy}>
        <Sidebar />
        <Capture>
          <Component ${Object.entries(mockData[0].data)
          .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
          .join(" ")} />
        </Capture>
        <GroupResizer />
      </DataProvider>
    )`;
};

export default homeTemplate;
