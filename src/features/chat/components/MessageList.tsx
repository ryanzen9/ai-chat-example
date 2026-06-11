import type { ChatMessage } from "../types";

function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-36 pt-10">
      <div className="mx-auto max-w-[860px] space-y-5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-[72%] whitespace-pre-wrap rounded border px-4 py-3 text-sm leading-6",
          isUser
            ? "border-[var(--app-brand-border)] bg-[var(--app-brand-soft)] text-foreground"
            : "border-border bg-card text-card-foreground",
        ].join(" ")}
      >
        {message.content}
      </div>
    </div>
  );
}

export default MessageList;
