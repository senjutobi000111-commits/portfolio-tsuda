"use client";

import { isProjectOpenAtom } from "@/lib/store/projects";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { m } from "@/components/motion-wrapper";
import { RisingEmbers } from "@/components/ui/rising-embers";

export const ProjectsBackground = () => {
  const isOpen = useAtomValue(isProjectOpenAtom);

  return (
    <div className="absolute inset-0">
      {/* 霧の水墨山水（pro5）— 元の色のまま。暗いヴェールで墨トーンに沈める */}
      <Image
        src="/images/pro5.webp"
        alt="Decorative ink landscape background"
        fill
        sizes="100vw"
        quality={82}
        className={cn(
          "object-cover object-center transition-opacity duration-700",
          isOpen ? "opacity-25" : "opacity-65",
        )}
        priority={false}
        aria-hidden="true"
      />

      {/* 暗いヴェール — 全体を墨色に締めて可読性を確保 */}
      <div className="from-darkest/70 via-darkest/55 to-darkest/85 absolute inset-0 bg-gradient-to-b" />

      {/* 下部の暖かい光が息づく */}
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "radial-gradient(ellipse 65% 85% at 50% 100%, rgba(255,140,70,0.14) 0%, rgba(255,140,70,0) 70%)",
        }}
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 蛍火 — ゆっくり昇る光の粒 */}
      <RisingEmbers />
    </div>
  );
};
