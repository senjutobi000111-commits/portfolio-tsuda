"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Layout,
  ShoppingBag,
  Server,
  Sparkles,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { m } from "@/components/motion-wrapper";

interface Service {
  id: string;
  Icon: LucideIcon;
  title: string;
  desc: string;
  tags: string[];
}

const SERVICES: Service[] = [
  {
    id: "web",
    Icon: Layout,
    title: "Webサイト・コーポレートサイト制作",
    desc: "ブランドサイト・採用サイト・メディアまで。WordPress や HTML / CSS / JS でのコーディング制作に対応します。",
    tags: ["WordPress", "HTML", "CSS", "JavaScript"],
  },
  {
    id: "ec",
    Icon: ShoppingBag,
    title: "EC サイト構築",
    desc: "海外ブランドの日本向けストアやセレクトショップまで。プラットフォームは目的・規模に応じて選定します。",
    tags: ["Shopify", "楽天市場", "MakeShop", "Bubble"],
  },
  {
    id: "system",
    Icon: Server,
    title: "業務システム・SaaS 開発",
    desc: "従業員管理・工数管理・LINE×サーバーレスなど、要件定義から運用までフルスタックで一貫対応します。",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "AWS"],
  },
  {
    id: "ai",
    Icon: Sparkles,
    title: "AI 業務自動化",
    desc: "メール処理・問い合わせ応答・データ集計など、ノーコード × AI で業務フローを一気通貫で自動化します。",
    tags: ["n8n", "Dify", "OpenAI", "Notion", "Slack"],
  },
  {
    id: "app",
    Icon: Smartphone,
    title: "モバイル・デスクトップアプリ開発",
    desc: "Mac / Windows のデスクトップアプリやモバイルアプリ、ゲームなど、目的に応じた構成で開発します。",
    tags: ["Electron", "Unity", "React"],
  },
  {
    id: "qa",
    Icon: ShieldCheck,
    title: "QA・テスト設計",
    desc: "結合テスト・UAT 設計・E2E 自動化など、客観的根拠で品質を担保する仕組みづくりに対応します。",
    tags: ["Playwright", "Python", "openpyxl"],
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

const ServiceCard = ({ Icon, title, desc, tags }: Service) => {
  return (
    <m.article
      variants={CARD_ITEM}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-black/15 bg-off-w/80 p-6 shadow-sm transition-all duration-300",
        "hover:border-acc-yellow hover:-translate-y-1 hover:shadow-md",
      )}
    >
      <div className="border-acc-yellow/40 bg-acc-yellow/10 text-acc-yellow group-hover:bg-acc-yellow/15 flex size-12 items-center justify-center rounded-lg border transition-colors">
        <Icon className="size-6" />
      </div>
      <h3 className="text-darkest font-serif-jp text-lg leading-snug font-semibold">
        {title}
      </h3>
      <p className="text-darkest/65 font-serif-jp text-sm leading-relaxed">
        {desc}
      </p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border-acc-yellow/30 bg-acc-yellow/5 text-acc-yellow font-jp rounded-full border px-2.5 py-0.5 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </m.article>
  );
};

export default function ServicesSection() {
  const scrollToContact = () => {
    const el = document.getElementById("contact-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="services-section"
      className={cn(
        "bg-off-w relative flex flex-col items-center justify-center overflow-clip",
        "scroll-mt-[var(--navbar-height)] px-6 py-14 sm:px-12 sm:py-16",
      )}
    >
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 sm:gap-10">
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

          <h2 className="text-darkest font-serif-jp text-3xl font-semibold tracking-wide sm:text-4xl lg:text-5xl">
            対応領域
          </h2>

          <p className="text-darkest/65 font-serif-jp max-w-xl text-sm leading-relaxed text-pretty sm:text-base">
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
          className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} {...service} />
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
              "bg-acc-yellow-2 text-darkest hover:bg-acc-yellow-3 group flex cursor-pointer items-center gap-2 rounded-sm px-6 py-3 text-base font-medium shadow-md transition-all duration-200",
              "sm:hover:-translate-y-1 sm:text-lg",
            )}
          >
            お気軽にご相談ください
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="text-darkest/50 font-serif-jp text-xs tracking-[0.2em]">
            ご相談・お見積もりは無料です
          </p>
        </m.div>
      </div>
    </section>
  );
}
