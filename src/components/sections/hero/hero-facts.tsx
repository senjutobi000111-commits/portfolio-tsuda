"use client";

import { useEffect, useState } from "react";
import { m } from "@/components/motion-wrapper";
import { Briefcase, Layers, MapPin, Clock } from "lucide-react";

// 数値カウントアップ（0 → to）。reduced-motion では即最終値。
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

const iconClass =
  "text-acc-yellow-3 size-4 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:size-[1.15rem]";
const numClass = "text-acc-yellow-3 text-base font-bold sm:text-lg";

export const HeroFacts = () => {
  return (
    <m.div
      initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="text-off-w flex flex-col gap-2 [text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_2px_14px_rgba(0,0,0,0.65)]"
    >
      <div className="font-serif-jp flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm sm:text-base">
        <span className="flex items-center gap-1.5">
          <Briefcase className={iconClass} />
          開発経験{" "}
          <b className={numClass}>
            <CountUp to={8} delay={700} />年
          </b>
        </span>
        <span className="text-acc-yellow-3/50" aria-hidden="true">
          ｜
        </span>
        <span className="flex items-center gap-1.5">
          <Layers className={iconClass} />
          制作実績{" "}
          <b className={numClass}>
            <CountUp to={50} delay={700} />件
          </b>
        </span>
        <span className="text-acc-yellow-3/50" aria-hidden="true">
          ｜
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className={iconClass} />
          香川県
        </span>
      </div>
      <div className="text-off-w/90 font-serif-jp flex items-center gap-1.5 text-xs sm:text-sm">
        <Clock className={iconClass} />
        対応可能時間：平日 9:00〜22:00 / 土日祝 18:00〜23:00
      </div>
    </m.div>
  );
};
