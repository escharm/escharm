import { describe, expect, it, vi } from "vitest";

import { addDataIdToHtmlTags } from "./htmlMatcher";

// Mock nanoid to return sequential IDs
vi.mock("nanoid", () => {
  let count = 0;
  return {
    nanoid: () => `mock-id-${++count}`,
  };
});

describe("htmlMatcher", () => {
  describe("addDataIdToHtmlTags", () => {
    it("should add data-id attribute to tags without data-id", () => {
      const html = "<div><p>Test</p></div>";
      const result = addDataIdToHtmlTags(html);
      expect(result).toMatchInlineSnapshot(
        `"<div data-id="mock-id-1"><p data-id="mock-id-2">Test</p></div>"`,
      );
    });

    it("should not add data-id to tags that already have it", () => {
      const html =
        '<div name="abc" data-id="existing"><p data-id="existing">Test</p></div>';
      const result = addDataIdToHtmlTags(html);
      expect(result).toMatchInlineSnapshot(
        `"<div name="abc" data-id="existing"><p data-id="existing">Test</p></div>"`,
      );
    });

    it("should handle multi-line HTML correctly", () => {
      const html = `
        <div
          class="container"
          style="color: red;"
        >
          <div
            class="container"
            style="color: red;"
          />
        </div>
      `;
      const result = addDataIdToHtmlTags(html);
      expect(result).toMatchInlineSnapshot(`
        "
                <div
                  data-id="mock-id-3"
                  class="container"
                  style="color: red;"
                >
                  <div
                    data-id="mock-id-4"
                    class="container"
                    style="color: red;"
                  />
                </div>
              "
      `);
    });
  });
});
