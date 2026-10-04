"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import {
  ClipboardList,
  Compass,
  Palette,
  Code2,
  Rocket,
  type LucideIcon,
} from "lucide-react";

interface ProcessImage {
  src: string;
  alt: string;
  caption: string;
}

interface ProcessStep {
  no: string;
  en: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  images?: ProcessImage[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    no: "01",
    en: "REQUIREMENT",
    title: "要件定義・ヒアリング",
    desc: "目的・課題・ご予算をヒアリングし、必要な機能と優先順位を言語化します。認識のズレをなくすことが、プロジェクト成功の第一歩です。",
    Icon: ClipboardList,
  },
  {
    no: "02",
    en: "PLANNING",
    title: "企画・設計",
    desc: "サイトマップやワイヤーフレーム、使用技術を設計します。ユーザー導線と運用のしやすさを両立する構成を固めます。",
    Icon: Compass,
  },
  {
    no: "03",
    en: "DESIGN",
    title: "デザイン制作",
    desc: "イラスト制作から配色、プロダクトの型紙設計、CG/VFXのライティングまで——媒体を問わず「伝わる見た目」を形にする工程です。ラフスケッチを起点に、質感・色・動きを一つずつ詰めていきます。",
    Icon: Palette,
    images: [
      {
        src: "/images/process/design-cgvfx.webp",
        alt: "CG / VFX 制作の様子",
        caption: "CG / VFX",
      },
      {
        src: "/images/process/design-illustration.webp",
        alt: "イラスト制作の様子",
        caption: "イラスト制作",
      },
      {
        src: "/images/process/design-coloring.webp",
        alt: "デジタル彩色の様子",
        caption: "デジタル彩色",
      },
      {
        src: "/images/process/design-product.webp",
        alt: "プロダクト・型紙設計の様子",
        caption: "プロダクト設計",
      },
    ],
  },
  {
    no: "04",
    en: "DEVELOPMENT",
    title: "開発・実装",
    desc: "フロントエンド・バックエンドを実装し、デザインを実際に動くプロダクトへ落とし込みます。レビューを重ねながら、保守しやすい設計を意識します。",
    Icon: Code2,
  },
  {
    no: "05",
    en: "RELEASE",
    title: "検証・公開",
    desc: "動作検証・QAを経て本番環境へ公開します。公開後も運用・改善までサポートします。",
    Icon: Rocket,
  },
];

const PANEL_COUNT = PROCESS_STEPS.length;

function DesignCollage({ images }: { images: ProcessImage[] }) {
  const [main, ...rest] = images;
  return (
    <div className="bg-off-w/5 grid h-full w-full grid-cols-2 grid-rows-3 gap-0.5 p-0.5">
      <div className="relative col-span-1 row-span-3 overflow-hidden">
        <Image
          src={main.src}
          alt={main.alt}
          fill
          sizes="(min-width: 1024px) 30vw, 60vw"
          className="object-cover"
        />
        <span className="font-jp text-off-w/90 bg-darkest/55 absolute bottom-2 left-2 rounded-sm px-2 py-0.5 text-[10px] tracking-widest backdrop-blur-sm">
          {main.caption}
        </span>
      </div>
      {rest.map((img) => (
        <div key={img.src} className="relative overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 15vw, 30vw"
            className="object-cover"
          />
          <span className="font-jp text-off-w/90 bg-darkest/55 absolute bottom-1.5 left-1.5 rounded-sm px-1.5 py-0.5 text-[9px] tracking-widest backdrop-blur-sm">
            {img.caption}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProcessVisual({ step }: { step: ProcessStep }) {
  if (step.images) return <DesignCollage images={step.images} />;
  const { Icon } = step;
  return (
    <div className="from-acc-yellow/15 via-darkest to-darkest flex h-full w-full items-center justify-center bg-gradient-to-br">
      <Icon
        className="text-off-w/15 size-24 sm:size-32 lg:size-40"
        strokeWidth={1}
      />
    </div>
  );
}

function ProcessPanel({ step }: { step: ProcessStep }) {
  return (
    <div className="border-off-w/10 relative flex h-full w-screen shrink-0 flex-col border-r lg:flex-row">
      <div className="relative h-[42%] w-full overflow-hidden lg:h-full lg:w-[56%]">
        <ProcessVisual step={step} />
      </div>

      <div className="relative flex flex-1 flex-col justify-center gap-4 px-6 py-8 sm:px-12 lg:px-14">
        <span className="font-jp text-off-w/30 text-sm tracking-[0.3em]">
          {step.no}
        </span>
        <h3 className="font-serif-jp text-off-w text-2xl font-semibold tracking-wide sm:text-3xl lg:text-4xl">
          {step.title}
        </h3>
        <span className="font-jp text-acc-yellow-3/80 text-xs tracking-[0.35em]">
          {step.en}
        </span>
        <p className="font-serif-jp text-off-w/65 max-w-md text-sm leading-relaxed sm:text-base">
          {step.desc}
        </p>
      </div>

      <span
        aria-hidden
        className="font-serif-jp text-off-w/5 pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 text-[9rem] leading-none font-bold tracking-widest select-none lg:block"
        style={{ writingMode: "vertical-rl" }}
      >
        {step.en}
      </span>
    </div>
  );
}

function ProcessHeader() {
  return (
    <div className="absolute top-6 left-6 z-20 flex items-center gap-3 sm:top-8 sm:left-10">
      <span className="bg-off-w/40 h-px w-8" />
      <span className="font-jp text-off-w/70 text-xs tracking-[0.4em]">
        PROCESS
      </span>
    </div>
  );
}

function ProcessPinned() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(PANEL_COUNT - 1) * 100}%`],
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(Math.round(v * 100));
    setActiveIndex(Math.min(PANEL_COUNT - 1, Math.floor(v * PANEL_COUNT)));
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `${PANEL_COUNT * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <ProcessHeader />

        <div className="font-jp text-off-w/50 absolute bottom-6 left-6 z-20 text-xs sm:bottom-8 sm:left-10">
          {String(Math.min(100, Math.max(0, progress))).padStart(2, "0")}%
        </div>
        <div className="font-jp text-off-w/50 absolute right-6 bottom-6 z-20 text-xs sm:right-10 sm:bottom-8">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(PANEL_COUNT).padStart(2, "0")}
        </div>

        <motion.div style={{ x }} className="flex h-full w-full">
          {PROCESS_STEPS.map((step) => (
            <ProcessPanel key={step.no} step={step} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ProcessMobile() {
  return (
    <div className="px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto mb-10 flex max-w-xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <span className="bg-off-w/30 h-px w-8" />
          <span className="font-jp text-off-w/60 text-xs tracking-[0.4em]">
            PROCESS
          </span>
          <span className="bg-off-w/30 h-px w-8" />
        </div>
        <h2 className="font-serif-jp text-off-w text-2xl font-semibold tracking-wide sm:text-3xl">
          制作工程
        </h2>
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-6">
        {PROCESS_STEPS.map((step) => (
          <div
            key={step.no}
            className="border-off-w/10 bg-off-w/[0.03] overflow-hidden rounded-xl border"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <ProcessVisual step={step} />
            </div>
            <div className="flex flex-col gap-2 p-5">
              <span className="font-jp text-acc-yellow-3/80 text-[11px] tracking-[0.3em]">
                {step.no} / {step.en}
              </span>
              <h3 className="font-serif-jp text-off-w text-lg font-semibold">
                {step.title}
              </h3>
              <p className="font-serif-jp text-off-w/60 text-xs leading-relaxed sm:text-sm">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProcessSection() {
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
      id="process-section"
      className="bg-darkest scroll-mt-[var(--navbar-height)]"
    >
      {isDesktop ? <ProcessPinned /> : <ProcessMobile />}
    </section>
  );
}
