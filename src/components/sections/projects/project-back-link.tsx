"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { m } from "@/components/motion-wrapper";

const backButtonIconClasses = cn(
  "size-5 transition-all duration-200",
  "group-hover:text-off-w group-hover:-translate-x-1",
);

const backButtonTextClasses = cn(
  "transition-all duration-200",
  "group-hover:text-off-w",
);

export const ProjectBackLink = () => {
  const t = useTranslations("Projects");

  return (
    <Link
      href="/#projects-section"
      className={cn(
        "group text-off-w/90 z-20 mb-2 flex cursor-pointer items-center gap-1 text-sm font-semibold tracking-tight italic",
        "sm:text-base",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={backButtonIconClasses}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
        />
      </svg>

      <span className={backButtonTextClasses}>{t("back")}</span>
    </Link>
  );
};

export const ProjectFloatingBackButton = () => {
  return (
    <Link href="/#projects-section" aria-label="back" className="lg:hidden">
      <m.div
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "bg-off-w sticky right-5 bottom-5 z-20 translate-x-4.5 cursor-pointer self-end rounded-full border border-black p-2 shadow-sm",
          "-my-[32px] transition-colors duration-200 hover:bg-[#bfafa4]",
        )}
      >
        <Undo2 className={cn("size-7", "sm:max-lg:size-9")} />
      </m.div>
    </Link>
  );
};
