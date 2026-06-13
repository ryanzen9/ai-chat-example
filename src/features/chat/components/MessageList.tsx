import type { ChatMessage } from "../types";

function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="px-6 pb-36 pt-10">
      <div className="mx-auto max-w-[860px] space-y-5">
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

  return (
    <div
      className={[
        isUser ? "flex justify-end" : "flex justify-start",
        isFirst ? "mt-8" : "",
      ].join(" ")}
    >
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
