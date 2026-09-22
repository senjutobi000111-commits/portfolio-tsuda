import { cn } from "@/lib/utils";

import Image from "next/image";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { HeroButtons } from "@/components/sections/hero/hero-buttons";
import { HeroOverlay } from "./hero-overlay";
import { Briefcase, Layers, MapPin, Clock } from "lucide-react";

const STATIC_COLOR = "#f3e5d7";
const MID_COLOR = "#f3e5d744";
const DARK_COLOR = "#00000033";

const imageBaseClasses = "pointer-events-none absolute";

export default function HeroSection() {
  return (
    <section
      id="hero-section"
      className={cn(
        "relative flex min-h-dvh flex-col items-start justify-end overflow-hidden pb-20",
        "px-8 xs:px-12 sm:pb-28 lg:px-24 lg:pb-32",
      )}
    >
      {/* Hero Content — 名前・キャッチは背景画像に描かれているため、クイック情報とCTAのみ表示 */}
      <div className="relative z-30 flex w-full max-w-[480px] flex-col gap-y-6 sm:max-w-[560px] lg:max-w-[640px]">
        {/* クイック情報（ファーストビュー） */}
        <div className="flex w-fit max-w-full flex-col gap-2 rounded-xl border border-off-w/15 bg-black/35 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="text-off-w font-serif-jp flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm sm:text-base">
            <span className="flex items-center gap-1.5">
              <Briefcase className="text-acc-yellow-3 size-4 sm:size-[1.15rem]" />
              開発経験 <b className="text-acc-yellow-3 font-semibold">8年</b>
            </span>
            <span className="text-off-w/30" aria-hidden="true">｜</span>
            <span className="flex items-center gap-1.5">
              <Layers className="text-acc-yellow-3 size-4 sm:size-[1.15rem]" />
              制作実績 <b className="text-acc-yellow-3 font-semibold">50件</b>
            </span>
            <span className="text-off-w/30" aria-hidden="true">｜</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="text-acc-yellow-3 size-4 sm:size-[1.15rem]" />
              香川県
            </span>
          </div>
          <div className="text-off-w/90 font-serif-jp flex items-center gap-1.5 text-xs sm:text-sm">
            <Clock className="text-acc-yellow-3 size-4 shrink-0" />
            対応可能時間：平日 9:00〜22:00 / 土日祝 18:00〜23:00
          </div>
        </div>

        <HeroButtons />
      </div>

      {/* 背景画像 — ズームアウトしながらフェードイン */}
      <Image
        src="/images/hero-2026.webp"
        alt="萩原 祟志 — ポートフォリオ"
        className={cn(
          imageBaseClasses,
          "splash-animation inset-0 z-10 h-full w-full object-cover object-center",
        )}
        loading="eager"
        priority
        quality={85}
        fill
        sizes="100vw"
      />

      {/* 暗いオーバーレイ — クライアントコンポーネントに分離 */}
      <HeroOverlay />

      {/* グラデーション背景 */}
      <AnimatedGradientBackground
        gradientStops={[45, 75, 100]}
        gradientColors={[DARK_COLOR, MID_COLOR, STATIC_COLOR]}
      />
    </section>
  );
}
