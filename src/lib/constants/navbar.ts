import { cn } from "@/lib/utils";

// Shared transition for all navbar interactive elements
const NAVBAR_TRANSITION = "transition-colors duration-150 ease-in-out";

// Links
export const LINK_DARK = cn(
  "text-black before:text-black border-black hover:border-black/50 hover:text-black/50 hover:before:text-black/50",
  NAVBAR_TRANSITION,
);

export const LINK_LIGHT = cn(
  "text-off-w before:text-off-w border-off-w hover:border-off-w/60 hover:text-off-w/60 hover:before:text-off-w/60",
  NAVBAR_TRANSITION,
);

// Icons
export const ICON_DARK = cn("text-black hover:text-black/50", NAVBAR_TRANSITION);

export const ICON_LIGHT = cn("text-off-w hover:text-off-w/60", NAVBAR_TRANSITION);

// Mobile Navbar backgrounds
export const MOBILE_NAVBAR_DARK = "bg-black";
export const MOBILE_NAVBAR_LIGHT = "bg-off-w";

// Navigation link definitions
export const NAV_LINKS = [
  { name: "about", id: "about-section" },
  { name: "projects", id: "projects-section" },
  { name: "contact", id: "contact-section" },
] as const;

export type NavbarLinks = typeof NAV_LINKS;
