import type { ReactNode } from "react";

// **強調** をインラインで処理
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={i} className="text-darkest font-bold">
          {m[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "p"; text: string };

// 行ベースの簡易マークダウン（## / ### 見出し・- 箇条書き・段落・**強調**）
function parse(content: string): Block[] {
  const lines = content.replace(/\r/g, "").split("\n");
  const out: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length) {
      out.push({ type: "p", text: para.join(" ") });
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      out.push({ type: "ul", items: [...list] });
      list = [];
    }
  };

  for (const line of lines) {
    const t = line.trim();
    if (t === "") {
      flushPara();
      flushList();
    } else if (t.startsWith("## ")) {
      flushPara();
      flushList();
      out.push({ type: "h2", text: t.slice(3) });
    } else if (t.startsWith("### ")) {
      flushPara();
      flushList();
      out.push({ type: "h3", text: t.slice(4) });
    } else if (t.startsWith("- ")) {
      flushPara();
      list.push(t.slice(2));
    } else {
      flushList();
      para.push(t);
    }
  }
  flushPara();
  flushList();
  return out;
}

export function ArticleContent({ content }: { content: string }) {
  const blocks = parse(content);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return (
            <h2
              key={i}
              className="text-darkest font-serif-jp border-acc-yellow mt-5 border-l-4 pl-3 text-lg font-bold tracking-wide sm:text-xl"
            >
              {inline(b.text)}
            </h2>
          );
        }
        if (b.type === "h3") {
          return (
            <h3 key={i} className="text-darkest font-serif-jp mt-3 text-base font-bold sm:text-lg">
              {inline(b.text)}
            </h3>
          );
        }
        if (b.type === "ul") {
          return (
            <ul
              key={i}
              className="text-darkest/80 font-jp list-disc space-y-1.5 pl-5 text-sm leading-relaxed"
            >
              {b.items.map((it, j) => (
                <li key={j}>{inline(it)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={i}
            className="text-darkest/80 font-jp text-sm leading-relaxed text-pretty"
          >
            {inline(b.text)}
          </p>
        );
      })}
    </div>
  );
}
