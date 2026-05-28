"use client";

import { cn } from "@/lib/utils";
import { m } from "@/components/motion-wrapper";

// 蛍火・魂火 — ゆっくり昇る光の粒（SSRと一致させるため固定値）
const EMBERS = [
  { left: "6%", bottom: "4%", size: 9, delay: 0, duration: 11, rise: 220, drift: 18 },
  { left: "13%", bottom: "16%", size: 6, delay: 3.2, duration: 13, rise: 260, drift: -14 },
  { left: "21%", bottom: "6%", size: 11, delay: 6, duration: 12, rise: 240, drift: 12 },
  { left: "29%", bottom: "22%", size: 7, delay: 1.5, duration: 14, rise: 280, drift: -20 },
  { left: "37%", bottom: "9%", size: 8, delay: 4.5, duration: 10, rise: 200, drift: 16 },
  { left: "45%", bottom: "18%", size: 12, delay: 7.5, duration: 13, rise: 270, drift: -10 },
  { left: "53%", bottom: "5%", size: 6, delay: 2.2, duration: 12, rise: 245, drift: 14 },
  { left: "61%", bottom: "20%", size: 9, delay: 5.5, duration: 14, rise: 285, drift: -18 },
  { left: "69%", bottom: "11%", size: 13, delay: 0.8, duration: 11, rise: 225, drift: 20 },
  { left: "77%", bottom: "24%", size: 7, delay: 6.8, duration: 13, rise: 265, drift: -12 },
  { left: "85%", bottom: "7%", size: 10, delay: 3.8, duration: 12, rise: 235, drift: 12 },
  { left: "92%", bottom: "17%", size: 8, delay: 8.2, duration: 15, rise: 295, drift: -16 },
] as const;

const EMBER_GLOW =
  "radial-gradient(circle, rgba(255,221,170,0.98) 0%, rgba(255,175,105,0.65) 38%, rgba(255,150,80,0) 72%)";

export const RisingEmbers = ({ className }: { className?: string }) => {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {EMBERS.map((e, i) => (
        <m.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: e.left,
            bottom: e.bottom,
            width: e.size,
            height: e.size,
            background: EMBER_GLOW,
            boxShadow: `0 0 ${Math.round(e.size * 1.8)}px ${Math.round(e.size * 0.5)}px rgba(255,185,120,0.55)`,
          }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.95, 0.9, 0],
            y: [0, -e.rise * 0.25, -e.rise * 0.8, -e.rise],
            x: [0, e.drift, -e.drift * 0.5, e.drift * 0.3],
          }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.18, 0.7, 1],
          }}
        />
      ))}
    </div>
  );
};
