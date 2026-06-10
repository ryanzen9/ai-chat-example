import type { SessionItem } from "../types";

interface SessionProps {
  session: SessionItem;
  active?: boolean;
  onClick?: (session: SessionItem) => void;
}

function Session({ session, active = false, onClick }: SessionProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(session)}
      className={`
        group
        flex
        w-full
        items-center
        rounded-md
        px-3
        py-2
        text-left
        transition-colors
        ${
          active
            ? "bg-[var(--surface-container-high)] text-[var(--primary-container)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--surface-container)] hover:text-[var(--text-primary)]"
        }
      `}
    >
      <span className="truncate text-sm font-medium">
        {session.title || "Untitled Chat"}
      </span>
    </button>
  );
}

export default Session;
