"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, useTexture } from "@react-three/drei";
import gsap from "gsap";
import type { Mesh, Material, PointLight } from "three";

const IMAGE_SRC = "/images/hero-ai-ec-blockchain.webp";
const IMAGE_ASPECT = 1672 / 941;

// 元のファーストビュー画像を本物の3D空間上のテクスチャとして配置し、
// マウスに応じて傾き・光が実際に反応する「触れる1枚絵」にする。
const HeroImagePlane = () => {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(IMAGE_SRC);
  const viewport = useThree((s) => s.viewport);

  // ビューポートいっぱいに収まるよう、アスペクト比を保って少しオーバースキャンさせる
  const overscan = 1.18;
  let planeW = viewport.width * overscan;
  let planeH = planeW / IMAGE_ASPECT;
  if (planeH < viewport.height * overscan) {
    planeH = viewport.height * overscan;
    planeW = planeH * IMAGE_ASPECT;
  }

  useEffect(() => {
    if (!meshRef.current) return;
    gsap.fromTo(
      meshRef.current.scale,
      { x: 0.92, y: 0.92, z: 0.92 },
      { x: 1, y: 1, z: 1, duration: 1.6, ease: "power3.out", delay: 0.15 },
    );
    gsap.fromTo(
      meshRef.current.material as Material,
      { opacity: 0 },
      { opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.1 },
    );
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.pointer;
    // 実際のカード傾き — 視差ではなく本物の回転
    meshRef.current.rotation.y += (x * 0.14 - meshRef.current.rotation.y) * 0.045;
    meshRef.current.rotation.x += (-y * 0.09 - meshRef.current.rotation.x) * 0.045;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeW, planeH]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.55}
        metalness={0.12}
        transparent
      />
    </mesh>
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
        <HeroImagePlane />
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

// ファーストビューの3Dシーン — 元の背景画像を本物のWebGLテクスチャとして
// 傾き・光に反応させる。prefers-reduced-motion では描画自体をスキップ。
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
