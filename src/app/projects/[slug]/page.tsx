import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PROJECTS } from "@/lib/content/projects";
import { ProjectTemplate } from "@/components/sections/projects/project-template";
import { ProjectsBackground } from "@/components/sections/projects/projects-background";

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

const BackLink = () => (
  <Link
    href="/#projects-section"
    className="text-off-w/60 hover:text-acc-yellow font-jp inline-flex items-center gap-1.5 text-sm transition-colors"
  >
    <ArrowLeft className="size-4" />
    制作実績一覧に戻る
  </Link>
);

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="bg-darkest relative min-h-dvh overflow-clip px-6 py-14 sm:px-10 sm:py-20">
      <ProjectsBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8">
        <BackLink />
        <ProjectTemplate slug={slug} />
        <BackLink />
      </div>
    </main>
  );
}
