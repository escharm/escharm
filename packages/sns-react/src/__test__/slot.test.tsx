import { act, cleanup, renderHook } from "@testing-library/react";
import { nanoid } from "nanoid";
import { FC, StrictMode, useCallback, useState } from "react";
import { describe, test, expect, afterEach } from "vitest";
import useSlot from "../useSlot";
import useSns from "../useSns";

const wrapper: FC<React.PropsWithChildren<unknown>> = (props) => {
  const { children } = props;
  return <StrictMode>{children}</StrictMode>;
};

afterEach(cleanup);

describe("useSlot useSlot StrictMode", () => {
  test("should has one slot", () => {
    const { result } = renderHook(
      () => {
        const [testId] = useState(nanoid());
        const slot = useSlot(testId);
        const sns = useSns();
        return { slot, sns };
      },
      {
        wrapper,
      },
    );

    expect(Object.values(result.current.sns["slots"]).length).toBe(1);
  });

  test("should has one slot after changeTestId", () => {
    const { result } = renderHook(
      () => {
        const [testId, setTestId] = useState(() => nanoid());
        const slot = useSlot(testId);
        const sns = useSns();
        const changeTestId = useCallback(() => {
          setTestId("B");
        }, []);
        return { slot, sns, changeTestId };
      },
      {
        wrapper,
      },
    );
    act(() => {
      result.current.changeTestId();
    });

    expect(result.current.slot?.id).toBe("B");
    expect(Object.values(result.current.sns["slots"]).length).toBe(1);
  });

  test("should has one slot if id is same", () => {
    const { result } = renderHook(
      () => {
        const [testId] = useState("A");
        const slot = useSlot(testId);
        const sns = useSns();
        return { slot, sns };
      },
      {
        wrapper,
      },
    );
    const { result: result2 } = renderHook(
      () => {
        const [testId] = useState("A");
        const slot = useSlot(testId);
        const sns = useSns();
        return { slot, sns };
      },
      {
        wrapper,
      },
    );

    expect(Object.values(result.current.sns["slots"]).length).toBe(1);
    expect(Object.values(result2.current.sns["slots"]).length).toBe(1);

    expect(result.current.slot).toEqual(result2.current.slot);
  });

  test("first useSlot,then useSlot", () => {
    const { result } = renderHook(
      () => {
        const [testId] = useState("A");
        const slot1 = useSlot(testId);
        const slot2 = useSlot(testId);
        const sns = useSns();
        return { slot1, slot2, sns };
      },
      {
        wrapper,
      },
    );

    expect(result.current.slot2).toEqual(result.current.slot1);
  });
});
