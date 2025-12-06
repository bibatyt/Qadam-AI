import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BookDemoModal } from "./BookDemoModal";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

function MobileDemoForm({ onSuccess }: { onSuccess: () => void }) {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({ title: t.fillAllFields, variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      await fetch("https://hook.eu1.make.com/9yrgvxmvaon9fflptoxqv240cllqnjjc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          timestamp: new Date().toISOString(),
          language,
        }),
      });

      toast({ title: t.demoSuccess, description: t.demoSuccessDesc });
      setName("");
      setPhone("");
      onSuccess();
    } catch (error) {
      console.error("Error submitting demo request:", error);
      toast({ title: t.demoError, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="md-name">{t.yourName}</Label>
        <Input id="md-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} disabled={isLoading} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="md-phone">{t.yourPhone}</Label>
        <Input id="md-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" disabled={isLoading} />
      </div>
      <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
        {isLoading ? t.sending : t.submitDemo}
      </Button>
    </form>
  );
}

export function Header() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];
  const [sheetOpen, setSheetOpen] = useState(false);
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);

  const mobileLabels = {
    ru: { demo: "Заказать демо", menu: "Меню" },
    en: { demo: "Book demo", menu: "Menu" },
    kz: { demo: "Демо тапсырысы", menu: "Мәзір" },
  };
  const labels = mobileLabels[language];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-primary relative">
            <span className="text-primary-foreground font-bold text-lg">Q</span>
          </div>
          <span className="font-bold text-lg">Qadam</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSwitcher />
          <BookDemoModal />
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
                <Dialog open={demoDialogOpen} onOpenChange={setDemoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      {labels.demo}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t.bookDemoTitle}</DialogTitle>
                    </DialogHeader>
                    <MobileDemoForm onSuccess={() => { setDemoDialogOpen(false); setSheetOpen(false); }} />
                  </DialogContent>
                </Dialog>

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
