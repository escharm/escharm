import { describe, expect, it } from "vitest";

import { IFlatHierarchy, IStory } from "../types";
import homeTemplate from "./homeTemplate";

describe("homeTemplate", () => {
  const mockHierarchy: IFlatHierarchy = {};

  it("should generate correct template with mock data", () => {
    const componentPath = "./TestComponent";
    const story: IStory = {
      name: "test",
      data: {
        prop1: "value1",
        prop2: 123,
        prop3: true,
      },
    };

    const result = homeTemplate(componentPath, story, mockHierarchy);
    expect(result.trim()).toMatchInlineSnapshot(`
      "import { createRoot } from 'react-dom/client';
          import DataProvider from '/src/react/DataProvider';
          import Sidebar from '/src/react/Sidebar';
          import GroupResizer from '/src/react/GroupResizer';
          import Capture from '/src/react/Capture';
          import Component from './TestComponent';

          const hierarchy = {};
          const storyData = {
        "prop1": "value1",
        "prop2": 123,
        "prop3": true
      };
          
          const root = createRoot(document.getElementById('root'));
          root.render(
            <DataProvider defaultValue={hierarchy}>
              <Sidebar />
              <Capture>
                <Component {...storyData} />
              </Capture>
              <GroupResizer />
            </DataProvider>
          )"
    `);
  });

  it("should handle empty mock data", () => {
    const componentPath = "./TestComponent";
    const story: IStory = {
      name: "test",
      data: {},
    };

    const result = homeTemplate(componentPath, story, mockHierarchy);
    expect(result.trim()).toMatchInlineSnapshot(`
      "import { createRoot } from 'react-dom/client';
          import DataProvider from '/src/react/DataProvider';
          import Sidebar from '/src/react/Sidebar';
          import GroupResizer from '/src/react/GroupResizer';
          import Capture from '/src/react/Capture';
          import Component from './TestComponent';

          const hierarchy = {};
          const storyData = {};
          
          const root = createRoot(document.getElementById('root'));
          root.render(
            <DataProvider defaultValue={hierarchy}>
              <Sidebar />
              <Capture>
                <Component {...storyData} />
              </Capture>
              <GroupResizer />
            </DataProvider>
          )"
    `);
  });

  it("should handle multiple mock data entries", () => {
    const componentPath = "./TestComponent";
    const story: IStory = {
      name: "test1",
      data: {
        prop1: "value1",
      },
    };

    const result = homeTemplate(componentPath, story, mockHierarchy);
    expect(result.trim()).toMatchInlineSnapshot(`
      "import { createRoot } from 'react-dom/client';
          import DataProvider from '/src/react/DataProvider';
          import Sidebar from '/src/react/Sidebar';
          import GroupResizer from '/src/react/GroupResizer';
          import Capture from '/src/react/Capture';
          import Component from './TestComponent';

          const hierarchy = {};
          const storyData = {
        "prop1": "value1"
      };
          
          const root = createRoot(document.getElementById('root'));
          root.render(
            <DataProvider defaultValue={hierarchy}>
              <Sidebar />
              <Capture>
                <Component {...storyData} />
              </Capture>
              <GroupResizer />
            </DataProvider>
          )"
    `);
  });
});
