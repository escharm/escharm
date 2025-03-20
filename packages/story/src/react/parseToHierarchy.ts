import { parseSync, traverse } from "@babel/core";
import * as t from "@babel/types";

import { IFlatHierarchy, IHierarchy } from "./types";

function createHierarchy(
  node: t.JSXElement,
  parentId: string | null,
): IHierarchy {
  const tagName = t.isJSXIdentifier(node.openingElement.name)
    ? node.openingElement.name.name
    : "unknown";

  const dataIdAttribute = node.openingElement.attributes.find(
    (attr) =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name) &&
      attr.name.name === "data-id",
  );

  const id =
    dataIdAttribute &&
    t.isJSXAttribute(dataIdAttribute) &&
    t.isStringLiteral(dataIdAttribute.value)
      ? dataIdAttribute.value.value
      : tagName;

  return {
    id,
    name: tagName,
    childIds: [],
    parentId,
  };
}

export const parseToHierarchy = (code: string): IFlatHierarchy => {
  const ast = parseSync(code, {
    sourceType: "module",
    plugins: [["@babel/plugin-syntax-typescript", { isTSX: true }]],
  });

  if (!ast) {
    return {};
  }

  const hierarchy: IFlatHierarchy = {};
  let currentParentId: string | null = null;

  traverse(ast, {
    JSXElement: {
      enter(path) {
        const node = path.node;
        if (t.isJSXIdentifier(node.openingElement.name)) {
          const item = createHierarchy(node, currentParentId);
          hierarchy[item.id] = item;

          if (currentParentId) {
            const parent = hierarchy[currentParentId];
            if (parent) {
              parent.childIds.push(item.id);
            }
          }

          currentParentId = item.id;
        }
      },
      exit() {
        const current = Object.values(hierarchy).find(
          (h) => h?.id === currentParentId,
        );
        currentParentId = current?.parentId || null;
      },
    },
  });

  return hierarchy;
};
