import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";

export const stringAtom = atom("default");

export const useMemoizedString = () => {
  const stringValue = useAtomValue(stringAtom);

  const memoized = useMemo(() => stringValue, [stringValue]);

  return memoized;
};
