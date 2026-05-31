import type { Metadata } from "next";

import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Crimson_Pro, Noto_Sans_JP, Noto_Serif_JP, Unbounded } from "next/font/google";

import JotaiProvider from "@/components/jotai-provider";
import { Toaster } from "@/components/ui/sonner";
import { MotionWrapper } from "@/components/motion-wrapper";

import "@/app/globals.css";

// i18n が cookies()/headers() を使うため全ルートを動的レンダリングに固定（静的生成での失敗を回避）
export const dynamic = "force-dynamic";

const siteUrl = "https://portfolio-tsuda.vercel.app";
const siteName = "津田 和明 | Portfolio";
const siteDescription =
  "Webエンジニアとして5年間、ECサイトの制作から業務システム・SaaS・AI業務自動化まで幅広く開発。津田 和明のポートフォリオサイト。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    siteName,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/og.png"],
  },
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
