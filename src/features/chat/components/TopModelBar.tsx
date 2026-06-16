import { ThemeToggle } from "@/shared/theme/theme-toggle";
import { AppWindowIcon, CodeIcon, ArticleIcon } from "@phosphor-icons/react";
import { Tabs, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { useState } from "react";
import { useCurrentSessionId } from "../hooks";
import { useChatStore } from "../store";
import type { ModelId } from "../types";

const modelTabs: { id: ModelId; value: ModelId; label: string }[] = [
  {
    id: "deepseek-v4-flash",
    value: "deepseek-v4-flash",
    label: "DeepSeek-V4 Flash",
  },
  { id: "deepseek-v4-pro", value: "deepseek-v4-pro", label: "DeepSeek-V4 Pro" },
];

function ModelTabs({
  models = [],
  onModelChange,
}: {
  models?: { id: ModelId; value: string; label: string }[];
  onModelChange?: (modelId: ModelId) => void;
}) {
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);
  const currentSessionId = useCurrentSessionId();
  const setSessionModelId = useChatStore((state) => state.setSessionModelId);

  if (models.length === 0) {
    return <div className="animate-pulse">loading</div>;
  }

  function handleModelChange(value: string) {
    setSelectedModel(value as ModelId);

    if (currentSessionId) {
      setSessionModelId(currentSessionId, value as ModelId);
    }

    if (onModelChange) {
      onModelChange(value as ModelId);
    }
  }

  return (
    <div className="w-full max-w-md">
      <Tabs value={selectedModel} onValueChange={handleModelChange}>
        <TabsList className="h-9 rounded-md border border-border bg-muted p-0.5">
          {models.map((model) => (
            <TabsTrigger
              key={model.id}
              value={model.value}
              className="h-8 flex-none rounded px-3 text-sm data-active:bg-card data-active:shadow-none"
            >
              {model.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

function PreviewCodeTabs({
  onViewModelChange,
}: {
  onViewModelChange?: (view: "preview" | "code") => void;
}) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  function handleViewChange(value: string) {
    setActiveView(value as "preview" | "code");

    if (onViewModelChange) {
      onViewModelChange(value as "preview" | "code");
    }
  }

  return (
    <Tabs value={activeView} onValueChange={handleViewChange}>
      <TabsList>
        <TabsTrigger value="preview">
          <AppWindowIcon data-icon="inline-start" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon data-icon="inline-start" />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function MarkdownToggle() {
  const enableMarkdown = useChatStore((state) => state.enableMarkdown);
  const toggleMarkdown = useChatStore((state) => state.toggleMarkdown);

  return (
    <Tabs value={enableMarkdown ? "on" : "off"} onValueChange={toggleMarkdown}>
      <TabsList>
        <TabsTrigger value="off">
          <ArticleIcon data-icon="inline-start" />
          Plain
        </TabsTrigger>
        <TabsTrigger value="on">
          <ArticleIcon data-icon="inline-start" />
          Markdown
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function TopModelBar({
  onViewModelChange,
  onModelChange,
}: {
  onViewModelChange?: (view: "preview" | "code") => void;
  onModelChange?: (modelId: ModelId) => void;
}) {
  return (
    <header className="relative flex h-[var(--topbar-height)] items-center border-b border-border bg-app-shell">
      <div className="flex h-full items-center  gap-5 px-6">
        <ModelTabs models={modelTabs} onModelChange={onModelChange} />
      </div>

      <div className="ml-auto flex h-full items-center gap-3 px-6 text-muted-foreground">
        <PreviewCodeTabs onViewModelChange={onViewModelChange} />
        <MarkdownToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}

export default TopModelBar;
