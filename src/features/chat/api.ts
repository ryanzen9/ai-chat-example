import type { ChatMessage, ModelId } from "./types";
import { useChatStore } from "./store";

export type Conversation = {
  id: string;
  title: string;
};

export type Message = {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
};

type DeepSeekMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

type DeepSeekRequest = {
  messages: DeepSeekMessage[];

  model: string;

  thinking?: {
    type: "enabled" | "disabled";
  };

  reasoning_effort?: "low" | "medium" | "high";

  max_tokens?: number;

  response_format?: {
    type: "text" | "json_object";
  };

  stop?: string | string[] | null;

  stream?: boolean;

  stream_options?: Record<string, unknown> | null;

  temperature?: number;

  top_p?: number;

  tools?: unknown[] | null;

  tool_choice?: "none" | "auto" | Record<string, unknown>;

  logprobs?: boolean;

  top_logprobs?: number | null;
};

export type DeepSeekChatCompletionChunk = {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  system_fingerprint?: string;

  choices: DeepSeekChunkChoice[];

  usage?: DeepSeekUsage | null;
};

export type DeepSeekChunkChoice = {
  index: number;

  delta: DeepSeekDelta;

  finish_reason:
    | "stop"
    | "length"
    | "content_filter"
    | "tool_calls"
    | "insufficient_system_resource"
    | null;

  logprobs: unknown | null;
};

export type DeepSeekDelta = {
  role?: "assistant" | "user" | "system" | "tool" | null;

  content?: string;

  reasoning_content?: string;

  tool_calls?: unknown[];
};

export type DeepSeekUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch("/api/conversations");
  if (!res.ok) throw new Error("获取会话列表失败");
  return res.json();
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const res = await fetch(`/api/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error("获取消息失败");
  return res.json();
}

export async function sendMessage(input: {
  model: ModelId;
  content: string;
  signal?: AbortSignal;
  onMessage: (message: Omit<ChatMessage, "id">) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}) {
  let hasDone = false;

  function markDone() {
    if (hasDone) return;

    hasDone = true;
    input.onDone();
  }

  function handleChunk(payload: DeepSeekChatCompletionChunk) {
    if (payload.choices.length === 0) return;

    for (const choice of payload.choices) {
      if (
        choice.finish_reason === "content_filter" ||
        choice.finish_reason === "insufficient_system_resource"
      ) {
        throw new Error(`DeepSeek stream stopped: ${choice.finish_reason}`);
      }

      const messageContent = choice.delta.content;

      if (messageContent) {
        input.onMessage({
          role: "assistant",
          content: messageContent,
          createdAt: new Date().toISOString(),
          status: "streaming",
        });
      }
    }
  }

  function handleSseEvent(event: string) {
    const raw = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.replace(/^data:\s?/, ""))
      .join("\n")
      .trim();

    if (!raw) return;

    if (raw === "[DONE]") {
      markDone();
      return;
    }

    const payload = JSON.parse(raw) as DeepSeekChatCompletionChunk;
    handleChunk(payload);
  }

  try {
    const apiKey = useChatStore.getState().apiKey;

    if (!apiKey) {
      throw new Error("请先在左侧填写 DeepSeek API Key。");
    }

    const requestBody: DeepSeekRequest = {
      model: input.model,
      messages: [
        {
          role: "user",
          content: input.content,
        },
      ],
      stream: true,
      thinking: {
        type: "enabled",
      },
      reasoning_effort: "high",
      response_format: {
        type: "text",
      },
    };

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: input.signal,
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(
        errorText || `Agent API 请求失败: ${res.status} ${res.statusText}`,
      );
    }

    if (!res.body) {
      throw new Error("Agent API 响应体为空。");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        buffer += decoder.decode();
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split(/\r?\n\r?\n/);

      buffer = events.pop() ?? "";

      for (const event of events) {
        handleSseEvent(event);

        if (hasDone) {
          return;
        }
      }
    }

    if (buffer.trim()) {
      handleSseEvent(buffer);
    }

    markDone();
  } catch (error) {
    const normalizedError =
      error instanceof Error ? error : new Error(String(error));

    input.onError(normalizedError);
    throw normalizedError;
  }
}
