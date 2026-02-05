import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface MobileHeaderProps {
  userName?: string;
  avatarUrl?: string;
  greeting?: string;
  showMenu?: boolean;
}

export function MobileHeader({ 
  userName = "User", 
  avatarUrl,
  greeting,
  showMenu = true 
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left - Menu */}
        {showMenu ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="py-6 space-y-4">
                <div className="flex items-center gap-3 px-2 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xl">Q</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{userName}</p>
                    <p className="text-sm text-muted-foreground">Студент</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-xl"
                    onClick={() => navigate("/my-path")}
                  >
                    📍 Мой путь
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-xl"
                    onClick={() => navigate("/counselor")}
                  >
                    💬 AI Помощник
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-xl"
                    onClick={() => navigate("/opportunities")}
                  >
                    🎓 Университеты
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-xl"
                    onClick={() => navigate("/settings")}
                  >
                    ⚙️ Настройки
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-10" />
        )}

        {/* Center - Greeting (optional) */}
        {greeting && (
          <div className="flex-1 text-center">
            <p className="text-sm font-semibold text-foreground truncate px-2">
              {greeting}
            </p>
          </div>
        )}

        {/* Right - Notifications & Avatar */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate("/settings")}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Q</span>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
