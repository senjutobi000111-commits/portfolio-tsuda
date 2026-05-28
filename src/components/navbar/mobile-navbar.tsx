import type { RefObject } from "react";
import type { NavbarStyles } from "@/lib/hooks/use-navbar-styles";
import type { NavbarLinks } from "@/lib/constants/navbar";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { MOBILE_NAV_MOTION, NAV_BUTTON_ANIMATION } from "./navbar";

import { m } from "@/components/motion-wrapper";
import { Menu, X } from "lucide-react";
import { AnimatePresence } from "motion/react";

type MobileNavbarProps = {
  dropdownRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  links: NavbarLinks;
  currentStyles: NavbarStyles;
  toggle: () => void;
  handleSectionTravel: (linkId: string) => void;
};

export const MobileNavbar = ({
  currentStyles,
  dropdownRef,
  links,
  isOpen,
  toggle,
  handleSectionTravel,
}: MobileNavbarProps) => {
  const t = useTranslations("Navbar");

  return (
    <div ref={dropdownRef} className="relative flex items-center md:hidden">
      <m.button
        {...NAV_BUTTON_ANIMATION}
        type="button"
        onClick={toggle}
        aria-controls="mobile-menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Toggle mobile menu"
        className="cursor-pointer"
      >
        <m.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? (
            <X className={cn("size-7", currentStyles.icon)} />
          ) : (
            <Menu className={cn("size-7", currentStyles.icon)} />
          )}
        </m.div>
      </m.button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            {...MOBILE_NAV_MOTION}
            id="mobile-menu"
            role="menu"
            aria-label="Mobile navigation menu"
            className={cn(
              "absolute top-12 right-0 flex min-w-max flex-col gap-y-5 rounded-md border border-black/25 p-4 shadow-md",
              currentStyles.mobileNavbar,
            )}
          >
            {links.map((link) => (
              <a
                key={link.id}
                role="menuitem"
                className={cn(
                  "cursor-pointer self-start text-sm font-medium",
                  currentStyles.mobileLink,
                )}
                onClick={() => handleSectionTravel(link.id)}
              >
                {t(link.name)}
              </a>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
