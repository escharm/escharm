export interface IPluginParams {
  staticPath?: { prefix: string };
  previewPath?: { prefix: string };
  storyPath?: { prefix: string; test: RegExp };
  fixturesPath?: (path: string) => string;
  homeTemplate?: (
    componentPath: string,
    mockData: {
      name: string;
      data: Record<string, unknown>;
    }[],
  ) => string;
}
