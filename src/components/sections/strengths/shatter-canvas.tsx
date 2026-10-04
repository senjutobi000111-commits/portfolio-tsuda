"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const TILE_COLS = 10;
const TILE_ROWS = 6;
const STAGGER_WINDOW = 220; // ms over which tile delays are spread
const TILE_DURATION = 320; // ms each tile takes to shatter away

export interface ShatterCanvasHandle {
  play: (imageSrc: string, onDone: () => void) => void;
}

interface ShatterCanvasProps {
  preloadSrcs?: string[];
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
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
  delay: number;
  dx: number;
  dy: number;
  rot: number;
}

const ShatterCanvas = forwardRef<ShatterCanvasHandle, ShatterCanvasProps>(
  function ShatterCanvas({ preloadSrcs }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);
    const imgCache = useRef<Map<string, HTMLImageElement>>(new Map());

    useEffect(() => {
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const boxW = canvas.clientWidth;
        const boxH = canvas.clientHeight;
        canvas.width = boxW * dpr;
        canvas.height = boxH * dpr;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          onDone();
          return;
        }
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
              tiles.push({
                col,
                row,
                delay: Math.random() * STAGGER_WINDOW,
                dx: (Math.random() - 0.5) * 36,
                dy: (Math.random() - 0.5) * 36,
                rot: (Math.random() - 0.5) * 0.3,
              });
            }
          }

          canvas.style.opacity = "1";
          const start = performance.now();
          const totalDuration = STAGGER_WINDOW + TILE_DURATION;

          const frame = (now: number) => {
            const elapsed = now - start;
            ctx.clearRect(0, 0, boxW, boxH);

            let allDone = true;
            for (const t of tiles) {
              const tElapsed = elapsed - t.delay;
              if (tElapsed < 0) {
                // not started yet: draw tile fully intact
                allDone = false;
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
                continue;
              }
              const p = Math.min(1, tElapsed / TILE_DURATION);
              if (p < 1) allDone = false;
              if (p >= 1) continue; // fully gone

              const eased = easeOutCubic(p);
              const cx = t.col * tileDstW + tileDstW / 2 + t.dx * eased;
              const cy = t.row * tileDstH + tileDstH / 2 + t.dy * eased;
              ctx.save();
              ctx.globalAlpha = 1 - eased;
              ctx.translate(cx, cy);
              ctx.rotate(t.rot * eased);
              ctx.scale(1 - 0.25 * eased, 1 - 0.25 * eased);
              ctx.drawImage(
                img,
                sx + t.col * tileSrcW,
                sy + t.row * tileSrcH,
                tileSrcW,
                tileSrcH,
                -tileDstW / 2,
                -tileDstH / 2,
                tileDstW + 0.5,
                tileDstH + 0.5,
              );
              ctx.restore();
            }

            if (elapsed < totalDuration && !allDone) {
              rafRef.current = requestAnimationFrame(frame);
            } else {
              ctx.clearRect(0, 0, boxW, boxH);
              canvas.style.opacity = "0";
              onDone();
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
        img.onerror = () => onDone();
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
