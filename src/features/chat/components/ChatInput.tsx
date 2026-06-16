"use client";

import { LoaderCircle, Mic, Paperclip, Send } from "lucide-react";

import { Button } from "@shared/ui/button";
import { Textarea } from "@shared/ui/textarea";
import type { ChangeEvent, KeyboardEvent } from "react";

export function ChatInput({
  value,
  onSend,
  onChange,
  isStreaming = false,
}: {
  value?: string;
  onSend?: (message: string) => void;
  onChange?: (value: string) => void;
  isStreaming?: boolean;
}) {
  const canSend = Boolean(value?.trim()) && !isStreaming;

  function handleSubmit() {
    const message = value?.trim();
    if (!message || isStreaming) return;

    if (onSend) {
      onSend(message);
    }
  }

  function handleChange(value: string) {
    if (onChange) {
      onChange(value);
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full shrink-0 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 md:px-6 md:py-4">
      <div
        className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 data-[streaming=true]:border-primary/40 data-[streaming=true]:ring-2 data-[streaming=true]:ring-primary/15 md:gap-3 md:rounded-2xl md:px-4 md:py-3"
        data-streaming={isStreaming}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Paperclip data-icon="inline-start" />
        </Button>

        <Textarea
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleChange(e.target.value)
          }
          placeholder="输入消息..."
          className="max-h-40 min-h-9 min-w-0 flex-1 resize-none border-0 bg-transparent px-0 py-1 shadow-none focus-visible:ring-0"
          disabled={isStreaming}
          onKeyDown={handleKeyDown}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden shrink-0 text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          <Mic data-icon="inline-start" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={isStreaming ? "secondary" : "default"}
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label={isStreaming ? "AI is responding" : "Send message"}
          className="shrink-0 data-[streaming=true]:text-primary"
          data-streaming={isStreaming}
        >
          {isStreaming ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : (
            <Send data-icon="inline-start" />
          )}
        </Button>
      </div>
    </div>
  );
}
