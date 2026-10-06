"use client";

import { useEffect } from "react";

const KEY = "home-scroll-y";

// Fixes the browser back button losing scroll position: with the app's
// i18n layout forcing dynamic rendering site-wide, the App Router's own
// scroll restoration on back-navigation to "/" is unreliable. This takes
// manual control: continuously remember scroll position while on the
// homepage, and restore it on mount (i.e. when returning via back button
// from /blog/[slug], /projects/[slug], etc.).
export function ScrollMemory() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const saved = sessionStorage.getItem(KEY);
    if (saved) {
      const y = parseInt(saved, 10);
      if (!Number.isNaN(y)) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => window.scrollTo(0, y));
        });
      }
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sessionStorage.setItem(KEY, String(window.scrollY));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
