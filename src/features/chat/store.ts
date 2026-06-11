import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ChatMessage, ChatSession, ModelId } from "./types";

type ChatState = {
  selectedModel: ModelId;
  currentSessionId: string | null;
  draft: string;
  messages: ChatMessage[];
  sessions: ChatSession[];

  setSelectedModel: (model: ModelId) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
  setDraft: (draft: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setSessions: (sessions: ChatSession[]) => void;
  addMessage: (message: ChatMessage) => void;
  addSession: (session: ChatSession) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        selectedModel: "deepseek-v3",
        draft: "",
        currentSessionId: null,
        sessions: [],
        messages: [],

        setSelectedModel: (model) => {
          set({ selectedModel: model });
        },

        setDraft: (draft) => {
          set({ draft });
        },

        setMessages: (messages) => {
          set({ messages });
        },

        setSessions: (sessions) => {
          set({ sessions });
        },

        addMessage: (message) => {
          set((state) => ({
            messages: [...state.messages, message],
          }));
        },

        clearMessages: () => {
          set({ messages: [] });
        },

        addSession: (session) => {
          set((state) => ({
            sessions: [session, ...state.sessions],
          }));
        },

        setCurrentSessionId: (sessionId) => {
          set({ currentSessionId: sessionId });
        },
      }),
      {
        name: "chat-store",
        partialize: (state) => ({
          selectedModel: state.selectedModel,
        }),
      },
    ),
  ),
);
