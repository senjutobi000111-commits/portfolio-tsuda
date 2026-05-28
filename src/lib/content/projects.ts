import type { ProjectType } from "@/lib/types";

import projects from "@/lib/content/projects.json";
import { TECH_LANGUAGES, TechCode } from "@/lib/constants/langs";

const STATUS_ORDER: Record<string, number> = {
  Current: 0,
  Complete: 1,
  "On-hold": 2,
  Abandoned: 3,
};

export const PROJECTS: ProjectType[] = projects
  .map((project) => ({
    ...project,
    languages: project.languages.map(
      (lang) => TECH_LANGUAGES[lang as TechCode],
    ),
  }))
  .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
