"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HeroParticles } from "@/components/sections/hero/hero-particles";
import { HeroNetworkLines } from "@/components/sections/hero/hero-network-lines";

const imageBaseClasses = "pointer-events-none absolute inset-0";

// マウス位置に応じて複数レイヤーを異なる速度で動かす視差シーン。
// prefers-reduced-motion / タッチ端末では視差を無効化（静止表示のまま）。
export const HeroParallaxScene = () => {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !finePointer) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;

      if (imgWrapRef.current) {
        imgWrapRef.current.style.transform = `translate3d(${curX * -12}px, ${curY * -8}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.setProperty("--gx", `${50 + curX * 28}%`);
        glowRef.current.style.setProperty("--gy", `${50 + curY * 28}%`);
      }
      if (linesRef.current) {
        linesRef.current.style.transform = `translate3d(${curX * 16}px, ${curY * 10}px, 0)`;
      }
      if (particlesRef.current) {
        particlesRef.current.style.transform = `translate3d(${curX * 30}px, ${curY * 18}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* 背景画像（最深レイヤー） — Ken Burns + 視差 */}
      <div ref={imgWrapRef} className={cn(imageBaseClasses, "z-10 will-change-transform")}>
        <Image
          src="/images/hero-ai-ec-blockchain.webp"
          alt="ManekiCat_29 — ポートフォリオ"
          className="hero-bg-anim h-full w-full object-cover object-center"
          loading="eager"
          priority
          quality={85}
          fill
          sizes="100vw"
        />
      </div>

      {/* カーソル追従のスポットライト */}
      <div ref={glowRef} className={cn(imageBaseClasses, "hero-spotlight z-[15]")} aria-hidden="true" />

      {/* ネットワークライン（中間レイヤー） */}
      <div ref={linesRef} className={cn(imageBaseClasses, "z-[16] will-change-transform")}>
        <HeroNetworkLines />
      </div>

      {/* 粒子（最前面レイヤー） */}
      <div ref={particlesRef} className="absolute inset-0 z-[17] will-change-transform">
        <HeroParticles />
      </div>
    </>
  );
};
