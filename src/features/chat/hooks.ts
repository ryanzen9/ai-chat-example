import { useMutation, useQuery } from "@tanstack/react-query";
import { getPromptCards, getSessionItems, sendFakeMessage } from "./mock";

export function usePromptCards() {
  return useQuery({
    queryKey: ["prompt-cards"],
    queryFn: getPromptCards,
  });
}

export function useSessionItems() {
  return useQuery({
    queryKey: ["session-items"],
    queryFn: getSessionItems,
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: sendFakeMessage,
  });
}
