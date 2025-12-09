import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { QadamLogo } from "./QadamLogo";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, MessageSquare } from "lucide-react";

export function Header() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];
  const [sheetOpen, setSheetOpen] = useState(false);

  const mobileLabels = {
    ru: { menu: "Меню", reviews: "Оставить отзыв" },
    en: { menu: "Menu", reviews: "Leave a Review" },
    kz: { menu: "Мәзір", reviews: "Пікір қалдыру" },
  };
  const labels = mobileLabels[language];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <QadamLogo size={36} />
          <span className="font-bold text-xl tracking-tight">Qadam</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/reviews">
            <Button variant="ghost" size="sm">{labels.reviews}</Button>
          </Link>
          <LanguageSwitcher />
          <Link to="/auth">
            <Button variant="outline" size="sm">{t.signIn}</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSwitcher />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>{labels.menu}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 mt-6">
                <Link to="/reviews" onClick={() => setSheetOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {labels.reviews}
                  </Button>
                </Link>

                <Link to="/auth" onClick={() => setSheetOpen(false)}>
                  <Button variant="default" className="w-full">{t.signIn}</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
