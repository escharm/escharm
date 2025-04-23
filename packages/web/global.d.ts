import "react";
import "valtio";
import "vite/types/customEvent.d.ts";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}
