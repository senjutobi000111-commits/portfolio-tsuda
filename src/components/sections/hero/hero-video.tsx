"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// ヒーロー背景の動画。muted+loop+playsInline で自動再生。
// prefers-reduced-motion では再生せず poster（現行ヒーロー画像）を表示。
export const HeroVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return; // poster のまま
    const play = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    if (v.readyState >= 2) play();
    else v.addEventListener("canplay", play, { once: true });
  }, []);

  return (
    <video
      ref={ref}
      className={cn(
        "splash-animation pointer-events-none absolute inset-0 z-10 h-full w-full object-cover object-center",
      )}
      poster="/images/hero-2026.webp"
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src="/videos/hero-water.mp4" type="video/mp4" />
    </video>
  );
};
