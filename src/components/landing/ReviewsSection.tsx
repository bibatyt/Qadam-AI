import { useState } from "react";
import { Star, Send, User, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { toast } from "sonner";

const reviewTranslations = {
  en: {
    sectionTitle: "Leave Your Feedback",
    sectionDesc: "Your opinion helps us improve Qadam",
    namePlaceholder: "Your name",
    phonePlaceholder: "Phone number",
    reviewPlaceholder: "Share your experience with Qadam...",
    ratingLabel: "Your rating",
    submitButton: "Submit Review",
    sending: "Sending...",
    successMessage: "Thank you! Your review has been submitted.",
    errorMessage: "Failed to send review. Please try again.",
    fillAllFields: "Please fill all required fields",
    staticReviewsTitle: "What Our Users Say",
  },
  ru: {
    sectionTitle: "Оставьте отзыв",
    sectionDesc: "Ваше мнение помогает нам улучшать Qadam",
    namePlaceholder: "Ваше имя",
    phonePlaceholder: "Номер телефона",
    reviewPlaceholder: "Поделитесь вашим опытом использования Qadam...",
    ratingLabel: "Ваша оценка",
    submitButton: "Отправить отзыв",
    sending: "Отправка...",
    successMessage: "Спасибо! Ваш отзыв отправлен.",
    errorMessage: "Не удалось отправить отзыв. Попробуйте снова.",
    fillAllFields: "Пожалуйста, заполните все обязательные поля",
    staticReviewsTitle: "Что говорят наши пользователи",
  },
  kz: {
    sectionTitle: "Пікір қалдырыңыз",
    sectionDesc: "Сіздің пікіріңіз Qadam-ды жақсартуға көмектеседі",
    namePlaceholder: "Сіздің атыңыз",
    phonePlaceholder: "Телефон нөмірі",
    reviewPlaceholder: "Qadam қолдану тәжірибеңізбен бөлісіңіз...",
    ratingLabel: "Сіздің бағаңыз",
    submitButton: "Пікір жіберу",
    sending: "Жіберілуде...",
    successMessage: "Рахмет! Сіздің пікіріңіз жіберілді.",
    errorMessage: "Пікір жіберу сәтсіз. Қайтадан көріңіз.",
    fillAllFields: "Барлық қажетті өрістерді толтырыңыз",
    staticReviewsTitle: "Қолданушылар не дейді",
  },
};


export const ReviewsSection = () => {
  const { language } = useLandingLanguage();
  const t = reviewTranslations[language];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !review.trim()) {
      toast.error(t.fillAllFields);
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSe4grrh1NRN59JXJElnW2ROqk2KlCHdfCerqHPNTNSGyd6jGg/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            "entry.2007414048": name,
            "entry.208210183": phone,
            "entry.52692107": rating.toString(),
            "entry.1245087277": review,
          }),
        }
      );

      toast.success(t.successMessage);
      setName("");
      setPhone("");
      setReview("");
      setRating(5);
    } catch (error) {
      toast.error(t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-6xl">
        {/* Feedback Form */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t.sectionTitle}</h2>
            <p className="text-muted-foreground">{t.sectionDesc}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-6 md:p-8 shadow-elevated border border-border/50"
          >
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background border-border/60"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background border-border/60"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {t.ratingLabel}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Textarea */}
            <div className="relative mb-6">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                placeholder={t.reviewPlaceholder}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="pl-10 min-h-[120px] rounded-xl bg-background border-border/60 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-xl shadow-primary hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? (
                t.sending
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t.submitButton}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
