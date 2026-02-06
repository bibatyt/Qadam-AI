import { Map, MessageCircle, GraduationCap, Settings, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export function BottomNav() {
  const { language } = useLanguage();
  
  const navLabels = {
    ru: { path: "Путь", ai: "AI", universities: "Вузы", opportunities: "Шансы", settings: "Ещё" },
    kk: { path: "Жол", ai: "AI", universities: "ЖОО", opportunities: "Мүмкіндік", settings: "Көбірек" },
    en: { path: "Path", ai: "AI", universities: "Unis", opportunities: "Opps", settings: "More" },
  };
  
  const labels = navLabels[language as keyof typeof navLabels] || navLabels.en;
  
  const navItems = [
    { to: "/my-path", icon: Map, label: labels.path },
    { to: "/counselor", icon: MessageCircle, label: labels.ai },
    { to: "/universities", icon: GraduationCap, label: labels.universities },
    { to: "/opportunities", icon: Sparkles, label: labels.opportunities },
    { to: "/settings", icon: Settings, label: labels.settings },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="floating-dock px-2 py-2 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary text-foreground" 
                    : "text-muted-foreground hover:text-foreground active:scale-95"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )} />
                  <span className={cn(
                    "text-[9px] font-bold",
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
