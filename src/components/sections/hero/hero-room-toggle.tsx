"use client";

import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRoomStore } from "./hero-room-store";

export const HeroRoomToggle = () => {
  const { isDarkRoom, isTransitioning, toggleRoom } = useRoomStore();

  return (
    <button
      type="button"
      onClick={toggleRoom}
      disabled={isTransitioning}
      aria-label={isDarkRoom ? "Light Roomに切り替える" : "Dark Roomに切り替える"}
      className={cn(
        "border-off-w/15 bg-darkest/40 text-off-w/80 hover:text-off-w hover:border-off-w/40",
        "absolute right-8 bottom-24 z-30 flex size-11 items-center justify-center rounded-full border backdrop-blur-sm transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "lg:right-24",
      )}
    >
      {isDarkRoom ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
