import { SVGProps } from "react";

// MakeShop（GMOメイクショップ）— 公式単色アイコンが無いため、EC/ストアを象徴する店舗グリフで表現。
export function SiMakeShop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" fillOpacity="0.85" d="M3 3h18l1 5H2z" />
      <path fill="currentColor" d="M4 9h16v12h-6v-6h-4v6H4z" />
    </svg>
  );
}
