import { GraduationCap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function Header() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-primary">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Qadam</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
            <Calendar className="w-4 h-4" />
            {t.bookDemo}
          </Button>
          <Link to="/auth">
            <Button variant="outline" size="sm">{t.signIn}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
