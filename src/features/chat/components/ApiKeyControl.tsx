import { CheckIcon, KeyIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { getDeepSeekApiKey, setDeepSeekApiKey } from "../api-key";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

function ApiKeyControl() {
  const [apiKey, setApiKey] = useState(() => getDeepSeekApiKey());
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setDeepSeekApiKey(apiKey);
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
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
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
