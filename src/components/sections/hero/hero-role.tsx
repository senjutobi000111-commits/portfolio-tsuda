"use client";

import { m } from "@/components/motion-wrapper";

// 肩書き（フルスタックAIエンジニア）— 情報カードの真上・アイブロウ位置
export const HeroRole = () => {
  return (
    <m.div
      initial={{ y: 14, opacity: 0, filter: "blur(6px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="border-off-w/10 flex w-fit max-w-full flex-col gap-1 rounded-lg border bg-black/35 px-4 py-2.5 shadow-lg backdrop-blur-md"
    >
      <p className="text-acc-yellow-3 text-xs font-bold tracking-[0.3em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:text-sm">
        Full-Stack <span className="hero-ai-shine">AI</span> Engineer
      </p>
      <p className="text-off-w font-serif-jp text-2xl font-bold tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] sm:text-3xl lg:text-4xl">
        フルスタック<span className="hero-ai-shine">AI</span>エンジニア
      </p>
    </m.div>
  );
};
