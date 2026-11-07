"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useVideoTexture, PerspectiveCamera } from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import gsap from "gsap";
import { MeshBasicMaterial, Vector3 } from "three";
import type { Group, Mesh, MeshStandardMaterial, PerspectiveCamera as PerspectiveCameraType } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { GLTFLoader } from "three-stdlib";

import { RoomStoreProvider, useRoomStore } from "./hero-room-store";
import { HeroRoomToggle } from "./hero-room-toggle";

// 兄のポートフォリオ (portfolio-twenty-six.vercel.app) で使われている
// Dark Room / Light Room の3Dモデル（本人の許可を得て使用）。
// Draco圧縮メッシュ + KTX2圧縮テクスチャで書き出されたファイルをそのまま読み込む。
const DARK_BASE = "/models/dark-room";
const LIGHT_BASE = "/models/light-room";

// 家具一式のおおよその中心点（各メッシュ座標から算出）。カメラの注視点に使う。
const DARK_CENTER = new Vector3(-0.14, 0.45, 0.7);
// Light_Third_Baked（床・壁をまとめたシェルメッシュ）のピボット位置を部屋の中心として使う。
const LIGHT_CENTER = new Vector3(24.79, -0.201, 0.173);
const DARK_CAMERA_POS = new Vector3(-5.343347927650611, 5.814755800622669, 6.742415043273456);
const LIGHT_CAMERA_POS = new Vector3(14.5, 11.54895655245577, 13.2042565605176);

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

const LightFirst = () => {
  const { nodes, materials } = useRoomGLTF(`${LIGHT_BASE}/Light_First.glb`);
  const baked = useBakedMaterials(materials);
  const videoTexture = useVideoTexture("/videos/devwork.mp4", { muted: true, loop: true, start: true });
  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.iPhone_Screen.geometry}
        material={baked["Computer scrreen"]}
        position={[23.994, 0.734, -1.338]}
        rotation={[0, -1.193, Math.PI / 2]}
      />
      <mesh geometry={nodes.Desktop_Screen.geometry} position={[24.377, 0.968, -1.548]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial map={videoTexture} color="#f6f6f6" toneMapped={false} />
      </mesh>
      <mesh
        geometry={nodes.Light_First_Baked.geometry}
        material={baked.REAL_first_Baked}
        position={[23.66, 1.452, -1.692]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

const LightSecond = () => {
  const { nodes, materials } = useRoomGLTF(`${LIGHT_BASE}/Light_Second.glb`);
  const baked = useBakedMaterials(materials);
  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.Light_Second_Baked.geometry}
        material={baked.actual_second_bro_Baked}
        position={[26.719, 1.498, 1.614]}
        rotation={[0, 0, -Math.PI / 2]}
      />
    </group>
  );
};

const LightThird = () => {
  const { nodes, materials } = useRoomGLTF(`${LIGHT_BASE}/Light_Third.glb`);
  const baked = useBakedMaterials(materials);
  return (
    <group dispose={null}>
      <mesh geometry={nodes.Light_Third_Baked.geometry} material={baked.REAL_third_Baked} position={[24.79, -0.201, 0.173]} />
    </group>
  );
};

const LightFourth = () => {
  const { nodes, materials } = useRoomGLTF(`${LIGHT_BASE}/Light_Fourth.glb`);
  const baked = useBakedMaterials(materials);
  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.Light_Fourth_Baked.geometry}
        material={baked.REAL_fourth_Baked}
        position={[26.632, -0.17, -1.134]}
        rotation={[Math.PI, 0, Math.PI]}
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

const DarkHitboxes = () => {
  const { nodes } = useRoomGLTF(`${DARK_BASE}/Dark_Targets.glb`);
  return (
    <>
      <RoomHitbox
        geometry={nodes.About_Hitbox.geometry}
        animGeometry={nodes.About_Hitbox_Anim.geometry}
        position={[0.679, 1.571, -1.368]}
        sectionId="about-section"
      />
      <RoomHitbox
        geometry={nodes.Dev_Work_Hitbox.geometry}
        animGeometry={nodes.Dev_Work_Hitbox_Anim.geometry}
        position={[-0.457, 0.597, 1.021]}
        sectionId="projects-section"
      />
    </>
  );
};

const LightHitboxes = () => {
  const { nodes } = useRoomGLTF(`${LIGHT_BASE}/Light_Targets.glb`);
  return (
    <RoomHitbox
      geometry={nodes.Design_Work_Hitbox.geometry}
      animGeometry={nodes.Design_Work_Hitbox_Anim.geometry}
      position={[24.434, 0.649, -1.105]}
      sectionId="projects-section"
    />
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

// Dark Room ⇄ Light Room のカメラ切り替え。
// 一旦ズームアウトしてから位置をスライドし、新しい部屋の中心を見てズームを戻す。
const RoomCamera = () => {
  const camRef = useRef<PerspectiveCameraType>(null);
  const { isDarkRoom, finishTransition } = useRoomStore();
  const isFirstRun = useRef(true);
  const finishTransitionRef = useRef(finishTransition);
  finishTransitionRef.current = finishTransition;

  useEffect(() => {
    const cam = camRef.current;
    if (!cam) return;
    const targetPos = isDarkRoom ? DARK_CAMERA_POS : LIGHT_CAMERA_POS;
    const targetCenter = isDarkRoom ? DARK_CENTER : LIGHT_CENTER;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      cam.lookAt(targetCenter);
      return;
    }

    const baseZoom = cam.zoom;
    const tl = gsap.timeline({
      onComplete: () => finishTransitionRef.current(),
    });
    tl.to(cam, {
      zoom: baseZoom * 0.82,
      duration: 0.3,
      ease: "power1.inOut",
      onUpdate: () => cam.updateProjectionMatrix(),
    })
      .to(cam.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 0.6,
        ease: "power1.inOut",
        onUpdate: () => cam.lookAt(targetCenter),
      })
      .to(cam, {
        zoom: baseZoom,
        duration: 0.3,
        ease: "power1.inOut",
        onUpdate: () => cam.updateProjectionMatrix(),
      });
  }, [isDarkRoom]);

  // positionはuseMemoで参照を固定する — 毎レンダリング新しい配列を渡すとGSAPによる
  // 位置アニメーションが再適用されて上書きされてしまうため。
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
        <LightFirst />
        <LightSecond />
        <LightThird />
        <LightFourth />
        <LightHitboxes />
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

// ファーストビューの3Dシーン — 兄のポートフォリオの実際のDark Room / Light Roomモデルを表示。
// prefers-reduced-motion では描画自体をスキップ。
export const Hero3DScene = () => {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return null;

  return (
    <RoomStoreProvider>
      <div className="absolute inset-0 z-10" aria-hidden="true">
        <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          <HeroSceneContent />
        </Canvas>
      </div>
      <HeroRoomToggle />
    </RoomStoreProvider>
  );
};
