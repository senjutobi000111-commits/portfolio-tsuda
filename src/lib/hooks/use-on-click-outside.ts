import React, { useEffect } from "react";

export default function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  callback: Array<(bool: boolean) => void>,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(e.target as Node)) {
        callback.forEach((cb) => cb(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, callback, enabled]);
}
