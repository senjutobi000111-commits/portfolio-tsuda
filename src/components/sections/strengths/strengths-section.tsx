"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import ShatterCanvas, { type ShatterCanvasHandle } from "./shatter-canvas";

interface Strength {
  no: string;
  en: string;
  titleLines: string[];
  desc: string;
  image: string;
}

// NOTE: 画像・本文は仮置き（後日差し替え予定）
const STRENGTHS: Strength[] = [
  {
    no: "01",
    en: "FULL-STACK",
    titleLines: ["フルスタックで", "一気通貫"],
    desc: "要件定義からデザイン、開発、運用まで。一人で全工程を担当できるので、伝言ゲームによるロスや手戻りがありません。",
    image: "/images/strengths/strength-fullstack.webp",
  },
  {
    no: "02",
    en: "SPEED",
    titleLines: ["止まらない", "スピード対応"],
    desc: "小さな確認から大きな意思決定まで、プロジェクトを止めずに前へ進める対応力。スピード感のあるやり取りを大切にしています。",
    image: "/images/strengths/strength-speed.webp",
  },
  {
    no: "03",
    en: "DESIGN",
    titleLines: ["成果に直結する", "デザイン"],
    desc: "機能だけでなく「見た目」にもこだわる。細部の質感まで詰めて、使われる・選ばれるプロダクトに仕上げます。",
    image: "/images/strengths/strength-design.webp",
  },
  {
    no: "04",
    en: "AI",
    titleLines: ["実務で使える", "AI活用力"],
    desc: "業務自動化から開発支援まで、AIを実務レベルで使いこなす。効率化のその先まで提案します。",
    image: "/images/strengths/strength-ai.webp",
  },
];

const COUNT = STRENGTHS.length;
const SWIPE_THRESHOLD = 40; // px

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

// Echoes 12-office.com's logoLeft/logoRight: an outlined numeral revealed via
// a stroke-dasharray/stroke-dashoffset "line being drawn" animation on enter
// (verified in their source: stroke-dasharray === stroke-dashoffset at rest,
// i.e. fully hidden, then dashoffset tweens to 0 to draw the line in).
function StrokeNumeral({ value, active }: { value: string; active: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      preserveAspectRatio="xMaxYMax meet"
      style={{ overflow: "visible" }}
      className="pointer-events-none absolute right-0 bottom-0 h-[65%] w-[68%] select-none sm:h-[75%] sm:w-[62%] lg:h-[85%] lg:w-[55%]"
    >
      <text
        x="98%"
        y="92%"
        textAnchor="end"
        dominantBaseline="text-after-edge"
        className="stroke-off-w/70 fill-none font-inter font-black"
        style={{
          fontSize: "380px",
          strokeWidth: 1.25,
          strokeDasharray: 2200,
          strokeDashoffset: active ? 0 : 2200,
          transition: active
            ? "stroke-dashoffset 1500ms cubic-bezier(0.65,0,0.35,1)"
            : "none",
        }}
      >
        {value}
      </text>
    </svg>
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
            {s.en}
          </span>
        </div>
      ))}
    </nav>
  );
}

function StrengthsPinned() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shatterRef = useRef<ShatterCanvasHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const transitioningRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getEngagement = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const pinnedRange = rect.height - vh;
      // allow a small top tolerance so scroll-margin-top (navbar offset) on
      // entry doesn't leave the section un-engaged for the first wheel tick
      const engaged = rect.top <= 60 && rect.top >= -pinnedRange - 0.5;
      return { engaged, vh };
    };

    const advance = (dir: 1 | -1, vh: number) => {
      if (transitioningRef.current) return;
      const current = activeIndexRef.current;
      const next = current + dir;

      if (next < 0 || next > COUNT - 1) {
        // exiting the pinned zone entirely — push scroll past the boundary
        window.scrollBy({ top: dir * (vh + 80) });
        return;
      }

      transitioningRef.current = true;
      const outgoingImage = STRENGTHS[current].image;
      activeIndexRef.current = next;
      setActiveIndex(next);
      window.scrollBy({ top: dir * vh });

      shatterRef.current?.play(outgoingImage, () => {
        transitioningRef.current = false;
      });
    };

    const onWheel = (e: WheelEvent) => {
      const { engaged, vh } = getEngagement();
      if (!engaged) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 2) return;
      advance(e.deltaY > 0 ? 1 : -1, vh);
    };

    const onTouchStart = (e: TouchEvent) => {
      const { engaged } = getEngagement();
      touchStartYRef.current = engaged ? e.touches[0].clientY : null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const { engaged, vh } = getEngagement();
      if (!engaged) {
        touchStartYRef.current = null;
        return;
      }
      const dy = touchStartYRef.current - e.touches[0].clientY;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;
      e.preventDefault();
      advance(dy > 0 ? 1 : -1, vh);
      touchStartYRef.current = e.touches[0].clientY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

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
              "absolute inset-0",
              activeIndex === i ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={s.image}
              alt={s.titleLines.join("")}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
            <StrokeNumeral value={String(i + 1)} active={activeIndex === i} />
            <div className="bg-darkest/60 absolute inset-0" />
            <div className="from-darkest/90 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          </div>
        ))}

        <ShatterCanvas
          ref={shatterRef}
          preloadSrcs={STRENGTHS.map((s) => s.image)}
        />

        <StrengthsHeader />
        <StrengthsSideNav activeIndex={activeIndex} />

        <div className="font-jp text-off-w/50 absolute right-6 bottom-6 z-20 text-xs sm:right-10 sm:bottom-8">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(COUNT).padStart(2, "0")}
        </div>

        <div className="relative z-10 flex h-full w-full items-center px-6 sm:px-12 lg:pr-24 lg:pl-72">
          <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
            <div>
              <span className="font-jp text-acc-yellow-3/80 text-xs tracking-[0.35em]">
                {STRENGTHS[activeIndex].no} ｜ {STRENGTHS[activeIndex].en}
              </span>
              <h3 className="font-jp text-off-w mt-4 leading-[1.15] font-bold">
                {STRENGTHS[activeIndex].titleLines.map((line, i) => (
                  <span
                    key={line}
                    className="block text-4xl tracking-wide sm:text-5xl lg:text-6xl"
                    style={{ marginLeft: `${i * 1.25}em` }}
                  >
                    {line}
                  </span>
                ))}
              </h3>
            </div>
            <p className="font-jp text-off-w/70 max-w-xs text-sm leading-relaxed sm:text-base lg:max-w-sm">
              {STRENGTHS[activeIndex].desc}
            </p>
          </div>
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
                alt={s.titleLines.join("")}
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
              <h3 className="font-jp text-off-w text-lg font-semibold">
                {s.titleLines.join("")}
              </h3>
              <p className="font-jp text-off-w/60 text-xs leading-relaxed sm:text-sm">
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
