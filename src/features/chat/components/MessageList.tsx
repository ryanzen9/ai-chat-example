import { cn } from "@/shared/lib/utils";
import { AnimatedShinyText } from "@/shared/ui/animated-shiny-text";
import { lazy, Suspense } from "react";
import { useChatStore } from "../store";
import type { ChatMessage } from "../types";

const AIMessageMarkdown = lazy(() => import("./AIMessageMarkdown"));

function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="px-6 pb-36 pt-10">
      <div className="mx-auto flex max-w-[860px] flex-col gap-5">
        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} index={index} />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  index,
}: {
  message: ChatMessage;
  index: number;
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

  return (
    <div
      className={cn(
        isUser ? "flex justify-end" : "flex justify-start",
        isFirst ? "mt-8" : "",
      )}
    >
      <div
        className={cn(
          "max-w-[72%] rounded border px-4 py-3 text-sm leading-6",
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
    </div>
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
