"use client";

import type { CSSProperties } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { m } from "@/components/motion-wrapper";
import { ArrowRight } from "lucide-react";

interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  desc: string;
  iconSrc: string;
  brand: string;
}

// ※ value / href は仮置きです。実際の連絡先に差し替えてください。
const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    value: "your@email.com",
    href: "mailto:your@email.com",
    desc: "Slack でのやり取りにも対応",
    iconSrc: "/images/icons/gmail.svg",
    brand: "#EA4335",
  },
  {
    id: "chatwork",
    label: "Chatwork",
    value: "chatwork.com/...",
    href: "#",
    desc: "お気軽にメッセージください",
    iconSrc: "/images/icons/chatwork.svg",
    brand: "#F03748",
  },
  {
    id: "line",
    label: "LINE",
    value: "lin.ee/...",
    href: "#",
    desc: "公式 LINE からもご相談ください",
    iconSrc: "/images/icons/line.svg",
    brand: "#06C755",
  },
  {
    id: "x",
    label: "X",
    value: "@username",
    href: "#",
    desc: "最新の活動はこちら",
    iconSrc: "/images/icons/x.svg",
    brand: "#1f1a15",
  },
  {
    id: "youtube",
    label: "YouTube",
    value: "@channel",
    href: "#",
    desc: "制作物・配信はこちら",
    iconSrc: "/images/icons/youtube.svg",
    brand: "#FF0000",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "in/username",
    href: "#",
    desc: "経歴・お仕事のご相談",
    iconSrc: "/images/icons/linkedin.svg",
    brand: "#0A66C2",
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

const ContactCard = ({ label, value, href, desc, iconSrc, brand }: ContactChannel) => {
  return (
    <m.div variants={CARD_ITEM}>
      <Link
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noopener noreferrer"
        style={{ "--brand": brand } as CSSProperties}
        aria-label={`${label} で連絡する`}
        className={cn(
          "group relative flex items-center gap-4 rounded-xl border border-black/15 p-4 shadow-sm backdrop-blur-sm transition-all duration-300",
          "bg-off-w/80 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-md",
        )}
      >
        {/* アイコン — 本物のブランドロゴSVGをリンク参照 */}
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-black/15 bg-black/[0.03] transition-colors duration-300 group-hover:border-[var(--brand)]/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconSrc} alt={`${label} のロゴ`} className="size-6 object-contain" loading="lazy" />
        </span>

        {/* ラベル + 値 */}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-acc-yellow font-jp text-[0.65rem] font-bold tracking-[0.22em] uppercase">
            {label}
          </span>
          <span className="text-darkest font-serif-jp truncate text-sm sm:text-base">
            {value}
          </span>
          <span className="text-darkest/45 font-jp truncate text-xs">{desc}</span>
        </span>

        {/* 矢印 */}
        <span className="text-darkest/50 flex size-8 shrink-0 items-center justify-center rounded-full border border-black/20 transition-all duration-300 group-hover:border-[var(--brand)] group-hover:bg-[var(--brand)]/10 group-hover:text-[var(--brand)]">
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </m.div>
  );
};

export default function ContactSection() {
  return (
    <section
      id="contact-section"
      className={cn(
        "bg-off-w relative flex min-h-dvh flex-col items-center justify-center overflow-clip",
        "scroll-mt-[var(--navbar-height)] px-6 py-20 sm:px-12",
      )}
    >
      {/* 背景 — 霧の水墨山水（pro3）。生成りに馴染ませるため multiply で合成 */}
      <Image
        src="/images/pro3.png"
        alt=""
        width={626}
        height={403}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full opacity-90 mix-blend-multiply"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-12">
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
              CONTACT
            </span>
            <span className="to-acc-yellow/60 h-px w-8 bg-gradient-to-l from-transparent" />
          </div>

          <h2 className="text-darkest font-serif-jp text-3xl font-semibold tracking-wide sm:text-4xl lg:text-5xl">
            ご相談・お問い合わせ
          </h2>

          <p className="text-darkest/65 font-serif-jp max-w-xl text-sm leading-relaxed text-pretty sm:text-base">
            サイト制作・リニューアル・保守運用など、まずはお気軽にご相談ください。
            お返事はできるだけ早くお送りします。
          </p>
        </m.header>

        {/* 連絡チャネル — 3×2 グリッド */}
        <m.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {CONTACT_CHANNELS.map((channel) => (
            <ContactCard key={channel.id} {...channel} />
          ))}
        </m.div>

        {/* 締めの一文 */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-black/20" />
          <span className="text-darkest/45 font-serif-jp text-xs tracking-[0.25em]">
            ご連絡をお待ちしております
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-black/20" />
        </m.div>
      </div>
    </section>
  );
}
