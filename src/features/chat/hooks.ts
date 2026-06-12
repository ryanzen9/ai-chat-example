import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import {
  getChatMessages,
  getChatSessions,
  getPromptCards,
  sendFakeMessage,
} from "./mock";

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
