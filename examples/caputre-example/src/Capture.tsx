import React from "react";

interface CaptureProps {
  children: React.ReactNode;
}

const Capture: React.FC<CaptureProps> = ({ children }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 检查点击的目标元素是否包含data-id属性
    const target = e.target as HTMLElement;
    console.log("test test", e.target, target.dataset.hierarchyId);
  };

  return <div onClickCapture={handleClick}>{children}</div>;
};

export default Capture;
