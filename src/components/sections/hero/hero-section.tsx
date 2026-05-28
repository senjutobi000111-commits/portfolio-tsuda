import { cn } from "@/lib/utils";

import Image from "next/image";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { HeroButtons } from "@/components/sections/hero/hero-buttons";
import { HeroText } from "./hero-text";
import { HeroOverlay } from "./hero-overlay";

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
      {/* Hero Content */}
      <div className="relative z-30 flex w-full max-w-[480px] flex-col gap-y-8 sm:max-w-[540px] lg:max-w-[600px]">
        <HeroText />
        <HeroButtons />
      </div>

      {/* 背景画像 — ズームアウトしながらフェードイン */}
      <Image
        src="/images/splash.png"
        alt="Splash Background"
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
