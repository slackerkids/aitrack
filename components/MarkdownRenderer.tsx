import React, { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";

interface MarkdownRendererProps {
  children: ReactNode;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
  const components: Components = {
    code({ node, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const lang = match ? match[1] : "";
      return match ? (
        <SyntaxHighlighter
          {...(props as any)}
          style={darcula as any}
          language={lang === "tsx" ? "jsx" : lang}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children as string}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
