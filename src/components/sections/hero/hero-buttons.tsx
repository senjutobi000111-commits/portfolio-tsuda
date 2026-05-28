"use client";

import type { CustomMotion } from "@/lib/types";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import { MessagesSquare, MousePointerClick } from "lucide-react";
import { m } from "@/components/motion-wrapper";

const BUTTONS_MOTION: CustomMotion<"div"> = {
  initial: { y: 15, opacity: 0, filter: "blur(4px)" },
  animate: { y: 0, opacity: 1, filter: "blur(0px)" },
  viewport: { once: true },
  transition: {
    duration: 0.6,
    delay: 2.8,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
};

const buttonBaseClasses =
  "flex cursor-pointer items-center rounded-sm p-2 sm:p-3 text-base shrink-0 lg:text-lg transition-all duration-150 shadow-md font-medium";

export const HeroButtons = () => {
  const t = useTranslations("Hero");

  const handleClick = (section: string) => {
    const sectionEl = document.getElementById(section);
    if (!sectionEl) return;
    sectionEl?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <m.div {...BUTTONS_MOTION} className={cn("flex flex-wrap", "gap-4 sm:gap-6")}>
      <button
        onClick={() => handleClick("about-section")}
        className={cn(
          buttonBaseClasses,
          "bg-acc-yellow-2 text-darkest",
          "hover:bg-acc-yellow-3 sm:hover:-translate-y-1",
        )}
      >
        {t("begin")}
        <MousePointerClick className="ml-2 size-5 sm:size-7" />
      </button>

      <button
        onClick={() => handleClick("contact-section")}
        className={cn(
          buttonBaseClasses,
          "text-off-w/60 border-off-w/45 bg-off-w/05 border",
          "hover:border-acc-red/60 hover:bg-acc-red/10 hover:text-acc-red sm:hover:-translate-y-1",
        )}
      >
        {t("contact")}

        <MessagesSquare className="ml-2 size-5 sm:size-7" />
      </button>
    </m.div>
  );
};
