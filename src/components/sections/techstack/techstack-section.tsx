"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import styles from "./techstack-section.module.css";

interface TechLayer {
  ja: string;
  en: string;
  items: string[];
}

// 制作実績（projects.json）の languages フィールドに実際に登場する
// 技術スタックを全件集計し、カテゴリ分けしたもの。
const TECH_LAYERS: TechLayer[] = [
  {
    ja: "フロントエンド",
    en: "FRONTEND",
    items: [
      "JavaScript",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "HTML",
      "CSS",
      "Vite",
      "TanStack",
      "Framer",
    ],
  },
  {
    ja: "バックエンド",
    en: "BACKEND",
    items: ["Python", "PHP", "Laravel", "Ruby on Rails", "C#", ".NET", "Prisma"],
  },
  {
    ja: "CMS・EC",
    en: "CMS / EC",
    items: ["WordPress", "Shopify", "MakeShop", "STUDIO", "FutureShop"],
  },
  {
    ja: "データベース",
    en: "DATABASE",
    items: ["MySQL", "PostgreSQL", "Database", "DynamoDB"],
  },
  {
    ja: "クラウド・インフラ",
    en: "CLOUD",
    items: ["AWS", "AWS Amplify", "AWS Lambda", "Amazon S3", "Firebase"],
  },
  {
    ja: "AI・自動化",
    en: "AI AUTOMATION",
    items: ["OpenAI", "n8n", "Notion", "Slack", "Playwright", "LINE"],
  },
  {
    ja: "モバイル・その他",
    en: "MOBILE / OTHER",
    items: ["Flutter", "Expo", "Leaflet", "OpenStreetMap"],
  },
];

const AUTO_INTERVAL_MS = 2600;

const pad2 = (n: number) => String(n).padStart(2, "0");

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
};

export default function TechStackSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  // 初回スクロールインの一度きりの検知（しきい値0.25）
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2.6秒ごとの自動巡回（表示中・非ホバー・reduced-motionでない場合のみ）
  useEffect(() => {
    if (!visible || hovering || reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % TECH_LAYERS.length);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [visible, hovering, reducedMotion]);

  const totalTools = TECH_LAYERS.reduce((sum, l) => sum + l.items.length, 0);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          対応<em>技術・ツール</em>
        </h2>

        <div
          ref={rootRef}
          className={cn(styles.stackviz, entered && styles.in)}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
        >
          <div className={styles.svScene} aria-hidden="true">
            <div className={styles.svStack}>
              {TECH_LAYERS.map((layer, i) => (
                <div
                  key={layer.en}
                  className={cn(styles.svPlate, i === active && styles.on)}
                  style={{ "--z": i } as CSSProperties}
                  onPointerEnter={() => setActive(i)}
                >
                  <span className={styles.svPlateNo}>{pad2(i + 1)}</span>
                  <span className={styles.svPlateEn}>{layer.en}</span>
                  <span className={styles.svCore} style={{ "--z": i } as CSSProperties} />
                </div>
              ))}
            </div>

            <div className={styles.svTotal}>
              <b>{totalTools}</b>
              <span>TOOLS / {TECH_LAYERS.length} LAYERS</span>
            </div>
          </div>

          <ol className={styles.svList}>
            {TECH_LAYERS.map((layer, i) => (
              <li
                key={layer.en}
                className={cn(styles.svRow, i === active && styles.on)}
                style={{ "--i": i } as CSSProperties}
                tabIndex={0}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className={styles.svNo}>{pad2(i + 1)}</span>
                <div>
                  <h3>
                    {layer.ja} <small>{layer.en}</small>
                  </h3>
                  <div className={styles.svChips}>
                    {layer.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
