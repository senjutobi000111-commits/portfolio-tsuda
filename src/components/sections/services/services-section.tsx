"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Layout,
  ShoppingBag,
  Server,
  Sparkles,
  Smartphone,
  ShieldCheck,
  ServerCog,
  Bot,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { m } from "@/components/motion-wrapper";
import { ShineBorder } from "@/components/ui/shine-border";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { GrainField } from "@/components/sections/services/grain/grain-field";
import { GrainHeading } from "@/components/sections/services/grain/grain-heading";
import { GrainIcon } from "@/components/sections/services/grain/grain-icon";

interface Service {
  id: string;
  Icon: LucideIcon;
  /** Single kanji that stands in for the service, rendered as grains. */
  kanji: string;
  title: string;
  desc: string;
  tags: string[];
}

const SERVICES: Service[] = [
  {
    id: "web",
    Icon: Layout,
    kanji: "制",
    title: "Webサイト・コーポレートサイト制作",
    desc: "ブランドサイト・採用サイト・メディアまで。WordPress や HTML / CSS / JS でのコーディング制作に対応します。",
    tags: ["WordPress", "HTML", "CSS", "JavaScript"],
  },
  {
    id: "ec",
    Icon: ShoppingBag,
    kanji: "商",
    title: "EC サイト構築",
    desc: "海外ブランドの日本向けストアやセレクトショップまで。プラットフォームは目的・規模に応じて選定します。",
    tags: ["Shopify", "楽天市場", "MakeShop", "Bubble"],
  },
  {
    id: "system",
    Icon: Server,
    kanji: "系",
    title: "業務システム・SaaS 開発",
    desc: "従業員管理・工数管理・LINE×サーバーレスなど、要件定義から運用までフルスタックで一貫対応します。",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "AWS"],
  },
  {
    id: "ai",
    Icon: Sparkles,
    kanji: "知",
    title: "AI 業務自動化",
    desc: "メール処理・問い合わせ応答・データ集計など、ノーコード × AI で業務フローを一気通貫で自動化します。",
    tags: ["n8n", "Dify", "OpenAI", "Notion", "Slack"],
  },
  {
    id: "app",
    Icon: Smartphone,
    kanji: "機",
    title: "モバイル・デスクトップアプリ開発",
    desc: "Mac / Windows のデスクトップアプリやモバイルアプリ、ゲームなど、目的に応じた構成で開発します。",
    tags: ["Electron", "Unity", "React"],
  },
  {
    id: "qa",
    Icon: ShieldCheck,
    kanji: "質",
    title: "QA・テスト設計",
    desc: "結合テスト・UAT 設計・E2E 自動化など、客観的根拠で品質を担保する仕組みづくりに対応します。",
    tags: ["Playwright", "Python", "openpyxl"],
  },
  {
    id: "migration",
    Icon: ServerCog,
    kanji: "移",
    title: "サーバー移行・インフラ刷新",
    desc: "WordPress・EC・業務システムを別サーバーへ。DNS・DB・メール・SSL含め、ダウンタイムを抑えて移行します。",
    tags: ["AWS", "VPS", "WordPress", "MySQL", "DNS"],
  },
  {
    id: "scraping",
    Icon: Bot,
    kanji: "集",
    title: "スクレイピング・データ収集",
    desc: "公開情報の収集・整形・蓄積を自動化。動的サイトはヘッドレスブラウザで取得し、CSV／DBへ整理します。",
    tags: ["Python", "Playwright", "Node.js", "BeautifulSoup"],
  },
];

const GRID_CONTAINER = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const CARD_ITEM = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
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

const ServiceCard = ({
  service,
  reduced,
}: {
  service: Service;
  reduced: boolean;
}) => {
  const { Icon, kanji, title, desc, tags } = service;
  const [hovered, setHovered] = useState(false);

  return (
    <m.article
      variants={CARD_ITEM}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative flex flex-col gap-2.5 overflow-hidden rounded-xl border border-black/15 bg-off-w/80 p-4 shadow-sm transition-all duration-300",
        "hover:border-acc-yellow hover:-translate-y-1 hover:shadow-md",
      )}
    >
      <div className="border-acc-yellow/40 bg-acc-yellow/10 text-acc-yellow group-hover:bg-acc-yellow/15 flex size-10 items-center justify-center overflow-hidden rounded-lg border transition-colors">
        {reduced ? (
          <Icon className="size-5" />
        ) : (
          <GrainIcon text={kanji} hovered={hovered} className="size-full" />
        )}
      </div>
      <h3 className="text-darkest font-serif-jp text-base leading-snug font-semibold">
        {title}
      </h3>
      <p className="text-darkest/65 font-serif-jp text-xs leading-relaxed sm:text-sm">
        {desc}
      </p>
      <div className="mt-auto flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border-acc-yellow/30 bg-acc-yellow/5 text-acc-yellow font-jp rounded-full border px-2 py-0.5 text-[10px] font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <ShineBorder
        className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        shineColor={["#ffbf7a", "#d58430", "#ffbf7a"]}
        borderWidth={1}
        duration={6}
      />
    </m.article>
  );
};

export default function ServicesSection() {
  const reduced = usePrefersReducedMotion();

  const scrollToContact = () => {
    const el = document.getElementById("contact-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="services-section"
      className={cn(
        "bg-off-w relative flex min-h-dvh flex-col items-center justify-center overflow-clip",
        "scroll-mt-[var(--navbar-height)] px-6 py-10 sm:px-12 sm:py-12",
      )}
    >
      {/* 背景 — 対応領域を象徴する「粒」の場。カーソルで掃ける */}
      {!reduced && (
        <GrainField className="pointer-events-none absolute inset-0 z-0 size-full" />
      )}

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8">
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
              SERVICES
            </span>
            <span className="to-acc-yellow/60 h-px w-8 bg-gradient-to-l from-transparent" />
          </div>

          {reduced ? (
            <h2 className="text-darkest font-serif-jp text-2xl font-semibold tracking-wide sm:text-3xl lg:text-4xl">
              対応領域
            </h2>
          ) : (
            <>
              <h2 className="sr-only">対応領域</h2>
              <GrainHeading
                text="対応領域"
                className="block h-14 w-[15rem] sm:h-16 sm:w-[19rem] lg:h-20 lg:w-[23rem]"
              />
            </>
          )}

          <p className="text-darkest/65 font-serif-jp max-w-xl text-xs leading-relaxed text-pretty sm:text-sm">
            Webサイト制作・EC構築から、業務システム開発・AI業務自動化・QAまで、
            これまで幅広い領域に対応してきました。
          </p>
        </m.header>

        {/* サービスグリッド */}
        <m.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} reduced={reduced} />
          ))}
        </m.div>

        {/* CTA */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-3"
        >
          <button
            type="button"
            onClick={scrollToContact}
            className={cn(
              "bg-acc-yellow-2 text-darkest hover:bg-acc-yellow-3 group flex cursor-pointer items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium shadow-md transition-all duration-200",
              "sm:hover:-translate-y-1 sm:text-base",
            )}
          >
            お気軽にご相談ください
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="text-darkest/50 font-serif-jp text-xs tracking-[0.2em]">
            ご相談・お見積もりは無料です
          </p>
        </m.div>
      </div>
    </section>
  );
}
