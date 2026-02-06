import { Map, MessageCircle, GraduationCap, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export function BottomNav() {
  const { language } = useLanguage();
  
  const navLabels = {
    ru: { path: "Мой путь", ai: "AI Помощник", universities: "Университеты", settings: "Настройки" },
    kk: { path: "Менің жолым", ai: "AI Көмекші", universities: "Университеттер", settings: "Параметрлер" },
    en: { path: "My Path", ai: "AI Assistant", universities: "Universities", settings: "Settings" },
  };
  
  const labels = navLabels[language as keyof typeof navLabels] || navLabels.en;
  
  const navItems = [
    { to: "/my-path", icon: Map, label: labels.path, emoji: "📍" },
    { to: "/counselor", icon: MessageCircle, label: labels.ai, emoji: "💬" },
    { to: "/universities", icon: GraduationCap, label: labels.universities, emoji: "🎓" },
    { to: "/settings", icon: Settings, label: labels.settings, emoji: "⚙️" },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="floating-dock px-2 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 touch-target",
                  isActive 
                    ? "bg-primary text-foreground" 
                    : "text-muted-foreground hover:text-foreground active:scale-95"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "w-6 h-6 transition-transform",
                    isActive && "scale-110"
                  )} />
                  <span className={cn(
                    "text-[10px] font-bold",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
