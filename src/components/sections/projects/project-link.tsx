"use client";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { TextAnimate } from "@/components/ui/text-animate";
import { m } from "@/components/motion-wrapper";

interface ProjectLinkProps {
  title: string;
  url: string;
  className?: string;
}

export const ProjectLink = ({ title, url, className }: ProjectLinkProps) => {
  return (
    <Link
      href={url}
      target="_blank"
      className={cn(
        "text-off-w/85 group flex w-fit cursor-pointer items-center gap-2 gap-x-1.5 transition-all duration-300",
        "hover:text-off-w",
        className,
      )}
    >
      <TextAnimate animation="slideUp" by="line" once>
        {title}
      </TextAnimate>

      <m.svg
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={cn(
          "size-4 -translate-y-[4px] text-inherit/75 transition-all duration-300",
          "group-hover:-translate-y-[5px] group-hover:text-inherit",
        )}
      >
        <path
          fillRule="evenodd"
          d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
          clipRule="evenodd"
        />
      </m.svg>
    </Link>
  );
};
