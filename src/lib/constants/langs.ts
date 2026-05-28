import { BrazilFlag } from "@/components/svgs/BrazilFlag";
import { USFlag } from "@/components/svgs/USFlag";
import { SiTanstack } from "@/components/svgs/SiTanstack";

import {
  SiGo,
  SiGnubash,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiFastify,
  SiPrisma,
  SiPostgresql,
  SiNodedotjs,
  SiPython,
  SiNextdotjs,
  SiGit,
  SiVite,
  SiQiita,
  SiZenn,
  IconType,
} from "@icons-pack/react-simple-icons";

export const TECH_LANGUAGES = {
  go: { src: SiGo, alt: "Go logo" },
  bash: { src: SiGnubash, alt: "Bash logo" },
  react: { src: SiReact, alt: "React logo" },
  tailwind: { src: SiTailwindcss, alt: "Tailwind logo" },
  ts: { src: SiTypescript, alt: "TypeScript logo" },
  js: { src: SiJavascript, alt: "JavaScript logo" },
  fastify: { src: SiFastify, alt: "Fastify logo" },
  prisma: { src: SiPrisma, alt: "Prisma logo" },
  postgresql: { src: SiPostgresql, alt: "PostgreSQL logo" },
  node: { src: SiNodedotjs, alt: "Node logo" },
  python: { src: SiPython, alt: "Python logo" },
  nextjs: { src: SiNextdotjs, alt: "NextJS logo" },
  git: { src: SiGit, alt: "Git logo" },
  tanstack: {
    src: SiTanstack as unknown as IconType,
    alt: "Tanstack logo",
  },
  vite: {
    src: SiVite,
    alt: "Vite logo",
  },
  qiita: {
    src: SiQiita,
    alt: "Qiita logo",
  },
  zenn: {
    src: SiZenn,
    alt: "Zenn logo",
  },
} as const;

export type ImagesData = typeof TECH_LANGUAGES;
export type TechCode = keyof typeof TECH_LANGUAGES;

export const INTL_LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    flag: USFlag,
    nativeName: "English",
  },
  pt: {
    code: "pt",
    name: "Português",
    flag: BrazilFlag,
    nativeName: "Português",
  },
} as const;

export type LanguageCode = keyof typeof INTL_LANGUAGES;
