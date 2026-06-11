"use client";

import { Mic, Paperclip, Send } from "lucide-react";

import { Button } from "@shared/ui/button";
import { Textarea } from "@shared/ui/textarea";

export function ChatInput({
  value,
  onSend,
  onChange,
}: {
  value?: string;
  onSend?: (message: string) => void;
  onChange?: (value: string) => void;
}) {
  function handleSubmit() {
    const message = value?.trim();
    if (!message) return;

    if (onSend) {
      onSend(message);
    }
  }

  function handleChange(value: string) {
    if (onChange) {
      onChange(value);
    }
  }

  return (
    <div className="w-full px-6 py-4">
      <div className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Textarea
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange(e.target.value)
          }
          placeholder="输入消息..."
          className="max-h-40 min-h-8 flex-1 resize-none border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Mic className="h-5 w-5" />
        </Button>

        <Button
          type="button"
          size="icon"
          onClick={handleSubmit}
          className="shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
