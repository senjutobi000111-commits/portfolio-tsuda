"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, useTexture } from "@react-three/drei";
import gsap from "gsap";
import type { Group, Mesh, Material, PointLight } from "three";

// ChatGPTで個別生成したレイヤー画像。背景は透過PNG。
// 新しいレイヤーを追加する場合はここに1行足すだけでよい。
interface LayerConfig {
  src: string;
  aspect: number; // 画像自体の横/縦比
  z: number; // 奥行き（0が基準面、プラスが手前）
  widthFrac: number; // 基準面の幅に対する比率
  offsetXFrac: number; // 基準面の幅に対する左右オフセット（符号付き）
  offsetYFrac: number; // 基準面の高さに対する上下オフセット（符号付き）
  parallax: number; // グループ全体の傾きに加える、このレイヤー独自の追従量
  isBase?: boolean; // 基準面（ビューポート全体を覆うレイヤー）かどうか
}

const LAYERS: LayerConfig[] = [
  {
    src: "/images/hero-layers/dashboard.webp",
    aspect: 1672 / 941,
    z: 0,
    widthFrac: 1,
    offsetXFrac: 0,
    offsetYFrac: 0,
    parallax: 0,
    isBase: true,
  },
  {
    src: "/images/hero-layers/magnifier.webp",
    aspect: 1536 / 1024,
    z: 0.9,
    widthFrac: 0.34,
    offsetXFrac: 0.13,
    offsetYFrac: 0.18,
    parallax: 0.4,
  },
];

const HeroLayer = ({
  layer,
  basePlaneW,
  basePlaneH,
}: {
  layer: LayerConfig;
  basePlaneW: number;
  basePlaneH: number;
}) => {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(layer.src);

  const { w, h, x, y } = useMemo(() => {
    const overscan = layer.isBase ? 1.18 : 1;
    let pw = basePlaneW * layer.widthFrac * overscan;
    let ph = pw / layer.aspect;
    if (layer.isBase && ph < basePlaneH * overscan) {
      ph = basePlaneH * overscan;
      pw = ph * layer.aspect;
    }
    return {
      w: pw,
      h: ph,
      x: layer.offsetXFrac * basePlaneW,
      y: layer.offsetYFrac * basePlaneH,
    };
  }, [basePlaneW, basePlaneH, layer]);

  useEffect(() => {
    if (!meshRef.current) return;
    const delay = layer.isBase ? 0.15 : 0.45;
    gsap.fromTo(
      meshRef.current.scale,
      { x: 0.9, y: 0.9, z: 0.9 },
      { x: 1, y: 1, z: 1, duration: 1.5, ease: "power3.out", delay },
    );
    gsap.fromTo(
      meshRef.current.material as Material,
      { opacity: 0 },
      { opacity: 1, duration: 1.3, ease: "power2.out", delay },
    );
  }, [layer.isBase]);

  useFrame((state) => {
    if (!meshRef.current || layer.parallax === 0) return;
    const { x: px, y: py } = state.pointer;
    const targetX = x + px * layer.parallax * basePlaneW * 0.05;
    const targetY = y + py * layer.parallax * basePlaneH * 0.05;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.06;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.06;
  });

  return (
    <mesh ref={meshRef} position={[x, y, layer.z]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} roughness={0.5} metalness={0.15} transparent />
    </mesh>
  );
};

// レイヤー群をまとめて傾けるグループ — マウスに応じて本物の回転で追従する
const HeroLayerGroup = () => {
  const groupRef = useRef<Group>(null);
  const viewport = useThree((s) => s.viewport);

  const base = LAYERS.find((l) => l.isBase) ?? LAYERS[0];
  const basePlaneW = viewport.width;
  const basePlaneH = basePlaneW / base.aspect;

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y += (x * 0.14 - groupRef.current.rotation.y) * 0.045;
    groupRef.current.rotation.x += (-y * 0.09 - groupRef.current.rotation.x) * 0.045;
  });

  return (
    <group ref={groupRef}>
      {LAYERS.map((layer) => (
        <HeroLayer key={layer.src} layer={layer} basePlaneW={basePlaneW} basePlaneH={basePlaneH} />
      ))}
    </group>
  );
};

// カーソルに追従する光のスイープ＋常時ゆっくり往復する補助光
const HeroLights = () => {
  const sweepRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (!sweepRef.current) return;
    const { x, y } = state.pointer;
    sweepRef.current.position.x += (x * 4 - sweepRef.current.position.x) * 0.06;
    sweepRef.current.position.y += (y * 2.4 - sweepRef.current.position.y) * 0.06;
  });

  return (
    <>
      <ambientLight intensity={1.05} />
      <pointLight ref={sweepRef} position={[0, 0, 3]} intensity={55} color="#ffd9a8" />
      <pointLight position={[-4, -2, 2.5]} intensity={30} color="#5fd8ff" />
    </>
  );
};

const HeroSceneContent = () => {
  return (
    <>
      <HeroLights />
      <Suspense fallback={null}>
        <HeroLayerGroup />
      </Suspense>
      <Sparkles
        count={70}
        scale={[8, 4.5, 2]}
        size={2.6}
        speed={0.22}
        color="#bfe9ff"
        opacity={0.5}
        position={[0, 0, 1.4]}
      />
    </>
  );
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
};

// ファーストビューの3Dシーン — 元画像を要素ごとに分離したレイヤーとして
// 本物のWebGL空間に配置し、それぞれ独立した奥行き・動きを持たせる。
// prefers-reduced-motion では描画自体をスキップ。
export const Hero3DScene = () => {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <HeroSceneContent />
      </Canvas>
    </div>
  );
};
