export type ModelId = "deepseek-v3" | "gpt-4o" | "claude-3.5";

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
