import { act, renderHook } from "@testing-library/react-hooks";
import { booleanAtom } from ".";
import { useAtomValue, useSetAtom } from "jotai";

describe("test test", () => {
  it("inits with default value", () => {
    const { result } = renderHook(() => useAtomValue(booleanAtom));

    expect(result.current).toBe(false);
  });

  it("updates value", () => {
    const { result: booleanValue } = renderHook(() =>
      useAtomValue(booleanAtom)
    );
    const { result: booleanSetter } = renderHook(() => useSetAtom(booleanAtom));

    act(() => {
      booleanSetter.current(true);
    });

    expect(booleanValue.current).toBe(true);
  });
});
