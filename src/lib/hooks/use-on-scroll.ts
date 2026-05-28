import { useEffect } from "react";

type UseOnScrollParams = (isScrollingUp: boolean) => void;

const SCROLL_THRESHOLD = 10;

export function useOnScroll(callback: UseOnScrollParams) {
  let lastDirection: "up" | "down" | null = null;
  let ticking = false;
  let isUserScrolling = false;
  let userScrollTimeout: NodeJS.Timeout;

  useEffect(() => {
    let lastScroll = window.scrollY;

    const markUserScroll = () => {
      isUserScrolling = true;
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 150);
    };

    const handleScroll = () => {
      if (!isUserScrolling) return;

      const currentScroll = window.scrollY;
      const scrollDiff = currentScroll - lastScroll;

      if (Math.abs(scrollDiff) < SCROLL_THRESHOLD) return;

      if (!ticking) {
        requestAnimationFrame(() => {
          const direction = scrollDiff > 0 ? "down" : "up";

          if (direction !== lastDirection) {
            callback(direction === "up");
            lastDirection = direction;
          }

          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", markUserScroll, { passive: true });
    window.addEventListener("touchstart", markUserScroll, { passive: true });
    window.addEventListener("keydown", (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "].includes(e.key)) {
        markUserScroll();
      }
    });

    return () => {
      window.removeEventListener("wheel", markUserScroll);
      window.removeEventListener("touchstart", markUserScroll);
      window.removeEventListener("keydown", markUserScroll);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(userScrollTimeout);
    };
  }, [callback]);
}
