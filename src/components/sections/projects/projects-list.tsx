import { useTranslations } from "next-intl";
import { PROJECTS } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

import { TextAnimate } from "@/components/ui/text-animate";
import { ProjectCard } from "@/components/sections/projects/project-card";
import { m } from "@/components/motion-wrapper";

export const ProjectsList = () => {
  const t = useTranslations("Projects");

  return (
    <m.div
      key="main-projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center gap-12"
    >
      <div className="flex w-full flex-col items-start px-12">
        <TextAnimate
          className={cn(
            "text-off-w font-serif-jp text-3xl font-semibold tracking-wide",
            "sm:text-4xl lg:text-5xl",
          )}
          once
        >
          {t("title")}
        </TextAnimate>

        <TextAnimate
          className={cn(
            "text-off-w/70 font-serif-jp pt-3 text-sm font-light text-balance",
            "sm:text-base",
          )}
          once
          by="line"
          as="h2"
        >
          {t("description")}
        </TextAnimate>
      </div>

      <div
        className={cn(
          "flex w-full flex-col flex-wrap items-center justify-center gap-6",
          "md:flex-row lg:gap-10",
        )}
      >
        {PROJECTS.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </m.div>
  );
};
