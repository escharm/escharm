import DirectoryNode from "./DirectoryNode";
import FileLeaf from "./FileLeaf";
import { IFileNode } from "./files";

interface FileNodeProps {
  node: IFileNode;
  path: string;
  expanded: Set<string>;
  onToggle: (path: string) => void;
}

const FileNode = (props: FileNodeProps) => {
  const { node, path, expanded, onToggle } = props;
  if (node.type === "file") {
    return <FileLeaf name={node.name} />;
  }

  return (
    <DirectoryNode
      name={node.name}
      isExpanded={expanded.has(path)}
      onToggle={() => onToggle(path)}
    >
      {node.children?.map((child) => (
        <FileNode
          key={`${path}/${child.name}`}
          node={child}
          path={`${path}/${child.name}`}
          expanded={expanded}
          onToggle={onToggle}
        />
      ))}
    </DirectoryNode>
  );
};

export default FileNode;
