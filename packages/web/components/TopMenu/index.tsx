import React, { useState } from "react";

interface MenuItemProps {
  label: string;
  items?: string[];
}

const MenuItem: React.FC<MenuItemProps> = ({ label, items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onClick={() => setIsOpen((s) => !s)}>
      <button className="px-3 py-1 text-sm text-gray-300 hover:bg-gray-700">
        {label}
      </button>

      {isOpen && items.length > 0 && (
        <div className="absolute left-0 mt-1 w-48 bg-[#252526] border border-[#454545] shadow-lg">
          {items.map((item, index) => (
            <button
              key={index}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#094771]"
              onClick={()=>{

              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TopMenu = () => {
  const menus = [
    {
      label: "File",
      items: ["New File", "Open File...", "Save", "Save As...", "Exit"],
    },
    {
      label: "Edit",
      items: ["Undo", "Redo", "Cut", "Copy", "Paste"],
    },
    {
      label: "View",
      items: ["Command Palette...", "Open View...", "Appearance", "Terminal"],
    },
    {
      label: "Help",
      items: ["Welcome", "Documentation", "About"],
    },
  ];

  return (
    <div className="h-8 bg-[#333333] flex items-center border-b border-[#454545]">
      {menus.map((item, index) => (
        <MenuItem key={index} label={item.label} items={item.items} />
      ))}
    </div>
  );
};

export default TopMenu;
