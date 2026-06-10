export type ModelId = "deepseek-v3" | "gpt-4o" | "claude-3.5";

export type MessageRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type PromptCard = {
  id: string;
  title: string;
  description: string;
  icon: "code" | "share" | "writing";
};

export type SessionItem = {
  id: string;
  isWorking: boolean;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
};
