import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

type Language = "ru" | "kk" | "en";

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "kk", label: "KZ" },
];

export function AppLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-muted rounded-full p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
            language === lang.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
