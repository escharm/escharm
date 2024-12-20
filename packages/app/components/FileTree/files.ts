import { WebContainer } from "@webcontainer/api";

export interface IFileNode {
  name: string;
  type: "file" | "directory";
  children?: IFileNode[];
}

export async function getFileStructure(
  webcontainerInstance: WebContainer,
  path: string = "/",
): Promise<IFileNode[]> {
  const entries = await webcontainerInstance.fs.readdir(path, {
    withFileTypes: true,
  });
  const nodes: IFileNode[] = [];

  for (const entry of entries) {
    const fullPath = path === "/" ? `/${entry.name}` : `${path}/${entry.name}`;

    if (entry.isDirectory()) {
      const children = await getFileStructure(webcontainerInstance, fullPath);
      nodes.push({
        name: entry.name,
        type: "directory",
        children,
      });
    } else {
      nodes.push({
        name: entry.name,
        type: "file",
      });
    }
  }

  return nodes;
}
