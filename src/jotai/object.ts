import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";

export const DEFAULT = { foo: "bar" };

export const objectAtom = atom<{ [key: string]: string }>(DEFAULT);

export const useMemoizedObject = () => {
  const objectValue = useAtomValue(objectAtom);

  const memoized = useMemo(() => objectValue, [objectValue]);

  return memoized;
};
