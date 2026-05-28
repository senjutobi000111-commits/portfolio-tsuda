import { useTranslations } from "next-intl";
import { PROJECTS } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

import { TextAnimate } from "@/components/ui/text-animate";
import { ProjectLink } from "@/components/sections/projects/project-link";
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
      <div
        className={cn(
          "flex w-full flex-col items-start justify-between px-12",
          "lg:flex-row lg:items-end",
        )}
      >
        <div>
          <TextAnimate
            className={cn(
              "text-acc-red-dark text-6xl font-extrabold tracking-tight",
              "md:text-7xl",
            )}
            once
          >
            {t("title")}
          </TextAnimate>

          <TextAnimate
            className={cn("text-acc-yellow-3 pt-4 text-xl font-light text-balance")}
            once
            by="line"
            as="h2"
          >
            {t("description")}
          </TextAnimate>
        </div>

        <ProjectLink
          title={t("check")}
          url="https://github.com/Kazyel"
          className={cn(
            "mt-4 self-start text-base font-light",
            "sm:text-lg lg:mt-0 lg:self-end",
          )}
        />
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
