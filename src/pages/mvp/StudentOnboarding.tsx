import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Language = "ru" | "en" | "kk";

const translations = {
  ru: {
    step1Title: "Выберите класс",
    step1Subtitle: "В каком классе вы сейчас учитесь?",
    grade9: "9 класс",
    grade10: "10 класс",
    grade11: "11 класс",
    step2Title: "Выберите цель",
    step2Subtitle: "Куда вы хотите поступить?",
    local: "Местный университет",
    localDesc: "Университеты в вашей стране",
    international: "Зарубежный университет",
    internationalDesc: "США, Европа, Азия и другие страны",
    step3Title: "Выберите экзамены",
    step3Subtitle: "Какие экзамены вы планируете сдавать?",
    ielts: "IELTS",
    sat: "SAT",
    ent: "ЕНТ",
    toefl: "TOEFL",
    step4Title: "Год поступления",
    step4Subtitle: "В каком году вы планируете поступать?",
    continue: "Продолжить",
    createPath: "Создать мой путь",
    creating: "Создаём ваш путь...",
    success: "Путь создан!",
    error: "Ошибка. Попробуйте снова.",
  },
  en: {
    step1Title: "Select your grade",
    step1Subtitle: "What grade are you currently in?",
    grade9: "Grade 9",
    grade10: "Grade 10",
    grade11: "Grade 11",
    step2Title: "Select your goal",
    step2Subtitle: "Where do you want to study?",
    local: "Local University",
    localDesc: "Universities in your country",
    international: "International University",
    internationalDesc: "USA, Europe, Asia and more",
    step3Title: "Select exams",
    step3Subtitle: "Which exams are you planning to take?",
    ielts: "IELTS",
    sat: "SAT",
    ent: "National Exam",
    toefl: "TOEFL",
    step4Title: "Target year",
    step4Subtitle: "When do you plan to start university?",
    continue: "Continue",
    createPath: "Create my path",
    creating: "Creating your path...",
    success: "Path created!",
    error: "Error. Please try again.",
  },
  kk: {
    step1Title: "Сыныпты таңдаңыз",
    step1Subtitle: "Қазір қай сыныпта оқисыз?",
    grade9: "9 сынып",
    grade10: "10 сынып",
    grade11: "11 сынып",
    step2Title: "Мақсатты таңдаңыз",
    step2Subtitle: "Қайда оқығыңыз келеді?",
    local: "Жергілікті университет",
    localDesc: "Өз еліңіздегі университеттер",
    international: "Шетелдік университет",
    internationalDesc: "АҚШ, Еуропа, Азия және т.б.",
    step3Title: "Емтихандарды таңдаңыз",
    step3Subtitle: "Қандай емтихандар тапсырасыз?",
    ielts: "IELTS",
    sat: "SAT",
    ent: "ҰБТ",
    toefl: "TOEFL",
    step4Title: "Түсу жылы",
    step4Subtitle: "Қай жылы түсесіз?",
    continue: "Жалғастыру",
    createPath: "Жолымды құру",
    creating: "Жолыңыз құрылуда...",
    success: "Жол құрылды!",
    error: "Қате. Қайтадан көріңіз.",
  },
};

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const OptionCard = ({ selected, onClick, title, subtitle, icon }: OptionCardProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
      selected
        ? "border-primary bg-primary/5"
        : "border-border bg-card hover:border-primary/50"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex-1">
        <p className={`font-medium ${selected ? "text-primary" : "text-foreground"}`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {selected && <Check className="w-5 h-5 text-primary" />}
    </div>
  </motion.button>
);

interface ExamChipProps {
  selected: boolean;
  onClick: () => void;
  label: string;
}

const ExamChip = ({ selected, onClick, label }: ExamChipProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 rounded-xl font-medium transition-all ${
      selected
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground hover:bg-muted/80"
    }`}
  >
    {label}
  </button>
);

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [language] = useState<Language>("ru");
  const t = translations[language];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [grade, setGrade] = useState("");
  const [goal, setGoal] = useState("");
  const [exams, setExams] = useState<string[]>([]);
  const [targetYear, setTargetYear] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const years = [currentYear + 1, currentYear + 2, currentYear + 3];

  const canProceed = () => {
    if (step === 1) return !!grade;
    if (step === 2) return !!goal;
    if (step === 3) return exams.length > 0;
    if (step === 4) return !!targetYear;
    return false;
  };

  const toggleExam = (exam: string) => {
    setExams((prev) =>
      prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreatePath = async () => {
    if (!user || !targetYear) return;

    setLoading(true);
    try {
      // Save user role
      await supabase.from("user_roles").upsert({
        user_id: user.id,
        role: "student" as const,
      });

      // Generate path using AI
      const { data: pathData, error: pathError } = await supabase.functions.invoke(
        "generate-student-path",
        {
          body: { grade, goal, exams, targetYear, language },
        }
      );

      if (pathError) throw pathError;

      // Save path to database
      const { error: saveError } = await supabase.from("student_paths").insert({
        user_id: user.id,
        grade,
        goal,
        exams,
        target_year: targetYear,
        milestones: pathData.milestones || [],
        current_stage: pathData.currentStage || "",
        progress_percent: 0,
      });

      if (saveError) throw saveError;

      toast.success(t.success);
      navigate("/my-path", { replace: true });
    } catch (error) {
      console.error("Error creating path:", error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-border/50">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="w-9" />
      </header>

      {/* Content */}
      <main className="flex-1 p-6 flex flex-col">
        <div className="flex-1 max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-foreground">{t.step1Title}</h1>
                  <p className="text-muted-foreground mt-2">{t.step1Subtitle}</p>
                </div>
                <div className="space-y-3">
                  <OptionCard
                    selected={grade === "9"}
                    onClick={() => setGrade("9")}
                    title={t.grade9}
                  />
                  <OptionCard
                    selected={grade === "10"}
                    onClick={() => setGrade("10")}
                    title={t.grade10}
                  />
                  <OptionCard
                    selected={grade === "11"}
                    onClick={() => setGrade("11")}
                    title={t.grade11}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-foreground">{t.step2Title}</h1>
                  <p className="text-muted-foreground mt-2">{t.step2Subtitle}</p>
                </div>
                <div className="space-y-3">
                  <OptionCard
                    selected={goal === "local"}
                    onClick={() => setGoal("local")}
                    title={t.local}
                    subtitle={t.localDesc}
                  />
                  <OptionCard
                    selected={goal === "international"}
                    onClick={() => setGoal("international")}
                    title={t.international}
                    subtitle={t.internationalDesc}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-foreground">{t.step3Title}</h1>
                  <p className="text-muted-foreground mt-2">{t.step3Subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  <ExamChip
                    selected={exams.includes("IELTS")}
                    onClick={() => toggleExam("IELTS")}
                    label={t.ielts}
                  />
                  <ExamChip
                    selected={exams.includes("SAT")}
                    onClick={() => toggleExam("SAT")}
                    label={t.sat}
                  />
                  <ExamChip
                    selected={exams.includes("ENT")}
                    onClick={() => toggleExam("ENT")}
                    label={t.ent}
                  />
                  <ExamChip
                    selected={exams.includes("TOEFL")}
                    onClick={() => toggleExam("TOEFL")}
                    label={t.toefl}
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-foreground">{t.step4Title}</h1>
                  <p className="text-muted-foreground mt-2">{t.step4Subtitle}</p>
                </div>
                <div className="space-y-3">
                  {years.map((year) => (
                    <OptionCard
                      key={year}
                      selected={targetYear === year}
                      onClick={() => setTargetYear(year)}
                      title={String(year)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Button */}
        <div className="mt-6 max-w-md mx-auto w-full">
          {step < 4 ? (
            <Button
              className="w-full h-12"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {t.continue}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="w-full h-12"
              onClick={handleCreatePath}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.creating}
                </>
              ) : (
                <>
                  {t.createPath}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
