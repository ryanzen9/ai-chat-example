import {
  useChatMessages,
  useCurrentSessionId,
  usePromptCards,
} from "@/features/chat/hooks";
import {
  clearStreamController,
  registerStreamController,
  useChatStore,
} from "@/features/chat/store";
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
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { sendMessage } from "../api";
import { ChatInput } from "./ChatInput";
import MessageList from "./MessageList";

function ChatWorkspace() {
  const messagesBySessionId = useChatStore(
    (state) => state.messagesBySessionId,
  );
  const draft = useChatStore((state) => state.draft);
  const userId = useChatStore((state) => state.userId);
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
  const setMessageContent = useChatStore((state) => state.setMessageContent);
  const updateMessageStatus = useChatStore(
    (state) => state.updateMessageStatus,
  );
  const addSession = useChatStore((state) => state.addSession);
  const setSessionWorking = useChatStore((state) => state.setSessionWorking);
  const cancelSessionStream = useChatStore(
    (state) => state.cancelSessionStream,
  );
  const sessions = useChatStore((state) => state.sessions);
  const cancelAllStreams = useChatStore((state) => state.cancelAllStreams);

  const navigate = useNavigate();

  const shouldLoadMockMessages =
    Boolean(currentSessionId) &&
    messagesBySessionId[currentSessionId!] === undefined;

  const { data, isLoading } = useChatMessages(
    currentSessionId ?? "",
    shouldLoadMockMessages,
  );

  useEffect(() => {
    if (!data || !currentSessionId) return;

    // 避免重复设置消息列表
    const hasInitializedMessages = currentSessionId in messagesBySessionId;
    if (hasInitializedMessages) return;

    setMessagesBySessionId(currentSessionId, data);
  }, [data, currentSessionId, messagesBySessionId, setMessagesBySessionId]);

  const messages = useMemo(
    () => (currentSessionId ? messagesBySessionId[currentSessionId] || [] : []),
    [currentSessionId, messagesBySessionId],
  );

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const isSessionWorking = currentSession?.isWorking ?? false;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const userScrolledRef = useRef(false);
  const isStreaming = messages.some((m) => m.status === "streaming");
  const hasMessages = messages.length > 0;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      userScrolledRef.current = distanceFromBottom > 40;
    };

    el.addEventListener("scroll", onScroll);

    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, [hasMessages]); // 只挂载一次

  useEffect(() => {
    if (!viewportRef.current) return;

    // 流式且没有滚轮未移动时输出时始终跟随最新内容；非流式时不自动滚动
    if (isStreaming && !userScrolledRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    const handlerUnload = () => {
      cancelAllStreams();
    };

    window.addEventListener("beforeunload", handlerUnload);

    return () => window.removeEventListener("beforeunload", handlerUnload);
  }, [cancelAllStreams]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-border border-t-transparent" />
      </div>
    );
  }

  function getSessionHistory(sessionId: string) {
    const sessionMessages = messagesBySessionId[sessionId] || [];
    return sessionMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
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

    // 如果当前 session 已有流在跑，先取消
    cancelSessionStream(sessionId);

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

    startAssistantStream(
      userId,
      sessionId,
      [...getSessionHistory(sessionId)],
      message,
      responseMessage.id,
    );
  }

  function startAssistantStream(
    userId: string,
    sessionId: string,
    history: {
      role: "user" | "assistant";
      content: string;
    }[],
    prompt: string,
    responseMessageId: string,
  ) {
    const controller = new AbortController();
    registerStreamController(sessionId, controller);
    setSessionWorking(sessionId, true);

    void sendMessage({
      userId,
      history,
      model: selectedModel,
      content: prompt,
      signal: controller.signal,
      onMessage: (msg: Omit<ChatMessage, "id">) => {
        appendMessageContent(sessionId, responseMessageId, msg.content);
        updateMessageStatus(sessionId, responseMessageId, "streaming");
      },
      onDone: () => {
        clearStreamController(sessionId);
        setSessionWorking(sessionId, false);
        updateMessageStatus(sessionId, responseMessageId, "done");
      },
      onError: (error) => {
        clearStreamController(sessionId);
        setSessionWorking(sessionId, false);

        if (error.name === "AbortError") {
          updateMessageStatus(sessionId, responseMessageId, "cancelled");
          return;
        }

        appendMessageContent(
          sessionId,
          responseMessageId,
          error.message || "发送失败，请稍后重试。",
        );
        updateMessageStatus(sessionId, responseMessageId, "error");
      },
    }).catch(() => undefined);
  }

  function retryAssistantMessage(message: ChatMessage, index: number) {
    if (!currentSessionId || message.role !== "assistant") return;

    const previousUserMessage = messages
      .slice(0, index)
      .findLast((item) => item.role === "user");

    if (!previousUserMessage) {
      setMessageContent(
        currentSessionId,
        message.id,
        "无法找到上一条用户消息。",
      );
      updateMessageStatus(currentSessionId, message.id, "error");
      return;
    }

    cancelSessionStream(currentSessionId);
    setMessageContent(currentSessionId, message.id, "");
    updateMessageStatus(currentSessionId, message.id, "pending");
    startAssistantStream(
      userId,
      currentSessionId,
      [...getSessionHistory(currentSessionId)],
      previousUserMessage.content,
      message.id,
    );
  }

  return (
    <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollArea className="min-h-0 flex-1" viewportRef={viewportRef}>
          <MessageList messages={messages} onRetry={retryAssistantMessage} />
          <ProgressiveBlur position="top" height="10%" />
          <ProgressiveBlur position="bottom" height="10%" />
        </ScrollArea>
      )}
      {/* <ChatComposer /> */}
      <ChatInput
        value={draft}
        onChange={setDraft}
        onSend={onSend}
        isStreaming={isSessionWorking}
      />
    </section>
  );
}

function EmptyState() {
  const { data: cards = [], isLoading } = usePromptCards();

  return (
    <div className="mx-auto flex w-full max-w-215 flex-1 flex-col justify-center px-4 pb-24 md:px-0 md:pb-32">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-card text-primary md:size-13">
          <MagnifyingGlassIcon size={30} weight="bold" />
        </div>

        <h1 className="text-2xl font-semibold leading-8 text-foreground md:text-[40px] md:leading-12">
          How can I help you today?
        </h1>
      </div>

      <div className="mt-6 h-px bg-border md:mt-9" />

      <div className="mt-6 grid grid-cols-1 gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
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
    <div className="min-h-24 animate-pulse rounded-md border border-border bg-card md:min-h-26.5" />
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
      className="group min-h-24 rounded-md border border-border bg-card px-4 py-3 text-left transition hover:border-app-brand-border hover:bg-muted md:min-h-26.5 md:px-5 md:py-4"
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
