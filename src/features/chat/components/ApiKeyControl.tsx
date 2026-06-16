import { CheckIcon, KeyIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { useChatStore } from "../store";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

function ApiKeyControl() {
  const apiKey = useChatStore((state) => state.apiKey);
  const setApiKey = useChatStore((state) => state.setApiKey);
  const [value, setValue] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setApiKey(value);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1200);
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3">
      <label
        htmlFor="deepseek-api-key"
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        <KeyIcon aria-hidden="true" />
        DeepSeek Key
      </label>

      <div className="flex gap-2">
        <Input
          id="deepseek-api-key"
          type="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSave();
            }
          }}
          placeholder="sk-..."
          autoComplete="off"
          className="h-8"
        />

        <Button
          type="button"
          size="icon"
          variant={saved ? "secondary" : "outline"}
          aria-label="Save DeepSeek API key"
          onClick={handleSave}
        >
          <CheckIcon data-icon="inline-start" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export default ApiKeyControl;
