"use client";

import { m } from "@/components/motion-wrapper";

// 肩書き（フルスタックAIエンジニア）— 情報カードの真上・アイブロウ位置
export const HeroRole = () => {
  return (
    <m.div
      initial={{ y: 14, opacity: 0, filter: "blur(6px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
    >
      <p className="text-off-w/90 text-xs font-semibold tracking-[0.28em] uppercase sm:text-sm">
        Full-Stack <span className="hero-ai-shine">AI</span> Engineer
      </p>
      <p className="text-off-w font-serif-jp text-xl font-semibold tracking-wide sm:text-2xl lg:text-3xl">
        フルスタック<span className="hero-ai-shine">AI</span>エンジニア
      </p>
    </m.div>
  );
};
