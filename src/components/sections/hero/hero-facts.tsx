"use client";

import { useEffect, useState } from "react";
import { m } from "@/components/motion-wrapper";
import { Briefcase, Layers, MapPin, Clock } from "lucide-react";

// ⑫ 数値カウントアップ（0 → to）。reduced-motion では即最終値。
const CountUp = ({ to, delay = 0 }: { to: number; delay?: number }) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(to);
      return;
    }
    const duration = 1100;
    let raf = 0;
    let start: number | null = null;
    const timer = window.setTimeout(() => {
      const step = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(eased * to));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, delay]);

  return <>{n}</>;
};

export const HeroFacts = () => {
  return (
    <m.div
      initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="border-off-w/15 flex w-fit max-w-full flex-col gap-2 rounded-xl border bg-black/35 px-4 py-3 shadow-lg backdrop-blur-md"
    >
      <div className="text-off-w font-serif-jp flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm sm:text-base">
        <span className="flex items-center gap-1.5">
          <Briefcase className="text-acc-yellow-3 size-4 sm:size-[1.15rem]" />
          開発経験{" "}
          <b className="text-acc-yellow-3 font-semibold">
            <CountUp to={8} delay={700} />年
          </b>
        </span>
        <span className="text-off-w/30" aria-hidden="true">
          ｜
        </span>
        <span className="flex items-center gap-1.5">
          <Layers className="text-acc-yellow-3 size-4 sm:size-[1.15rem]" />
          制作実績{" "}
          <b className="text-acc-yellow-3 font-semibold">
            <CountUp to={50} delay={700} />件
          </b>
        </span>
        <span className="text-off-w/30" aria-hidden="true">
          ｜
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="text-acc-yellow-3 size-4 sm:size-[1.15rem]" />
          香川県
        </span>
      </div>
      <div className="text-off-w/90 font-serif-jp flex items-center gap-1.5 text-xs sm:text-sm">
        <Clock className="text-acc-yellow-3 size-4 shrink-0" />
        対応可能時間：平日 9:00〜22:00 / 土日祝 18:00〜23:00
      </div>
    </m.div>
  );
};
