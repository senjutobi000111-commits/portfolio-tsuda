"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import gsap from "gsap";
import type { Group } from "three";

// AIコア：歪むガラス質のイコサヘドロン＋ワイヤーフレームの外殻。
// マウス位置に応じて緩やかに向きを変え、常時ゆっくり自転する。
const HeroCore = () => {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1, duration: 1.7, ease: "elastic.out(1, 0.55)", delay: 0.25 },
    );
    gsap.fromTo(
      groupRef.current.position,
      { y: -0.6 },
      { y: 0, duration: 1.7, ease: "power3.out", delay: 0.25 },
    );
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y += (x * 0.5 - groupRef.current.rotation.y) * 0.04 + delta * 0.08;
    groupRef.current.rotation.x += (-y * 0.3 - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
        <mesh>
          <icosahedronGeometry args={[1.35, 2]} />
          <MeshDistortMaterial
            color="#2d74b8"
            emissive="#123a66"
            emissiveIntensity={0.9}
            roughness={0.1}
            metalness={0.8}
            distort={0.35}
            speed={1.8}
          />
        </mesh>
        <mesh scale={1.22}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color="#9be9ff" wireframe transparent opacity={0.18} />
        </mesh>
      </Float>
    </group>
  );
};

const HeroSceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 3, 4]} intensity={90} color="#ffbf7a" />
      <pointLight position={[-4, -2, -3]} intensity={70} color="#5fd8ff" />
      <pointLight position={[0, -3, 5]} intensity={35} color="#ff9f6b" />

      <HeroCore />

      <Sparkles count={220} scale={8} size={3.2} speed={0.3} color="#9be9ff" opacity={0.9} />
      <Sparkles count={90} scale={5} size={2.4} speed={0.2} color="#ffd9a8" opacity={0.8} />
      <Sparkles count={60} scale={3.2} size={4} speed={0.15} color="#ffffff" opacity={0.6} />
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

// ファーストビューの3Dシーン — WebGL (React Three Fiber) による本物の立体演出。
// prefers-reduced-motion では描画自体をスキップし、背景グラデーションのみにする。
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
