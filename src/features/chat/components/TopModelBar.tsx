import { AppWindowIcon, CodeIcon } from "@phosphor-icons/react";
import { Tabs, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { useState } from "react";
import { useCurrentSessionId } from "../hooks";
import { useChatStore } from "../store";
import type { ModelId } from "../types";

const modelTabs: { id: ModelId; value: ModelId; label: string }[] = [
  { id: "deepseek-v3", value: "deepseek-v3", label: "DeepSeek-V3" },
  { id: "gpt-4o", value: "gpt-4o", label: "GPT-4o" },
  { id: "claude-3.5", value: "claude-3.5", label: "Claude-3.5" },
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
              className="h-8 flex-none rounded px-3 text-sm data-active:bg-card data-active:text-foreground data-active:shadow-none"
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
          <AppWindowIcon />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon />
          Code
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
    <header className="relative flex h-[var(--topbar-height)] items-center border-b border-border bg-[var(--app-shell)]">
      <div className="flex h-full items-center  gap-5 px-6">
        <ModelTabs models={modelTabs} onModelChange={onModelChange} />
      </div>

      <div className="ml-auto flex h-full items-center gap-5 px-6 text-muted-foreground ">
        <PreviewCodeTabs onViewModelChange={onViewModelChange} />
      </div>
    </header>
  );
}

export default TopModelBar;
