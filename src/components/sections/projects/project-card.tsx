import type { ProjectType } from "@/lib/types";

import { cn } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { useLocale } from "next-intl";
import { isProjectOpenAtom, currentProjectAtom } from "@/lib/store/projects";
import { LanguageCode } from "@/lib/constants/langs";

import Image from "next/image";
import { ProjectTag } from "./project-tag";

export const ProjectCard = ({ ...props }: ProjectType) => {
  const currentLocale = useLocale() as LanguageCode;

  const setCurrentProject = useSetAtom(currentProjectAtom);
  const setIsProjectOpen = useSetAtom(isProjectOpenAtom);

  const openProject = () => {
    const projectsSection = document.querySelector("#projects-section");
    if (!projectsSection) return;
    projectsSection.scrollIntoView({ behavior: "instant" });

    setIsProjectOpen(true);
    setCurrentProject(props);
  };

  return (
    <article
      id="project-card"
      className="group border-acc-red-dark/40 relative grid aspect-square w-[clamp(325px,_40vw,_400px)] cursor-pointer grid-cols-1 overflow-hidden rounded-none border shadow-lg"
      onClick={openProject}
    >
      <ProjectTag status={props.status} />

      <figure className="relative col-span-full row-span-full flex aspect-square size-full overflow-hidden">
        <Image
          src={props.repoImage}
          alt={`${props.title}-image`}
          fill
          loading="lazy"
          decoding="async"
          quality={65}
          className="object-cover object-left"
        />
      </figure>

      <div className="z-20 col-span-full row-span-full flex flex-col gap-1.5 self-end rounded-lg p-7">
        <h3
          id="project-title"
          className={cn(
            "text-acc-red-dark text-2xl font-bold tracking-tight transition-all duration-200",
            "md:text-3xl",
          )}
        >
          {props.title}
        </h3>

        <p
          id="project-text"
          className={cn(
            "text-off-w text-xs leading-5 tracking-wide text-pretty transition-all duration-200",
            "md:text-sm",
          )}
        >
          {props.description[currentLocale]}
        </p>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 z-10 h-full w-full bg-gradient-to-t from-black to-transparent opacity-100 transition-all duration-250",
          "group-hover:translate-y-16",
        )}
      />
    </article>
  );
};
