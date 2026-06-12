import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getChatMessages,
  getChatSessions,
  getPromptCards,
  sendFakeMessage,
} from "./mock";

export function usePromptCards() {
  return useQuery({
    queryKey: ["prompt-cards"],
    queryFn: getPromptCards,
  });
}

export function useChatSessions() {
  return useQuery({
    queryKey: ["chat-sessions"],
    queryFn: getChatSessions,
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
