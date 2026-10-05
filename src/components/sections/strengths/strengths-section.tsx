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
  grids?: string[];
}

// NOTE: 画像・本文は仮置き（後日差し替え予定）
const STRENGTHS: Strength[] = [
  {
    no: "01",
    en: "FASHION EC",
    titleLines: ["ファッション・アパレル", "ECサイト制作"],
    desc: "「どう見せれば売れるか」を、数々のアパレルECで磨いてきました。写真・導線・UIの一つひとつが購入の決め手になります。",
    image: "/images/strengths/strength-fashion.webp",
    grids: [
      "/images/packages/makeshop-ec-1.webp",
      "/images/packages/shopify-ec-1.webp",
      "/images/packages/rakuten-ec-1.webp",
    ],
  },
  {
    no: "02",
    en: "SPEED",
    titleLines: ["止まらない", "スピード対応"],
    desc: "「返信が速い」「止まらない」——発注者が一番求める安心感です。小さな確認から大きな意思決定まで対応します。",
    image: "/images/strengths/strength-speed.webp",
  },
  {
    no: "03",
    en: "DESIGN",
    titleLines: ["成果に直結する", "デザイン"],
    desc: "機能が良くても、見た目で選ばれなければ意味がありません。細部の質感まで詰めて仕上げます。",
    image: "/images/strengths/strength-design.webp",
    grids: [
      "/images/strengths/grid-design-1.webp",
      "/images/strengths/grid-design-2.webp",
      "/images/strengths/grid-design-3.webp",
    ],
  },
  {
    no: "04",
    en: "AI",
    titleLines: ["実務で使える", "AI活用力"],
    desc: "「使えるAI」と「使えないAI」の差は実装力です。業務自動化から開発支援まで、効率化のその先まで提案します。",
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
      style={{ overflow: "visible", transform: "translateY(4%)" }}
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
            ? "stroke-dashoffset 2400ms cubic-bezier(0.65,0,0.35,1)"
            : "none",
        }}
      >
        {value}
      </text>
    </svg>
  );
}

// Rises in after the main shatter reveal settles (~1.8s), each panel
// starting its own rise with a left-to-right stagger — mounted fresh each
// time its slide becomes active, so a CSS @keyframes animation (not a
// transition) is used so it reliably plays on mount. Full-width band
// pinned to the bottom of the frame, split into 3 equal panels.
function DesignGrids({ grids }: { grids: string[] }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex h-[26%] gap-2 px-6 pb-6 sm:gap-3 sm:px-12 sm:pb-8 lg:gap-4 lg:px-24 lg:pb-10">
      {grids.map((src, i) => (
        <div
          key={src}
          className="border-off-w/70 flex-1 border p-1.5 shadow-lg"
          style={{
            opacity: 0,
            animation: `rise-in 700ms cubic-bezier(0.22,1,0.36,1) ${1700 + i * 220}ms both`,
          }}
        >
          <div className="h-full w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      ))}
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
            {s.en}
          </span>
        </div>
      ))}
    </nav>
  );
}

// trackpad flicks keep emitting wheel events well after the physical
// gesture ends (momentum/inertia); once the lock unlocks at UNLOCK_AT a
// trailing low-magnitude event from the SAME gesture could slip through
// and fire a second advance, skipping a slide. Gate new advances behind a
// longer cooldown (independent of the canvas/visual unlock) to swallow it.
const WHEEL_COOLDOWN = 1700; // ms

function StrengthsPinned() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shatterRef = useRef<ShatterCanvasHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const transitioningRef = useRef(false);
  const cooldownUntilRef = useRef(0);
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
      const now = performance.now();
      if (transitioningRef.current || now < cooldownUntilRef.current) return;
      const current = activeIndexRef.current;
      const next = current + dir;

      if (next < 0 || next > COUNT - 1) {
        // exiting the pinned zone entirely — push scroll past the boundary
        window.scrollBy({ top: dir * (vh + 80) });
        return;
      }

      transitioningRef.current = true;
      cooldownUntilRef.current = now + WHEEL_COOLDOWN;
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
            <div
              className="bg-darkest absolute inset-0"
              style={{
                animation: `darken-drift ${9 + i * 1.7}s ease-in-out infinite`,
                animationDelay: `${-i * 2.3}s`,
              }}
            />
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

        {STRENGTHS[activeIndex].grids && (
          <DesignGrids key={activeIndex} grids={STRENGTHS[activeIndex].grids!} />
        )}
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
