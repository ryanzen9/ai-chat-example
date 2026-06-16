import { cn } from "@/shared/lib/utils";
import { AnimatedShinyText } from "@/shared/ui/animated-shiny-text";
import { Button } from "@/shared/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { lazy, Suspense, useState, type ReactNode } from "react";
import { useChatStore } from "../store";
import type { ChatMessage } from "../types";

const AIMessageMarkdown = lazy(() => import("./AIMessageMarkdown"));

function MessageList({
  messages,
  onRetry,
}: {
  messages: ChatMessage[];
  onRetry?: (message: ChatMessage, index: number) => void;
}) {
  return (
    <div className="px-3 pb-32 pt-6 md:px-6 md:pb-36 md:pt-10">
      <div className="mx-auto flex w-full max-w-215 flex-col gap-4 md:gap-5">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            index={index}
            onRetry={onRetry}
            isLast={index === messages.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  index,
  onRetry,
  isLast,
}: {
  message: ChatMessage;
  index: number;
  onRetry?: (message: ChatMessage, index: number) => void;
  isLast: boolean;
}) {
  const isUser = message.role === "user";
  const isFirst = index === 0;
  const status = message.status;
  const isPending = status === "pending";
  const isTalking = status === "streaming";
  const isError = status === "error";
  const isCancelled = status === "cancelled";
  const isRenderableContent =
    !status || status === "done" || isError || isCancelled;

  const [toolBarIsVisible, setToolBarIsVisible] = useState(false);

  return (
    <div
      className={cn(
        isUser ? "flex justify-end" : "flex justify-start",
        isFirst ? "mt-8" : "",
      )}
      onMouseEnter={() => setToolBarIsVisible(isLast && !isUser)}
      onMouseLeave={() => setToolBarIsVisible(false)}
    >
      <div className="group/message flex max-w-[92%] flex-col items-start md:max-w-[72%]">
        <div
          className={cn(
            "min-w-0 rounded border px-3 py-2.5 text-sm leading-6 md:px-4 md:py-3",
            isUser
              ? "whitespace-pre-wrap border-app-brand-border bg-app-brand-soft text-foreground"
              : "border-border bg-card text-card-foreground",
            isTalking && "border-primary/40 ring-1 ring-primary/20",
            isPending && "border-primary/30 bg-muted/40",
            isError && "border-destructive/40 text-destructive",
          )}
        >
          {isPending && <PendingMessage />}
          {isTalking && <StreamingMessage content={message.content} />}
          {isRenderableContent &&
            (isCancelled ? (
              <span className="text-muted-foreground">{message.content}</span>
            ) : isUser ? (
              message.content
            ) : (
              <MarkdownContent content={message.content} />
            ))}
        </div>

        {!isUser && (
          <MessageToolBar
            isShow={toolBarIsVisible}
            status={status}
            onRetry={() => onRetry?.(message, index)}
          />
        )}
      </div>
    </div>
  );
}

function MessageToolBar({
  isShow,
  status,
  onRetry,
}: {
  isShow: boolean;
  status: ChatMessage["status"];
  onRetry?: () => void;
}) {
  return (
    <div
      className={cn(
        "mt-1.5 flex h-7 w-full items-center justify-between gap-2 text-xs text-muted-foreground transition-opacity",
        "focus-within:opacity-100",
        isShow ? "opacity-100" : "invisible opacity-0 pointer-events-none",
      )}
    >
      <MessageStatus status={status} />

      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        title="Retry"
        aria-label="Retry assistant response"
        onClick={onRetry}
      >
        <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
      </Button>
    </div>
  );
}

function MessageStatus({ status }: { status: ChatMessage["status"] }) {
  if (status === "pending") {
    return <StatusLabel tone="active">等待响应</StatusLabel>;
  }

  if (status === "streaming") {
    return <StatusLabel tone="active">正在输出</StatusLabel>;
  }

  if (status === "cancelled") {
    return <StatusLabel tone="muted">已取消</StatusLabel>;
  }

  if (status === "error") {
    return <StatusLabel tone="error">失败</StatusLabel>;
  }

  return <span aria-hidden="true" />;
}

function StatusLabel({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "active" | "muted" | "error";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5",
        tone === "active" && "bg-primary/10 text-primary",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "error" && "bg-destructive/10 text-destructive",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          tone === "active" && "animate-pulse bg-primary",
          tone === "muted" && "bg-muted-foreground",
          tone === "error" && "bg-destructive",
        )}
      />
      {children}
    </span>
  );
}

function PendingMessage() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-1.5 rounded-full bg-primary" />
      <AnimatedShinyText className="mx-0 max-w-none">
        Thinking...
      </AnimatedShinyText>
    </span>
  );
}

function StreamingMessage({ content }: { content: string }) {
  return <MarkdownContent content={content} isStreaming />;
}

function MarkdownContent({
  content,
  isStreaming,
}: {
  content: string;
  isStreaming?: boolean;
}) {
  const enableMarkdown = useChatStore((state) => state.enableMarkdown);

  if (!enableMarkdown) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  return (
    <Suspense fallback={<span className="whitespace-pre-wrap">{content}</span>}>
      <AIMessageMarkdown content={content} isStreaming={isStreaming} />
    </Suspense>
  );
}

export default MessageList;
