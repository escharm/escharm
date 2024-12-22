"use client";

import { WebContainer } from "@webcontainer/api";
import { useState } from "react";

import FileTree from "@/components/FileTree";
import { getFileStructure, IFileNode } from "@/components/FileTree/files";
import TopMenu from "@/components/TopMenu";

async function syncLocalToWebContainer(
  dirHandle: FileSystemDirectoryHandle,
  webcontainerInstance: WebContainer,
  currentPath: string = "/",
) {
  for await (const [name, handle] of dirHandle.entries()) {
    const fullPath = `${currentPath}${name}`;

    if (handle.kind === "file") {
      // Handle files
      const file = await handle.getFile();
      const contents = await file.text();
      await webcontainerInstance.fs.writeFile(fullPath, contents);
    } else if (handle.kind === "directory") {
      // Handle directories recursively
      await webcontainerInstance.fs.mkdir(fullPath, { recursive: true });
      await syncLocalToWebContainer(
        handle,
        webcontainerInstance,
        `${fullPath}/`,
      );
    }
  }
}

const Page = () => {
  const [files, setFiles] = useState<IFileNode[]>([]);

  return (
    <div>
      <TopMenu />
      <button
        onClick={async () => {
          const { webcontainerInstance } = await import("../webcontainer");
          // Usage in your existing code:
          const directoryHandle = await window.showDirectoryPicker({
            mode: "readwrite",
          });

          await syncLocalToWebContainer(directoryHandle, webcontainerInstance);

          const structure = await getFileStructure(webcontainerInstance);
          setFiles(structure);
        }}
      >
        test
      </button>
      <FileTree files={files} />
    </div>
  );
};

export default Page;
