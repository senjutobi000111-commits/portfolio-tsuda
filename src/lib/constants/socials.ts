import { SiGithub } from "@icons-pack/react-simple-icons";
import { SiLinkedin } from "@/components/svgs/SiLinkedIn";
import { Socials } from "@/lib/types";

export const SOCIAL_LINKS: Socials<"linkedIn" | "github"> = {
  github: {
    href: "https://www.github.com/Kazyel",
    icon: SiGithub,
    text: "GitHub",
  },
  linkedIn: {
    href: "https://www.linkedin.com/in/mateusmascarelo/",
    icon: SiLinkedin,
    text: "LinkedIn",
  },
} as const;
