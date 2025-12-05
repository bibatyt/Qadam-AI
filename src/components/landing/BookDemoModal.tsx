import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function BookDemoModal() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: t.fillAllFields,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await fetch("https://hook.eu1.make.com/9yrgvxmvaon9fflptoxqv240cllqnjjc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          timestamp: new Date().toISOString(),
          language,
        }),
      });

      toast({
        title: t.demoSuccess,
        description: t.demoSuccessDesc,
      });
      
      setName("");
      setPhone("");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting demo request:", error);
      toast({
        title: t.demoError,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
          <Calendar className="w-4 h-4" />
          {t.bookDemo}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t.bookDemoTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.yourName}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t.yourPhone}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t.sending : t.submitDemo}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
