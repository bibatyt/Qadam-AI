import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Language = "ru" | "en" | "kk";

const translations = {
  ru: {
    step1Title: "В каком вы классе?",
    grade9: "9 класс",
    grade10: "10 класс",
    grade11: "11 класс",
    step2Title: "Куда планируете поступать?",
    local: "В местный университет",
    localDesc: "Казахстан, Россия",
    international: "В зарубежный университет",
    internationalDesc: "США, Европа, Азия",
    step3Title: "Какие экзамены будете сдавать?",
    step3Hint: "Можно выбрать несколько",
    step4Title: "В каком году планируете поступать?",
    continue: "Продолжить",
    createPath: "Создать мой план",
    creating: "Создаём план...",
    success: "План создан",
    error: "Ошибка. Попробуйте снова.",
  },
  en: {
    step1Title: "What grade are you in?",
    grade9: "Grade 9",
    grade10: "Grade 10",
    grade11: "Grade 11",
    step2Title: "Where do you plan to apply?",
    local: "Local university",
    localDesc: "Kazakhstan, Russia",
    international: "International university",
    internationalDesc: "USA, Europe, Asia",
    step3Title: "Which exams will you take?",
    step3Hint: "You can select multiple",
    step4Title: "What year do you plan to start?",
    continue: "Continue",
    createPath: "Create my plan",
    creating: "Creating plan...",
    success: "Plan created",
    error: "Error. Please try again.",
  },
  kk: {
    step1Title: "Қай сыныпта оқисыз?",
    grade9: "9 сынып",
    grade10: "10 сынып",
    grade11: "11 сынып",
    step2Title: "Қайда түсуді жоспарлап жатырсыз?",
    local: "Жергілікті университет",
    localDesc: "Қазақстан, Ресей",
    international: "Шетелдік университет",
    internationalDesc: "АҚШ, Еуропа, Азия",
    step3Title: "Қандай емтихандар тапсырасыз?",
    step3Hint: "Бірнешеуін таңдауға болады",
    step4Title: "Қай жылы түсуді жоспарлап жатырсыз?",
    continue: "Жалғастыру",
    createPath: "Жоспарымды құру",
    creating: "Жоспар құрылуда...",
    success: "Жоспар құрылды",
    error: "Қате. Қайтадан көріңіз.",
  },
};

interface OptionProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
}

const Option = ({ selected, onClick, title, subtitle }: OptionProps) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-lg border text-left transition-colors ${
      selected
        ? "border-primary bg-primary/5"
        : "border-border bg-card hover:border-primary/30"
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <span className={`block font-medium ${selected ? "text-primary" : "text-foreground"}`}>
          {title}
        </span>
        {subtitle && (
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        )}
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
    </div>
  </button>
);

interface ExamOptionProps {
  selected: boolean;
  onClick: () => void;
  label: string;
}

const ExamOption = ({ selected, onClick, label }: ExamOptionProps) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 rounded-lg border font-medium transition-colors ${
      selected
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-foreground hover:border-primary/30"
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
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreatePath = async () => {
    if (!user || !targetYear) return;

    setLoading(true);
    try {
      await supabase.from("user_roles").upsert({
        user_id: user.id,
        role: "student" as const,
      });

      const { data: pathData, error: pathError } = await supabase.functions.invoke(
        "generate-student-path",
        { body: { grade, goal, exams, targetYear, language } }
      );

      if (pathError) throw pathError;

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-border">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded hover:bg-muted transition-colors"
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
              className={`h-1 w-8 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="w-9" />
      </header>

      {/* Content */}
      <main className="flex-1 p-6 flex flex-col">
        <div className="flex-1 max-w-md mx-auto w-full">
          {step === 1 && (
            <div className="space-y-4">
              <h1 className="text-xl font-semibold text-foreground text-center mb-6">
                {t.step1Title}
              </h1>
              <Option
                selected={grade === "9"}
                onClick={() => setGrade("9")}
                title={t.grade9}
              />
              <Option
                selected={grade === "10"}
                onClick={() => setGrade("10")}
                title={t.grade10}
              />
              <Option
                selected={grade === "11"}
                onClick={() => setGrade("11")}
                title={t.grade11}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h1 className="text-xl font-semibold text-foreground text-center mb-6">
                {t.step2Title}
              </h1>
              <Option
                selected={goal === "local"}
                onClick={() => setGoal("local")}
                title={t.local}
                subtitle={t.localDesc}
              />
              <Option
                selected={goal === "international"}
                onClick={() => setGoal("international")}
                title={t.international}
                subtitle={t.internationalDesc}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-foreground">
                  {t.step3Title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{t.step3Hint}</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {["IELTS", "SAT", "ЕНТ", "TOEFL"].map((exam) => (
                  <ExamOption
                    key={exam}
                    selected={exams.includes(exam)}
                    onClick={() => toggleExam(exam)}
                    label={exam}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h1 className="text-xl font-semibold text-foreground text-center mb-6">
                {t.step4Title}
              </h1>
              {years.map((year) => (
                <Option
                  key={year}
                  selected={targetYear === year}
                  onClick={() => setTargetYear(year)}
                  title={String(year)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Button */}
        <div className="mt-6 max-w-md mx-auto w-full">
          {step < 4 ? (
            <Button
              className="w-full h-11"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {t.continue}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="w-full h-11"
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
