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

const TECH_STACK = [
  { name: "WordPress", src: TECH_LANGUAGES.wordpress.src },
  { name: "PHP", src: TECH_LANGUAGES.php.src },
  { name: "MySQL", src: TECH_LANGUAGES.mysql.src },
  { name: "Shopify", src: TECH_LANGUAGES.shopify.src },
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
    </div>
  );
};

export default function AboutSection() {
  return (
    <section
      id="about-section"
      className={cn(
        "bg-off-w relative flex min-h-dvh scroll-mt-[var(--navbar-height)] flex-col items-center justify-center gap-y-8 overflow-clip px-6 pt-16 pb-18",
        "md:scroll-mt-0 xl:gap-y-10 xl:px-0 xl:py-16",
      )}
    >
      <MyInfo />
      <BackgroundInkPaint />
      <TechStackMarquee />
    </section>
  );
}
