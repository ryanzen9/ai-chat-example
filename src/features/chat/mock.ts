import type { ChatMessage, ChatSession, PromptCard } from "./types";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPromptCards(): Promise<PromptCard[]> {
  await wait(2500);

  return [
    {
      id: "react-hook",
      title: "React Hook",
      description: "Help me write a React hook: ",
      icon: "code",
    },
    {
      id: "cors",
      title: "Explain CORS",
      description: "Explain Cross-Origin Resource Sharing: ",
      icon: "share",
    },
    {
      id: "writing",
      title: "Creative Writing",
      description: "Write a story about a cyber city: ",
      icon: "writing",
    },
  ];
}

export async function getChatSessions(): Promise<
  Omit<ChatSession, "messages">[]
> {
  await wait(2000);

  return [
    {
      id: "session-1",
      modelId: "gpt-4o",
      title: "Chat about React",
      lastMessage: "What is the useState hook?",
      isWorking: false,
      lastMessageTime: "2024-06-01T12:00:00Z",
    },
    {
      id: "session-2",
      modelId: "deepseek-v3",
      title: "Chat about DeepSeek",
      lastMessage: "What is DeepSeek?",
      isWorking: false,
      lastMessageTime: "2024-06-01T12:00:00Z",
    },
  ];
}

export async function getChatMessages(
  sessionId: string,
): Promise<ChatMessage[]> {
  await wait(1500);
  console.log("Fetching messages for session:", sessionId);

  if (sessionId === "session-1") {
    return [
      {
        id: "message-1",
        role: "user",
        content: "What is the useState hook?",
        createdAt: "2024-06-01T12:00:00Z",
      },
      {
        id: "message-2",
        role: "assistant",
        content: "Test Message 1",
        createdAt: "2024-06-01T12:01:00Z",
      },
    ];
  }

  return [
    {
      id: "message-1",
      role: "user",
      content: "What is the useState hook?",
      createdAt: "2024-06-01T12:00:00Z",
    },
    {
      id: "message-2",
      role: "assistant",
      content: "Test Message 2",
      createdAt: "2024-06-01T12:01:00Z",
    },
  ];
}

export async function sendFakeMessage(content: string): Promise<ChatMessage> {
  await wait(700);

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: `收到：${content}\n\n这是一个模拟 AI 回复。下一步你可以把这个函数替换成真实的 /api/chat 请求。`,
    createdAt: new Date().toISOString(),
  };
}
