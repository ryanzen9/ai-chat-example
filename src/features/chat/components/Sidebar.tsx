import { CloudIcon, GearSixIcon, GithubLogoIcon } from "@phosphor-icons/react";
import Button from "@shared/ui/components/Button";
import { useState } from "react";
import { useSessionItems } from "../hooks";
import { useChatStore } from "../store";
import type { SessionItem } from "../types";
import Session from "./Session";

function Sidebar() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]); // Placeholder for session data
  const clearMessages = useChatStore((state) => state.clearMessages);

  const { data, isLoading } = useSessionItems();
  const sessionItems = data || [];

  function newChatClickHandler() {
    // 清空当前界面缓存
    clearMessages();
    setCurrentSessionId(null);
  }

  return (
    <aside className="flex h-screen w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-card)]">
      <div className="flex h-[var(--topbar-height)] items-center gap-3 border-b border-[var(--border-subtle)] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#502400] text-[var(--primary-container)]">
          <CloudIcon size={19} weight="fill" />
        </div>

        <div>
          <div className="text-[20px] font-semibold leading-6 tracking-[-0.02em]">
            Chat
          </div>
          <div className="text-sm leading-5 text-[var(--text-secondary)]">
            Infrastructure Mode
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-4 py-5">
        <Button variant="primary" handleClick={newChatClickHandler}>
          New Chat
        </Button>

        <div className="mt-6 mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Recent Chats
        </div>

        <div className="flex min-h-0 flex-1">
          <div className=" w-full rounded border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-secondary)]">
            {isLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-[var(--text-secondary)]">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border-subtle)] border-t-[var(--primary-container)]" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : sessionItems.length > 0 ? (
              sessionItems.map((item) => (
                <Session
                  key={item.id}
                  session={item}
                  active={currentSessionId === item.id}
                  onClick={(session: SessionItem) =>
                    setCurrentSessionId(session.id)
                  }
                />
              ))
            ) : (
              "No recent chats"
            )}
          </div>
        </div>

        {/* <nav className="mt-4 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav> */}
      </div>

      <div className="border-t border-[var(--border-subtle)] px-4 py-4">
        <button className="flex h-10 w-full items-center gap-3 rounded px-1 text-left text-[15px] font-semibold text-[#cbd5e1] hover:text-white">
          <GearSixIcon size={18} />
          Configuration
        </button>

        <button className="flex h-10 w-full items-center gap-3 rounded px-1 text-left text-[15px] font-semibold text-[#cbd5e1] hover:text-white">
          <GithubLogoIcon size={18} />
          Github
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
