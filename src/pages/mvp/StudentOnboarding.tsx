import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Check, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { specialties, englishLevels } from "@/data/universities";

type Language = "ru" | "en" | "kk";

const translations = {
  ru: {
    step1Title: "В каком вы классе?",
    grade9: "9 класс",
    grade10: "10 класс",
    grade11: "11 класс",
    step2Title: "Куда планируете поступать?",
    local: "Казахстан",
    localDesc: "ЕНТ, местные вузы",
    international: "За рубеж",
    internationalDesc: "США, Европа, Азия",
    step3Title: "Какие экзамены сдаёте?",
    step3Hint: "Можно выбрать несколько",
    step4Title: "Год поступления",
    step5Title: "Уровень английского",
    step6Title: "Ваши баллы",
    ieltsScore: "IELTS балл (если есть)",
    entScore: "ЕНТ балл (если есть)",
    satScore: "SAT балл (если есть)",
    gpaScore: "Средний балл (из 5)",
    step7Title: "Специальность",
    step7Hint: "Выберите направление",
    step8Title: "Нужна стипендия?",
    yes: "Да, нужна",
    yesDesc: "Буду искать финансирование",
    no: "Нет, не нужна",
    noDesc: "Могу оплатить сам",
    continue: "Продолжить",
    createPath: "Создать мой план",
    creating: "AI создаёт план...",
    success: "План создан! 🎉",
    error: "Ошибка. Попробуйте снова.",
  },
  en: {
    step1Title: "What grade are you in?",
    grade9: "Grade 9",
    grade10: "Grade 10",
    grade11: "Grade 11",
    step2Title: "Where do you plan to apply?",
    local: "Kazakhstan",
    localDesc: "ENT, local universities",
    international: "Abroad",
    internationalDesc: "USA, Europe, Asia",
    step3Title: "Which exams will you take?",
    step3Hint: "You can select multiple",
    step4Title: "Target year",
    step5Title: "English level",
    step6Title: "Your scores",
    ieltsScore: "IELTS score (if any)",
    entScore: "ENT score (if any)",
    satScore: "SAT score (if any)",
    gpaScore: "GPA (out of 5)",
    step7Title: "Specialty",
    step7Hint: "Choose your field",
    step8Title: "Need scholarship?",
    yes: "Yes, I need",
    yesDesc: "Looking for financial aid",
    no: "No, I don't",
    noDesc: "Can pay myself",
    continue: "Continue",
    createPath: "Create my plan",
    creating: "AI creating plan...",
    success: "Plan created! 🎉",
    error: "Error. Please try again.",
  },
  kk: {
    step1Title: "Қай сыныпта оқисыз?",
    grade9: "9 сынып",
    grade10: "10 сынып",
    grade11: "11 сынып",
    step2Title: "Қайда түсуді жоспарлайсыз?",
    local: "Қазақстан",
    localDesc: "ЕНТ, жергілікті ЖОО",
    international: "Шетел",
    internationalDesc: "АҚШ, Еуропа, Азия",
    step3Title: "Қандай емтихандар тапсырасыз?",
    step3Hint: "Бірнешеуін таңдауға болады",
    step4Title: "Түсу жылы",
    step5Title: "Ағылшын деңгейі",
    step6Title: "Сіздің балдарыңыз",
    ieltsScore: "IELTS балы (бар болса)",
    entScore: "ЕНТ балы (бар болса)",
    satScore: "SAT балы (бар болса)",
    gpaScore: "Орташа балл (5-тен)",
    step7Title: "Мамандық",
    step7Hint: "Бағытты таңдаңыз",
    step8Title: "Стипендия керек пе?",
    yes: "Иә, керек",
    yesDesc: "Қаржыландыру іздеймін",
    no: "Жоқ, керек емес",
    noDesc: "Өзім төлей аламын",
    continue: "Жалғастыру",
    createPath: "Жоспарымды құру",
    creating: "AI жоспар құруда...",
    success: "Жоспар құрылды! 🎉",
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
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`option-card ${selected ? "option-card-selected" : "option-card-unselected"}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <span className={`block font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
          {title}
        </span>
        {subtitle && (
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        )}
      </div>
      {selected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}
    </div>
  </motion.button>
);

interface ExamOptionProps {
  selected: boolean;
  onClick: () => void;
  label: string;
}

const ExamOption = ({ selected, onClick, label }: ExamOptionProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-3.5 rounded-2xl border-2 font-semibold transition-all duration-200 ${
      selected
        ? "border-primary bg-primary text-primary-foreground shadow-md"
        : "border-border bg-card text-foreground hover:border-primary/30"
    }`}
  >
    {label}
  </motion.button>
);

const TOTAL_STEPS = 8;

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
  const [englishLevel, setEnglishLevel] = useState("");
  const [ieltsScore, setIeltsScore] = useState("");
  const [entScore, setEntScore] = useState("");
  const [satScore, setSatScore] = useState("");
  const [gpa, setGpa] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [needScholarship, setNeedScholarship] = useState<boolean | null>(null);

  const currentYear = new Date().getFullYear();
  const years = [currentYear + 1, currentYear + 2, currentYear + 3];

  const canProceed = () => {
    if (step === 1) return !!grade;
    if (step === 2) return !!goal;
    if (step === 3) return exams.length > 0;
    if (step === 4) return !!targetYear;
    if (step === 5) return !!englishLevel;
    if (step === 6) return true; // Scores are optional
    if (step === 7) return !!specialty;
    if (step === 8) return needScholarship !== null;
    return false;
  };

  const toggleExam = (exam: string) => {
    setExams((prev) =>
      prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]
    );
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
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

      // Update profile with scores
      await supabase.from("profiles").update({
        ielts_score: ieltsScore ? parseFloat(ieltsScore) : null,
        sat_score: satScore ? parseInt(satScore) : null,
      }).eq("user_id", user.id);

      const { data: pathData, error: pathError } = await supabase.functions.invoke(
        "generate-student-path",
        { 
          body: { 
            grade, 
            goal, 
            exams, 
            targetYear, 
            language,
            englishLevel,
            ieltsScore: ieltsScore || null,
            entScore: entScore || null,
            satScore: satScore || null,
            gpa: gpa || null,
            specialty,
            needScholarship,
          } 
        }
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

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-card">
        {step > 1 ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        ) : (
          <div className="w-9" />
        )}

        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8 }}
              animate={{ scale: i + 1 <= step ? 1 : 0.8 }}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i + 1 <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="w-9" />
      </header>

      {/* Content */}
      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex-1 max-w-md mx-auto w-full"
          >
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {t.step1Title}
                  </h1>
                </div>
                <Option selected={grade === "9"} onClick={() => setGrade("9")} title={t.grade9} />
                <Option selected={grade === "10"} onClick={() => setGrade("10")} title={t.grade10} />
                <Option selected={grade === "11"} onClick={() => setGrade("11")} title={t.grade11} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-foreground text-center mb-8">
                  {t.step2Title}
                </h1>
                <Option selected={goal === "local"} onClick={() => setGoal("local")} title={t.local} subtitle={t.localDesc} />
                <Option selected={goal === "international"} onClick={() => setGoal("international")} title={t.international} subtitle={t.internationalDesc} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-foreground">{t.step3Title}</h1>
                  <p className="text-sm text-muted-foreground mt-2">{t.step3Hint}</p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {["IELTS", "SAT", "ЕНТ", "TOEFL", "ACT", "GRE"].map((exam) => (
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
                <h1 className="text-2xl font-bold text-foreground text-center mb-8">
                  {t.step4Title}
                </h1>
                {years.map((year) => (
                  <Option key={year} selected={targetYear === year} onClick={() => setTargetYear(year)} title={String(year)} />
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-foreground text-center mb-8">
                  {t.step5Title}
                </h1>
                {englishLevels.map((level) => (
                  <Option 
                    key={level.id} 
                    selected={englishLevel === level.id} 
                    onClick={() => setEnglishLevel(level.id)} 
                    title={level.nameRu} 
                  />
                ))}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-5">
                <h1 className="text-2xl font-bold text-foreground text-center mb-8">
                  {t.step6Title}
                </h1>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t.ieltsScore}</label>
                    <Input 
                      type="number" 
                      step="0.5"
                      min="0"
                      max="9"
                      placeholder="0.0 - 9.0" 
                      value={ieltsScore} 
                      onChange={(e) => setIeltsScore(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t.entScore}</label>
                    <Input 
                      type="number"
                      min="0"
                      max="140"
                      placeholder="0 - 140" 
                      value={entScore} 
                      onChange={(e) => setEntScore(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t.satScore}</label>
                    <Input 
                      type="number"
                      min="400"
                      max="1600"
                      placeholder="400 - 1600" 
                      value={satScore} 
                      onChange={(e) => setSatScore(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t.gpaScore}</label>
                    <Input 
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      placeholder="1.0 - 5.0" 
                      value={gpa} 
                      onChange={(e) => setGpa(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-foreground">{t.step7Title}</h1>
                  <p className="text-sm text-muted-foreground mt-2">{t.step7Hint}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {specialties.map((spec) => (
                    <motion.button
                      key={spec.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSpecialty(spec.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        specialty === spec.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <span className={`text-sm font-semibold ${specialty === spec.id ? "text-primary" : "text-foreground"}`}>
                        {spec.nameRu}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-foreground text-center mb-8">
                  {t.step8Title}
                </h1>
                <Option selected={needScholarship === true} onClick={() => setNeedScholarship(true)} title={t.yes} subtitle={t.yesDesc} />
                <Option selected={needScholarship === false} onClick={() => setNeedScholarship(false)} title={t.no} subtitle={t.noDesc} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Button */}
        <div className="mt-6 max-w-md mx-auto w-full">
          {step < TOTAL_STEPS ? (
            <Button
              className="w-full h-14 rounded-2xl text-base font-semibold"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {t.continue}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              className="w-full h-14 rounded-2xl text-base font-semibold"
              onClick={handleCreatePath}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t.creating}
                </>
              ) : (
                <>
                  {t.createPath}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
