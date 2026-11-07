"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useVideoTexture, PerspectiveCamera, Sparkles } from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import gsap from "gsap";
import { MeshBasicMaterial, Vector3 } from "three";
import type { Group, Mesh, MeshStandardMaterial, PerspectiveCamera as PerspectiveCameraType } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { GLTFLoader } from "three-stdlib";

// 兄のポートフォリオ (portfolio-twenty-six.vercel.app) で使われている
// Dark Room の3Dモデル（本人の許可を得て使用）。
// Draco圧縮メッシュ + KTX2圧縮テクスチャで書き出されたファイルをそのまま読み込む。
const DARK_BASE = "/models/dark-room";

// 家具一式のおおよその中心点（各メッシュ座標から算出）。カメラの注視点に使う。
const DARK_CENTER = new Vector3(-0.14, 0.45, 0.7);
const DARK_CAMERA_POS = new Vector3(-5.343347927650611, 5.814755800622669, 6.742415043273456);

type GLTFNodes = Record<string, Mesh>;
type GLTFMaterials = Record<string, MeshStandardMaterial>;

function useRoomGLTF(path: string) {
  const { gl } = useThree();
  return useGLTF(path, true, true, (loader: GLTFLoader) => {
    const ktx2 = new KTX2Loader().setTranscoderPath("/basis/").detectSupport(gl);
    loader.setKTX2Loader(ktx2);
  }) as unknown as { nodes: GLTFNodes; materials: GLTFMaterials };
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
  const { nodes, materials } = useRoomGLTF(`${DARK_BASE}/Dark_First.glb`);
  const baked = useBakedMaterials(materials);
  const videoTexture = useVideoTexture("/videos/devwork.mp4", { muted: true, loop: true, start: true });
  return (
    <group dispose={null}>
      <mesh geometry={nodes.Mac_Screen.geometry} position={[-0.861, 0.815, 0.684]} rotation={[0, 0.523, 0]}>
        <meshBasicMaterial map={videoTexture} color="#f6f6f6" toneMapped={false} />
      </mesh>
      <mesh geometry={nodes.Computer_Screen.geometry} position={[-0.302, 0.955, 0.647]} rotation={[0, -0.053, 0]}>
        <meshBasicMaterial map={videoTexture} color="#f6f6f6" toneMapped={false} />
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
  const { nodes, materials } = useRoomGLTF(`${DARK_BASE}/Dark_Second.glb`);
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
  const { nodes, materials } = useRoomGLTF(`${DARK_BASE}/Dark_Third.glb`);
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
  const { nodes, materials } = useRoomGLTF(`${DARK_BASE}/Dark_Fourth.glb`);
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

// クリックするとサイト内の該当セクションへスクロールするヒットボックス。
// ホバー中は透明な「Anim」メッシュをふわっと拡大表示してフィードバックを返す。
const RoomHitbox = ({
  geometry,
  animGeometry,
  position,
  rotation,
  sectionId,
}: {
  geometry: Mesh["geometry"];
  animGeometry: Mesh["geometry"];
  position: [number, number, number];
  rotation?: [number, number, number];
  sectionId: string;
}) => {
  const animRef = useRef<Mesh>(null);

  const handleEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    if (animRef.current) {
      gsap.to(animRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "power2.out" });
    }
  };

  const handleLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    if (animRef.current) {
      gsap.to(animRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "power2.out" });
    }
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <mesh
        geometry={geometry}
        visible={false}
        position={position}
        rotation={rotation}
        onPointerOver={handleEnter}
        onPointerOut={handleLeave}
        onClick={handleClick}
      />
      <mesh ref={animRef} geometry={animGeometry} position={position} rotation={rotation} scale={0}>
        <meshBasicMaterial color="#ffbf7a" transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </>
  );
};

// モデルに専用ジオメトリがない対象（時計など）用。球形のプリミティブでヒットボックスを作る。
const PrimitiveHitbox = ({
  position,
  radius = 0.16,
  sectionId,
  color,
}: {
  position: [number, number, number];
  radius?: number;
  sectionId: string;
  color?: string;
}) => {
  const animRef = useRef<Mesh>(null);

  const handleEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    if (animRef.current) {
      gsap.to(animRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "power2.out" });
    }
  };

  const handleLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    if (animRef.current) {
      gsap.to(animRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "power2.out" });
    }
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <mesh visible={false} position={position} onPointerOver={handleEnter} onPointerOut={handleLeave} onClick={handleClick}>
        <sphereGeometry args={[radius, 16, 16]} />
      </mesh>
      <mesh ref={animRef} position={position} scale={0}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial color={color ?? "#ffbf7a"} transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </>
  );
};

const DarkHitboxes = () => {
  const { nodes } = useRoomGLTF(`${DARK_BASE}/Dark_Targets.glb`);
  return (
    <>
      <RoomHitbox
        geometry={nodes.About_Hitbox.geometry}
        animGeometry={nodes.About_Hitbox_Anim.geometry}
        position={[0.679, 1.571, -1.368]}
        sectionId="services-section"
      />
      <RoomHitbox
        geometry={nodes.Dev_Work_Hitbox.geometry}
        animGeometry={nodes.Dev_Work_Hitbox_Anim.geometry}
        position={[-0.457, 0.597, 1.021]}
        sectionId="projects-section"
      />
      <PrimitiveHitbox position={[-1.2, 1.6, -1.45]} radius={0.25} sectionId="about-section" />
      {/* 壁の写真まわりにある装飾アクセントと同じ雰囲気で、時計まわりにも散りばめる */}
      <Sparkles
        count={20}
        scale={[0.8, 0.8, 0.4]}
        size={5}
        speed={0.25}
        color="#f09e46"
        opacity={1}
        position={[-1.2, 1.6, -1.45]}
      />
    </>
  );
};

// 部屋一式をまとめたグループ — マウスの横位置に応じてゆるやかに回転追従する
const RoomGroup = ({ children }: { children: React.ReactNode }) => {
  const groupRef = useRef<Group>(null);
  const rotTarget = useRef(0);

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0.85, y: 0.85, z: 0.85 },
      { x: 1, y: 1, z: 1, duration: 1.6, ease: "power3.out", delay: 0.2 },
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
      <Suspense fallback={null}>{children}</Suspense>
    </group>
  );
};

// 固定カメラ — Dark Roomの家具一式の中心を注視する。
const RoomCamera = () => {
  const camRef = useRef<PerspectiveCameraType>(null);

  useEffect(() => {
    camRef.current?.lookAt(DARK_CENTER);
  }, []);

  const initialPosition = useMemo(() => DARK_CAMERA_POS.toArray() as [number, number, number], []);

  return <PerspectiveCamera ref={camRef} makeDefault fov={32} position={initialPosition} />;
};

const HeroSceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <RoomCamera />
      <RoomGroup>
        <DarkFirst />
        <DarkSecond />
        <DarkThird />
        <DarkFourth />
        <DarkHitboxes />
      </RoomGroup>
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
    <div className="absolute inset-0 z-10" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <HeroSceneContent />
      </Canvas>
    </div>
  );
};
