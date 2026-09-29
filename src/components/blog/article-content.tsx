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

// 簡易マークダウン（## / ### 見出し・- 箇条書き・段落・**強調**）
export function ArticleContent({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\n+/);

  return (
    <div className="flex flex-col gap-5">
      {blocks.map((raw, i) => {
        const block = raw.trim();

        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-darkest font-serif-jp mt-4 border-l-4 border-acc-yellow pl-3 text-xl font-bold tracking-wide sm:text-2xl"
            >
              {inline(block.slice(3))}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="text-darkest font-serif-jp mt-2 text-lg font-bold">
              {inline(block.slice(4))}
            </h3>
          );
        }

        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul
              key={i}
              className="text-darkest/80 font-jp list-disc space-y-1.5 pl-5 text-sm leading-relaxed sm:text-base"
            >
              {lines.map((l, j) => (
                <li key={j}>{inline(l.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={i}
            className="text-darkest/80 font-jp text-sm leading-loose text-pretty sm:text-base"
          >
            {inline(block.replace(/\n/g, " "))}
          </p>
        );
      })}
    </div>
  );
}
