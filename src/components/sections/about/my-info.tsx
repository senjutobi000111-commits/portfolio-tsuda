"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { TextAnimate } from "@/components/ui/text-animate";

const AboutText = () => {
  const t = useTranslations("About");

  return (
    <div
      className={cn(
        "relative z-10 max-w-[clamp(400px,64vw,900px)]",
        "xl:border-l-2 xl:border-black xl:pl-6",
      )}
    >
      {["description-1", "description-2", "description-3", "description-4", "description-5"].map((key) => (
        <TextAnimate
          key={key}
          className={cn(
            "font-serif-jp mb-3 text-pretty text-black last:mb-0",
            "text-xs leading-6 sm:text-sm lg:text-base",
          )}
          by="text"
          animation="slideRight"
          delay={0.2}
          duration={0.6}
          once
        >
          {t(key)}
        </TextAnimate>
      ))}
    </div>
  );
};

export const MyInfo = () => {
  const t = useTranslations("About");

  return (
    <div
      className={cn(
        "z-10 flex flex-col items-start justify-center gap-6 px-4",
        "xl:mt-12 xl:px-16",
      )}
    >
      <TextAnimate
        className={cn(
          "font-serif-jp text-darkest text-3xl font-extrabold tracking-tight",
          "sm:text-4xl",
        )}
        as="h2"
        by="line"
        animation="slideDown"
        delay={0}
        once
      >
        {t("title")}
      </TextAnimate>

      <AboutText />
    </div>
  );
};
