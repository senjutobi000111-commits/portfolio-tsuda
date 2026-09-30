import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// 外部リンクは踏ませない（テキスト化）／画像は非表示。コード・表・見出し等を整形。
const components: Components = {
  h1: ({ children }) => (
    <h2 className="text-darkest font-serif-jp border-acc-yellow mt-5 border-l-4 pl-3 text-lg font-bold tracking-wide sm:text-xl">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="text-darkest font-serif-jp border-acc-yellow mt-5 border-l-4 pl-3 text-lg font-bold tracking-wide sm:text-xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-darkest font-serif-jp mt-3 text-base font-bold sm:text-lg">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-darkest font-serif-jp mt-2 text-sm font-bold sm:text-base">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-darkest/80 font-jp text-sm leading-relaxed text-pretty">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="text-darkest/80 font-jp list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-darkest/80 font-jp list-decimal space-y-1.5 pl-5 text-sm leading-relaxed">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="text-darkest font-bold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children }) => <span className="text-darkest font-medium">{children}</span>,
  img: () => null,
  blockquote: ({ children }) => (
    <blockquote className="border-acc-yellow/40 text-darkest/70 border-l-4 pl-4 text-sm italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-black/10" />,
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className || "");
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="text-darkest rounded bg-black/[0.07] px-1.5 py-0.5 font-mono text-[0.82em]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-darkest text-off-w overflow-x-auto rounded-lg p-4 font-mono text-xs leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs sm:text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-black/[0.04]">{children}</thead>,
  th: ({ children }) => (
    <th className="text-darkest border border-black/10 px-3 py-2 font-bold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="text-darkest/80 border border-black/10 px-3 py-2 align-top">
      {children}
    </td>
  ),
};

export function ArticleContent({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  );
}
