"use client";

import { useEffect, useRef } from "react";

import { INK, grainDpr, sampleGlyphPoints } from "./grain-core";

interface HeadingGrain {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  ph: number;
}

/**
 * Renders `text` as a field of black ink grains that start scattered and
 * GATHER into the glyphs when the section scrolls into view. The cursor sweeps
 * the grains apart as it passes; they spring back. Decorative — pair with an
 * sr-only heading; skip on reduced motion (caller decides).
 */
export function GrainHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = grainDpr();
    let w = 0;
    let h = 0;
    let raf = 0;
    let entered = false;
    let alive = true;
    let grains: HeadingGrain[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

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
        /* fall back to a system serif */
      }
      if (!alive) return;

      const pts = sampleGlyphPoints(text, w, h, {
        stride: 2,
        weight: 800,
        fitH: 0.78,
      });
      grains = pts.map((p) => ({
        hx: p.x,
        hy: p.y,
        x: p.x + (Math.random() - 0.5) * w * 0.8,
        y: p.y + (Math.random() - 0.5) * h * 3.5,
        vx: 0,
        vy: 0,
        r: Math.random() * 0.7 + 0.75,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const spring = entered ? 0.075 : 0.02;
      for (const g of grains) {
        g.vx += (g.hx - g.x) * spring;
        g.vy += (g.hy - g.y) * spring;

        if (pointer.active) {
          const dx = g.x - pointer.x;
          const dy = g.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const R = 82;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / R) * 3;
            g.vx += (dx / d) * f;
            g.vy += (dy / d) * f;
          }
        }

        g.vx *= 0.84;
        g.vy *= 0.84;
        g.x += g.vx;
        g.y += g.vy;

        const dist = Math.hypot(g.x - g.hx, g.y - g.hy);
        const settled = Math.max(0, 1 - dist / 6);
        const shimmer = 0.9 + Math.sin(t * 0.0028 + g.ph) * 0.1;
        ctx.globalAlpha =
          (entered ? Math.min(0.98, 0.2 + settled * 0.85) : 0.3) * shimmer;
        ctx.fillStyle = INK;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.x = x;
      pointer.y = y;
      pointer.active = x > -50 && x < w + 50 && y > -50 && y < h + 50;
    };
    const clearPointer = () => {
      pointer.active = false;
    };

    void build().then(() => {
      if (alive && entered) start();
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entered = true;
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      void build();
    });
    ro.observe(canvas);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", clearPointer);

    return () => {
      alive = false;
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", clearPointer);
    };
  }, [text]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
