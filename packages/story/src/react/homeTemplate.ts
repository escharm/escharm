const homeTemplate = (
  componentPath: string,
  mockData: {
    name: string;
    data: Record<string, unknown>;
  }[],
) => {
  return `
      import { createRoot } from 'react-dom/client';
      import Component from '${componentPath}';
      
      const root = createRoot(document.getElementById('root'));
      root.render(<Component ${Object.entries(mockData[0].data)
        .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
        .join(" ")} />)`;
};

export default homeTemplate;
