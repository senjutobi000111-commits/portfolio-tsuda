"use client";

import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";

// Dark Room / Light Room の切り替え状態。Canvas内外（カメラ・ヒットボックス・トグルボタン）で共有する。
interface RoomStore {
  isDarkRoom: boolean;
  isTransitioning: boolean;
  toggleRoom: () => void;
  finishTransition: () => void;
}

const RoomStoreContext = createContext<RoomStore | null>(null);

export const RoomStoreProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkRoom, setIsDarkRoom] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitioningRef = useRef(false);

  const toggleRoom = () => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    setIsTransitioning(true);
    setIsDarkRoom((prev) => !prev);
  };

  const finishTransition = () => {
    transitioningRef.current = false;
    setIsTransitioning(false);
  };

  return (
    <RoomStoreContext.Provider value={{ isDarkRoom, isTransitioning, toggleRoom, finishTransition }}>
      {children}
    </RoomStoreContext.Provider>
  );
};

export const useRoomStore = () => {
  const ctx = useContext(RoomStoreContext);
  if (!ctx) throw new Error("useRoomStore must be used within RoomStoreProvider");
  return ctx;
};
