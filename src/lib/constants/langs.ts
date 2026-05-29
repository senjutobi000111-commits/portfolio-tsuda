import { BrazilFlag } from "@/components/svgs/BrazilFlag";
import { USFlag } from "@/components/svgs/USFlag";
import { SiTanstack } from "@/components/svgs/SiTanstack";
import { SiPlaywright } from "@/components/svgs/SiPlaywright";
import { SiBubble } from "@/components/svgs/SiBubble";

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
  SiWordpress,
  SiPhp,
  SiMysql,
  SiShopify,
  SiHtml5,
  SiCss3,
  SiElectron,
  SiUnity,
  SiRubyonrails,
  SiN8n,
  SiNotion,
  SiSlack,
  SiOpenai,
  SiAmazonwebservices,
  SiLine,
  SiAwslambda,
  SiAmazondynamodb,
  SiAmazons3,
  SiAwsamplify,
  SiLeaflet,
  SiOpenstreetmap,
  SiNetlify,
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
  wordpress: {
    src: SiWordpress,
    alt: "WordPress logo",
  },
  php: {
    src: SiPhp,
    alt: "PHP logo",
  },
  mysql: {
    src: SiMysql,
    alt: "MySQL logo",
  },
  shopify: {
    src: SiShopify,
    alt: "Shopify logo",
  },
  html: {
    src: SiHtml5,
    alt: "HTML5 logo",
  },
  css: {
    src: SiCss3,
    alt: "CSS3 logo",
  },
  electron: {
    src: SiElectron,
    alt: "Electron logo",
  },
  unity: {
    src: SiUnity,
    alt: "Unity logo",
  },
  rubyonrails: {
    src: SiRubyonrails,
    alt: "Ruby on Rails logo",
  },
  playwright: {
    src: SiPlaywright as unknown as IconType,
    alt: "Playwright logo",
  },
  n8n: {
    src: SiN8n,
    alt: "n8n logo",
  },
  notion: {
    src: SiNotion,
    alt: "Notion logo",
  },
  slack: {
    src: SiSlack,
    alt: "Slack logo",
  },
  openai: {
    src: SiOpenai,
    alt: "OpenAI logo",
  },
  aws: {
    src: SiAmazonwebservices,
    alt: "AWS logo",
  },
  line: {
    src: SiLine,
    alt: "LINE logo",
  },
  lambda: {
    src: SiAwslambda,
    alt: "AWS Lambda logo",
  },
  dynamodb: {
    src: SiAmazondynamodb,
    alt: "Amazon DynamoDB logo",
  },
  s3: {
    src: SiAmazons3,
    alt: "Amazon S3 logo",
  },
  amplify: {
    src: SiAwsamplify,
    alt: "AWS Amplify logo",
  },
  leaflet: {
    src: SiLeaflet,
    alt: "Leaflet logo",
  },
  openstreetmap: {
    src: SiOpenstreetmap,
    alt: "OpenStreetMap logo",
  },
  netlify: {
    src: SiNetlify,
    alt: "Netlify logo",
  },
  bubble: {
    src: SiBubble as unknown as IconType,
    alt: "Bubble logo",
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
