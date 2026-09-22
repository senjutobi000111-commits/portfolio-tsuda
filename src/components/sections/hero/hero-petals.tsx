import type { CSSProperties } from "react";

// index からの決定的な擬似乱数（SSR とクライアントで一致させ hydration ずれを防ぐ）
const rand = (i: number, seed: number) => (Math.sin(i * 12.9898 + seed * 78.233) + 1) / 2;

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: Math.round(rand(i, 1) * 100),
  size: 8 + Math.round(rand(i, 2) * 10),
  duration: 9 + Math.round(rand(i, 3) * 9),
  delay: -Math.round(rand(i, 4) * 14),
  drift: 20 + Math.round(rand(i, 5) * 90),
  opacity: 0.4 + rand(i, 6) * 0.4,
}));

export const HeroPetals = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden motion-reduce:hidden"
      aria-hidden="true"
    >
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="hero-petal"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              filter: "blur(0.3px)",
              "--petal-drift": `${p.drift}px`,
              "--petal-opacity": p.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
};
