import { CloudIcon, GearSixIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { cn } from "@/shared/lib/utils";
import Button from "@shared/ui/components/Button";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useChatSessions, useCurrentSessionId } from "../hooks";
import { useChatStore } from "../store";
import type { ChatSession } from "../types";
import Session from "./Session";

function Sidebar() {
  const currentSessionId = useCurrentSessionId();
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);
  const setSessions = useChatStore((state) => state.setSessions);
  const sessions = useChatStore((state) => state.sessions);

  const { data, isLoading } = useChatSessions(sessions.length === 0);

  const navigate = useNavigate();

  useEffect(() => {
    // 只在初始加载时设置会话列表
    if (!data) return;
    if (sessions.length > 0) return;

    // 非首次直接读取缓存
    setSessions(data);
  }, [data, setSessions, sessions.length]);

  function newChatClickHandler() {
    setSelectedModel("deepseek-v3");
    navigate("/chat");
  }

  function sessionClickHandler(session: ChatSession) {
    setSelectedModel(session.modelId);
    navigate(`/chat/${session.id}`);
  }

  return (
    <aside className="flex h-screen w-[var(--sidebar-width)] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-[var(--topbar-height)] items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex size-8 items-center justify-center rounded-md bg-app-brand-soft text-primary">
          <CloudIcon weight="fill" />
        </div>

        <div>
          <div className="text-xl font-semibold leading-6">
            Chat
          </div>
          <div className="text-sm leading-5 text-muted-foreground">
            Infrastructure Mode
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-5">
        <Button variant="primary" handleClick={newChatClickHandler}>
          New Chat
        </Button>

        <div className="mt-6 mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Recent Chats
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="w-full rounded-md border-border px-3 py-2 text-sm text-muted-foreground">
            {isLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : sessions.length > 0 ? (
              sessions.map((item) => (
                <Session
                  key={item.id}
                  session={item}
                  active={currentSessionId === item.id}
                  onClick={() => sessionClickHandler(item)}
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

      <div className="border-t border-sidebar-border px-4 py-4">
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-md px-1 text-left text-[15px] font-semibold text-muted-foreground transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <GearSixIcon />
          Configuration
        </button>

        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-md px-1 text-left text-[15px] font-semibold text-muted-foreground transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <GithubLogoIcon />
          Github
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
