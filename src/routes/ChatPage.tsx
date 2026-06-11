import Sidebar from "@/features/chat/components/Sidebar";
import TopModelBar from "@/features/chat/components/TopModelBar";
import { usePromptCards, useSendMessage } from "@/features/chat/hooks";
import { useChatStore } from "@/features/chat/store";
import type { ChatMessage, PromptCard } from "@/features/chat/types";
import { Button, InputArea } from "@cloudflare/kumo";
import {
  CodeIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
  PencilSimpleLineIcon,
  ShareNetworkIcon,
  TerminalWindowIcon,
} from "@phosphor-icons/react";

export function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col border-l border-border bg-[var(--app-shell)]">
        <TopModelBar />
        <ChatWorkspace />
      </main>
    </div>
  );
}

function ChatWorkspace() {
  const messages = useChatStore((state) => state.messages);

  return (
    <section className="relative min-h-0 flex-1 overflow-hidden">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <MessageList messages={messages} />
      )}
      <ChatComposer />
    </section>
  );
}

function EmptyState() {
  const { data: cards = [], isLoading } = usePromptCards();

  return (
    <div className="mx-auto flex h-full max-w-[860px] flex-col justify-center pb-32">
      <div className="flex items-center gap-4">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-md border border-border bg-card text-primary">
          <MagnifyingGlassIcon size={30} weight="bold" />
        </div>

        <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.02em] text-foreground">
          How can I help you today?
        </h1>
      </div>

      <p className="mt-5 text-base leading-6 text-muted-foreground">
        Engage with KUMO AI for code generation, complex problem solving, or
        creative exploration.
      </p>

      <div className="mt-9 h-px bg-border" />

      <div className="mt-8 grid grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <PromptSkeleton />
            <PromptSkeleton />
            <PromptSkeleton />
          </>
        ) : (
          cards.map((card) => <PromptCardItem key={card.id} card={card} />)
        )}
      </div>
    </div>
  );
}

function PromptSkeleton() {
  return (
    <div className="h-[106px] animate-pulse rounded-md border border-border bg-card" />
  );
}

function PromptCardItem({ card }: { card: PromptCard }) {
  const setDraft = useChatStore((state) => state.setDraft);

  const iconMap = {
    code: CodeIcon,
    share: ShareNetworkIcon,
    writing: PencilSimpleLineIcon,
  };

  const Icon = iconMap[card.icon];

  return (
    <button
      onClick={() => setDraft(card.description)}
      className="group h-[106px] rounded-md border border-border bg-card px-5 py-4 text-left transition hover:border-[var(--app-border-hover)] hover:bg-muted"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon
          size={17}
          className="text-primary transition-transform group-hover:scale-105"
        />
        {card.title}
      </div>

      <p className="mt-3 text-sm leading-5 text-muted-foreground">
        {card.description}
      </p>
    </button>
  );
}

function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="h-full overflow-y-auto px-6 pb-36 pt-10">
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

function ChatComposer() {
  const draft = useChatStore((state) => state.draft);
  const setDraft = useChatStore((state) => state.setDraft);
  const addMessage = useChatStore((state) => state.addMessage);
  const sendMessage = useSendMessage();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = draft.trim();

    if (!content || sendMessage.isPending) {
      return;
    }

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    });

    setDraft("");

    sendMessage.mutate(content, {
      onSuccess: (assistantMessage) => {
        addMessage(assistantMessage);
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-5 left-1/2 w-[min(var(--composer-width),calc(100%-48px))] -translate-x-1/2"
    >
      <div className="flex min-h-[60px] items-center gap-4 rounded-md border border-border bg-input px-4 py-3 transition focus-within:border-ring">
        <TerminalWindowIcon
          size={20}
          className="shrink-0 text-muted-foreground"
        />

        <InputArea
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Message KUMO AI..."
          aria-label="Message KUMO AI"
          className="!min-h-[28px] flex-1 !resize-none !border-0 !bg-transparent !px-0 !py-0 !text-base !text-foreground !outline-none placeholder:!text-muted-foreground"
        />

        <Button
          type="submit"
          variant="ghost"
          shape="square"
          icon={PaperPlaneTiltIcon}
          aria-label="Send message"
          loading={sendMessage.isPending}
          className="!text-primary hover:!bg-accent"
        />
      </div>
    </form>
  );
}
