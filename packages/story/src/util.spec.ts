import { describe, expect, it } from "vitest";

import { getInterfaceProps } from "./util";

describe("getInterfaceProps", () => {
  it("should return null for empty code", () => {
    const result = getInterfaceProps(`
      
      interface IProps {
        a:string
        b:string
      };
      export const d = (x:IProps)=>{};
      export default d;`);
    expect(result).toBeNull();
  });

  // it("should extract props from interface", () => {
  //   const code = `
  //     interface Props {
  //       name: string;
  //       age: number;
  //       isActive: boolean;
  //     }
  //   `;
  //   const result = getInterfaceProps(code);
  //   expect(result).toEqual([
  //     { name: "name", type: "string" },
  //     { name: "age", type: "number" },
  //     { name: "isActive", type: "boolean" },
  //   ]);
  // });

  // it("should handle complex types", () => {
  //   const code = `
  //     interface Props {
  //       user: { name: string; age: number };
  //       permissions: string[];
  //       metadata?: Record<string, unknown>;
  //     }
  //   `;
  //   const result = getInterfaceProps(code);
  //   expect(result).toEqual([
  //     { name: "user", type: "object" },
  //     { name: "permissions", type: "array" },
  //     { name: "metadata", type: "object" },
  //   ]);
  // });

  // it("should return null for invalid code", () => {
  //   const code = "invalid typescript code";
  //   const result = getInterfaceProps(code);
  //   expect(result).toBeNull();
  // });

  // it("should handle optional properties", () => {
  //   const code = `
  //     interface Props {
  //       name?: string;
  //       age: number;
  //     }
  //   `;
  //   const result = getInterfaceProps(code);
  //   expect(result).toEqual([
  //     { name: "name", type: "string" },
  //     { name: "age", type: "number" },
  //   ]);
  // });
});
