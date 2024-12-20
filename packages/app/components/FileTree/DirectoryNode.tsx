interface IDirectoryNodeProps {
  name: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const DirectoryNode = (props: IDirectoryNodeProps) => {
  const { name, isExpanded, onToggle, children } = props;
  return (
    <div>
      <div
        className="flex items-center py-1 pl-4 hover:bg-gray-100 cursor-pointer"
        onClick={onToggle}
      >
        <span className="mr-2">{isExpanded ? "📂" : "📁"}</span>
        {name}
      </div>
      {isExpanded && <div className="ml-4">{children}</div>}
    </div>
  );
};

export default DirectoryNode;
