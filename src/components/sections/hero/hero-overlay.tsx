"use client";

import { cn } from "@/lib/utils";
import { m } from "@/components/motion-wrapper";

const imageBaseClasses = "pointer-events-none absolute";

export const HeroOverlay = () => {
  return (
    <m.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
      className={cn(imageBaseClasses, "inset-0 z-20 bg-black")}
      aria-hidden="true"
    />
  );
};
