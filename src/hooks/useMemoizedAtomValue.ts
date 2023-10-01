import { Atom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import isEqual from "lodash/isEqual";
import { useMemo } from "react";

export const useMemoizedAtomValue = <T>(atom: Atom<T>) => {
  const value = useAtomValue(
    // Without useMemo, you run the risk of infinite loops.
    // https://jotai.org/docs/utilities/select#hold-stable-references
    useMemo(
      () =>
        selectAtom(
          atom,
          (v) => v,
          (a, b) => isEqual(a, b)
        ),
      [atom]
    )
  );

  return value;
};
