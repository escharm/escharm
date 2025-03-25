import { IFlatHierarchy } from "../types";

const homeTemplate = (
  componentPath: string,
  story: {
    name: string;
    data: Record<string, unknown>;
  },
  hierarchy: IFlatHierarchy,
) => {
  return `
    import { createRoot } from 'react-dom/client';
    import StoryProvider from '/src/components/StoryProvider';
    import Sidebar from '/src/components/Sidebar';
    import GroupResizer from '/src/components/GroupResizer';
    import Capture from '/src/components/Capture';
    import Component from '${componentPath}';

    const hierarchy = ${JSON.stringify(hierarchy, null, 2)};
    const storyData = ${JSON.stringify(story.data, null, 2)};
    
    const root = createRoot(document.getElementById('root'));
    root.render(
      <StoryProvider defaultValue={hierarchy}>
        <Sidebar />
        <Capture>
          <Component {...storyData} />
        </Capture>
        <GroupResizer />
      </StoryProvider>
    )`;
};

export default homeTemplate;
