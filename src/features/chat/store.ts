import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ChatMessage, ChatSession, ModelId } from "./types";

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

  addMessage: (sessionId: string, message: ChatMessage) => void;
  appendMessage: (sessionId: string, message: ChatMessage) => void;
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

        addMessage: (sessionId: string, message: ChatMessage) => {
          set((state) => ({
            messagesBySessionId: {
              ...state.messagesBySessionId,
              [sessionId]: [
                ...(state.messagesBySessionId[sessionId] || []),
                message,
              ],
            },
          }));
        },

        appendMessage: (sessionId: string, message: ChatMessage) => {
          set((state) => {
            const sessions = state.sessions.map((session) =>
              session.id === sessionId
                ? {
                    ...session,
                    title: message.content.slice(0, 20),
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
