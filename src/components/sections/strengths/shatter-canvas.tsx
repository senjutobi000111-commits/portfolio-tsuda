"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// Values verified by reading 12-office.com's production JS bundle directly
// (OGL fragment shader + GSAP timeline), not guessed from screenshots:
// - grid: landscape viewports use a 4-col x 2-row tile grid
//   (gridResolution.x = width*0.25, gridResolution.y = height*0.5)
// - a single GSAP tween drives `leaveAnimationValue` 0->1 linearly (easeNone)
//   over 1.8s; the SHADER then remaps that per-tile through its own
//   exponential easing and a randomized delay/duration window — the linear
//   GSAP driver is just the clock, not the visible curve.
// - per tile: offsetRatio = rand1 * 0.4 (delay), durationRatio =
//   (1 - offsetRatio) * (0.6 + 0.4 * rand2) (getAnimationValue2 in source)
// - tiles don't fade in place — the shader shifts each tile's sample
//   coordinate by 2x its own size and wraps it (mod), i.e. the tile scrolls
//   through itself and wraps before disappearing, not a plain opacity fade
// - alternating tiles (checkerboard col/row parity) scroll in opposite
//   axes — even parity horizontal, odd parity vertical (dirIndex in source)
const TILE_COLS = 4;
const TILE_ROWS = 2;
const TOTAL_DURATION = 1800; // ms, matches reference exactly
const MAX_OFFSET_RATIO = 0.4;
const MIN_DURATION_RATIO = 0.6;
const SCROLL_CYCLES = 2;
// the reference unlocks interaction well before the visual tail finishes
// (gsap .add(callback, .8) inside the 1.8s timeline)
const UNLOCK_AT = 1000; // ms

export interface ShatterCanvasHandle {
  play: (imageSrc: string, onDone: () => void) => void;
}

interface ShatterCanvasProps {
  preloadSrcs?: string[];
}

function exponentialOut(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
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
  durationRatio: number;
  vertical: boolean;
}

function buildTiles(): Tile[] {
  const tiles: Tile[] = [];
  for (let row = 0; row < TILE_ROWS; row++) {
    for (let col = 0; col < TILE_COLS; col++) {
      const rv1 = Math.random();
      const rv2 = Math.random();
      const delayRatio = rv1 * MAX_OFFSET_RATIO;
      const maxDurationRatio = 1 - delayRatio;
      const durationRatio =
        maxDurationRatio * (MIN_DURATION_RATIO + (1 - MIN_DURATION_RATIO) * rv2);
      // dirIndex: checkerboard parity — odd scrolls vertically, even horizontally
      const vertical = (col + row) % 2 === 1;
      tiles.push({ col, row, delayRatio, durationRatio, vertical });
    }
  }
  return tiles;
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

          const tiles = buildTiles();

          canvas.style.opacity = "1";
          const start = performance.now();

          const frame = (now: number) => {
            const globalRatio = Math.min(1, (now - start) / TOTAL_DURATION);
            ctx.clearRect(0, 0, boxW, boxH);

            let allDone = true;
            for (const t of tiles) {
              const raw = Math.min(
                1,
                Math.max(0, (globalRatio - t.delayRatio) / t.durationRatio),
              );
              const eased = exponentialOut(raw);
              if (eased >= 1) continue; // fully gone
              allDone = false;

              const dstX = t.col * tileDstW;
              const dstY = t.row * tileDstH;
              const srcX = sx + t.col * tileSrcW;
              const srcY = sy + t.row * tileSrcH;
              const shift = (eased * SCROLL_CYCLES) % 1;

              ctx.save();
              ctx.globalAlpha = 1 - eased;
              ctx.beginPath();
              ctx.rect(dstX, dstY, tileDstW, tileDstH);
              ctx.clip();
              if (t.vertical) {
                const dy = shift * tileDstH;
                ctx.drawImage(
                  img,
                  srcX,
                  srcY,
                  tileSrcW,
                  tileSrcH,
                  dstX,
                  dstY - tileDstH + dy,
                  tileDstW + 0.5,
                  tileDstH + 0.5,
                );
                ctx.drawImage(
                  img,
                  srcX,
                  srcY,
                  tileSrcW,
                  tileSrcH,
                  dstX,
                  dstY + dy,
                  tileDstW + 0.5,
                  tileDstH + 0.5,
                );
              } else {
                const dx = shift * tileDstW;
                ctx.drawImage(
                  img,
                  srcX,
                  srcY,
                  tileSrcW,
                  tileSrcH,
                  dstX - tileDstW + dx,
                  dstY,
                  tileDstW + 0.5,
                  tileDstH + 0.5,
                );
                ctx.drawImage(
                  img,
                  srcX,
                  srcY,
                  tileSrcW,
                  tileSrcH,
                  dstX + dx,
                  dstY,
                  tileDstW + 0.5,
                  tileDstH + 0.5,
                );
              }
              ctx.restore();
            }

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
