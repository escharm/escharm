import { describe, expect, it } from "vitest";

import { getInterfaceProps } from "./util";

describe("getInterfaceProps", () => {
  it("interface + arrow function", () => {
    const result = getInterfaceProps(`
      interface IProps {
        a: string;
        b: string;
      }
      export const d = (x: IProps) => {};
      export default d;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "value": "mockString",
        },
        {
          "key": "b",
          "value": "mockString",
        },
      ]
    `);
  });

  it("interface + function", () => {
    const result = getInterfaceProps(`
      interface IProps {
        a: string;
        b: string;
      }
      export function d(x: IProps) {}
      export default d;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "value": "mockString",
        },
        {
          "key": "b",
          "value": "mockString",
        },
      ]
    `);
  });

  it("type + arrow function", () => {
    const result = getInterfaceProps(`
      type IProps = {
        a: string;
        b: string;
      };
      export const d = (x: IProps) => {};
      export default d;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "value": "mockString",
        },
        {
          "key": "b",
          "value": "mockString",
        },
      ]
    `);
  });

  it("type + function", () => {
    const result = getInterfaceProps(`
      type IProps = {
        a:string
        b:string
      };
      export function d(x: IProps) {}
      export default d;`);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "value": "mockString",
        },
        {
          "key": "b",
          "value": "mockString",
        },
      ]
    `);
  });
});
