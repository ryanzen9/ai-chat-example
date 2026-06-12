import {
  usePromptCards,
  useSendMessage,
} from "@/features/chat/hooks";
import { useChatStore } from "@/features/chat/store";
import type {
  ChatMessage,
  ChatSession,
  PromptCard,
} from "@/features/chat/types";
import {
  CodeIcon,
  MagnifyingGlassIcon,
  PencilSimpleLineIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import { ChatInput } from "./ChatInput";
import MessageList from "./MessageList";

function ChatWorkspace() {
  const messagesBySessionId = useChatStore(
    (state) => state.messagesBySessionId,
  );
  const draft = useChatStore((state) => state.draft);
  const setDraft = useChatStore((state) => state.setDraft);
  const currentSessionId = useChatStore((state) => state.currentSessionId);
  const setCurrentSessionId = useChatStore(
    (state) => state.setCurrentSessionId,
  );
  const selectedModel = useChatStore((state) => state.selectedModel);

  const addMessage = useChatStore((state) => state.addMessage); // Subscribe to messages changes
  const addSession = useChatStore((state) => state.addSession);

  const sendMessage = useSendMessage();

  const messages = currentSessionId
    ? messagesBySessionId[currentSessionId] || []
    : [];

  function onSend(message: string) {
    const messageBody: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };
    const session: ChatSession = {
      id: crypto.randomUUID(),
      modelId: selectedModel,
      isWorking: false,
      title: message,
      lastMessage: message,
      lastMessageTime: new Date().toISOString(),
    };

    const sessionId = currentSessionId || session.id;

    setDraft("");
    addMessage(sessionId, messageBody);

    sendMessage.mutate(message, {
      onSuccess: (response) => {
        addMessage(sessionId, response);

        if (!currentSessionId) {
          addSession(session);
          setCurrentSessionId(session.id);
        }
      },
      onError: () => {},
    });
  }

  return (
    <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <MessageList messages={messages} />
      )}
      {/* <ChatComposer /> */}
      <ChatInput value={draft} onChange={setDraft} onSend={onSend} />
    </section>
  );
}

function EmptyState() {
  const { data: cards = [], isLoading } = usePromptCards();

  return (
    <div className="mx-auto flex flex-1 max-w-[860px] flex-col justify-center pb-32">
      <div className="flex items-center gap-4 ">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-md  border-border bg-card text-primary">
          <MagnifyingGlassIcon size={30} weight="bold" />
        </div>

        <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.02em] text-foreground">
          How can I help you today?
        </h1>
      </div>

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

export default ChatWorkspace;
