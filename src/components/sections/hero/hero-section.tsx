import { cn } from "@/lib/utils";

import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { HeroButtons } from "@/components/sections/hero/hero-buttons";
import { HeroOverlay } from "./hero-overlay";
import { HeroRole } from "./hero-role";
import { HeroFacts } from "./hero-facts";
import { HeroPetals } from "./hero-petals";
import { HeroVideo } from "./hero-video";
import { HeroScrollIndicator } from "./hero-scroll-indicator";

const STATIC_COLOR = "#f3e5d7";
const MID_COLOR = "#f3e5d744";
const DARK_COLOR = "#00000033";

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
      <div className="relative z-30 flex w-full max-w-[480px] flex-col gap-y-5 sm:max-w-[560px] lg:max-w-[640px]">
        <HeroRole />
        <HeroFacts />
        <HeroButtons />
      </div>

      {/* ⑩ スクロール誘導 */}
      <HeroScrollIndicator />

      {/* 背景動画（poster＝現行ヒーロー画像。reduced-motion では静止画） */}
      <HeroVideo />

      {/* ④ 桜の花びら */}
      <HeroPetals />

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
