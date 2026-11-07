"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import gsap from "gsap";
import { MeshBasicMaterial, Vector3 } from "three";
import type { Group, Mesh, MeshStandardMaterial, PerspectiveCamera as PerspectiveCameraType } from "three";
import type { GLTFLoader } from "three-stdlib";

// 家具一式のおおよその中心点（確認済みの各メッシュ座標から算出）。カメラの注視点に使う。
const ROOM_CENTER = new Vector3(-0.14, 0.45, 0.7);

// 兄のポートフォリオ (portfolio-twenty-six.vercel.app) で使われている
// Dark Room の3Dモデル（本人の許可を得て使用）。
// Draco圧縮メッシュ + KTX2圧縮テクスチャで書き出されたファイルをそのまま読み込む。
const MODEL_BASE = "/models/dark-room";

type GLTFNodes = Record<string, Mesh>;
type GLTFMaterials = Record<string, MeshStandardMaterial>;

function useRoomGLTF(file: string) {
  const { gl } = useThree();
  return useGLTF(
    `${MODEL_BASE}/${file}`,
    true,
    true,
    (loader: GLTFLoader) => {
      const ktx2 = new KTX2Loader().setTranscoderPath("/basis/").detectSupport(gl);
      loader.setKTX2Loader(ktx2);
    },
  ) as unknown as { nodes: GLTFNodes; materials: GLTFMaterials };
}

// 元のテクスチャはベイク済みのライティングを含むため、MeshStandardMaterialではなく
// MeshBasicMaterialに変換して使う（シーンのライトに反応させない）。
function useBakedMaterials(materials: GLTFMaterials) {
  return useMemo(() => {
    const result: Record<string, MeshBasicMaterial> = {};
    for (const [key, mat] of Object.entries(materials)) {
      result[key] = new MeshBasicMaterial({
        map: mat.map,
        transparent: mat.transparent,
        alphaTest: mat.transparent ? 0.1 : 0,
        toneMapped: false,
      });
    }
    return result;
  }, [materials]);
}

const DarkFirst = () => {
  const { nodes, materials } = useRoomGLTF("Dark_First.glb");
  const baked = useBakedMaterials(materials);
  return (
    <group dispose={null}>
      <mesh geometry={nodes.Mac_Screen.geometry} position={[-0.861, 0.815, 0.684]} rotation={[0, 0.523, 0]}>
        <meshBasicMaterial color="#141a24" toneMapped={false} />
      </mesh>
      <mesh geometry={nodes.Computer_Screen.geometry} position={[-0.302, 0.955, 0.647]} rotation={[0, -0.053, 0]}>
        <meshBasicMaterial color="#141a24" toneMapped={false} />
      </mesh>
      <mesh
        geometry={nodes.First_Baked.geometry}
        material={baked.first_real_realfdsa_Baked}
        position={[-0.231, -0.14, 0.652]}
        rotation={[Math.PI, 0, Math.PI]}
      />
    </group>
  );
};

const DarkSecond = () => {
  const { nodes, materials } = useRoomGLTF("Dark_Second.glb");
  const baked = useBakedMaterials(materials);
  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.Second_Baked.geometry}
        material={baked.Second_Real_Texture_Set_Baked}
        position={[0.053, 0, 0.341]}
        rotation={[Math.PI, 0, Math.PI]}
      />
    </group>
  );
};

const DarkThird = () => {
  const { nodes, materials } = useRoomGLTF("Dark_Third.glb");
  const baked = useBakedMaterials(materials);
  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.Floor_Vaccum_Third_Baked.geometry}
        material={baked.Third_Real_Real_Texture_Set_Baked}
        position={[1.371, 0, -0.354]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={1.015}
      />
      <mesh
        geometry={nodes.Third_Baked.geometry}
        material={baked.Third_Real_Real_Texture_Set_Baked}
        position={[-0.819, 0.746, 1.115]}
        rotation={[Math.PI / 2, 0, 0.47]}
      />
      <mesh
        geometry={nodes.Fan_Third_Baked.geometry}
        material={baked.Third_Real_Real_Texture_Set_Baked}
        position={[0.247, 0.951, 0.524]}
        rotation={[Math.PI / 2, 0, 0.47]}
      />
    </group>
  );
};

const DarkFourth = () => {
  const { nodes, materials } = useRoomGLTF("Dark_Fourth.glb");
  const baked = useBakedMaterials(materials);
  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.Fourth_Baked.geometry}
        material={baked.Fourth_Real_Real_Texture_Set_Baked}
        position={[-0.356, 0, 1.362]}
        rotation={[Math.PI, 0, Math.PI]}
      />
      <mesh
        geometry={nodes.Chair_Top_Fourth_Baked.geometry}
        material={baked.Fourth_Real_Real_Texture_Set_Baked}
        position={[-0.373, 0.735, 1.304]}
        rotation={[Math.PI, -0.121, Math.PI]}
      />
    </group>
  );
};

// デスク一式をまとめたグループ — マウスの横位置に応じてゆるやかに回転追従する
const DarkRoomGroup = () => {
  const groupRef = useRef<Group>(null);
  const rotTarget = useRef(0);

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0.85, y: 0.85, z: 0.85 },
      { x: 1, y: 1, z: 1, duration: 1.6, ease: "power3.out", delay: 0.2 },
    );
    gsap.fromTo(
      groupRef.current.position,
      { y: -0.4 },
      { y: 0, duration: 1.6, ease: "power3.out", delay: 0.2 },
    );
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const target = state.pointer.x * Math.PI * 0.1;
    rotTarget.current += (target - rotTarget.current) * 0.05;
    groupRef.current.rotation.y = rotTarget.current;
  });

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        <DarkFirst />
        <DarkSecond />
        <DarkThird />
        <DarkFourth />
      </Suspense>
    </group>
  );
};

// 元サイトの「Dark Room」カメラ位置（俯瞰アングル）を参考にしつつ、
// 家具一式の中心を注視するよう向きを計算する。
const DarkRoomCamera = () => {
  const camRef = useRef<PerspectiveCameraType>(null);

  useLayoutEffect(() => {
    camRef.current?.lookAt(ROOM_CENTER);
  });

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      fov={32}
      position={[-5.343347927650611, 5.814755800622669, 6.742415043273456]}
    />
  );
};

const HeroSceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <DarkRoomCamera />
      <DarkRoomGroup />
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

// ファーストビューの3Dシーン — 兄のポートフォリオの実際のDark Roomモデルを表示。
// prefers-reduced-motion では描画自体をスキップ。
export const Hero3DScene = () => {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <HeroSceneContent />
      </Canvas>
    </div>
  );
};
