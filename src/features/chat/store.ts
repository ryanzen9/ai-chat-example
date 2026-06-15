import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  ChatMessage,
  ChatMessageStatus,
  ChatSession,
  ModelId,
} from "./types";

type ChatState = {
  selectedModel: ModelId;
  draft: string;
  sessions: ChatSession[];
  messagesBySessionId: Record<string, ChatMessage[]>;

  setSelectedModel: (model: ModelId) => void;
  setDraft: (draft: string) => void;
  setSessions: (sessions: ChatSession[]) => void;
  setMessageBySessionId: (sessionId: string, messages: ChatMessage[]) => void;
  setSessionModelId: (sessionId: string, modelId: ModelId) => void;

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
        selectedModel: "deepseek-v3",
        draft: "",
        sessions: [],
        messagesBySessionId: {},

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
        partialize: (state) => ({
          selectedModel: state.selectedModel,
          sessions: state.sessions,
          messagesBySessionId: state.messagesBySessionId,
        }),
      },
    ),
  ),
);
