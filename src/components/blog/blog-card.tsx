import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate, type Article } from "@/lib/content/blog";
import { ArrowUpRight } from "lucide-react";

export const BlogCard = ({ post }: { post: Article }) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-black/10 bg-off-w/85 p-5 shadow-sm backdrop-blur-sm transition-all duration-300",
        "hover:border-acc-yellow hover:-translate-y-1 hover:shadow-md",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="border-acc-yellow/40 bg-acc-yellow/10 text-acc-yellow rounded-full border px-3 py-0.5 text-[0.65rem] font-bold tracking-[0.12em]">
          {post.category}
        </span>
        <time className="text-darkest/45 font-jp text-xs">
          {formatDate(post.date)}
        </time>
      </div>

      <h3 className="text-darkest font-serif-jp text-base leading-snug font-bold group-hover:text-acc-yellow sm:text-lg">
        {post.title}
      </h3>

      <p className="text-darkest/65 font-jp line-clamp-3 flex-1 text-xs leading-relaxed text-pretty sm:text-sm">
        {post.excerpt}
      </p>

      <span className="text-acc-yellow mt-1 inline-flex items-center gap-1 self-start text-xs font-bold tracking-wide">
        続きを読む
        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
};
