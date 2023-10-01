import { render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { stringAtom, useMemoizedString } from "./string";

describe("string test", () => {
  const { result: set } = renderHook(() => useSetAtom(stringAtom));

  afterEach(() => {
    set.current("default");
  });

  it("does not rerender using useAtomValue when string set value is equal", () => {
    let renderCount = 0;

    function TextComponent() {
      useEffect(() => {
        renderCount++;
      });

      const text = useAtomValue(stringAtom);

      return <div>{text}</div>;
    }

    render(<TextComponent />);

    expect(renderCount).toBe(1);

    act(() => {
      set.current("hello");
    });

    expect(renderCount).toBe(2);

    act(() => {
      set.current("hello");
    });

    expect(renderCount).toBe(2);

    act(() => {
      set.current("goodbye");
    });

    expect(renderCount).toBe(3);
  });
  it("does not rerender using useMemo when string set value is equal", () => {
    let renderCount = 0;

    function TextComponent() {
      useEffect(() => {
        renderCount++;
      });

      const text = useMemoizedString();

      return <div>{text}</div>;
    }

    render(<TextComponent />);

    expect(renderCount).toBe(1);

    act(() => {
      set.current("hello");
    });

    expect(renderCount).toBe(2);

    act(() => {
      set.current("hello");
    });

    expect(renderCount).toBe(2);

    act(() => {
      set.current("goodbye");
    });

    expect(renderCount).toBe(3);
  });
});
