"use client";

import { currentProjectAtom, isProjectOpenAtom } from "@/lib/store/projects";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";

import { ProjectsBackground } from "@/components/sections/projects/projects-background";
import { ProjectView } from "@/components/sections/projects/project-view";
import { ProjectsList } from "@/components/sections/projects/projects-list";

export default function ProjectsSection() {
  const currentProject = useAtomValue(currentProjectAtom);
  const isProjectOpen = useAtomValue(isProjectOpenAtom);

  return (
    <section
      id="projects-section"
      className={cn(
        "relative flex flex-col items-center justify-center overflow-clip bg-darkest",
        "max-lg:scroll-mt-[var(--navbar-height)]",
      )}
    >
      <div
        className={cn(
          "z-10 flex min-h-dvh max-w-[1500px] items-center justify-center px-8 py-16",
          "sm:px-12 sm:py-24 xl:py-36",
        )}
      >
        {isProjectOpen ? <ProjectView {...currentProject!} /> : <ProjectsList />}
      </div>

      <ProjectsBackground />
    </section>
  );
}
