import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { MentorChatFAB } from "@/features/chat";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Outlet />
      <MentorChatFAB />
      <BottomNav />
    </div>
  );
}
