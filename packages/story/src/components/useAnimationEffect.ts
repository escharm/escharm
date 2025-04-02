import { DependencyList, useEffect } from "react";

export const useAnimationEffect = (
  callback: () => void,
  dependencies?: DependencyList,
) => {
  useEffect(() => {
    const handler = requestAnimationFrame(callback);
    return () => {
      cancelAnimationFrame(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
