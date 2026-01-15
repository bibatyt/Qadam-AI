import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";

const reviewsTranslations = {
  en: {
    headerTitle: "Leave a Review",
    pageTitle: "Leave a Review",
    pageDesc: "Your opinion helps us improve",
    formTitle: "Review Form",
  },
  ru: {
    headerTitle: "Оставить отзыв",
    pageTitle: "Оставить отзыв",
    pageDesc: "Ваше мнение помогает нам стать лучше",
    formTitle: "Форма отзыва",
  },
  kz: {
    headerTitle: "Пікір қалдыру",
    pageTitle: "Пікір қалдыру",
    pageDesc: "Сіздің пікіріңіз бізге жақсаруға көмектеседі",
    formTitle: "Пікір формасы",
  },
};

const Reviews = () => {
  const { language } = useLandingLanguage();
  const t = reviewsTranslations[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">{t.headerTitle}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">{t.pageTitle}</h2>
            <p className="text-muted-foreground">{t.pageDesc}</p>
          </div>

          {/* Embedded Typeform */}
          <div className="w-full overflow-hidden rounded-xl bg-card border border-border/50" style={{ height: "600px" }}>
            <iframe
              src="https://form.typeform.com/to/VoSk3S3r"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="camera; microphone; autoplay; encrypted-media;"
              style={{ border: "none" }}
              title={t.formTitle}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reviews;
