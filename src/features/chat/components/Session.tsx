import type { ChatSession } from "../types";
import { cn } from "@/shared/lib/utils";

interface SessionProps {
  session: ChatSession;
  active?: boolean;
  onClick?: (session: ChatSession) => void;
}

function Session({ session, active = false, onClick }: SessionProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(session)}
      className={cn(
        "group flex w-full items-center rounded-md px-3 py-2 text-left transition-colors",
        active
          ? "bg-sidebar-accent text-primary"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <span className="truncate text-sm font-medium">
        {session.title || "Untitled Chat"}
      </span>
    </button>
  );
}

export default Session;
