// Shared primitives for the "grain" (粒) canvas effect used across the
// Services / 対応領域 section — ink grains that gather into glyphs, inspired by
// the shatter-then-gather particle field. Palette matches the site tokens.

export const INK = "#1f1a15"; // --color-darkest
export const GOLD = "#d58430"; // --color-acc-yellow
export const GOLD_HI = "#ffbf7a"; // --color-acc-yellow-3
export const WARM = "#f3e5d7"; // --color-off-w — warm-white grains on the dark field

/** A Japanese-serif stack; only the glyph *shape* is sampled, so any mincho works. */
export const GRAIN_FONT =
  '"Noto Serif JP","Yu Mincho","Hiragino Mincho ProN","Songti SC",serif';

export interface GlyphPoint {
  x: number;
  y: number;
}

/**
 * Renders `text` to an offscreen canvas and samples the opaque pixels into a
 * list of target points (CSS-pixel coordinates within a w×h box). The font is
 * auto-fit to the box width. Call after `document.fonts.ready` for fidelity.
 */
export function sampleGlyphPoints(
  text: string,
  w: number,
  h: number,
  opts: { stride?: number; weight?: number; fitH?: number } = {},
): GlyphPoint[] {
  const stride = Math.max(1, opts.stride ?? 3);
  const weight = opts.weight ?? 700;
  const fitH = opts.fitH ?? 0.82;

  const width = Math.max(1, Math.floor(w));
  const height = Math.max(1, Math.floor(h));
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const c = off.getContext("2d");
  if (!c) return [];

  let size = height * fitH;
  c.font = `${weight} ${size}px ${GRAIN_FONT}`;
  const maxW = width * 0.94;
  const measured = c.measureText(text).width;
  if (measured > maxW && measured > 0) {
    size *= maxW / measured;
    c.font = `${weight} ${size}px ${GRAIN_FONT}`;
  }
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillStyle = "#000";
  c.fillText(text, width / 2, height / 2 + size * 0.04);

  const data = c.getImageData(0, 0, width, height).data;
  const points: GlyphPoint[] = [];
  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      if (data[(y * width + x) * 4 + 3] > 128) {
        // slight jitter keeps the field organic without smearing the strokes
        points.push({
          x: x + (Math.random() - 0.5) * stride * 0.6,
          y: y + (Math.random() - 0.5) * stride * 0.6,
        });
      }
    }
  }
  return points;
}

/** Caps devicePixelRatio so large/retina sections stay cheap to paint. */
export function grainDpr(): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}
