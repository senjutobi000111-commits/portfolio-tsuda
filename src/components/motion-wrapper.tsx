"use client";
import { LazyMotion, domAnimation, m, AnimatePresence } from "motion/react";

export const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
  <LazyMotion features={domAnimation}>{children}</LazyMotion>
);

export { m, AnimatePresence };
