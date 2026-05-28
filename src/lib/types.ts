import { IconType } from "@icons-pack/react-simple-icons";
import { HTMLMotionProps } from "motion/react";
import { JSX, SVGProps } from "react";

export type Socials<T extends string> = {
  [K in T]: {
    href: string;
    icon: IconType | ((props: SVGProps<SVGSVGElement>) => JSX.Element);
    text: string;
  };
};

export type ProjectType = {
  title: string;
  description: { en: string; pt: string };
  body: { en: string[]; pt: string[] };
  repoLink: string;
  repoImage: string;
  languages: {
    src: IconType;
    alt: string;
  }[];
  status: string;
};

export type CustomMotion<T extends "div" | "span" | "p" | "button"> = Omit<
  HTMLMotionProps<T>,
  "ref" | "className"
>;
