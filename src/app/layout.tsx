import type { Metadata } from "next";

import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Crimson_Pro, Noto_Sans_JP, Noto_Serif_JP, Unbounded } from "next/font/google";

import JotaiProvider from "@/components/jotai-provider";
import { Toaster } from "@/components/ui/sonner";
import { MotionWrapper } from "@/components/motion-wrapper";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "津田 和明 | Portfolio",
  description:
    "Web開発を中心に5年間、さまざまなプロジェクトに携わってきました。近年はAI開発にも注力しています。津田 和明のポートフォリオサイトです。",
};

const crimson = Crimson_Pro({
  preload: true,
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

const jp = Noto_Sans_JP({
  preload: true,
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-jp",
  display: "swap",
});

const serifJp = Noto_Serif_JP({
  preload: true,
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif-jp",
  display: "swap",
});

const unbounded = Unbounded({
  preload: true,
  variable: "--font-unbounded",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <meta property="og:url" content="https://kazyel.dev/" />
      <meta property="og:type" content="site" />
      <meta property="og:title" content="津田 和明 | Portfolio" />
      <meta
        property="og:description"
        content="Meu portfólio pessoal para mostraro ao mundo meus projetos e a minha jornada como desenvolvedor,
          com design limpo e ilustrado com elementos da cultura oriental."
      />

      <meta property="og:image" content="https://www.kazyel.dev/images/og.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://kazyel.dev/" />
      <meta name="twitter:title" content="site" />
      <meta
        name="twitter:description"
        content="Meu portfólio pessoal para mostraro ao mundo meus projetos e a minha jornada como desenvolvedor,
          com design limpo e ilustrado com elementos da cultura oriental."
      />
      <meta name="twitter:image" content="https://kazyel.dev/images/og.png" />

      <body
        className={`${jp.variable} ${unbounded.variable} ${crimson.variable} ${serifJp.variable} font-serif-jp bg-darkest antialiased`}
      >
        <JotaiProvider>
          <MotionWrapper>
            <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
          </MotionWrapper>
        </JotaiProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
