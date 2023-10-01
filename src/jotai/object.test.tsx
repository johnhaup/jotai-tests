import { render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useCallback, useEffect, useMemo } from "react";
import { stringAtom, useMemoizedString } from "./string";
import { DEFAULT, objectAtom } from "./object";
import { useDeepMemo } from "../hooks/useDeepMemo";
import { selectAtom } from "jotai/utils";
import { isEqual } from "lodash";
import { useMemoizedAtomValue } from "../hooks/useMemoizedAtomValue";

describe("object test", () => {
  const { result: set } = renderHook(() => useSetAtom(objectAtom));

  afterEach(() => {
    act(() => {
      set.current(DEFAULT);
    });
  });

  it("rerenders when setting an object with equal key/value pairs", () => {
    let renderCount = 0;

    function TextComponent() {
      useEffect(() => {
        renderCount++;
      });

      useAtomValue(objectAtom);

      return <div>Object Test</div>;
    }

    render(<TextComponent />);

    expect(renderCount).toBe(1);

    act(() => {
      set.current({ foo: "bar" });
    });

    expect(renderCount).toBe(2);
  });

  it("does not rerender when setting the same object", () => {
    let renderCount = 0;

    function TextComponent() {
      useEffect(() => {
        renderCount++;
      });

      useAtomValue(objectAtom);

      return <div>Object Test</div>;
    }

    render(<TextComponent />);

    expect(renderCount).toBe(1);

    act(() => {
      set.current(DEFAULT);
    });

    expect(renderCount).toBe(1);
  });

  // NOTE: WIHOUT useMemo, we get an infinite loop!
  it("does not rerender when setting an object with equal key/value pairs and using selectAtom with useMemo", () => {
    let renderCount = 0;

    function useMemoizedObjectAtom() {
      const object = useAtomValue(
        useMemo(
          () =>
            selectAtom(
              objectAtom,
              (v) => v,
              (a, b) => isEqual(a, b)
            ),
          []
        )
      );

      return object;
    }

    function TextComponent() {
      useEffect(() => {
        renderCount++;
      });

      useMemoizedObjectAtom();

      return <div>Deep Memo Test</div>;
    }

    render(<TextComponent />);

    expect(renderCount).toBe(1);

    act(() => {
      set.current({ foo: "bar" });
    });
    act(() => {
      set.current({ foo: "bar" });
    });
    act(() => {
      set.current({ foo: "boo" });
    });

    expect(renderCount).toBe(2);
  });

  it("does not rerender when setting a nested object value with equal key/value pairs and using selectAtom with useMemo", () => {
    let renderCount = 0;

    const nestedAtomObject = atom<object>({ foo: { bar: { hello: "bye" } } });
    const { result: setNested } = renderHook(() =>
      useSetAtom(nestedAtomObject)
    );

    function useMemoizedObjectAtom() {
      const object = useMemoizedAtomValue(nestedAtomObject);

      return object;
    }

    function TextComponent() {
      useEffect(() => {
        renderCount++;
      });

      useMemoizedObjectAtom();

      return <div>Deep Memo Test</div>;
    }

    render(<TextComponent />);

    expect(renderCount).toBe(1);

    act(() => {
      setNested.current({ foo: { bar: { hello: "bye" } } });
    });
    act(() => {
      setNested.current({ foo: { bar: { hello: "bye" } } });
    });
    act(() => {
      setNested.current({ foo: { bar: { hello: "HI!" } } });
    });
    act(() => {
      setNested.current({ foo: { bar: { hello: "HI!", iamnew: "yes!" } } });
    });

    expect(renderCount).toBe(3);
  });

  it("does not rerender when setting a nested object value with equal key/value pairs and using selectAtom with useMemo and passing a selector", () => {
    let renderCount = 0;

    const nestedAtomObject = atom<object>({ foo: { bar: { hello: "bye" } } });
    const { result: setNested } = renderHook(() =>
      useSetAtom(nestedAtomObject)
    );

    function useMemoizedObjectAtom() {
      const object = useAtomValue(
        useMemo(
          () =>
            selectAtom(
              nestedAtomObject,
              //@ts-ignore
              (v) => v.foo.bar,
              (a, b) => isEqual(a, b)
            ),
          [nestedAtomObject]
        )
      );

      return object;
    }

    function TextComponent() {
      useEffect(() => {
        renderCount++;
      });

      useMemoizedObjectAtom();

      return <div>Deep Memo Test</div>;
    }

    render(<TextComponent />);

    expect(renderCount).toBe(1);

    act(() => {
      setNested.current({ foo: { bar: { hello: "bye" } } });
    });
    act(() => {
      setNested.current({ foo: { bar: { hello: "bye" } } });
    });
    act(() => {
      setNested.current({ foo: { bar: { hello: "HI!" } } });
    });
    act(() => {
      setNested.current({ foo: { bar: { hello: "HI!", iamnew: "yes!" } } });
    });

    expect(renderCount).toBe(3);
  });

  it("rerenders with useDeepMemo 😠 since useAtomValue is rerunning", () => {
    let renderCount = 0;

    function useMemoizedObjectAtom() {
      const object = useAtomValue(objectAtom);

      const memoized = useDeepMemo(() => object, [object]);

      return memoized;
    }

    function TextComponent() {
      useEffect(() => {
        renderCount++;
      });

      useMemoizedObjectAtom();

      return <div>Deep Memo Test</div>;
    }

    render(<TextComponent />);

    expect(renderCount).toBe(1);

    act(() => {
      set.current({ foo: "bar" });
    });
    act(() => {
      set.current({ foo: "bar" });
    });
    act(() => {
      set.current({ foo: "boo" });
    });

    expect(renderCount).toBe(4);
  });
});
