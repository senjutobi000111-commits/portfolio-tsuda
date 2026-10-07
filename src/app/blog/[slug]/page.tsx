import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { BLOG_POSTS, getPost, formatDate } from "@/lib/content/blog";
import { ArticleContent } from "@/components/blog/article-content";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "記事が見つかりません | ManekiCat_29" };
  return {
    title: `${post.title} | ManekiCat_29`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="bg-off-w text-darkest min-h-dvh px-6 py-14 sm:px-10 sm:py-20">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <Link
          href="/blog"
          className="text-darkest/60 hover:text-acc-yellow font-jp inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          ブログ一覧に戻る
        </Link>

        <header className="flex flex-col gap-4 border-b border-black/10 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border-acc-yellow/40 bg-acc-yellow/10 text-acc-yellow rounded-full border px-3 py-0.5 text-[0.65rem] font-bold tracking-[0.12em]">
              {post.category}
            </span>
            <time className="text-darkest/45 font-jp text-xs">
              {formatDate(post.date)}
            </time>
          </div>
          <h1 className="font-serif-jp text-2xl leading-snug font-bold tracking-wide sm:text-3xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="border-acc-yellow/25 bg-acc-yellow/5 text-acc-yellow/90 font-jp rounded-full border px-2 py-0.5 text-[10px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <ArticleContent content={post.content} />

        <footer className="mt-6 border-t border-black/10 pt-6">
          <Link
            href="/blog"
            className="text-acc-yellow font-jp inline-flex items-center gap-1.5 text-sm font-bold transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="size-4" />
            ブログ一覧に戻る
          </Link>
        </footer>
      </article>
    </main>
  );
}
