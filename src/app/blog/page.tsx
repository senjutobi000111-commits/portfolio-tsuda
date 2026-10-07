import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BLOG_POSTS } from "@/lib/content/blog";
import { BlogCard } from "@/components/blog/blog-card";

export const metadata: Metadata = {
  title: "ブログ | ManekiCat_29",
  description:
    "EC 構築・業務システム・AI 業務自動化・アプリ開発などについて、実案件をもとにした記事を発信しています。",
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="bg-off-w text-darkest min-h-dvh px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="text-darkest/60 hover:text-acc-yellow font-jp inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" />
            ホームに戻る
          </Link>

          <header className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-3">
              <span className="to-acc-yellow/60 h-px w-8 bg-gradient-to-r from-transparent" />
              <span className="text-acc-yellow font-jp text-xs tracking-[0.4em]">
                BLOG
              </span>
              <span className="to-acc-yellow/60 h-px w-8 bg-gradient-to-l from-transparent" />
            </div>
            <h1 className="font-serif-jp text-2xl font-semibold tracking-wide sm:text-3xl lg:text-4xl">
              ブログ
            </h1>
            <p className="text-darkest/65 font-serif-jp max-w-xl text-xs leading-relaxed text-pretty sm:text-sm">
              EC 構築・業務システム・AI 業務自動化・アプリ開発などについて、
              実案件をもとにした知見を発信しています。
            </p>
          </header>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
