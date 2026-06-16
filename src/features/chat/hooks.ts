import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { sendMessage } from "./api";
import {
  getChatMessages,
  getChatSessions,
  getPromptCards,
  sendFakeMessage,
} from "./mock";
import type { ChatMessage, ModelId } from "./types";

type StreamingMessageVariables = {
  model: ModelId;
  content: string;
  onMessage: (message: Omit<ChatMessage, "id">) => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
};

export function useCurrentSessionId() {
  return useParams<string>()["conversationId"];
}

export function usePromptCards() {
  return useQuery({
    queryKey: ["prompt-cards"],
    queryFn: getPromptCards,
  });
}

export function useChatSessions(enabled = true) {
  return useQuery({
    queryKey: ["chat-sessions"],
    queryFn: getChatSessions,
    enabled,
  });
}

export function useChatMessages(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: () => getChatMessages(sessionId),
    enabled: Boolean(sessionId) && enabled,
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: sendFakeMessage,
  });
}

export function useStreamingMessage() {
  return useMutation<void, Error, StreamingMessageVariables>({
    mutationFn: ({ model, content, onMessage, onDone, onError }) =>
      sendMessage({
        model,
        content,
        onMessage,
        onDone: onDone ?? (() => undefined),
        onError: onError ?? (() => undefined),
      }),
  });
}
