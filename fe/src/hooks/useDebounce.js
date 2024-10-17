import React from "react";

export function useDebounceCallback(callback, delay) {
  const timeoutRef = React.useRef(null);

  const debouncedCallback = React.useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const timeoutId = window.setTimeout(() => {
        callback(...args);
      }, delay);

      timeoutRef.current = timeoutId;
    },
    [callback, delay]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
