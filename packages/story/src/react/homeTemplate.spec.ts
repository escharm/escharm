import { describe, expect, it } from "vitest";

import { IFlatHierarchy } from "../types";
import homeTemplate from "./homeTemplate";

describe("homeTemplate", () => {
  const mockHierarchy: IFlatHierarchy = {};

  it("should generate correct template with mock data", () => {
    const componentPath = "./TestComponent";
    const mockData = [
      {
        name: "test",
        data: {
          prop1: "value1",
          prop2: 123,
          prop3: true,
        },
      },
    ];

    const result = homeTemplate(componentPath, mockData, mockHierarchy);
    expect(result.trim()).toMatchInlineSnapshot(`
      "import { createRoot } from 'react-dom/client';
          import DataProvider from '/src/react/DataProvider';
          import Sidebar from '/src/react/Sidebar';
          import Component from './TestComponent';

          const hierarchy = {};
          
          const root = createRoot(document.getElementById('root'));
          root.render(
            <DataProvider defaultValue={{ hierarchy }}>
              <Sidebar />
              <Component prop1={"value1"} prop2={123} prop3={true} />
            </DataProvider>
          )"
    `);
  });

  it("should handle empty mock data", () => {
    const componentPath = "./TestComponent";
    const mockData = [
      {
        name: "test",
        data: {},
      },
    ];

    const result = homeTemplate(componentPath, mockData, mockHierarchy);
    expect(result.trim()).toMatchInlineSnapshot(`
      "import { createRoot } from 'react-dom/client';
          import DataProvider from '/src/react/DataProvider';
          import Sidebar from '/src/react/Sidebar';
          import Component from './TestComponent';

          const hierarchy = {};
          
          const root = createRoot(document.getElementById('root'));
          root.render(
            <DataProvider defaultValue={{ hierarchy }}>
              <Sidebar />
              <Component  />
            </DataProvider>
          )"
    `);
  });

  it("should handle multiple mock data entries", () => {
    const componentPath = "./TestComponent";
    const mockData = [
      {
        name: "test1",
        data: {
          prop1: "value1",
        },
      },
      {
        name: "test2",
        data: {
          prop2: "value2",
        },
      },
    ];

    const result = homeTemplate(componentPath, mockData, mockHierarchy);
    expect(result.trim()).toMatchInlineSnapshot(`
      "import { createRoot } from 'react-dom/client';
          import DataProvider from '/src/react/DataProvider';
          import Sidebar from '/src/react/Sidebar';
          import Component from './TestComponent';

          const hierarchy = {};
          
          const root = createRoot(document.getElementById('root'));
          root.render(
            <DataProvider defaultValue={{ hierarchy }}>
              <Sidebar />
              <Component prop1={"value1"} />
            </DataProvider>
          )"
    `);
  });
});
