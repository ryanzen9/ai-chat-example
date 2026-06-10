import { createBrowserRouter, Navigate } from "react-router";
import { ChatPage } from "../routes/ChatPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/chat" replace />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/chat/:conversationId",
    element: <ChatPage />,
  },
]);

export default router;
