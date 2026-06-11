"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectLightboxProps {
  images: string[];
  alt: string;
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export const ProjectLightbox = ({
  images,
  alt,
  open,
  initialIndex = 0,
  onClose,
}: ProjectLightboxProps) => {
  const [index, setIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  // キーボード操作と body スクロールロック
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight")
        setIndex((i) => (i + 1) % images.length);
      else if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, images.length, onClose]);

  // モバイル：横スワイプで前後に移動
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) setIndex((i) => (i - 1 + images.length) % images.length);
      else setIndex((i) => (i + 1) % images.length);
    }
    touchStartX.current = null;
  };

  if (!mounted) return null;
  const multi = images.length > 1;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* 暗幕 */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* 閉じる */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="border-off-w/25 text-off-w/80 hover:text-off-w absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full border bg-black/30 transition-colors hover:bg-black/50 sm:top-6 sm:right-6"
            aria-label="閉じる"
          >
            <X className="size-5" />
          </button>

          {/* 前へ */}
          {multi && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => (i - 1 + images.length) % images.length);
              }}
              className={cn(
                "absolute left-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border bg-black/0 sm:left-6",
                "border-off-w/0 text-off-w/40 transition-all hover:border-off-w/25 hover:bg-black/40 hover:text-off-w/95",
              )}
              aria-label="前の画像"
            >
              <ChevronLeft className="size-7" />
            </button>
          )}

          {/* 次へ */}
          {multi && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => (i + 1) % images.length);
              }}
              className={cn(
                "absolute right-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border bg-black/0 sm:right-6",
                "border-off-w/0 text-off-w/40 transition-all hover:border-off-w/25 hover:bg-black/40 hover:text-off-w/95",
              )}
              aria-label="次の画像"
            >
              <ChevronRight className="size-7" />
            </button>
          )}

          {/* 画像 */}
          <motion.div
            key="lightbox-inner"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative z-10 flex max-h-[95vh] max-w-[95vw] items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="border-acc-yellow/40 overflow-hidden rounded-md border shadow-2xl"
              >
                <Image
                  src={images[index]}
                  alt={`${alt}${multi ? ` (${index + 1}/${images.length})` : ""}`}
                  width={1920}
                  height={1440}
                  className="block h-auto w-auto"
                  priority
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* カウンタ + ドット */}
          {multi && (
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2.5 sm:bottom-8">
              <div className="text-off-w/65 font-jp text-xs tracking-[0.25em]">
                {index + 1} / {images.length}
              </div>
              <div className="flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIndex(i);
                    }}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-200",
                      i === index
                        ? "bg-off-w w-6"
                        : "bg-off-w/35 hover:bg-off-w/70 w-1.5",
                    )}
                    aria-label={`画像 ${i + 1} を表示`}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
