import { NodePath, parseSync, traverse } from "@babel/core";
import * as t from "@babel/types";

function handleTSPropertySignature(
  path: NodePath,
  node: t.TSPropertySignature,
) {
  if (t.isIdentifier(node.key) && t.isTSTypeAnnotation(node.typeAnnotation)) {
    let mockValue;

    switch (node.typeAnnotation.typeAnnotation.type) {
      case "TSStringKeyword":
        mockValue = "mockString";
        break;
      case "TSNumberKeyword":
        mockValue = 123;
        break;
      case "TSBooleanKeyword":
        mockValue = true;
        break;
      case "TSNullKeyword":
        mockValue = null;
        break;
      case "TSTypeReference":
        mockValue = `mockTSTypeReference`;
        break;
      case "TSArrayType":
        mockValue = [];
        break;
      case "TSObjectKeyword":
        mockValue = {};
        break;
      default:
        mockValue = null;
    }

    return {
      key: node.key.name,
      value: mockValue,
    };
  }
}

function handleFunctionParams(
  path: NodePath,
  node: t.FunctionDeclaration | t.ArrowFunctionExpression,
) {
  const results: Array<{ key: string; value: unknown }> = [];

  node.params.forEach((param) => {
    if (
      t.isIdentifier(param) &&
      t.isTSTypeAnnotation(param.typeAnnotation) &&
      t.isTSTypeReference(param.typeAnnotation.typeAnnotation) &&
      t.isIdentifier(param.typeAnnotation.typeAnnotation.typeName)
    ) {
      const typeName = param.typeAnnotation.typeAnnotation.typeName.name;
      let declaration:
        | t.TSInterfaceDeclaration
        | t.TSTypeAliasDeclaration
        | undefined;

      traverse(path.scope.block, {
        TSInterfaceDeclaration(path) {
          if (path.node.id.name === typeName) {
            declaration = path.node;
          }
        },
        TSTypeAliasDeclaration(path) {
          if (path.node.id.name === typeName) {
            declaration = path.node;
          }
        },
      });

      if (declaration) {
        if (t.isTSInterfaceDeclaration(declaration)) {
          declaration.body.body.forEach((bodyItem) => {
            if (t.isTSPropertySignature(bodyItem)) {
              const result = handleTSPropertySignature(path, bodyItem);
              if (result) {
                results.push(result);
              }
            }
          });
        }

        if (
          t.isTSTypeAliasDeclaration(declaration) &&
          t.isTSTypeLiteral(declaration.typeAnnotation)
        ) {
          declaration.typeAnnotation.members.forEach((bodyItem) => {
            if (t.isTSPropertySignature(bodyItem)) {
              const result = handleTSPropertySignature(path, bodyItem);
              if (result) {
                results.push(result);
              }
            }
          });
        }
      }
    }
    if (
      t.isIdentifier(param) &&
      t.isTSTypeAnnotation(param.typeAnnotation) &&
      t.isTSTypeLiteral(param.typeAnnotation.typeAnnotation)
    ) {
      param.typeAnnotation.typeAnnotation.members.forEach((bodyItem) => {
        if (t.isTSPropertySignature(bodyItem)) {
          const result = handleTSPropertySignature(path, bodyItem);
          if (result) {
            results.push(result);
          }
        }
      });
    }
  });

  return results;
}

export const getInterfaceProps = (code: string) => {
  const ast = parseSync(code, {
    sourceType: "module",
    plugins: [
      "@babel/plugin-transform-typescript",
      "@babel/plugin-transform-react-jsx",
    ],
  });

  if (!ast) {
    return null;
  }

  const results: Array<{ key: string; value: unknown }> = [];

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;
      if (t.isIdentifier(declaration)) {
        const binding = path.scope.getBinding(declaration.name);
        if (
          t.isVariableDeclarator(binding?.path.node) &&
          t.isArrowFunctionExpression(binding.path.node.init)
        ) {
          const paramsResults = handleFunctionParams(
            binding.path,
            binding.path.node.init,
          );
          results.push(...paramsResults);
        }

        if (
          t.isFunctionDeclaration(binding?.path.node) ||
          t.isArrowFunctionExpression(binding?.path.node)
        ) {
          const paramsResults = handleFunctionParams(
            binding.path,
            binding.path.node,
          );
          results.push(...paramsResults);
        }
      }
      if (
        t.isFunctionDeclaration(declaration) ||
        t.isArrowFunctionExpression(declaration)
      ) {
        const paramsResults = handleFunctionParams(path, declaration);
        results.push(...paramsResults);
      }
    },
  });

  return results;
};
