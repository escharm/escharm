interface IFileLeafProps {
  name: string;
}

const FileLeaf = (props: IFileLeafProps) => {
  const { name } = props;
  return (
    <div className="flex items-center py-1 pl-4 hover:bg-gray-100">
      <span className="mr-2">📄</span>
      {name}
    </div>
  );
};

export default FileLeaf;
