import type { ChatMessage, PromptCard, SessionItem } from "./types";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPromptCards(): Promise<PromptCard[]> {
  await wait(250);

  return [
    {
      id: "react-hook",
      title: "React Hook",
      description: "Help me write a React hook",
      icon: "code",
    },
    {
      id: "cors",
      title: "Explain CORS",
      description: "Explain Cross-Origin Resource Sharing",
      icon: "share",
    },
    {
      id: "writing",
      title: "Creative Writing",
      description: "Write a story about a cyber city",
      icon: "writing",
    },
  ];
}

export async function getSessionItems(): Promise<SessionItem[]> {
  await wait(2000);

  return [
    {
      id: "session-1",
      title: "Chat about React",
      lastMessage: "What is the useState hook?",
      isWorking: false,
      lastMessageTime: "2024-06-01T12:00:00Z",
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
