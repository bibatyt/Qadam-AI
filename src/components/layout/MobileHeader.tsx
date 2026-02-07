import { Menu, Bell, User } from "lucide-react";
import qadamLogo from "@/assets/qadam-logo.png";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useLanguage } from "@/hooks/useLanguage";

interface MobileHeaderProps {
  userName?: string;
  avatarUrl?: string;
  greeting?: string;
  showMenu?: boolean;
}

const translations = {
  ru: {
    student: "Студент",
    myPath: "Мой путь",
    aiHelper: "AI Помощник",
    universities: "Университеты",
    settings: "Настройки",
  },
  en: {
    student: "Student",
    myPath: "My Path",
    aiHelper: "AI Assistant",
    universities: "Universities",
    settings: "Settings",
  },
  kk: {
    student: "Студент",
    myPath: "Менің жолым",
    aiHelper: "AI Көмекші",
    universities: "Университеттер",
    settings: "Баптаулар",
  },
};

export function MobileHeader({ 
  userName = "User", 
  avatarUrl,
  greeting,
  showMenu = true 
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
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
                <img 
                  src={qadamLogo} 
                  alt="Qadam" 
                  className="w-12 h-12 object-contain"
                />
                  <div>
                    <p className="font-bold text-foreground">{userName}</p>
                    <p className="text-sm text-muted-foreground">{t.student}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-xl"
                    onClick={() => navigate("/my-path")}
                  >
                    📍 {t.myPath}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-xl"
                    onClick={() => navigate("/counselor")}
                  >
                    💬 {t.aiHelper}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-xl"
                    onClick={() => navigate("/universities")}
                  >
                    🎓 {t.universities}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-xl"
                    onClick={() => navigate("/settings")}
                  >
                    ⚙️ {t.settings}
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
            <img 
              src={qadamLogo} 
              alt="Qadam" 
              className="w-8 h-8 object-contain"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}