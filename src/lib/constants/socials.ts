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
    href: "https://www.linkedin.com/in/祟志-萩原-a17b28436/",
    icon: SiLinkedin,
    text: "LinkedIn",
  },
} as const;
