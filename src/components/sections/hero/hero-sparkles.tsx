"use client";

import { useEffect, useRef } from "react";

// 名前（水文字）まわりを引き立てる、きらめき＋水面グローのライトレイヤー（Canvas）
export const HeroSparkles = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;

    const COLORS = ["255,255,255", "255,224,170", "190,225,255"];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    type Spark = {
      x: number;
      y: number;
      r: number;
      base: number;
      spd: number;
      ph: number;
      drift: number;
      hue: string;
    };
    let sparks: Spark[] = [];

    const build = () => {
      const n = Math.round(Math.min(w / dpr, 1400) / 24); // 端末幅に応じて ~30〜55
      sparks = Array.from({ length: n }, () => ({
        x: rnd(0.26, 0.74) * w, // 中央寄り（名前・水面）
        y: rnd(0.5, 0.94) * h, // 下half（水面）
        r: rnd(0.6, 2.2) * dpr,
        base: rnd(0.25, 0.85),
        spd: rnd(0.6, 1.8),
        ph: rnd(0, Math.PI * 2),
        drift: rnd(-0.1, 0.1) * dpr,
        hue: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width * dpr));
      h = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
      build();
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // 水面・名前あたりのソフトなグロー（ゆっくり脈打つ）
      const gx = w * 0.53;
      const gy = h * 0.72;
      const gr = Math.min(w, h) * 0.55;
      const pulse = 0.08 + 0.05 * Math.sin(t * 0.8);
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      g.addColorStop(0, `rgba(205,228,255,${pulse})`);
      g.addColorStop(1, "rgba(205,228,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // きらめき
      for (const s of sparks) {
        s.y -= s.spd * dpr * 0.14;
        s.x += s.drift;
        if (s.y < h * 0.4) {
          s.y = h * 0.96;
          s.x = rnd(0.26, 0.74) * w;
        }
        const tw = s.base * (0.5 + 0.5 * Math.sin(t * s.spd + s.ph));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue},${Math.max(0, tw)})`;
        ctx.shadowBlur = 6 * dpr;
        ctx.shadowColor = `rgba(${s.hue},${Math.max(0, tw)})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full motion-reduce:hidden"
    />
  );
};
