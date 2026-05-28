"use client";

import type { CustomMotion } from "@/lib/types";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import { INTL_LANGUAGES, LanguageCode } from "@/lib/constants/langs";
import useOnClickOutside from "@/lib/hooks/use-on-click-outside";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { International } from "@/components/svgs/International";
import { m, AnimatePresence } from "@/components/motion-wrapper";
import { useOnScroll } from "@/lib/hooks/use-on-scroll";

interface LanguageSwitcherProps {
  currentStyles: {
    link: string;
    icon: string;
    mobileNavbar: string;
    mobileLink: string;
  };
}

const SWITCHER_ANIMATION: CustomMotion<"div"> = {
  initial: {
    opacity: 0,
    y: -5,
  },
  animate: {
    opacity: 1,
    y: 5,
  },
  exit: {
    opacity: 0,
    y: 0,
  },
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.3,
  },
} as const;

export default function LanguageSwitcher({ currentStyles }: LanguageSwitcherProps) {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = useLocale() as LanguageCode;
  const router = useRouter();

  useOnScroll(() => setIsSwitcherOpen(false));
  useOnClickOutside(dropdownRef, [setIsSwitcherOpen], isSwitcherOpen);

  const updateCookies = (newLocale: LanguageCode) => {
    document.cookie = `NEXT_LOCALE=${encodeURIComponent(newLocale)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax; Secure`;
  };

  const changeLocale = (newLocale: LanguageCode) => {
    setIsSwitcherOpen(false);
    startTransition(async () => {
      updateCookies(newLocale);
      router.refresh();
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <m.button
            onClick={() => setIsSwitcherOpen((prev) => !prev)}
            className={cn(
              "flex items-center disabled:cursor-not-allowed disabled:opacity-50",
              currentStyles.icon,
            )}
            type="button"
            aria-haspopup="menu"
            aria-label="Change language"
            aria-expanded={isSwitcherOpen}
            disabled={isPending}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isPending ? (
                <m.div
                  key="loader"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Loader2 className={cn("size-6 animate-spin", currentStyles.icon)} />
                </m.div>
              ) : (
                <m.div
                  key="intl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <International
                    className={cn("size-6 cursor-pointer", currentStyles.icon)}
                  />
                </m.div>
              )}
            </AnimatePresence>
          </m.button>
        </TooltipTrigger>

        <TooltipContent className="text-off-w text-[0.65rem] font-semibold tracking-tight">
          i18n
        </TooltipContent>
      </Tooltip>

      {/* Language Switcher Menu */}
      <AnimatePresence>
        {isSwitcherOpen && (
          <m.div
            {...SWITCHER_ANIMATION}
            className={cn(
              "absolute top-12 -right-10 z-50 flex min-w-max flex-col gap-y-3 rounded-sm border border-black/20 p-4 shadow-lg lg:right-0",
              currentStyles.mobileNavbar,
            )}
            role="menu"
            aria-label="Language selection menu"
          >
            {/* Available Languages */}
            {Object.entries(INTL_LANGUAGES).map(([code, language]) => {
              const LanguageFlag = language.flag;
              const isActive = code === currentLocale;

              return (
                <m.button
                  key={code}
                  onClick={() => changeLocale(code as LanguageCode)}
                  className={cn(
                    "flex cursor-pointer text-sm font-medium",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    currentStyles.mobileLink,
                  )}
                  role="menuitem"
                  aria-current={isActive ? "true" : "false"}
                  disabled={isPending || isActive}
                >
                  <div className="flex items-center gap-2">
                    <LanguageFlag className="size-5 flex-shrink-0" />

                    <span>{language.nativeName}</span>
                  </div>
                </m.button>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
