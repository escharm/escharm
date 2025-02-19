import { useSelectedGroup } from "../groupedRect";
import { useMovePanel, usePositionStyle } from "./data";

const PropsPanel = () => {
  const selectedGroup = useSelectedGroup();
  const style = usePositionStyle();
  const { moveBind } = useMovePanel();

  return (
    <div style={style} className="absolute">
      <div {...moveBind()}>title</div>
      <div>x {selectedGroup.relativeX}</div>
      <div>y {selectedGroup.relativeY}</div>
      <div>width {selectedGroup.width}</div>
      <div>height {selectedGroup.height}</div>
    </div>
  );
};

export default PropsPanel;
