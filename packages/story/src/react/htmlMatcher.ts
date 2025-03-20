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
        return `<${tagName} data-id="${nanoid()}"${attributes}>`;
      }
      return match;
    },
  );
}
