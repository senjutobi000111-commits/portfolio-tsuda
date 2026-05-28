import { atom } from "jotai";
import { ProjectType } from "@/lib/types";

export const currentProjectAtom = atom<ProjectType | null>(null);
export const isProjectOpenAtom = atom(false);
