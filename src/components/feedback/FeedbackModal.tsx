import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Star, Send, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type FeedbackLanguage = "ru" | "en" | "kk";

const translations = {
  ru: {
    title: "Оставить отзыв",
    subtitle: "Помогите нам стать лучше",
    ratingLabel: "Как вам Qadam AI?",
    feedbackLabel: "Ваш отзыв",
    feedbackPlaceholder: "Расскажите, что понравилось или что можно улучшить...",
    submit: "Отправить",
    submitting: "Отправка...",
    skip: "Пропустить",
    thankYou: "Спасибо за отзыв!",
    thankYouSub: "Ваше мнение очень важно для нас",
    close: "Закрыть",
    error: "Ошибка отправки",
    ratingDescriptions: {
      1: "Очень плохо",
      2: "Плохо",
      3: "Нормально",
      4: "Хорошо",
      5: "Отлично!",
    },
  },
  en: {
    title: "Leave Feedback",
    subtitle: "Help us improve",
    ratingLabel: "How do you like Qadam AI?",
    feedbackLabel: "Your feedback",
    feedbackPlaceholder: "Tell us what you liked or what could be improved...",
    submit: "Submit",
    submitting: "Submitting...",
    skip: "Skip",
    thankYou: "Thank you for your feedback!",
    thankYouSub: "Your opinion matters to us",
    close: "Close",
    error: "Submission error",
    ratingDescriptions: {
      1: "Very bad",
      2: "Bad",
      3: "Okay",
      4: "Good",
      5: "Excellent!",
    },
  },
  kk: {
    title: "Пікір қалдыру",
    subtitle: "Бізге жақсаруға көмектесіңіз",
    ratingLabel: "Qadam AI ұнады ма?",
    feedbackLabel: "Сіздің пікіріңіз",
    feedbackPlaceholder: "Не ұнағанын немесе нені жақсартуға болатынын айтыңыз...",
    submit: "Жіберу",
    submitting: "Жіберілуде...",
    skip: "Өткізу",
    thankYou: "Пікіріңізге рахмет!",
    thankYouSub: "Сіздің пікіріңіз бізге маңызды",
    close: "Жабу",
    error: "Жіберу қатесі",
    ratingDescriptions: {
      1: "Өте нашар",
      2: "Нашар",
      3: "Қалыпты",
      4: "Жақсы",
      5: "Тамаша!",
    },
  },
};

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: "settings" | "milestone" | "completion";
}

export function FeedbackModal({ isOpen, onClose, source = "settings" }: FeedbackModalProps) {
  const [language, setLanguage] = useState<FeedbackLanguage>("ru");
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const t = translations[language];

  const handleSubmit = async () => {
    if (!rating && !feedback.trim()) {
      onClose();
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-feedback", {
        body: {
          rating,
          feedback: feedback.trim(),
          language,
          source,
          timestamp: new Date().toISOString(),
        },
      });

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        // Reset state after close
        setTimeout(() => {
          setRating(null);
          setFeedback("");
          setSubmitted(false);
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(t.error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
    setTimeout(() => {
      setRating(null);
      setFeedback("");
      setSubmitted(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-card border border-border rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
              <button
                onClick={handleSkip}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Language Toggle */}
              <div className="flex items-center gap-1 mb-4 bg-muted rounded-full p-1 w-fit">
                {(["ru", "en", "kk"] as FeedbackLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                      language === lang
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{t.title}</h2>
                  <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-8 h-8 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {t.thankYou}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t.thankYouSub}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Rating */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        {t.ratingLabel}
                      </label>
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRating(star)}
                            className={cn(
                              "p-2 rounded-xl transition-all",
                              rating && rating >= star
                                ? "text-amber-400"
                                : "text-muted-foreground/30 hover:text-muted-foreground"
                            )}
                          >
                            <Star
                              className="w-8 h-8"
                              fill={rating && rating >= star ? "currentColor" : "none"}
                            />
                          </motion.button>
                        ))}
                      </div>
                      {rating && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-sm text-muted-foreground mt-2"
                        >
                          {t.ratingDescriptions[rating as keyof typeof t.ratingDescriptions]}
                        </motion.p>
                      )}
                    </div>

                    {/* Feedback Text */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {t.feedbackLabel}
                      </label>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={t.feedbackPlaceholder}
                        className="min-h-[100px] rounded-xl resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        onClick={handleSkip}
                        className="flex-1 h-12 rounded-xl"
                      >
                        {t.skip}
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 h-12 rounded-xl font-medium"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t.submitting}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {t.submit}
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
