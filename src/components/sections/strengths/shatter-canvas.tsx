"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// Values verified against 12-office.com's production JS bundle (OGL + GSAP):
// - grid: landscape viewports use a 4-col x 2-row tile grid
//   (gridResolution.x = width*0.25, gridResolution.y = height*0.5)
// - duration: 1.8s, ease: GSAP's easeNone (linear)
// - each tile's reveal window is delayed by up to 40% of the total duration
//   and plays over the remaining ~60%, so tiles don't all finish together
const TILE_COLS = 4;
const TILE_ROWS = 2;
const TOTAL_DURATION = 1800; // ms, matches reference exactly
const MAX_DELAY_RATIO = 0.4;
const WINDOW_RATIO = 0.6;
// the reference unlocks interaction well before the visual tail finishes
// (gsap .add(callback, .8) inside the 1.8s timeline)
const UNLOCK_AT = 1000; // ms

export interface ShatterCanvasHandle {
  play: (imageSrc: string, onDone: () => void) => void;
}

interface ShatterCanvasProps {
  preloadSrcs?: string[];
}

function getCoverRect(imgW: number, imgH: number, boxW: number, boxH: number) {
  const imgRatio = imgW / imgH;
  const boxRatio = boxW / boxH;
  let sx: number, sy: number, sw: number, sh: number;
  if (imgRatio > boxRatio) {
    sh = imgH;
    sw = sh * boxRatio;
    sy = 0;
    sx = (imgW - sw) / 2;
  } else {
    sw = imgW;
    sh = sw / boxRatio;
    sx = 0;
    sy = (imgH - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

interface Tile {
  col: number;
  row: number;
  delayRatio: number;
}

const ShatterCanvas = forwardRef<ShatterCanvasHandle, ShatterCanvasProps>(
  function ShatterCanvas({ preloadSrcs }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);
    const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const imgCache = useRef<Map<string, HTMLImageElement>>(new Map());

    useEffect(() => {
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      };
    }, []);

    useEffect(() => {
      if (!preloadSrcs) return;
      for (const src of preloadSrcs) {
        if (imgCache.current.has(src)) continue;
        const img = new window.Image();
        img.src = src;
        img.onload = () => imgCache.current.set(src, img);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preloadSrcs?.join("|")]);

    useImperativeHandle(ref, () => ({
      play(imageSrc, onDone) {
        const canvas = canvasRef.current;
        if (!canvas) {
          onDone();
          return;
        }
        if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = setTimeout(onDone, UNLOCK_AT);

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const boxW = canvas.clientWidth;
        const boxH = canvas.clientHeight;
        canvas.width = boxW * dpr;
        canvas.height = boxH * dpr;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const draw = (img: HTMLImageElement) => {
          const { sx, sy, sw, sh } = getCoverRect(
            img.naturalWidth,
            img.naturalHeight,
            boxW,
            boxH,
          );
          const tileSrcW = sw / TILE_COLS;
          const tileSrcH = sh / TILE_ROWS;
          const tileDstW = boxW / TILE_COLS;
          const tileDstH = boxH / TILE_ROWS;

          const tiles: Tile[] = [];
          for (let row = 0; row < TILE_ROWS; row++) {
            for (let col = 0; col < TILE_COLS; col++) {
              tiles.push({ col, row, delayRatio: Math.random() * MAX_DELAY_RATIO });
            }
          }

          canvas.style.opacity = "1";
          const start = performance.now();

          const frame = (now: number) => {
            const globalRatio = Math.min(1, (now - start) / TOTAL_DURATION);
            ctx.clearRect(0, 0, boxW, boxH);

            let allDone = true;
            for (const t of tiles) {
              // linear remap within this tile's own delayed window —
              // matches the reference's un-eased (easeNone) per-tile reveal
              const p = Math.min(
                1,
                Math.max(0, (globalRatio - t.delayRatio) / WINDOW_RATIO),
              );
              if (p >= 1) continue; // fully gone
              allDone = false;
              ctx.globalAlpha = 1 - p;
              ctx.drawImage(
                img,
                sx + t.col * tileSrcW,
                sy + t.row * tileSrcH,
                tileSrcW,
                tileSrcH,
                t.col * tileDstW,
                t.row * tileDstH,
                tileDstW + 0.5,
                tileDstH + 0.5,
              );
            }
            ctx.globalAlpha = 1;

            if (globalRatio < 1 && !allDone) {
              rafRef.current = requestAnimationFrame(frame);
            } else {
              ctx.clearRect(0, 0, boxW, boxH);
              canvas.style.opacity = "0";
            }
          };
          rafRef.current = requestAnimationFrame(frame);
        };

        const cached = imgCache.current.get(imageSrc);
        if (cached && cached.complete) {
          draw(cached);
          return;
        }
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;
        img.onload = () => {
          imgCache.current.set(imageSrc, img);
          draw(img);
        };
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-30 h-full w-full opacity-0"
        aria-hidden
      />
    );
  },
);

export default ShatterCanvas;
