import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  ChatMessage,
  ChatMessageStatus,
  ChatSession,
  ModelId,
} from "./types";
import { isModelId } from "./types";

const streamControllers = new Map<string, AbortController>();

export function registerStreamController(
  sessionId: string,
  controller: AbortController,
) {
  streamControllers.set(sessionId, controller);
}

export function clearStreamController(sessionId: string) {
  streamControllers.delete(sessionId);
}

type ChatState = {
  userId: string;
  selectedModel: ModelId;
  draft: string;
  sessions: ChatSession[];
  messagesBySessionId: Record<string, ChatMessage[]>;
  enableMarkdown: boolean;
  apiKey: string;

  setSelectedModel: (model: ModelId) => void;
  setDraft: (draft: string) => void;
  setSessions: (sessions: ChatSession[]) => void;
  setMessageBySessionId: (sessionId: string, messages: ChatMessage[]) => void;
  setSessionModelId: (sessionId: string, modelId: ModelId) => void;
  toggleMarkdown: () => void;
  setApiKey: (apiKey: string) => void;
  setSessionWorking: (sessionId: string, isWorking: boolean) => void;
  cancelSessionStream: (sessionId: string) => void;
  cancelAllStreams: () => void;

  appendMessage: (sessionId: string, message: ChatMessage) => void;
  appendMessageContent: (
    sessionId: string,
    messageId: string,
    chunk: string,
  ) => void;
  setMessageContent: (
    sessionId: string,
    messageId: string,
    content: string,
  ) => void;
  updateMessageStatus: (
    sessionId: string,
    messageId: string,
    status: ChatMessageStatus,
  ) => void;
  addSession: (session: ChatSession) => void;
};

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        selectedModel: "deepseek-v4-flash",
        userId: crypto.randomUUID(),
        draft: "",
        sessions: [],
        messagesBySessionId: {},
        enableMarkdown: true,
        apiKey: "",

        setSelectedModel: (model) => {
          set({ selectedModel: model });
        },

        setDraft: (draft) => {
          set({ draft });
        },

        setSessions: (sessions) => {
          set({ sessions });
        },

        setMessageBySessionId: (sessionId, messages) => {
          set((state) => ({
            messagesBySessionId: {
              ...state.messagesBySessionId,
              [sessionId]: messages,
            },
          }));
        },

        setSessionModelId: (sessionId, modelId) => {
          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === sessionId ? { ...session, modelId } : session,
            ),
          }));
        },

        toggleMarkdown: () => {
          set((state) => ({ enableMarkdown: !state.enableMarkdown }));
        },

        setApiKey: (apiKey) => {
          if (typeof window === "undefined") return;
          const normalized = apiKey.trim();
          set(() => ({ apiKey: normalized }));
        },

        setSessionWorking: (sessionId, isWorking) => {
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === sessionId ? { ...s, isWorking } : s,
            ),
          }));
        },

        cancelSessionStream: (sessionId) => {
          streamControllers.get(sessionId)?.abort();
          streamControllers.delete(sessionId);
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === sessionId ? { ...s, isWorking: false } : s,
            ),
            messagesBySessionId: {
              ...state.messagesBySessionId,
              [sessionId]: (state.messagesBySessionId[sessionId] || []).map(
                (m) =>
                  m.status === "streaming" || m.status === "pending"
                    ? { ...m, status: "cancelled" }
                    : m,
              ),
            },
          }));
        },

        cancelAllStreams: () => {
          streamControllers.forEach((controller, sessionId) => {
            controller.abort();
            streamControllers.delete(sessionId);
            set((state) => ({
              sessions: state.sessions.map((s) =>
                s.id === sessionId ? { ...s, isWorking: false } : s,
              ),
              messagesBySessionId: {
                ...state.messagesBySessionId,
                [sessionId]: (state.messagesBySessionId[sessionId] || []).map(
                  (m) =>
                    m.status === "streaming" || m.status === "pending"
                      ? { ...m, status: "cancelled" }
                      : m,
                ),
              },
            }));
          });
        },

        appendMessage: (sessionId: string, message: ChatMessage) => {
          set((state) => {
            const sessions = state.sessions.map((session) =>
              session.id === sessionId
                ? {
                    ...session,
                    lastMessage: message.content,
                    lastMessageTime: message.createdAt,
                  }
                : session,
            );

            return {
              sessions: sessions,
              messagesBySessionId: {
                ...state.messagesBySessionId,
                [sessionId]: [
                  ...(state.messagesBySessionId[sessionId] || []),
                  message,
                ],
              },
            };
          });
        },

        appendMessageContent: (sessionId, messageId, chunk) => {
          set((state) => {
            const sessions = state.sessions.map((session) =>
              session.id === sessionId
                ? {
                    ...session,

                    lastMessage: session.lastMessage + chunk,
                    lastMessageTime: new Date().toISOString(),
                  }
                : session,
            );

            const messages = state.messagesBySessionId[sessionId]?.map(
              (message) =>
                message.id === messageId
                  ? { ...message, content: message.content + chunk }
                  : message,
            );

            return {
              sessions,
              messagesBySessionId: {
                ...state.messagesBySessionId,
                [sessionId]: messages || [],
              },
            };
          });
        },

        setMessageContent: (sessionId, messageId, content) => {
          set((state) => {
            const messages = state.messagesBySessionId[sessionId]?.map(
              (message) =>
                message.id === messageId ? { ...message, content } : message,
            );

            return {
              messagesBySessionId: {
                ...state.messagesBySessionId,
                [sessionId]: messages || [],
              },
            };
          });
        },

        updateMessageStatus: (
          sessionId,
          messageId,
          status: ChatMessageStatus,
        ) => {
          set((state) => {
            const messages = state.messagesBySessionId[sessionId]?.map(
              (message) =>
                message.id === messageId ? { ...message, status } : message,
            );

            return {
              messagesBySessionId: {
                ...state.messagesBySessionId,
                [sessionId]: messages || [],
              },
            };
          });
        },

        addSession: (session) => {
          set((state) => ({
            sessions: [session, ...state.sessions],
          }));
        },
      }),
      {
        name: "chat-store",
        version: 4,
        migrate: (persistedState) => {
          if (!persistedState || typeof persistedState !== "object") {
            return persistedState;
          }

          const state = persistedState as Partial<ChatState>;

          if (typeof window !== "undefined") {
            const apiKey = window.localStorage.getItem("deepseek-api-key");
            if (apiKey) {
              state.apiKey = apiKey;
            }
          }

          return {
            ...state,
            selectedModel: isModelId(state.selectedModel)
              ? state.selectedModel
              : "deepseek-v4-flash",
            userId: state.userId || crypto.randomUUID(),
            sessions: state.sessions?.map((session) => ({
              ...session,
              isWorking: false,
              modelId: isModelId(session.modelId)
                ? session.modelId
                : "deepseek-v4-flash",
            })),
          };
        },
        partialize: (state) => ({
          selectedModel: state.selectedModel,
          sessions: state.sessions,
          messagesBySessionId: state.messagesBySessionId,
          enableMarkdown: state.enableMarkdown,
          apiKey: state.apiKey,
        }),
      },
    ),
  ),
);
