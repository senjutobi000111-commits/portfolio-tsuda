"use client";

import { cn } from "@/lib/utils";

import { m } from "@/components/motion-wrapper";
import { BackgroundInkPaint } from "@/components/sections/about/background-ink-paint";

export default function ContactSection() {
  return (
    <section
      id="contact-section"
      className={cn(
        "bg-off-w relative flex min-h-dvh flex-col items-center justify-center overflow-clip",
        "scroll-mt-[var(--navbar-height)] px-6 py-20 sm:px-12",
      )}
    >
      {/* 背景 — Aboutと同じ墨絵の情景で締めくくる */}
      <BackgroundInkPaint />

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
