import { SVGProps } from "react";

// Bubble (bubble.io) — 公式単色アイコンが無いため、ノーコードを象徴する立方体で表現。
export function SiBubble(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" fillOpacity="0.55" d="M12 2 21.5 7 12 12 2.5 7z" />
      <path fill="currentColor" fillOpacity="0.85" d="M2.5 7 12 12v10L2.5 17z" />
      <path fill="currentColor" d="M21.5 7 12 12v10l9.5-5z" />
    </svg>
  );
}
