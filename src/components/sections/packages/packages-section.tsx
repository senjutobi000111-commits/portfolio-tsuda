"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { m } from "@/components/motion-wrapper";
import { BackgroundInkPaint } from "@/components/sections/about/background-ink-paint";
import { ArrowUpRight } from "lucide-react";

interface Package {
  id: string;
  title: string;
  category: string;
  image: string;
  value: string;
  href: string;
}

// パッケージ（ランサーズの公開パッケージから取り込み。作成済みバナーをそのまま使用・価格は非表示）。
const PACKAGES: Package[] = [
  {
    id: "makeshop-ec",
    title: "MakeShop EC 構築・改修",
    category: "EC・ネットショップ",
    image: "/images/packages/makeshop-ec.webp",
    value:
      "デザイン×開発×AI を一人で一貫。売れる動線設計から SEO 対策まで、MakeShop 仕様に準拠した高品質な EC サイトを構築します。",
    href: "https://www.lancers.jp/menu/detail/1344958",
  },
];

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

const PackageCard = ({ title, category, image, value, href }: Package) => {
  return (
    <m.article
      variants={CARD_ITEM}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-black/10 shadow-sm transition-all duration-300",
        "bg-off-w/85 backdrop-blur-sm hover:-translate-y-1 hover:shadow-md",
      )}
    >
      {/* バナー（作成済みをそのまま） */}
      <Link href={href} target="_blank" rel="noopener noreferrer" className="relative block aspect-[16/9] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="text-off-w absolute top-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[0.65rem] font-bold tracking-[0.15em] backdrop-blur-sm">
          {category}
        </span>
      </Link>

      {/* 内容 */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-darkest font-serif-jp text-lg font-bold tracking-wide sm:text-xl">
          {title}
        </h3>
        <p className="text-darkest/70 font-jp flex-1 text-sm leading-relaxed text-pretty">
          {value}
        </p>
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-acc-yellow hover:text-acc-yellow-2 mt-1 inline-flex items-center gap-1 self-start text-sm font-bold tracking-wide transition-colors"
        >
          詳細・ご相談
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </m.article>
  );
};

export default function PackagesSection() {
  return (
    <section
      id="packages-section"
      className={cn(
        "bg-off-w relative flex min-h-dvh scroll-mt-[var(--navbar-height)] flex-col items-center justify-center overflow-clip px-6 py-20 sm:px-12",
      )}
    >
      <BackgroundInkPaint />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-12">
        {/* 見出し */}
        <m.header
          initial={{ opacity: 0, y: -16, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, amount: 0.6 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="flex items-center gap-3">
            <span className="to-acc-yellow/60 h-px w-8 bg-gradient-to-r from-transparent" />
            <span className="text-acc-yellow font-jp text-xs tracking-[0.4em]">
              PACKAGES
            </span>
            <span className="to-acc-yellow/60 h-px w-8 bg-gradient-to-l from-transparent" />
          </div>

          <h2 className="text-darkest font-serif-jp text-3xl font-semibold tracking-wide sm:text-4xl lg:text-5xl">
            サービスパッケージ
          </h2>

          <p className="text-darkest/65 font-serif-jp max-w-xl text-sm leading-relaxed text-pretty sm:text-base">
            目的に合わせて選べる制作パッケージです。ご相談・お見積りは無料。
            まずはお気軽にお問い合わせください。
          </p>
        </m.header>

        {/* カード */}
        <m.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} {...pkg} />
          ))}
        </m.div>
      </div>
    </section>
  );
}
