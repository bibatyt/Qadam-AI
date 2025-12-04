import { Home, Map, MessageCircle, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Главная" },
  { to: "/path", icon: Map, label: "Путь" },
  { to: "/counselor", icon: MessageCircle, label: "AI" },
  { to: "/statistics", icon: BarChart3, label: "Статистика" },
  { to: "/settings", icon: Settings, label: "Настройки" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-2 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "nav-item flex-1",
                isActive ? "nav-item-active" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
