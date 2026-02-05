import { Home, MessageCircle, Map, Search, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export function BottomNav() {
  const { t } = useLanguage();
  
  const navItems = [
    { to: "/dashboard", icon: Home, labelKey: "home" },
    { to: "/my-path", icon: Map, labelKey: "path" },
    { to: "/counselor", icon: MessageCircle, labelKey: "ai" },
    { to: "/opportunities", icon: Search, labelKey: "search" },
    { to: "/settings", icon: User, labelKey: "profile" },
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
                    {t(item.labelKey)}
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
