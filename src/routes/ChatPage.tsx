import { useState } from "react";

import ChatWorkspace from "@/features/chat/components/ChatWorkspace";
import Sidebar from "@/features/chat/components/Sidebar";
import TopModelBar from "@/features/chat/components/TopModelBar";
import { cn } from "@/shared/lib/utils";

export function ChatPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-background font-mono text-foreground">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          isMobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!isMobileSidebarOpen}
      >
        <button
          type="button"
          aria-label="Close sidebar"
          className={cn(
            "absolute inset-0 bg-background/70 transition-opacity",
            isMobileSidebarOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setIsMobileSidebarOpen(false)}
        />

        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[min(var(--sidebar-width),85vw)] transition-transform duration-200",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
        </div>
      </div>

      <main className="flex min-w-0 flex-1 flex-col bg-app-shell lg:border-l lg:border-border">
        <TopModelBar onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <ChatWorkspace />
      </main>
    </div>
  );
}
