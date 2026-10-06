import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { cn } from "@/lib/utils";
import { PROJECTS } from "@/lib/content/projects";
import Navbar from "@/components/navbar/navbar";
import { ProjectTemplate } from "@/components/sections/projects/project-template";
import { ProjectsBackground } from "@/components/sections/projects/projects-background";
import {
  ProjectBackLink,
  ProjectFloatingBackButton,
} from "@/components/sections/projects/project-back-link";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "プロジェクトが見つかりません | 萩原 崇志" };
  return {
    title: `${project.title} | 萩原 崇志`,
    description: project.description.en,
    openGraph: {
      title: project.title,
      description: project.description.en,
      type: "website",
      images: [{ url: project.repoImage }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main>
      <Navbar />

      <section
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
          <div className="flex flex-col justify-center">
            <ProjectBackLink />
            <ProjectTemplate slug={slug} />
            <ProjectFloatingBackButton />
          </div>
        </div>

        <ProjectsBackground />
      </section>
    </main>
  );
}
