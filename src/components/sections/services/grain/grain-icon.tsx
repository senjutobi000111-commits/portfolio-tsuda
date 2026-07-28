"use client";

import { useEffect, useRef } from "react";

import { GOLD, GOLD_HI, INK, grainDpr, sampleGlyphPoints } from "./grain-core";

interface IconGrain {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  gold: boolean;
  r: number;
  ph: number;
}

/**
 * A single kanji drawn as ink grains inside a service card. At rest it sits dim
 * and gathered; on hover the grains burst outward from the centre and spring
 * back (shatter → gather) while brightening to gold. RAF runs only while
 * hovered or settling, then stops on a static frame.
 */
export function GrainIcon({
  text,
  hovered,
  className,
}: {
  text: string;
  hovered: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(hovered);
  const burstRef = useRef(false);
  const startRef = useRef<() => void>(() => {});

  // Reflect prop changes into refs the RAF loop reads, and trigger a burst on
  // the rising edge of hover.
  useEffect(() => {
    if (hovered && !hoverRef.current) burstRef.current = true;
    hoverRef.current = hovered;
    startRef.current();
  }, [hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = grainDpr();
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let alive = true;
    let grains: IconGrain[] = [];

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const g of grains) {
        ctx.globalAlpha = g.gold ? 0.5 : 0.4;
        ctx.fillStyle = g.gold ? GOLD : INK;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = (t: number) => {
      const hv = hoverRef.current;

      if (burstRef.current) {
        burstRef.current = false;
        const cx = w / 2;
        const cy = h / 2;
        for (const g of grains) {
          const dx = g.x - cx;
          const dy = g.y - cy;
          const d = Math.hypot(dx, dy) || 1;
          const imp = 2.2 + Math.random() * 1.8;
          g.vx += (dx / d) * imp;
          g.vy += (dy / d) * imp;
        }
      }

      let moving = false;
      ctx.clearRect(0, 0, w, h);
      for (const g of grains) {
        g.vx += (g.hx - g.x) * 0.13;
        g.vy += (g.hy - g.y) * 0.13;
        g.vx *= 0.8;
        g.vy *= 0.8;
        g.x += g.vx;
        g.y += g.vy;
        if (Math.abs(g.vx) + Math.abs(g.vy) > 0.05) moving = true;

        const shimmer = hv ? 0.85 + Math.sin(t * 0.006 + g.ph) * 0.15 : 1;
        const baseA = hv ? (g.gold ? 0.95 : 0.82) : g.gold ? 0.5 : 0.4;
        ctx.globalAlpha = baseA * shimmer;
        ctx.fillStyle = g.gold ? (hv ? GOLD_HI : GOLD) : INK;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (hv || moving) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        raf = 0;
        drawStatic();
      }
    };

    const start = () => {
      if (!running && alive && (hoverRef.current || burstRef.current)) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    startRef.current = start;

    const build = async () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (w < 2 || h < 2) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      try {
        await document.fonts?.ready;
      } catch {
        /* ignore */
      }
      if (!alive) return;

      const pts = sampleGlyphPoints(text, w, h, {
        stride: 2,
        weight: 700,
        fitH: 0.9,
      });
      grains = pts.map((p) => ({
        hx: p.x,
        hy: p.y,
        x: p.x,
        y: p.y,
        vx: 0,
        vy: 0,
        gold: Math.random() < 0.18,
        r: Math.random() * 0.75 + 0.55,
        ph: Math.random() * Math.PI * 2,
      }));
      drawStatic();
      start();
    };

    void build();

    const ro = new ResizeObserver(() => {
      void build();
    });
    ro.observe(canvas);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [text]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
