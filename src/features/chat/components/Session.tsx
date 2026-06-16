import type { ChatSession } from "../types";
import { cn } from "@/shared/lib/utils";
import { XIcon } from "lucide-react";

interface SessionProps {
  session: ChatSession;
  active?: boolean;
  onClick?: (session: ChatSession) => void;
  onCancel?: (sessionId: string) => void;
}

function Session({ session, active = false, onClick, onCancel }: SessionProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(session)}
      className={cn(
        "group flex min-w-0 w-full items-center rounded-md px-3 py-2 text-left transition-colors",
        active
          ? "bg-sidebar-accent text-primary"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {session.title || "Untitled Chat"}
      </span>

      {session.isWorking && (
        <span className="ml-auto flex shrink-0 items-center gap-1">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span
            className="hidden rounded p-0.5 hover:bg-sidebar-accent group-hover:inline-flex"
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.(session.id);
            }}
            role="button"
            aria-label="Cancel"
          >
            <XIcon className="size-3" />
          </span>
        </span>
      )}
    </button>
  );
}

export default Session;
