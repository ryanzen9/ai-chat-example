import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ChatMessage, ChatSession, ModelId } from "./types";

type ChatState = {
  selectedModel: ModelId;
  currentSessionId: string | null;
  draft: string;
  sessions: ChatSession[];
  messagesBySessionId: Record<string, ChatMessage[]>;

  setSelectedModel: (model: ModelId) => void;
  setCurrentSessionId: (sessionId: string) => void;
  setDraft: (draft: string) => void;
  setSessions: (sessions: ChatSession[]) => void;
  setMessageBySessionId: (sessionId: string, messages: ChatMessage[]) => void;
  setSessionModelId: (sessionId: string, modelId: ModelId) => void;

  addMessage: (currentSessionId: string, message: ChatMessage) => void;
  addSession: (session: ChatSession) => void;

  clearCurrentSession: () => void;
};

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        selectedModel: "deepseek-v3",
        draft: "",
        currentSessionId: null,
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

        addMessage: (currentSessionId: string, message: ChatMessage) => {
          set((state) => ({
            messagesBySessionId: {
              ...state.messagesBySessionId,
              [currentSessionId]: [
                ...(state.messagesBySessionId[currentSessionId] || []),
                message,
              ],
            },
          }));
        },

        addSession: (session) => {
          set((state) => ({
            sessions: [session, ...state.sessions],
          }));
        },

        setCurrentSessionId: (sessionId) => {
          set({ currentSessionId: sessionId });
        },

        clearCurrentSession: () => {
          set({ currentSessionId: null });
        },
      }),
      {
        name: "chat-store",
        partialize: (state) => ({
          selectedModel: state.selectedModel,
          sessions: state.sessions,
          messagesBySessionId: state.messagesBySessionId,
          currentSessionId: state.currentSessionId,
        }),
      },
    ),
  ),
);
