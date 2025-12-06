import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BookDemoModal } from "./BookDemoModal";
import { FeedbackModal } from "./FeedbackModal";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, MessageSquare, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

function MobileFeedbackForm({ onSuccess }: { onSuccess: () => void }) {
  const { language } = useLandingLanguage();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [review, setReview] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const feedbackText = {
    ru: {
      title: "Ваш Отзыв о Qadam",
      nameLabel: "Ваше Имя",
      namePlaceholder: "Введите ваше имя",
      phoneLabel: "Телефон (опционально)",
      phonePlaceholder: "+7 (___) ___-__-__",
      reviewLabel: "Отзыв",
      reviewPlaceholder: "Расскажите о вашем опыте...",
      suggestionsLabel: "Что стоит изменить? (опционально)",
      suggestionsPlaceholder: "Ваши предложения...",
      submit: "Отправить",
      sending: "Отправка...",
      successTitle: "Спасибо за ваш отзыв!",
      successDesc: "Мы ценим ваше мнение.",
      errorTitle: "Ошибка при отправке",
      fillRequired: "Заполните обязательные поля",
    },
    en: {
      title: "Your Feedback on Qadam",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your name",
      phoneLabel: "Phone (optional)",
      phonePlaceholder: "+7 (___) ___-__-__",
      reviewLabel: "Review",
      reviewPlaceholder: "Tell us about your experience...",
      suggestionsLabel: "What should we change? (optional)",
      suggestionsPlaceholder: "Your suggestions...",
      submit: "Submit",
      sending: "Sending...",
      successTitle: "Thank you!",
      successDesc: "We appreciate your feedback.",
      errorTitle: "Error sending",
      fillRequired: "Fill in required fields",
    },
    kz: {
      title: "Qadam туралы пікіріңіз",
      nameLabel: "Атыңыз",
      namePlaceholder: "Атыңызды енгізіңіз",
      phoneLabel: "Телефон (міндетті емес)",
      phonePlaceholder: "+7 (___) ___-__-__",
      reviewLabel: "Пікір",
      reviewPlaceholder: "Тәжірибеңіз туралы айтыңыз...",
      suggestionsLabel: "Нені өзгерту керек? (міндетті емес)",
      suggestionsPlaceholder: "Ұсыныстарыңыз...",
      submit: "Жіберу",
      sending: "Жіберілуде...",
      successTitle: "Рахмет!",
      successDesc: "Пікіріңізді бағалаймыз.",
      errorTitle: "Жіберу қатесі",
      fillRequired: "Міндетті өрістерді толтырыңыз",
    },
  };

  const text = feedbackText[language];

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !review.trim()) {
      toast({ title: text.fillRequired, variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      await fetch("https://hook.eu1.make.com/8apuia9k3v1in0du3vhu8ics3rg3e1nv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          review: review.trim(),
          suggestions: suggestions.trim() || null,
          timestamp: new Date().toISOString(),
          language,
        }),
      });

      toast({ title: text.successTitle, description: text.successDesc });
      setName("");
      setPhone("");
      setReview("");
      setSuggestions("");
      onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({ title: text.errorTitle, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={submitReview} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="m-name" className="text-sm">{text.nameLabel} <span className="text-destructive">*</span></Label>
        <Input id="m-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={text.namePlaceholder} disabled={isLoading} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="m-phone" className="text-sm">{text.phoneLabel}</Label>
        <Input id="m-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={text.phonePlaceholder} disabled={isLoading} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="m-review" className="text-sm">{text.reviewLabel} <span className="text-destructive">*</span></Label>
        <Textarea id="m-review" value={review} onChange={(e) => setReview(e.target.value)} placeholder={text.reviewPlaceholder} disabled={isLoading} className="min-h-[80px] resize-none" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="m-suggestions" className="text-sm">{text.suggestionsLabel}</Label>
        <Textarea id="m-suggestions" value={suggestions} onChange={(e) => setSuggestions(e.target.value)} placeholder={text.suggestionsPlaceholder} disabled={isLoading} className="min-h-[60px] resize-none" />
      </div>
      <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
        {isLoading ? text.sending : text.submit}
      </Button>
    </form>
  );
}

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
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);

  const mobileLabels = {
    ru: { feedback: "Оставить отзыв", demo: "Заказать демо", menu: "Меню" },
    en: { feedback: "Leave feedback", demo: "Book demo", menu: "Menu" },
    kz: { feedback: "Пікір қалдыру", demo: "Демо тапсырысы", menu: "Мәзір" },
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
          <FeedbackModal />
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
                <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {labels.feedback}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {language === "ru" ? "Ваш Отзыв о Qadam" : language === "kz" ? "Qadam туралы пікіріңіз" : "Your Feedback on Qadam"}
                      </DialogTitle>
                    </DialogHeader>
                    <MobileFeedbackForm onSuccess={() => { setFeedbackDialogOpen(false); setSheetOpen(false); }} />
                  </DialogContent>
                </Dialog>

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
