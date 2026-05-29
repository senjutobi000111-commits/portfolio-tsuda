import type { ProjectType } from "@/lib/types";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { ProjectLink } from "@/components/sections/projects/project-link";
import { ProjectImage } from "@/components/sections/projects/project-image";
import { TextAnimate } from "@/components/ui/text-animate";

type LanguageCode = "en" | "pt";

export const ProjectTemplate = ({ ...props }: ProjectType) => {
  const t = useTranslations("Projects");
  const currentLocale = useLocale() as LanguageCode;

  const hasLink = !!props.repoLink && props.repoLink !== "#";
  const images = props.images?.length ? props.images : [props.repoImage];
  const mediaClasses = cn(
    "group border-acc-red-dark/40 relative col-span-1 mx-auto aspect-square w-[clamp(300px,_50vw,_400px)] self-center overflow-hidden border-2",
    "lg:w-[clamp(350px,_30vw,_400px)] lg:self-start",
    hasLink && "cursor-pointer",
  );
  const media = (
    <>
      <ProjectImage images={images} alt={props.title} quality={50} />
      <div
        className={cn(
          "absolute bottom-0 left-0 z-10 h-full w-full bg-gradient-to-t from-black/75 to-transparent opacity-100 transition-all duration-250",
          "group-hover:translate-y-16",
        )}
      />
    </>
  );

  return (
    <section className="z-20 flex w-full flex-col items-center">
      <div className="mt-6 mb-4 flex flex-col gap-4 self-start rounded">
        <TextAnimate
          className={cn(
            "text-off-w font-serif-jp text-3xl font-semibold tracking-wide",
            "sm:text-4xl",
          )}
          as="h1"
          by="line"
          once
        >
          {props.title}
        </TextAnimate>

        <TextAnimate
          className="text-off-w/70 font-serif-jp max-w-[800px] text-sm font-light text-balance sm:text-base"
          animation="slideUp"
          as="h2"
          by="line"
          once
        >
          {props.description[currentLocale]}
        </TextAnimate>

        {hasLink && (
          <ProjectLink
            className={cn(
              "text-acc-yellow-3 mb-4 text-sm font-medium sm:text-base",
              "hover:text-acc-yellow-2",
            )}
            title={t("view")}
            url={props.repoLink}
          />
        )}
      </div>

      <div
        className={cn(
          "flex w-full flex-col items-center justify-center xl:max-h-[700px]",
          "lg:grid lg:grid-cols-3 lg:gap-6",
        )}
      >
        <div
          className={cn(
            "col-span-2 mb-10 flex flex-col items-center justify-between gap-8",
            "xl:mb-0",
          )}
        >
          <div>
            {props.body[currentLocale].map((line, index) => (
              <TextAnimate
                key={index}
                className={cn(
                  "text-off-w/85 font-serif-jp mb-4 text-sm leading-7 text-pretty last:mb-0 last:pb-0 sm:text-base lg:text-lg",
                )}
                animation="slideLeft"
                delay={0.15}
                duration={0.1}
                by="line"
                as="p"
                once
              >
                {line}
              </TextAnimate>
            ))}
          </div>

          <div
            className={cn(
              "bg-off-w flex flex-wrap items-center justify-center gap-5 self-start p-4",
            )}
          >
            {props.languages.map((lang, index) => (
              <lang.src key={index} className="col-span-1 aspect-square size-12" />
            ))}
          </div>
        </div>

        {hasLink ? (
          <Link href={props.repoLink} target="_blank" className={mediaClasses}>
            {media}
          </Link>
        ) : (
          <div className={mediaClasses}>{media}</div>
        )}
      </div>
    </section>
  );
};
