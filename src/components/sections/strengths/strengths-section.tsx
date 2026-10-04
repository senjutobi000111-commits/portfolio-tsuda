"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent } from "motion/react";

import { cn } from "@/lib/utils";
import { m, AnimatePresence } from "@/components/motion-wrapper";

interface Strength {
  no: string;
  en: string;
  title: string;
  desc: string;
  image: string;
}

// NOTE: 画像・本文は仮置き（後日差し替え予定）
const STRENGTHS: Strength[] = [
  {
    no: "01",
    en: "FULL-STACK",
    title: "フルスタックで一気通貫",
    desc: "要件定義からデザイン、開発、運用まで。一人で全工程を担当できるので、伝言ゲームによるロスや手戻りがありません。",
    image: "/images/strengths/strength-fullstack.webp",
  },
  {
    no: "02",
    en: "SPEED",
    title: "止まらないスピード対応",
    desc: "小さな確認から大きな意思決定まで、プロジェクトを止めずに前へ進める対応力。スピード感のあるやり取りを大切にしています。",
    image: "/images/strengths/strength-speed.webp",
  },
  {
    no: "03",
    en: "DESIGN",
    title: "成果に直結するデザイン",
    desc: "機能だけでなく「見た目」にもこだわる。細部の質感まで詰めて、使われる・選ばれるプロダクトに仕上げます。",
    image: "/images/strengths/strength-design.webp",
  },
  {
    no: "04",
    en: "AI",
    title: "実務で使えるAI活用力",
    desc: "業務自動化から開発支援まで、AIを実務レベルで使いこなす。効率化のその先まで提案します。",
    image: "/images/strengths/strength-ai.webp",
  },
];

const COUNT = STRENGTHS.length;

function StrengthsHeader() {
  return (
    <div className="absolute top-6 left-6 z-20 flex items-center gap-3 sm:top-8 sm:left-10">
      <span className="bg-off-w/40 h-px w-8" />
      <span className="font-jp text-off-w/70 text-xs tracking-[0.4em]">
        STRENGTHS
      </span>
    </div>
  );
}

function StrengthsSideNav({ activeIndex }: { activeIndex: number }) {
  return (
    <nav
      aria-label="強み"
      className="absolute top-1/2 left-6 z-20 hidden -translate-y-1/2 flex-col gap-6 lg:left-10 lg:flex"
    >
      {STRENGTHS.map((s, i) => (
        <div key={s.no} className="flex items-center gap-3">
          <span
            className={cn(
              "h-px transition-all duration-300",
              activeIndex === i ? "bg-acc-yellow-3 w-6" : "bg-off-w/30 w-3",
            )}
          />
          <span
            className={cn(
              "font-jp text-xs tracking-[0.25em] transition-colors duration-300",
              activeIndex === i ? "text-off-w" : "text-off-w/35",
            )}
          >
            {s.no} / {s.en}
          </span>
        </div>
      ))}
    </nav>
  );
}

function StrengthsPinned() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT)));
    setActiveIndex(idx);
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `${COUNT * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {STRENGTHS.map((s, i) => (
          <div
            key={s.no}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              activeIndex === i ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
            <div className="bg-darkest/60 absolute inset-0" />
            <div className="from-darkest/90 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          </div>
        ))}

        <StrengthsHeader />
        <StrengthsSideNav activeIndex={activeIndex} />

        <div className="font-jp text-off-w/50 absolute right-6 bottom-6 z-20 text-xs sm:right-10 sm:bottom-8">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(COUNT).padStart(2, "0")}
        </div>

        <div className="relative z-10 flex h-full w-full items-end px-6 pb-16 sm:px-12 sm:pb-20 lg:px-24 lg:pb-24">
          <AnimatePresence mode="wait">
            <m.div
              key={activeIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-xl"
            >
              <span className="font-jp text-acc-yellow-3/80 text-xs tracking-[0.35em]">
                {STRENGTHS[activeIndex].no} / {STRENGTHS[activeIndex].en}
              </span>
              <h3 className="font-serif-jp text-off-w mt-3 text-2xl font-semibold tracking-wide sm:text-3xl lg:text-4xl">
                {STRENGTHS[activeIndex].title}
              </h3>
              <p className="font-serif-jp text-off-w/70 mt-4 text-sm leading-relaxed sm:text-base">
                {STRENGTHS[activeIndex].desc}
              </p>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StrengthsMobile() {
  return (
    <div className="px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto mb-10 flex max-w-xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <span className="bg-off-w/30 h-px w-8" />
          <span className="font-jp text-off-w/60 text-xs tracking-[0.4em]">
            STRENGTHS
          </span>
          <span className="bg-off-w/30 h-px w-8" />
        </div>
        <h2 className="font-serif-jp text-off-w text-2xl font-semibold tracking-wide sm:text-3xl">
          私の強み
        </h2>
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-6">
        {STRENGTHS.map((s) => (
          <div
            key={s.no}
            className="border-off-w/10 bg-off-w/[0.03] overflow-hidden rounded-xl border"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(min-width: 640px) 28rem, 100vw"
                className="object-cover"
              />
              <div className="bg-darkest/50 absolute inset-0" />
            </div>
            <div className="flex flex-col gap-2 p-5">
              <span className="font-jp text-acc-yellow-3/80 text-[11px] tracking-[0.3em]">
                {s.no} / {s.en}
              </span>
              <h3 className="font-serif-jp text-off-w text-lg font-semibold">
                {s.title}
              </h3>
              <p className="font-serif-jp text-off-w/60 text-xs leading-relaxed sm:text-sm">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StrengthsSection() {
  const [isDesktop, setIsDesktop] = useState(true);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      id="strengths-section"
      className="bg-darkest scroll-mt-[var(--navbar-height)]"
    >
      {isDesktop ? <StrengthsPinned /> : <StrengthsMobile />}
    </section>
  );
}
