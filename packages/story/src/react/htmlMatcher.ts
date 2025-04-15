import { nanoid } from "nanoid";

export function addDataIdToHtmlTags(html: string): string {
  return html.replace(
    /<([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g,
    (match, tagName, attributes) => {
      // 如果标签名首字母大写，则不添加data-id
      if (/^[A-Z]/.test(tagName)) {
        return match;
      }
      if (!attributes.includes("data-id")) {
        // 判断是否是多行标签
        if (match.includes("\n")) {
          // 获取第一行的缩进
          const indent = match.match(/\n(\s*)/)?.[1] || "  ";
          return `<${tagName}\n${indent}data-id="${nanoid()}"${attributes}>`;
        }
        return `<${tagName} data-id="${nanoid()}"${attributes}>`;
      }
      return match;
    },
  );
}
