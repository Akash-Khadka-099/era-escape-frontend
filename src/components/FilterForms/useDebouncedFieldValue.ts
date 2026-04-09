import { useCallback, useEffect, useState } from "react";

export const useDebouncedFieldValue = <T,>(
  value: T,
  onDebouncedChange: (value: T) => void,
  delay = 400,
) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleValueChange = useCallback(
    (nextValue: T) => {
      setInternalValue(nextValue);

      if (delay <= 0 && nextValue !== value) {
        onDebouncedChange(nextValue);
      }
    },
    [delay, onDebouncedChange, value],
  );

  useEffect(() => {
    if (delay <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (internalValue !== value) {
        onDebouncedChange(internalValue);
      }
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, internalValue, onDebouncedChange, value]);

  return [internalValue, handleValueChange] as const;
};
