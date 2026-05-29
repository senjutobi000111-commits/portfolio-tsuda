"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProjectImageProps {
  images: string[];
  alt: string;
  quality?: number;
  intervalMs?: number;
}

// 複数画像を数秒ごとにクロスフェードで自動切り替えするスライドショー。
// 親要素を relative + overflow-hidden にして使用する（fill で重ねる）。
export const ProjectImage = ({
  images,
  alt,
  quality = 65,
  intervalMs = 3500,
}: ProjectImageProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          quality={quality}
          loading="lazy"
          decoding="async"
          className={cn(
            "object-cover object-left transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </>
  );
};
