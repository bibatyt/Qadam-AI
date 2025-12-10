import { Home, Map, MessageCircle, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export function BottomNav() {
  const { t } = useLanguage();
  
  const navItems = [
    { to: "/dashboard", icon: Home, labelKey: "home" },
    { to: "/path", icon: Map, labelKey: "path" },
    { to: "/counselor", icon: MessageCircle, labelKey: "ai" },
    { to: "/statistics", icon: BarChart3, labelKey: "stats" },
    { to: "/settings", icon: Settings, labelKey: "settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border px-2 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[56px] touch-target",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive && "bg-primary/10"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold",
                  isActive && "text-primary"
                )}>
                  {t(item.labelKey)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}