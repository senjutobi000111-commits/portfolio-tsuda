"use client";

import { m } from "@/components/motion-wrapper";

// 肩書き（フルスタックAIエンジニア）— 下地なし。影＋金アクセントで“浮かせる”。
export const HeroRole = () => {
  return (
    <m.div
      initial={{ y: 14, opacity: 0, filter: "blur(6px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-2"
    >
      {/* アイブロウ（金の罫線＋英字ラベル） */}
      <div className="flex items-center gap-2.5">
        <span className="from-acc-yellow-3/90 h-px w-8 bg-gradient-to-r to-transparent" />
        <span className="text-acc-yellow-3 text-xs font-bold tracking-[0.34em] uppercase drop-shadow-[0_1px_5px_rgba(0,0,0,0.95)] sm:text-sm">
          Full-Stack{" "}
          <span className="hero-ai-shine">AI</span>{" "}
          Engineer
        </span>
      </div>

      {/* 見出し（大きめ明朝・強い影で背景から浮かす） */}
      <p className="text-off-w font-serif-jp text-3xl font-bold tracking-wide [text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_3px_20px_rgba(0,0,0,0.65)] sm:text-4xl lg:text-5xl">
        フルスタック<span className="hero-ai-shine">AI</span>エンジニア
      </p>
    </m.div>
  );
};
