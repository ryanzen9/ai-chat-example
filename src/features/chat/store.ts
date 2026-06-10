import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ChatMessage, ModelId } from "./types";

type ChatState = {
  selectedModel: ModelId;
  draft: string;
  messages: ChatMessage[];

  setSelectedModel: (model: ModelId) => void;
  setDraft: (draft: string) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        selectedModel: "deepseek-v3",
        draft: "",
        messages: [],

        setSelectedModel: (model) => {
          set({ selectedModel: model });
        },

        setDraft: (draft) => {
          set({ draft });
        },

        addMessage: (message) => {
          set((state) => ({
            messages: [...state.messages, message],
          }));
        },

        clearMessages: () => {
          set({ messages: [] });
        },
      }),
      {
        name: "kumo-ai-chat-store",
        partialize: (state) => ({
          selectedModel: state.selectedModel,
        }),
      },
    ),
  ),
);
