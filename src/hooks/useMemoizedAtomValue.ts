import { Atom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import isEqual from "lodash/isEqual";
import { useCallback, useMemo } from "react";

export const useMemoizedAtomValue = <T>(
  atom: Atom<T>,
  selector: (v: T) => Partial<T> = (v) => v
) => {
  const value = useAtomValue(
    // Without useMemo, you run the risk of infinite loops.
    // https://jotai.org/docs/utilities/select#hold-stable-references
    useMemo(
      () => selectAtom(atom, selector, (a, b) => isEqual(a, b)),
      [atom, selector]
    )
  );

  return value;
};
