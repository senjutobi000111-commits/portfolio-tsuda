import {
  LINK_DARK,
  LINK_LIGHT,
  ICON_DARK,
  ICON_LIGHT,
  MOBILE_NAVBAR_DARK,
  MOBILE_NAVBAR_LIGHT,
} from "@/lib/constants/navbar";

export type NavbarStyles = ReturnType<typeof useNavbarStyles>;

export default function useNavbarStyles(
  hoveredLink: string,
  activeSection: string,
  isOverlapping: boolean,
) {
  const isHovered = hoveredLink === activeSection;
  const link = isOverlapping ? LINK_DARK : LINK_LIGHT;
  const icon = isOverlapping ? ICON_DARK : ICON_LIGHT;
  const mobileNavbar = isOverlapping ? MOBILE_NAVBAR_DARK : MOBILE_NAVBAR_LIGHT;
  const mobileLink = isOverlapping ? LINK_LIGHT : LINK_DARK;

  const underline = isOverlapping
    ? isHovered
      ? "bg-black/50"
      : "bg-black"
    : isHovered
      ? "bg-off-w/60"
      : "bg-off-w";

  return { link, icon, mobileNavbar, mobileLink, underline };
}
