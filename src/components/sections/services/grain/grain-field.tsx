"use client";

import { useEffect, useRef } from "react";

import { GOLD, INK, grainDpr } from "./grain-core";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

interface FieldGrain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  gold: boolean;
}

/**
 * A quiet field of drifting ink grains behind the Services grid. Grains wander
 * slowly and are swept aside by the cursor. Runs only while on-screen; renders
 * a single static frame when the user prefers reduced motion.
 */
export function GrainField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = grainDpr();
    let w = 0;
    let h = 0;
    let raf = 0;
    let grains: FieldGrain[] = [];
    const pointer = { x: -9999, y: -9999 };

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      for (const g of grains) {
        ctx.globalAlpha = g.a;
        ctx.fillStyle = g.gold ? GOLD : INK;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.round((w * h) / 5600), 520);
      grains = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        r: Math.random() * 1.3 + 0.4,
        a: Math.random() * 0.22 + 0.05,
        gold: Math.random() < 0.13,
      }));
    };

    const frame = () => {
      for (const g of grains) {
        g.vx += (Math.random() - 0.5) * 0.02;
        g.vy += (Math.random() - 0.5) * 0.02;

        const dx = g.x - pointer.x;
        const dy = g.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        const R = 130;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 1.5;
          g.vx += (dx / d) * f;
          g.vy += (dy / d) * f;
        }

        g.vx *= 0.95;
        g.vy *= 0.95;
        g.x += g.vx;
        g.y += g.vy;

        if (g.x < -6) g.x = w + 6;
        else if (g.x > w + 6) g.x = -6;
        if (g.y < -6) g.y = h + 6;
        else if (g.y > h + 6) g.y = -6;
      }
      paint();
      raf = requestAnimationFrame(frame);
    };

    build();

    if (reduced) {
      paint();
      return;
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const clearPointer = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(frame);
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", clearPointer);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", clearPointer);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
