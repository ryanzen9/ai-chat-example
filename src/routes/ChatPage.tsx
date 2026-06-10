import { Button, InputArea, Tabs } from "@cloudflare/kumo";
import {
  BracketsCurlyIcon,
  CodeIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
  PencilSimpleLineIcon,
  ShareNetworkIcon,
  TerminalWindowIcon,
} from "@phosphor-icons/react";
import Sidebar from "../features/chat/components/Sidebar";

import { usePromptCards, useSendMessage } from "../features/chat/hooks";
import { useChatStore } from "../features/chat/store";
import type { ChatMessage, ModelId, PromptCard } from "../features/chat/types";

const modelTabs = [
  { value: "deepseek-v3", label: "DeepSeek-V3" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "claude-3.5", label: "Claude-3.5" },
];

export function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background-deep)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col border-l border-[var(--border-subtle)] bg-[var(--surface)]">
        <TopModelBar />
        <ChatWorkspace />
      </main>
    </div>
  );
}

function TopModelBar() {
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);

  return (
    <header className="relative flex h-[var(--topbar-height)] items-center border-b border-[var(--border-subtle)] bg-[var(--surface)]">
      <div className="absolute left-1/2 top-0 flex h-full -translate-x-1/2 items-center">
        <Tabs
          variant="underline"
          value={selectedModel}
          onValueChange={(value) => setSelectedModel(value as ModelId)}
          tabs={modelTabs}
          className="h-full"
          listClassName="h-full gap-8 bg-transparent"
          indicatorClassName="!bg-[var(--primary-container)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-5 px-6 text-[#cbd5e1]">
        <TerminalWindowIcon size={18} />
        <BracketsCurlyIcon size={18} />
      </div>
    </header>
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
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">
          <MagnifyingGlassIcon size={30} weight="bold" />
        </div>

        <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.02em] text-white">
          How can I help you today?
        </h1>
      </div>

      <p className="mt-5 text-base leading-6 text-[#cbd5e1]">
        Engage with KUMO AI for code generation, complex problem solving, or
        creative exploration.
      </p>

      <div className="mt-9 h-px bg-[var(--border-subtle)]" />

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
    <div className="h-[106px] animate-pulse rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]" />
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
      className="group h-[106px] rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-4 text-left transition hover:border-[var(--border-hover)] hover:bg-[var(--surface-container)]"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon
          size={17}
          className="text-[var(--primary-container)] group-hover:scale-105"
        />
        {card.title}
      </div>

      <p className="mt-3 text-sm leading-5 text-[#cbd5e1]">
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
            ? "border-[#964900] bg-[#502400] text-white"
            : "border-[var(--border-subtle)] bg-[var(--surface-card)] text-[#e5e7eb]",
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
      <div className="flex min-h-[60px] items-center gap-4 rounded border border-[var(--border-subtle)] bg-[#111111] px-4 py-3 transition focus-within:border-[var(--primary-container)]">
        <TerminalWindowIcon size={20} className="shrink-0 text-[#cbd5e1]" />

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
          className="!min-h-[28px] flex-1 !resize-none !border-0 !bg-transparent !px-0 !py-0 !text-base !text-white !outline-none placeholder:!text-[#9ca3af]"
        />

        <Button
          type="submit"
          variant="ghost"
          shape="square"
          icon={PaperPlaneTiltIcon}
          aria-label="Send message"
          loading={sendMessage.isPending}
          className="!text-[var(--primary-container)] hover:!bg-[#ffffff10]"
        />
      </div>
    </form>
  );
}
