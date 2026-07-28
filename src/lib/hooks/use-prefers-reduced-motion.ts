import { useEffect, useState } from "react";

/**
 * Reports the user's OS "reduce motion" preference.
 * Defaults to `false` on the server / first paint (enhanced experience),
 * then switches to `true` after mount if the user opted out of motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
