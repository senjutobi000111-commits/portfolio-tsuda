"use client";

import { m } from "@/components/motion-wrapper";
import { ChevronDown } from "lucide-react";

// ⑩ スクロール誘導インジケーター
export const HeroScrollIndicator = () => {
  const handleClick = () => {
    document
      .getElementById("about-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <m.button
      onClick={handleClick}
      aria-label="次のセクションへスクロール"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      className="text-off-w/70 hover:text-off-w absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] transition-colors duration-200 max-md:hidden"
    >
      <span className="font-serif-jp text-[0.6rem] tracking-[0.35em]">
        SCROLL
      </span>
      <m.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="size-5" />
      </m.span>
    </m.button>
  );
};
