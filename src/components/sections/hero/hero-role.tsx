"use client";

import { m } from "@/components/motion-wrapper";

const wipeReveal = (delay: number) => ({
  initial: { clipPath: "inset(0 101% 0 0)", opacity: 0 },
  animate: { clipPath: "inset(0 0% 0 0)", opacity: 1 },
  transition: { duration: 0.85, delay, ease: [0.65, 0, 0.1, 1] as const },
});

// 肩書き／キャッチ — 下地なし。影＋金アクセントで“浮かせる”。
// テキストは行ごとに左から光が走るようにワイプで出現する。
export const HeroRole = () => {
  return (
    <div className="flex flex-col gap-2">
      {/* アイブロウ（金の罫線＋英字ラベル） */}
      <m.div {...wipeReveal(0.15)} className="flex items-center gap-2.5">
        <span className="from-acc-yellow-3/90 h-px w-8 bg-gradient-to-r to-transparent" />
        <span className="text-acc-yellow-3 text-xs font-bold tracking-[0.34em] uppercase drop-shadow-[0_1px_5px_rgba(0,0,0,0.95)] sm:text-sm">
          Full-Stack <span className="hero-ai-shine">AI</span> Engineer
        </span>
      </m.div>

      {/* 名前の代わりに表示するID */}
      <m.p
        {...wipeReveal(0.32)}
        className="text-off-w font-serif-jp text-2xl font-bold leading-snug tracking-wide [text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_3px_20px_rgba(0,0,0,0.65)] sm:text-3xl lg:text-[2.75rem] lg:leading-[1.25]"
      >
        ManekiCat_29
      </m.p>

      {/* サブ（提供価値） */}
      <m.p
        {...wipeReveal(0.49)}
        className="text-off-w/95 font-serif-jp text-lg leading-relaxed [text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_2px_12px_rgba(0,0,0,0.6)] sm:text-xl lg:text-3xl"
      >
        <span className="text-acc-yellow-3 font-semibold">
          UIデザイン×AI・Web・EC開発
        </span>
      </m.p>
    </div>
  );
};
