import ChatWorkspace from "@/features/chat/components/ChatWorkspace";
import Sidebar from "@/features/chat/components/Sidebar";
import TopModelBar from "@/features/chat/components/TopModelBar";

export function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground mono">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col border-l border-border bg-[var(--app-shell)]">
        <TopModelBar />
        <ChatWorkspace />
      </main>
    </div>
  );
}
