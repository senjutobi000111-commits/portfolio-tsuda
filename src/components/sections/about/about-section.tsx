import type { CSSProperties } from "react";
import type { IconType } from "@icons-pack/react-simple-icons";

import { TECH_LANGUAGES } from "@/lib/constants/langs";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Marquee } from "@/components/ui/marquee";
import { MyInfo } from "@/components/sections/about/my-info";
import { BackgroundInkPaint } from "@/components/sections/about/background-ink-paint";
import Link from "next/link";

const TECH_STACK = [
  { name: "React", src: TECH_LANGUAGES.react.src },
  { name: "TypeScript", src: TECH_LANGUAGES.ts.src },
  { name: "Next.js", src: TECH_LANGUAGES.nextjs.src },
  { name: "Tailwind", src: TECH_LANGUAGES.tailwind.src },
  { name: "Python", src: TECH_LANGUAGES.python.src },
  { name: "Go", src: TECH_LANGUAGES.go.src },
  { name: "NodeJS", src: TECH_LANGUAGES.node.src },
  { name: "PostgreSQL", src: TECH_LANGUAGES.postgresql.src },
  { name: "Git", src: TECH_LANGUAGES.git.src },
  { name: "Vite", src: TECH_LANGUAGES.vite.src },
] as const;

// Qiita・Zenn は外部リンク付きで別枠表示
const BLOG_LINKS = [
  {
    name: "Qiita",
    src: TECH_LANGUAGES.qiita.src,
    href: "https://qiita.com/zywx21301",
    color: "#55C500",
  },
  {
    name: "Zenn",
    src: TECH_LANGUAGES.zenn.src,
    href: "https://zenn.dev/",
    color: "#3EA8FF",
  },
] as const;

interface LanguageCardProps {
  src: IconType;
  name: string;
}

const LanguageCard = ({ src: Icon, name }: LanguageCardProps) => {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <figure
          className={cn(
            "relative ml-3 w-[4.5rem] cursor-pointer border border-black/15 p-3 shadow-sm",
            "bg-off-w hover:bg-[#e5d8cc] lg:w-[5rem] lg:border-2 lg:border-black",
          )}
        >
          <Icon className="size-full" />
        </figure>
      </TooltipTrigger>
      <TooltipContent className="text-off-w text-xs font-extrabold">
        {name}
      </TooltipContent>
    </Tooltip>
  );
};

const BlogLinkCard = ({
  src: Icon,
  name,
  href,
  color,
}: (typeof BLOG_LINKS)[number]) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group cursor-pointer"
      style={{ "--brand": color } as CSSProperties}
      aria-label={`${name}の投稿を見る`}
    >
      <span
        className={cn(
          "flex size-16 items-center justify-center border border-black/15 shadow-sm transition-all duration-200 lg:size-[4.5rem] lg:border-2 lg:border-black",
          "bg-off-w group-hover:-translate-y-1 group-hover:border-[var(--brand)] group-hover:shadow-md",
        )}
      >
        <Icon className="text-darkest/80 size-8 transition-colors duration-200 group-hover:text-[var(--brand)] lg:size-9" />
      </span>
    </Link>
  );
};

const TechStackMarquee = () => {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Tech stack marquee */}
      <div
        className={cn(
          "relative flex flex-row items-center justify-center overflow-hidden",
          "w-full lg:w-[800px] xl:w-[1000px]",
        )}
      >
        <Marquee pauseOnHover className="[--duration:15s]">
          {TECH_STACK.map((tech) => (
            <TooltipProvider key={tech.name}>
              <LanguageCard src={tech.src} name={tech.name} />
            </TooltipProvider>
          ))}
        </Marquee>

        {/* Fade gradients */}
        <div className="from-off-w pointer-events-none absolute inset-y-0 left-0 z-0 w-1/5 bg-gradient-to-r" />
        <div className="from-off-w pointer-events-none absolute inset-y-0 right-0 z-0 w-1/5 bg-gradient-to-l" />
      </div>

      {/* Blog links — Qiita & Zenn */}
      <div className="flex flex-col items-center gap-6">
        {/* 左右対称の罫線で囲んだ見出し */}
        <div className="flex w-60 items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-black/25" />
          <span className="font-jp text-darkest/55 text-xs tracking-[0.3em] whitespace-nowrap">
            記事を読む
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-black/25" />
        </div>

        <div className="flex items-start gap-10">
          {BLOG_LINKS.map((blog) => (
            <BlogLinkCard key={blog.name} {...blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AboutSection() {
  return (
    <section
      id="about-section"
      className={cn(
        "bg-off-w relative flex min-h-dvh scroll-mt-[var(--navbar-height)] flex-col items-center justify-center gap-y-8 overflow-clip px-6 pt-16 pb-18",
        "md:scroll-mt-0 xl:gap-y-16 xl:p-0",
      )}
    >
      <MyInfo />
      <BackgroundInkPaint />
      <TechStackMarquee />
    </section>
  );
}
