import {
  useChatMessages,
  useCurrentSessionId,
  usePromptCards,
  useStreamingMessage,
} from "@/features/chat/hooks";
import { useChatStore } from "@/features/chat/store";
import type {
  ChatMessage,
  ChatSession,
  PromptCard,
} from "@/features/chat/types";
import { ProgressiveBlur } from "@/shared/ui/progressive-blur";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  CodeIcon,
  MagnifyingGlassIcon,
  PencilSimpleLineIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ChatInput } from "./ChatInput";
import MessageList from "./MessageList";

function ChatWorkspace() {
  const messagesBySessionId = useChatStore(
    (state) => state.messagesBySessionId,
  );
  const draft = useChatStore((state) => state.draft);
  const setDraft = useChatStore((state) => state.setDraft);
  const currentSessionId = useCurrentSessionId();
  const setMessagesBySessionId = useChatStore(
    (state) => state.setMessageBySessionId,
  );
  const selectedModel = useChatStore((state) => state.selectedModel);
  const appendMessage = useChatStore((state) => state.appendMessage);
  const appendMessageContent = useChatStore(
    (state) => state.appendMessageContent,
  );
  const updateMessageStatus = useChatStore(
    (state) => state.updateMessageStatus,
  );
  const addSession = useChatStore((state) => state.addSession);
  const navigate = useNavigate();

  const shouldLoadMockMessages =
    Boolean(currentSessionId) &&
    messagesBySessionId[currentSessionId!] === undefined;

  const { data, isLoading } = useChatMessages(
    currentSessionId ?? "",
    shouldLoadMockMessages,
  );

  const sendMessageStream = useStreamingMessage();

  useEffect(() => {
    if (!data || !currentSessionId) return;

    // 避免重复设置消息列表
    const hasInitializedMessages = currentSessionId in messagesBySessionId;
    if (hasInitializedMessages) return;

    setMessagesBySessionId(currentSessionId, data);
  }, [data, currentSessionId, messagesBySessionId, setMessagesBySessionId]);

  const messages = currentSessionId
    ? messagesBySessionId[currentSessionId] || []
    : [];

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-border border-t-transparent" />
      </div>
    );
  }

  function onSend(message: string) {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      modelId: selectedModel,
      isWorking: false,
      title: message,
      lastMessage: message,
      lastMessageTime: new Date().toISOString(),
    };
    const messageBody: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
      status: "done",
    };

    const sessionId = currentSessionId || session.id;

    if (!currentSessionId) {
      addSession(session);
      navigate(`/chat/${sessionId}`, { replace: true });
    }

    setDraft("");
    appendMessage(sessionId, messageBody);

    const responseMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    appendMessage(sessionId, responseMessage);

    sendMessageStream.mutate({
      content: message,
      onMessage: (message: Omit<ChatMessage, "id">) => {
        appendMessageContent(sessionId, responseMessage.id, message.content);
        updateMessageStatus(sessionId, responseMessage.id, "streaming");
      },
      onDone: () => {
        updateMessageStatus(sessionId, responseMessage.id, "done");
      },
      onError: () => {
        appendMessageContent(
          sessionId,
          responseMessage.id,
          "发送失败，请稍后重试。",
        );

        updateMessageStatus(sessionId, responseMessage.id, "error");
      },
    });
  }

  return (
    <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollArea className="min-h-0 flex-1 rounded-md border">
          <MessageList messages={messages} />
          <ProgressiveBlur position="top" height="10%" />
          <ProgressiveBlur position="bottom" height="10%" />
        </ScrollArea>
      )}
      {/* <ChatComposer /> */}
      <ChatInput
        value={draft}
        onChange={setDraft}
        onSend={onSend}
        isStreaming={sendMessageStream.isPending}
      />
    </section>
  );
}

function EmptyState() {
  const { data: cards = [], isLoading } = usePromptCards();

  return (
    <div className="mx-auto flex flex-1 max-w-[860px] flex-col justify-center pb-32">
      <div className="flex items-center gap-4 ">
        <div className="flex size-[52px] items-center justify-center rounded-md border border-border bg-card text-primary">
          <MagnifyingGlassIcon size={30} weight="bold" />
        </div>

        <h1 className="text-[40px] font-semibold leading-[48px] text-foreground">
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
      className="group h-[106px] rounded-md border border-border bg-card px-5 py-4 text-left transition hover:border-app-brand-border hover:bg-muted"
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
