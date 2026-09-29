"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { m } from "@/components/motion-wrapper";
import { BackgroundInkPaint } from "@/components/sections/about/background-ink-paint";
import { BlogCard } from "@/components/blog/blog-card";
import { BLOG_POSTS } from "@/lib/content/blog";
import { ArrowRight } from "lucide-react";

const GRID_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const CARD_ITEM = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export default function BlogSection() {
  const latest = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);

  return (
    <section
      id="blog-section"
      className={cn(
        "bg-off-w relative flex min-h-dvh scroll-mt-[var(--navbar-height)] flex-col items-center justify-center overflow-clip px-6 py-16 sm:px-12 sm:py-20",
      )}
    >
      <BackgroundInkPaint />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8">
        <m.header
          initial={{ opacity: 0, y: -16, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, amount: 0.6 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="flex items-center gap-3">
            <span className="to-acc-yellow/60 h-px w-8 bg-gradient-to-r from-transparent" />
            <span className="text-acc-yellow font-jp text-xs tracking-[0.4em]">BLOG</span>
            <span className="to-acc-yellow/60 h-px w-8 bg-gradient-to-l from-transparent" />
          </div>
          <h2 className="text-darkest font-serif-jp text-2xl font-semibold tracking-wide sm:text-3xl lg:text-4xl">
            ブログ
          </h2>
          <p className="text-darkest/65 font-serif-jp max-w-xl text-xs leading-relaxed text-pretty sm:text-sm">
            EC 構築・業務システム・AI 業務自動化・アプリ開発などについて、
            実案件をもとにした知見を発信しています。
          </p>
        </m.header>

        <m.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {latest.map((post) => (
            <m.div key={post.slug} variants={CARD_ITEM}>
              <BlogCard post={post} />
            </m.div>
          ))}
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
            href="/blog"
            className={cn(
              "bg-acc-yellow-2 text-darkest hover:bg-acc-yellow-3 group flex cursor-pointer items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium shadow-md transition-all duration-200",
              "sm:hover:-translate-y-1 sm:text-base",
            )}
          >
            記事一覧へ
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </m.div>
      </div>
    </section>
  );
}
