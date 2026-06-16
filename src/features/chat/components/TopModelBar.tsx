import { ThemeToggle } from "@/shared/theme/theme-toggle";
import { Button } from "@/shared/ui/button";
import {
  AppWindowIcon,
  ArticleIcon,
  CodeIcon,
  ListIcon,
} from "@phosphor-icons/react";
import { Tabs, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { useState } from "react";
import { useCurrentSessionId } from "../hooks";
import { useChatStore } from "../store";
import type { ModelId } from "../types";

const modelTabs: {
  id: ModelId;
  value: ModelId;
  label: string;
  shortLabel: string;
}[] = [
  {
    id: "deepseek-v4-flash",
    value: "deepseek-v4-flash",
    label: "DeepSeek-V4 Flash",
    shortLabel: "V4 Flash",
  },
  {
    id: "deepseek-v4-pro",
    value: "deepseek-v4-pro",
    label: "DeepSeek-V4 Pro",
    shortLabel: "V4 Pro",
  },
];

function ModelTabs({
  models = [],
  onModelChange,
}: {
  models?: { id: ModelId; value: string; label: string; shortLabel?: string }[];
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
    <div className="w-full min-w-0 md:max-w-md">
      <Tabs value={selectedModel} onValueChange={handleModelChange}>
        <TabsList className="scrollbar-none h-9 w-full max-w-full justify-start overflow-x-auto rounded-md border border-border bg-muted p-0.5 lg:w-fit">
          {models.map((model) => (
            <TabsTrigger
              key={model.id}
              value={model.value}
              className="h-8 min-w-0 flex-1 rounded px-2 text-xs data-active:bg-card data-active:shadow-none lg:flex-none lg:px-3 lg:text-sm"
            >
              <span className="truncate lg:hidden">
                {model.shortLabel ?? model.label}
              </span>
              <span className="hidden lg:inline">{model.label}</span>
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
          <span className="hidden min-[420px]:inline">Preview</span>
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon data-icon="inline-start" />
          <span className="hidden min-[420px]:inline">Code</span>
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
          <span className="sm:hidden">MD</span>
          <span className="hidden sm:inline">Markdown</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function TopModelBar({
  onViewModelChange,
  onModelChange,
  onOpenSidebar,
}: {
  onViewModelChange?: (view: "preview" | "code") => void;
  onModelChange?: (modelId: ModelId) => void;
  onOpenSidebar?: () => void;
}) {
  return (
    <header className="relative flex min-h-[var(--topbar-height)] flex-col gap-2 border-b border-border bg-app-shell px-3 py-2 md:h-[var(--topbar-height)] md:flex-row md:items-center md:px-6 md:py-0">
      <div className="flex w-full min-w-0 items-center gap-2 md:h-full md:w-auto md:flex-1 md:gap-5 lg:flex-none">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
        >
          <ListIcon data-icon="inline-start" aria-hidden="true" />
        </Button>
        <ModelTabs models={modelTabs} onModelChange={onModelChange} />
      </div>

      <div className="flex w-full min-w-0 items-center gap-2 text-muted-foreground md:ml-auto md:h-full md:w-auto md:justify-end md:gap-3">
        <div className="scrollbar-none flex min-w-0 flex-1 items-center gap-2 overflow-x-auto md:flex-none md:overflow-visible">
          <PreviewCodeTabs onViewModelChange={onViewModelChange} />
          <MarkdownToggle />
        </div>
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default TopModelBar;
