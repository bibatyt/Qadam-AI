import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Loader2, 
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Star,
  Send,
  GraduationCap,
  Users,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

type Language = "ru" | "en" | "kk";

const translations = {
  ru: {
    title: "Ваш отзыв",
    subtitle: "Помогите нам улучшить продукт",
    step: "Шаг",
    of: "из",
    back: "Назад",
    next: "Далее",
    submit: "Отправить",
    submitting: "Отправка...",
    skip: "Пропустить",
    thankYou: "Спасибо за отзыв!",
    thankYouSub: "Ваше мнение поможет нам стать лучше",
    goBack: "Вернуться",
    // Step 1
    step1Title: "Помог ли вам продукт?",
    yes: "Да",
    partially: "Частично",
    no: "Нет",
    usefulnessLabel: "Оцените полезность от 1 до 5",
    // Step 2
    step2Title: "Расскажите подробнее",
    problemLabel: "Какую проблему вы пытались решить?",
    problemPlaceholder: "Например: подготовка к поступлению в университет...",
    helpfulLabel: "Что было наиболее полезным?",
    helpfulPlaceholder: "Например: персонализированный план...",
    improveLabel: "Что было непонятно или можно улучшить?",
    improvePlaceholder: "Например: хотелось бы больше информации о...",
    // Step 3
    step3Title: "Последние вопросы",
    recommendLabel: "Порекомендуете ли вы продукт другим? Почему?",
    recommendPlaceholder: "Расскажите, кому и почему вы бы порекомендовали...",
    roleLabel: "Кто вы?",
    student: "Школьник",
    teacher: "Учитель",
    parent: "Родитель",
    other: "Другое",
    anonymousLabel: "Можем ли мы использовать ваш отзыв анонимно?",
    yesAnonymous: "Да, можете",
    noAnonymous: "Нет",
  },
  en: {
    title: "Your Feedback",
    subtitle: "Help us improve the product",
    step: "Step",
    of: "of",
    back: "Back",
    next: "Next",
    submit: "Submit",
    submitting: "Submitting...",
    skip: "Skip",
    thankYou: "Thank you for your feedback!",
    thankYouSub: "Your opinion will help us improve",
    goBack: "Go back",
    // Step 1
    step1Title: "Did the product help you?",
    yes: "Yes",
    partially: "Partially",
    no: "No",
    usefulnessLabel: "Rate usefulness from 1 to 5",
    // Step 2
    step2Title: "Tell us more",
    problemLabel: "What problem were you trying to solve?",
    problemPlaceholder: "For example: preparing for university admission...",
    helpfulLabel: "What was the most helpful part?",
    helpfulPlaceholder: "For example: personalized plan...",
    improveLabel: "What was confusing or could be improved?",
    improvePlaceholder: "For example: I would like more information about...",
    // Step 3
    step3Title: "Final questions",
    recommendLabel: "Would you recommend this product to others? Why?",
    recommendPlaceholder: "Tell us who and why you would recommend...",
    roleLabel: "Who are you?",
    student: "Student",
    teacher: "Teacher",
    parent: "Parent",
    other: "Other",
    anonymousLabel: "Can we use your feedback anonymously?",
    yesAnonymous: "Yes, you can",
    noAnonymous: "No",
  },
  kk: {
    title: "Сіздің пікіріңіз",
    subtitle: "Өнімді жақсартуға көмектесіңіз",
    step: "Қадам",
    of: "/",
    back: "Артқа",
    next: "Келесі",
    submit: "Жіберу",
    submitting: "Жіберілуде...",
    skip: "Өткізу",
    thankYou: "Пікіріңізге рахмет!",
    thankYouSub: "Сіздің пікіріңіз бізге жақсаруға көмектеседі",
    goBack: "Қайту",
    // Step 1
    step1Title: "Өнім сізге көмектесті ме?",
    yes: "Иә",
    partially: "Ішінара",
    no: "Жоқ",
    usefulnessLabel: "Пайдалылығын 1-ден 5-ке дейін бағалаңыз",
    // Step 2
    step2Title: "Толығырақ айтыңыз",
    problemLabel: "Қандай мәселені шешуге тырыстыңыз?",
    problemPlaceholder: "Мысалы: университетке түсуге дайындық...",
    helpfulLabel: "Не ең пайдалы болды?",
    helpfulPlaceholder: "Мысалы: жеке жоспар...",
    improveLabel: "Не түсініксіз болды немесе жақсартуға болады?",
    improvePlaceholder: "Мысалы: көбірек ақпарат алғым келеді...",
    // Step 3
    step3Title: "Соңғы сұрақтар",
    recommendLabel: "Бұл өнімді басқаларға ұсынасыз ба? Неге?",
    recommendPlaceholder: "Кімге және неге ұсынатыныңызды айтыңыз...",
    roleLabel: "Сіз кімсіз?",
    student: "Оқушы",
    teacher: "Мұғалім",
    parent: "Ата-ана",
    other: "Басқа",
    anonymousLabel: "Пікіріңізді анонимді түрде қолдана аламыз ба?",
    yesAnonymous: "Иә, қолданыңыз",
    noAnonymous: "Жоқ",
  },
};

type HelpedOption = "yes" | "partially" | "no" | null;
type RoleOption = "student" | "teacher" | "parent" | "other" | null;

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnPath = searchParams.get("return") || "/";
  
  const [language, setLanguage] = useState<Language>("ru");
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [helped, setHelped] = useState<HelpedOption>(null);
  const [usefulness, setUsefulness] = useState<number | null>(null);

  // Step 2
  const [problem, setProblem] = useState("");
  const [helpful, setHelpful] = useState("");
  const [improve, setImprove] = useState("");

  // Step 3
  const [recommend, setRecommend] = useState("");
  const [role, setRole] = useState<RoleOption>(null);
  const [allowAnonymous, setAllowAnonymous] = useState<boolean | null>(null);

  const t = translations[language];

  const canProceedStep1 = helped !== null;
  const canProceedStep2 = true; // All fields optional
  const canSubmit = true; // All fields optional

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-feedback", {
        body: {
          // Step 1
          helped,
          usefulness,
          // Step 2
          problem: problem.trim(),
          helpful: helpful.trim(),
          improve: improve.trim(),
          // Step 3
          recommend: recommend.trim(),
          role,
          allowAnonymous,
          // Meta
          language,
          source: "feedback-page",
          timestamp: new Date().toISOString(),
        },
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Ошибка отправки");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleGoBack = () => {
    navigate(returnPath);
  };

  const roleIcons = {
    student: GraduationCap,
    teacher: BookOpen,
    parent: Users,
    other: HelpCircle,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-full p-1">
            {(["ru", "en", "kk"] as Language[]).map((lang) => (
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
              >
                <Check className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t.thankYou}</h2>
              <p className="text-muted-foreground mb-8">{t.thankYouSub}</p>
              <Button onClick={handleGoBack} className="rounded-xl">
                {t.goBack}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Title */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      s === step ? "w-8 bg-primary" : s < step ? "w-8 bg-primary/50" : "w-8 bg-muted"
                    )}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-2">
                  {t.step} {step} {t.of} 3
                </span>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">{t.step1Title}</h2>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "yes" as const, label: t.yes, icon: ThumbsUp, color: "text-emerald-500" },
                          { value: "partially" as const, label: t.partially, icon: Minus, color: "text-amber-500" },
                          { value: "no" as const, label: t.no, icon: ThumbsDown, color: "text-red-500" },
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setHelped(option.value)}
                            className={cn(
                              "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                              helped === option.value
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <option.icon className={cn("w-6 h-6", helped === option.value ? option.color : "text-muted-foreground")} />
                            <span className="text-sm font-medium">{option.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        {t.usefulnessLabel}
                      </label>
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setUsefulness(star)}
                            className={cn(
                              "p-2 rounded-xl transition-all",
                              usefulness && usefulness >= star
                                ? "text-amber-400"
                                : "text-muted-foreground/30 hover:text-muted-foreground"
                            )}
                          >
                            <Star
                              className="w-8 h-8"
                              fill={usefulness && usefulness >= star ? "currentColor" : "none"}
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <h2 className="text-lg font-semibold text-foreground">{t.step2Title}</h2>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {t.problemLabel}
                      </label>
                      <Textarea
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder={t.problemPlaceholder}
                        className="min-h-[80px] rounded-xl resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {t.helpfulLabel}
                      </label>
                      <Textarea
                        value={helpful}
                        onChange={(e) => setHelpful(e.target.value)}
                        placeholder={t.helpfulPlaceholder}
                        className="min-h-[80px] rounded-xl resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {t.improveLabel}
                      </label>
                      <Textarea
                        value={improve}
                        onChange={(e) => setImprove(e.target.value)}
                        placeholder={t.improvePlaceholder}
                        className="min-h-[80px] rounded-xl resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-lg font-semibold text-foreground">{t.step3Title}</h2>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {t.recommendLabel}
                      </label>
                      <Textarea
                        value={recommend}
                        onChange={(e) => setRecommend(e.target.value)}
                        placeholder={t.recommendPlaceholder}
                        className="min-h-[80px] rounded-xl resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        {t.roleLabel}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["student", "teacher", "parent", "other"] as const).map((r) => {
                          const Icon = roleIcons[r];
                          return (
                            <motion.button
                              key={r}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setRole(r)}
                              className={cn(
                                "p-3 rounded-xl border-2 transition-all flex items-center gap-3",
                                role === r
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <Icon className={cn("w-5 h-5", role === r ? "text-primary" : "text-muted-foreground")} />
                              <span className="text-sm font-medium">{t[r]}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        {t.anonymousLabel}
                      </label>
                      <div className="flex gap-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAllowAnonymous(true)}
                          className={cn(
                            "flex-1 p-3 rounded-xl border-2 transition-all text-sm font-medium",
                            allowAnonymous === true
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {t.yesAnonymous}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAllowAnonymous(false)}
                          className={cn(
                            "flex-1 p-3 rounded-xl border-2 transition-all text-sm font-medium",
                            allowAnonymous === false
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {t.noAnonymous}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-12 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.back}
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button
                    onClick={handleNext}
                    disabled={step === 1 && !canProceedStep1}
                    className="flex-1 h-12 rounded-xl font-medium"
                  >
                    {t.next}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
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
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
