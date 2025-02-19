"use client";

import clsx from "clsx";
import { Fragment, memo, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import copyStyles from "./copyStyles";
import { useSelectHierarchy, useToggleSelect } from "./groupedRect";
import { useHierarchy, useHierarchyStyle } from "./hooks";
import { HierarchyType } from "./types";

interface IProps {
  id: string;
}

const Hierarchy = memo((props: IProps) => {
  const { id } = props;
  const page = useHierarchy(id);
  const style = useHierarchyStyle(id);
  const ref = useRef<HTMLIFrameElement>(null);
  const toggleSelect = useToggleSelect();
  const selectHierarchy = useSelectHierarchy();
  const [mount, setMount] = useState(false);

  const callbackRef = useCallback((el: HTMLIFrameElement) => {
    if (el != null) {
      setMount(true);
      ref.current = el;
      copyStyles(window.document, el.contentDocument!);
    }
  }, []);

  const onClick = useCallback(() => {
    selectHierarchy(id);
  }, [id, selectHierarchy]);

  return (
    <Fragment>
      {page.type === HierarchyType.Page ? (
        <iframe
          id={id}
          ref={callbackRef}
          className={clsx("absolute", page.classList?.toString())}
          style={style}
        >
          {mount
            ? createPortal(
                <div className="h-screen w-screen relative" onClick={onClick}>
                  {page.childIds?.map((childId) => {
                    return <Hierarchy id={childId} key={childId} />;
                  })}
                </div>,
                ref.current!.contentDocument!.body
              )
            : null}
        </iframe>
      ) : null}
      {page.type === HierarchyType.Component ? (
        <div
          id={id}
          className={clsx(page.classList?.toString())}
          style={style}
          onClick={onClick}
        >
          {page.childIds?.map((childId) => {
            return <Hierarchy id={childId} key={childId} />;
          })}
        </div>
      ) : null}
    </Fragment>
  );
});

Hierarchy.displayName = "Hierarchy";

export default Hierarchy;
