"use client";

import { useEffect, useRef } from "react";

// 穏やかな水面から水滴が立ち上がり、名前（水書体）へ集まる“形成”演出＋以降のほのかな水滴。
export const HeroDroplets = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const COLORS = ["190,225,255", "255,255,255", "255,224,170"];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    let w = 0;
    let h = 0;
    let cx = 0;
    let baseY = 0;
    let nameY = 0;
    let raf = 0;
    let t0 = 0;
    let lastSpawn = 0;

    type Drop = { sx: number; tx: number; dur: number; st: number; size: number; hue: string };
    type Ripple = { x: number; y: number; st: number; dur: number; max: number };
    let drops: Drop[] = [];
    let ripples: Ripple[] = [];

    const geom = () => {
      cx = 0.53 * w;
      baseY = 0.82 * h; // 水面（水滴が生まれる高さ）
      nameY = 0.6 * h; // 名前の位置（集まる先）
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      canvas.width = w;
      canvas.height = h;
      geom();
    };

    const spawn = (now: number) => {
      const sx = cx + rnd(-0.16, 0.16) * w;
      const tx = sx + (cx - sx) * rnd(0.15, 0.4); // ゆるく中央（名前）へ寄る
      drops.push({
        sx,
        tx,
        dur: rnd(1.6, 2.6),
        st: now,
        size: rnd(1.4, 3.0) * dpr,
        hue: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
      if (Math.random() < 0.5) {
        ripples.push({ x: sx, y: baseY, st: now, dur: rnd(1.2, 2), max: rnd(18, 42) * dpr });
      }
    };

    const frame = (ts: number) => {
      if (!t0) t0 = ts;
      const t = (ts - t0) / 1000; // 経過秒
      const narrow = w / dpr < 640;

      ctx.clearRect(0, 0, w, h);

      // スポーン頻度：イントロ（〜3.2s）は密、以降はまばら
      const introEnd = 3.2;
      const every = t < introEnd ? (narrow ? 0.08 : 0.05) : narrow ? 0.75 : 0.5;
      if (t - lastSpawn > every) {
        spawn(t);
        lastSpawn = t;
      }

      // 名前あたりのグロー（イントロで一度明るくブルーム）
      const introGlow = Math.max(0, 1 - Math.abs(t - 2.4) / 2.4);
      const glow = 0.06 + 0.045 * Math.sin(t * 0.8) + 0.12 * introGlow;
      const gr = Math.min(w, h) * 0.5;
      const g = ctx.createRadialGradient(cx, nameY, 0, cx, nameY, gr);
      g.addColorStop(0, `rgba(205,228,255,${glow})`);
      g.addColorStop(1, "rgba(205,228,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // 水面の波紋
      ripples = ripples.filter((r) => {
        const p = (t - r.st) / r.dur;
        if (p >= 1) return false;
        const rad = r.max * p;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, rad, rad * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(210,230,255,${(1 - p) * 0.22})`;
        ctx.lineWidth = 1.2 * dpr;
        ctx.stroke();
        return true;
      });

      // 水滴（立ち上がって名前へ）
      drops = drops.filter((d) => {
        const p = (t - d.st) / d.dur;
        if (p >= 1) return false;
        const e = 1 - Math.pow(1 - p, 2); // easeOut で上昇
        const y = baseY + (nameY - baseY) * e - Math.sin(p * Math.PI) * 0.02 * h;
        const x = d.sx + (d.tx - d.sx) * e;
        const op = p < 0.12 ? p / 0.12 : p > 0.7 ? (1 - p) / 0.3 : 1;
        ctx.beginPath();
        ctx.ellipse(x, y, d.size, d.size * 1.6, 0, 0, Math.PI * 2); // 涙形
        ctx.fillStyle = `rgba(${d.hue},${Math.max(0, op) * 0.9})`;
        ctx.shadowBlur = 6 * dpr;
        ctx.shadowColor = `rgba(${d.hue},${Math.max(0, op)})`;
        ctx.fill();
        return true;
      });
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

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
