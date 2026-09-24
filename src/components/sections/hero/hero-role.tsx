"use client";

import { m } from "@/components/motion-wrapper";

// 肩書き／キャッチ — 下地なし。影＋金アクセントで“浮かせる”。
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
          Full-Stack <span className="hero-ai-shine">AI</span> Engineer
        </span>
      </div>

      {/* 主コピー（キャッチ） */}
      <p className="text-off-w font-serif-jp text-2xl font-bold leading-snug tracking-wide [text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_3px_20px_rgba(0,0,0,0.65)] sm:text-3xl lg:text-[2.75rem] lg:leading-[1.25]">
        『日常業務を、もっと圧倒的に心地よく』
      </p>

      {/* サブ（提供価値） */}
      <p className="text-off-w/95 font-serif-jp text-base leading-relaxed [text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_2px_12px_rgba(0,0,0,0.6)] sm:text-lg lg:text-2xl">
        成果に直結する
        <span className="text-acc-yellow-3 font-semibold">
          UIデザイン×AI・Web・EC開発
        </span>
      </p>
    </m.div>
  );
};
