import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReadinessForm, ReadinessResult, ReadinessFormData, ReadinessEvaluation } from "@/features/readiness";
import { useLanguage } from "@/hooks/useLanguage";

export default function ReadinessPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<ReadinessEvaluation | null>(null);

  const translations = {
    ru: {
      back: "Назад",
      error: "Ошибка при оценке профиля",
      tryAgain: "Попробуйте еще раз"
    },
    en: {
      back: "Back",
      error: "Error evaluating profile",
      tryAgain: "Please try again"
    },
    kk: {
      back: "Артқа",
      error: "Профильді бағалау қатесі",
      tryAgain: "Қайта көріңіз"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.ru;

  const handleSubmit = async (formData: ReadinessFormData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-readiness", {
        body: {
          gpa: formData.gpa,
          englishLevel: formData.englishLevel,
          ieltsScore: formData.ieltsScore,
          targetCountries: formData.targetCountries,
          annualBudget: formData.annualBudget,
          intendedMajor: formData.intendedMajor,
          extracurriculars: formData.extracurriculars,
          grade: formData.grade,
          age: formData.age,
          language
        }
      });

      if (error) throw error;

      setEvaluation(data);
    } catch (error) {
      console.error("Evaluation error:", error);
      toast.error(t.error, {
        description: t.tryAgain
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEvaluation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">Admission Readiness</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {evaluation ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ReadinessResult
                evaluation={evaluation}
                onReset={handleReset}
                language={language}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ReadinessForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                language={language}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
