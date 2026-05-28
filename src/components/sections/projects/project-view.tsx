import type { ProjectType } from "@/lib/types";

import { useSetAtom } from "jotai";
import { currentProjectAtom, isProjectOpenAtom } from "@/lib/store/projects";
import { cn } from "@/lib/utils";

import { m } from "@/components/motion-wrapper";
import { ProjectTemplate } from "@/components/sections/projects/project-template";
import { useTranslations } from "next-intl";
import { Undo2 } from "lucide-react";

interface ProjectBackButtonProps {
  onClick: () => void;
}

const ProjectBackButton = ({ onClick }: ProjectBackButtonProps) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={cn(
        "bg-off-w sticky right-5 bottom-5 z-20 translate-x-4.5 cursor-pointer self-end rounded-full border border-black p-2 shadow-sm",
        "-my-[32px] transition-colors duration-200 hover:bg-[#bfafa4]",
        "lg:hidden",
      )}
    >
      <Undo2 className={cn("size-7", "sm:max-lg:size-9")} />
    </m.div>
  );
};

const backButtonIconClasses = cn(
  "size-5 transition-all duration-200",
  "group-hover:text-off-w group-hover:-translate-x-1",
);

const backButtonTextClasses = cn(
  "transition-all duration-200",
  "group-hover:text-off-w",
);

export const ProjectView = ({ ...props }: ProjectType) => {
  const t = useTranslations("Projects");

  const setIsProjectOpen = useSetAtom(isProjectOpenAtom);
  const setCurrentProject = useSetAtom(currentProjectAtom);

  const closeProject = () => {
    const projectsSection = document.querySelector("#projects-section");
    if (!projectsSection) return;
    projectsSection.scrollIntoView({ behavior: "instant" });

    setIsProjectOpen(false);
    setCurrentProject(null);
  };

  return (
    <m.div
      key="project-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-center"
    >
      <button
        className={cn(
          "group text-off-w/90 z-20 mb-2 flex cursor-pointer items-center gap-1 text-sm font-semibold tracking-tight italic",
          "sm:text-base",
        )}
        onClick={closeProject}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={backButtonIconClasses}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>

        <span className={backButtonTextClasses}>{t("back")}</span>
      </button>

      <ProjectTemplate {...props} />

      <ProjectBackButton onClick={closeProject} />
    </m.div>
  );
};
