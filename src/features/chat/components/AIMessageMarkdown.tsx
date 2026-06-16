import { CheckIcon, CopyIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, isValidElement, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type AIMessageMarkdownProps = {
  content: string;
  isStreaming?: boolean;
};

function AIMessageMarkdown({ content, isStreaming }: AIMessageMarkdownProps) {
  return (
    <div
      className={cn(
        "ai-markdown prose prose-sm max-w-none leading-6 dark:prose-invert",
        "prose-headings:mb-2 prose-headings:mt-4 prose-headings:font-semibold prose-headings:text-foreground",
        "prose-p:my-2 prose-p:text-card-foreground",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-code:font-mono prose-code:text-foreground",
        "prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-li:marker:text-muted-foreground",
        "prose-blockquote:my-3 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
        "prose-table:my-3 prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-3 prose-th:py-2",
        "prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2",
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true }]]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && <StreamingCursor />}
    </div>
  );
}

const markdownComponents: Components = {
  a({ className, ...props }) {
    return (
      <a
        className={cn("font-medium", className)}
        target="_blank"
        rel="noreferrer"
        {...props}
      />
    );
  },
  pre({ className, children, ...props }) {
    return (
      <CodeBlock className={className} {...props}>
        {children}
      </CodeBlock>
    );
  },
  code({ className, children, ...props }) {
    return (
      <code
        className={cn(
          "rounded bg-muted px-1.5 py-0.5 text-[0.85em] before:content-none after:content-none",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  table({ className, ...props }) {
    return (
      <div className="my-3 overflow-x-auto rounded-md border border-border">
        <table className={cn("my-0 w-full", className)} {...props} />
      </div>
    );
  },
  blockquote({ className, ...props }) {
    return (
      <blockquote
        className={cn("rounded-r-md bg-muted/50 px-3 py-2", className)}
        {...props}
      />
    );
  },
  hr({ className, ...props }) {
    return <hr className={cn("my-4 border-border", className)} {...props} />;
  },
};

function CodeBlock({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);
  const code = getCodeText(children);
  const language = getCodeLanguage(children);

  async function handleCopy() {
    if (!code) return;

    await navigator.clipboard.writeText(code);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1200);
  }

  return (
    <div className="not-prose my-3 overflow-hidden rounded-md border border-border bg-muted/40">
      <div className="flex h-9 items-center justify-between border-b border-border bg-muted px-3">
        <span className="font-mono text-xs text-muted-foreground">
          {language || "code"}
        </span>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label="Copy code"
          onClick={handleCopy}
          disabled={!code}
        >
          {copied ? (
            <CheckIcon data-icon="inline-start" aria-hidden="true" />
          ) : (
            <CopyIcon data-icon="inline-start" aria-hidden="true" />
          )}
        </Button>
      </div>
      <pre
        className={cn(
          "my-0 overflow-x-auto bg-transparent p-4 font-mono text-xs leading-5 text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

function StreamingCursor() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block animate-pulse font-mono text-primary"
    >
      ▍
    </span>
  );
}

function getCodeText(children: ComponentPropsWithoutRef<"pre">["children"]) {
  if (!isValidElement(children)) return "";

  const childProps = children.props as { children?: unknown };
  const codeChildren = childProps.children;

  if (Array.isArray(codeChildren)) {
    return codeChildren.join("");
  }

  return typeof codeChildren === "string" ? codeChildren : "";
}

function getCodeLanguage(children: ComponentPropsWithoutRef<"pre">["children"]) {
  if (!isValidElement(children)) return "";

  const childProps = children.props as { className?: string };
  const match = /language-(\w+)/.exec(childProps.className ?? "");

  return match?.[1] ?? "";
}

export default AIMessageMarkdown;
