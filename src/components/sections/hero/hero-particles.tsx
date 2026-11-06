import type { CSSProperties } from "react";

// index からの決定的な擬似乱数（SSR とクライアントで一致させ hydration ずれを防ぐ）
const rand = (i: number, seed: number) => (Math.sin(i * 12.9898 + seed * 78.233) + 1) / 2;

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left: Math.round(rand(i, 1) * 100),
  top: Math.round(rand(i, 7) * 100),
  size: 2 + Math.round(rand(i, 2) * 3),
  duration: 5 + rand(i, 3) * 5,
  delay: -rand(i, 4) * 10,
  opacity: 0.35 + rand(i, 6) * 0.45,
}));

// AIネットワークの粒子 — 旧・桜の花びら演出の置き換え（テーマ統一）
export const HeroParticles = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
      aria-hidden="true"
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="hero-particle"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--p-op": p.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
};
