import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  ChatMessage,
  ChatMessageStatus,
  ChatSession,
  ModelId,
} from "./types";
import { isModelId } from "./types";

type ChatState = {
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

  appendMessage: (sessionId: string, message: ChatMessage) => void;
  appendMessageContent: (
    sessionId: string,
    messageId: string,
    chunk: string,
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
        version: 3,
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
            sessions: state.sessions?.map((session) => ({
              ...session,
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
