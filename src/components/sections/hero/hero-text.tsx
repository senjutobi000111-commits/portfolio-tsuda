"use client";

import { cn } from "@/lib/utils";
import { m } from "@/components/motion-wrapper";
import { useTranslations } from "next-intl";

// 1文字ずつstaggerで登場させるコンポーネント
const CHAR_CONTAINER = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  }),
};

const CHAR_ITEM = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

interface TypewriterTextProps {
  text: string;
  delay: number;
  className?: string;
}

const TypewriterText = ({ text, delay, className }: TypewriterTextProps) => {
  const chars = Array.from(text); // 日本語対応のため Array.from を使用

  return (
    <m.div
      custom={delay}
      variants={CHAR_CONTAINER}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-wrap", className)}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <m.span
          key={i}
          variants={CHAR_ITEM}
          className={char === " " || char === "　" ? "inline-block w-[0.3em]" : "inline-block"}
        >
          {char}
        </m.span>
      ))}
    </m.div>
  );
};

export const HeroText = () => {
  const t = useTranslations("Hero");

  return (
    <div className="flex flex-col gap-y-6">
      {/* 挨拶 — 上から静かにフェードイン */}
      <m.p
        initial={{ y: -20, opacity: 0, filter: "blur(6px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 0.7,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={cn(
          "font-serif-jp text-off-w/85 font-light tracking-[0.25em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]",
          "text-base sm:text-lg lg:text-xl",
        )}
      >
        {t("greetings")}
      </m.p>

      {/* 名前 — 主役。大きな明朝体で見せ場をつくる */}
      <div className="flex flex-wrap items-baseline gap-x-3">
        <TypewriterText
          text={t("mateus")}
          delay={0.5}
          className={cn(
            "font-serif-jp text-off-w font-semibold tracking-wide drop-shadow-[0_3px_16px_rgba(0,0,0,1)]",
            "text-5xl sm:text-6xl lg:text-7xl",
          )}
        />
        <m.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className={cn(
            "font-serif-jp text-off-w/75 font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]",
            "text-lg sm:text-xl lg:text-2xl",
          )}
        >
          と申します。
        </m.span>
      </div>

      {/* 説明 2行 — 明朝体で上品に。最後の1行をアクセントカラーで強調 */}
      <div className="space-y-2">
        <TypewriterText
          text={t("front")}
          delay={1.4}
          className={cn(
            "font-serif-jp text-acc-yellow-3 font-bold leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,1)]",
            "text-xl sm:text-2xl lg:text-3xl",
          )}
        />

        <TypewriterText
          text={t("fullstack")}
          delay={1.9}
          className={cn(
            "font-serif-jp text-acc-yellow-3 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,1)]",
            "text-base sm:text-lg lg:text-xl",
          )}
        />
      </div>
    </div>
  );
};
