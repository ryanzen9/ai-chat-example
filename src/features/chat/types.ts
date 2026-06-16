export const MODEL_IDS = ["deepseek-v4-flash", "deepseek-v4-pro"] as const;

export type ModelId = (typeof MODEL_IDS)[number];

export function isModelId(value: unknown): value is ModelId {
  return typeof value === "string" && MODEL_IDS.includes(value as ModelId);
}

export type MessageRole = "user" | "assistant";

export type ChatMessageStatus =
  | "pending"
  | "error"
  | "streaming"
  | "done"
  | "cancelled";

export type PromptCard = {
  id: string;
  title: string;
  description: string;
  icon: "code" | "share" | "writing";
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status?: ChatMessageStatus;
};

export type ChatSession = {
  id: string;
  modelId: ModelId;
  isWorking: boolean;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
};
