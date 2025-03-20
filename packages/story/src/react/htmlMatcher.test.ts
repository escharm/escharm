import { describe, expect, it } from "vitest";

import { addDataIdToHtmlTags } from "./htmlMatcher";

describe("htmlMatcher", () => {
  describe("addDataIdToHtmlTags", () => {
    it("should add data-id attribute to tags without data-id", () => {
      const html = "<div><p>Test</p></div>";
      const result = addDataIdToHtmlTags(html);
      expect(result).toMatch(
        /<div data-id="[^"]+"><p data-id="[^"]+">Test<\/p><\/div>/,
      );
    });

    it("should not add data-id to tags that already have it", () => {
      const html =
        '<div name="abc" data-id="existing"><p data-id="existing">Test</p></div>';
      const result = addDataIdToHtmlTags(html);
      expect(result).toBe(
        '<div name="abc" data-id="existing"><p data-id="existing">Test</p></div>',
      );
    });
  });
});
