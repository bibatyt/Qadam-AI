import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, ChevronRight, Loader2, Share2, Settings, LogOut, 
  BookOpen, Trophy, Target, FileText, Users, Lightbulb,
  Calendar, Star, X, GraduationCap, Brain, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Language = "ru" | "kk";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "done";
  category: string;
  order: number;
}

interface Stage {
  id: string;
  name: { ru: string; kk: string };
  period: { ru: string; kk: string };
  goal: { ru: string; kk: string };
  icon: React.ReactNode;
  milestones: Milestone[];
  details: {
    subjects: { ru: string[]; kk: string[] };
    exams: { ru: string[]; kk: string[] };
    skills: { ru: string[]; kk: string[] };
    projects: { ru: string[]; kk: string[] };
    weeklyActions: { ru: string[]; kk: string[] };
  };
}

const translations = {
  ru: {
    title: "Qadam жолы",
    subtitle: "Твой путь к мечте",
    progress: "Прогресс",
    completed: "выполнено",
    noPath: "Путь ещё не создан",
    createPath: "Начать путь",
    loading: "Загрузка...",
    nextStep: "Твой следующий шаг",
    shareCode: "Поделиться с родителем",
    codeCopied: "Код скопирован!",
    codeExpires: "Действителен 7 дней",
    settings: "Настройки",
    subjects: "Предметы",
    exams: "Экзамены",
    skills: "Навыки",
    projects: "Проекты и олимпиады",
    weeklyActions: "Действия на неделю",
    close: "Закрыть",
    stageComplete: "Этап завершён!",
    currentStage: "Текущий этап",
    upcomingStage: "Впереди",
    completedStage: "Завершено",
    tapToOpen: "Нажми, чтобы открыть",
    startJourney: "Начни свой путь к поступлению",
    stepByStep: "Шаг за шагом к цели",
  },
  kk: {
    title: "Qadam жолы",
    subtitle: "Армандағы жолың",
    progress: "Прогресс",
    completed: "орындалды",
    noPath: "Жол әлі құрылмаған",
    createPath: "Жолды бастау",
    loading: "Жүктелуде...",
    nextStep: "Келесі қадамың",
    shareCode: "Ата-анамен бөлісу",
    codeCopied: "Код көшірілді!",
    codeExpires: "7 күн жарамды",
    settings: "Баптаулар",
    subjects: "Пәндер",
    exams: "Емтихандар",
    skills: "Дағдылар",
    projects: "Жобалар мен олимпиадалар",
    weeklyActions: "Апталық әрекеттер",
    close: "Жабу",
    stageComplete: "Кезең аяқталды!",
    currentStage: "Ағымдағы кезең",
    upcomingStage: "Алда",
    completedStage: "Аяқталды",
    tapToOpen: "Ашу үшін бас",
    startJourney: "Түсу жолыңды баста",
    stepByStep: "Мақсатқа қадам-қадам",
  },
};

// Default stages template
const defaultStages: Stage[] = [
  {
    id: "1",
    name: { ru: "Подготовка", kk: "Дайындық" },
    period: { ru: "Сентябрь — Ноябрь", kk: "Қыркүйек — Қараша" },
    goal: { ru: "Определить цели и начать подготовку к экзаменам", kk: "Мақсаттарды анықтап, емтиханға дайындықты бастау" },
    icon: <Target className="w-5 h-5" />,
    milestones: [],
    details: {
      subjects: { 
        ru: ["Английский язык", "Математика", "Профильные предметы"], 
        kk: ["Ағылшын тілі", "Математика", "Бейіндік пәндер"] 
      },
      exams: { 
        ru: ["IELTS (начать подготовку)", "SAT (изучить формат)"], 
        kk: ["IELTS (дайындықты бастау)", "SAT (форматты үйрену)"] 
      },
      skills: { 
        ru: ["Тайм-менеджмент", "Академическое письмо"], 
        kk: ["Уақытты басқару", "Академиялық жазу"] 
      },
      projects: { 
        ru: ["Выбрать олимпиаду по предмету", "Начать волонтёрство"], 
        kk: ["Пән бойынша олимпиада таңдау", "Волонтерлікті бастау"] 
      },
      weeklyActions: { 
        ru: ["30 мин английского ежедневно", "Решать 5 задач SAT/ACT", "Читать статьи по специальности"], 
        kk: ["Күнде 30 мин ағылшын", "5 SAT/ACT есеп шығару", "Мамандық бойынша мақалалар оқу"] 
      },
    },
  },
  {
    id: "2",
    name: { ru: "Экзамены", kk: "Емтихандар" },
    period: { ru: "Декабрь — Февраль", kk: "Желтоқсан — Ақпан" },
    goal: { ru: "Сдать основные экзамены (IELTS, SAT)", kk: "Негізгі емтихандарды тапсыру (IELTS, SAT)" },
    icon: <BookOpen className="w-5 h-5" />,
    milestones: [],
    details: {
      subjects: { 
        ru: ["Интенсивный английский", "Математика для SAT"], 
        kk: ["Қарқынды ағылшын", "SAT математикасы"] 
      },
      exams: { 
        ru: ["IELTS (цель: 7.0+)", "SAT (цель: 1400+)", "ЕНТ/ОГЭ"], 
        kk: ["IELTS (мақсат: 7.0+)", "SAT (мақсат: 1400+)", "ҰБТ"] 
      },
      skills: { 
        ru: ["Стресс-менеджмент", "Скорочтение"], 
        kk: ["Стресс-менеджмент", "Жылдам оқу"] 
      },
      projects: { 
        ru: ["Участие в Infomatrix", "Городская олимпиада"], 
        kk: ["Infomatrix қатысу", "Қалалық олимпиада"] 
      },
      weeklyActions: { 
        ru: ["Пробный тест раз в неделю", "Анализ ошибок", "Карточки со словами"], 
        kk: ["Аптасына бір сынақ тест", "Қателерді талдау", "Сөз карточкалары"] 
      },
    },
  },
  {
    id: "3",
    name: { ru: "Эссе", kk: "Эссе" },
    period: { ru: "Март — Май", kk: "Наурыз — Мамыр" },
    goal: { ru: "Написать сильные эссе для поступления", kk: "Түсу үшін күшті эссе жазу" },
    icon: <FileText className="w-5 h-5" />,
    milestones: [],
    details: {
      subjects: { 
        ru: ["Креативное письмо", "Литература"], 
        kk: ["Креативті жазу", "Әдебиет"] 
      },
      exams: { 
        ru: ["Пересдача экзаменов (если нужно)"], 
        kk: ["Емтихандарды қайта тапсыру (қажет болса)"] 
      },
      skills: { 
        ru: ["Сторителлинг", "Самоанализ", "Редактирование"], 
        kk: ["Сторителлинг", "Өзін-өзі талдау", "Редакциялау"] 
      },
      projects: { 
        ru: ["Республиканская олимпиада", "Личный проект"], 
        kk: ["Республикалық олимпиада", "Жеке жоба"] 
      },
      weeklyActions: { 
        ru: ["Писать черновики эссе", "Получать обратную связь", "Изучать примеры успешных эссе"], 
        kk: ["Эссе жобаларын жазу", "Кері байланыс алу", "Табысты эссе үлгілерін оқу"] 
      },
    },
  },
  {
    id: "4",
    name: { ru: "Заявки", kk: "Өтінімдер" },
    period: { ru: "Июнь — Сентябрь", kk: "Маусым — Қыркүйек" },
    goal: { ru: "Подать заявки в университеты", kk: "Университеттерге өтінім беру" },
    icon: <GraduationCap className="w-5 h-5" />,
    milestones: [],
    details: {
      subjects: { 
        ru: ["Финансовая грамотность"], 
        kk: ["Қаржылық сауаттылық"] 
      },
      exams: { 
        ru: ["Финальные результаты экзаменов"], 
        kk: ["Емтихандардың соңғы нәтижелері"] 
      },
      skills: { 
        ru: ["Организованность", "Внимание к деталям"], 
        kk: ["Ұйымдастырушылық", "Бөлшектерге назар аудару"] 
      },
      projects: { 
        ru: ["Международные олимпиады", "Научные публикации"], 
        kk: ["Халықаралық олимпиадалар", "Ғылыми жарияланымдар"] 
      },
      weeklyActions: { 
        ru: ["Заполнять формы заявок", "Собирать рекомендации", "Проверять дедлайны"], 
        kk: ["Өтінім формаларын толтыру", "Ұсыныстар жинау", "Мерзімдерді тексеру"] 
      },
    },
  },
  {
    id: "5",
    name: { ru: "Финиш", kk: "Финиш" },
    period: { ru: "Октябрь — Декабрь", kk: "Қазан — Желтоқсан" },
    goal: { ru: "Получить решения и подготовиться к отъезду", kk: "Шешімдер алу және кетуге дайындалу" },
    icon: <Trophy className="w-5 h-5" />,
    milestones: [],
    details: {
      subjects: { 
        ru: ["Язык страны обучения"], 
        kk: ["Оқу елінің тілі"] 
      },
      exams: { 
        ru: ["Завершение всех тестов"], 
        kk: ["Барлық тесттерді аяқтау"] 
      },
      skills: { 
        ru: ["Независимость", "Межкультурная коммуникация"], 
        kk: ["Тәуелсіздік", "Мәдениетаралық қарым-қатынас"] 
      },
      projects: { 
        ru: ["Завершить текущие проекты", "Подготовить портфолио"], 
        kk: ["Ағымдағы жобаларды аяқтау", "Портфолио дайындау"] 
      },
      weeklyActions: { 
        ru: ["Оформить визу", "Найти жильё", "Подготовить документы"], 
        kk: ["Виза рәсімдеу", "Тұрғын үй табу", "Құжаттарды дайындау"] 
      },
    },
  },
];

// Language Switcher Component
function LanguageSwitcher({ 
  language, 
  onLanguageChange 
}: { 
  language: Language; 
  onLanguageChange: (lang: Language) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1">
      <button
        onClick={() => onLanguageChange("ru")}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
          language === "ru"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        RU
      </button>
      <button
        onClick={() => onLanguageChange("kk")}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
          language === "kk"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        KZ
      </button>
    </div>
  );
}

// Stage Detail Panel Component
function StageDetailPanel({
  stage,
  language,
  onClose,
  onMilestoneToggle,
}: {
  stage: Stage;
  language: Language;
  onClose: () => void;
  onMilestoneToggle: (milestoneId: string) => void;
}) {
  const t = translations[language];
  const completedCount = stage.milestones.filter(m => m.status === "done").length;
  const progress = stage.milestones.length > 0 
    ? Math.round((completedCount / stage.milestones.length) * 100) 
    : 0;

  const detailSections = [
    { key: "subjects", icon: <BookOpen className="w-4 h-4" />, label: t.subjects, items: stage.details.subjects[language] },
    { key: "exams", icon: <Award className="w-4 h-4" />, label: t.exams, items: stage.details.exams[language] },
    { key: "skills", icon: <Brain className="w-4 h-4" />, label: t.skills, items: stage.details.skills[language] },
    { key: "projects", icon: <Star className="w-4 h-4" />, label: t.projects, items: stage.details.projects[language] },
    { key: "weeklyActions", icon: <Calendar className="w-4 h-4" />, label: t.weeklyActions, items: stage.details.weeklyActions[language] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-card border border-border rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              {stage.icon}
            </div>
            <div>
              <h3 className="font-bold text-foreground">{stage.name[language]}</h3>
              <p className="text-xs text-muted-foreground">{stage.period[language]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-4 space-y-4">
          {/* Goal */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wide">
                {language === "ru" ? "Цель этапа" : "Кезең мақсаты"}
              </span>
            </div>
            <p className="text-sm text-foreground">{stage.goal[language]}</p>
          </div>

          {/* Progress if has milestones */}
          {stage.milestones.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.progress}</span>
                <span className="font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          )}

          {/* Milestones */}
          {stage.milestones.length > 0 && (
            <div className="space-y-2">
              {stage.milestones.map((milestone) => (
                <motion.button
                  key={milestone.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onMilestoneToggle(milestone.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left",
                    milestone.status === "done" 
                      ? "bg-primary/10 border border-primary/20" 
                      : "bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5",
                    milestone.status === "done"
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-border"
                  )}>
                    {milestone.status === "done" && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium",
                      milestone.status === "done" ? "text-muted-foreground line-through" : "text-foreground"
                    )}>
                      {milestone.title}
                    </p>
                    {milestone.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{milestone.description}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Detail Sections */}
          <div className="space-y-3">
            {detailSections.map((section) => (
              <div key={section.key} className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {section.icon}
                  <span className="text-xs font-bold uppercase tracking-wide">{section.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Roadmap Node Component
function RoadmapNode({
  stage,
  index,
  totalStages,
  status,
  language,
  onClick,
  isCurrent,
}: {
  stage: Stage;
  index: number;
  totalStages: number;
  status: "completed" | "current" | "upcoming";
  language: Language;
  onClick: () => void;
  isCurrent: boolean;
}) {
  const t = translations[language];
  const isLast = index === totalStages - 1;

  const completedCount = stage.milestones.filter(m => m.status === "done").length;
  const progress = stage.milestones.length > 0 
    ? Math.round((completedCount / stage.milestones.length) * 100) 
    : 0;

  return (
    <div className="relative flex gap-4">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        {/* Node */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className={cn(
            "relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-card transition-all duration-300",
            status === "completed" && "bg-primary text-primary-foreground",
            status === "current" && "bg-primary text-primary-foreground ring-4 ring-primary/30 animate-pulse-glow",
            status === "upcoming" && "bg-muted text-muted-foreground border-2 border-border"
          )}
        >
          {status === "completed" ? (
            <Check className="w-6 h-6" strokeWidth={3} />
          ) : (
            stage.icon
          )}
        </motion.button>

        {/* Connecting Line */}
        {!isLast && (
          <div className="relative w-1 flex-1 min-h-[80px]">
            <div className="absolute inset-0 bg-border rounded-full" />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: status === "completed" ? "100%" : "0%" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="absolute top-0 left-0 right-0 bg-primary rounded-full"
            />
          </div>
        )}
      </div>

      {/* Content Card */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          "flex-1 text-left p-4 rounded-2xl border transition-all duration-200 mb-4",
          status === "completed" && "bg-primary/5 border-primary/20",
          status === "current" && "bg-card border-primary shadow-card",
          status === "upcoming" && "bg-card/50 border-border opacity-70 hover:opacity-100"
        )}
      >
        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            status === "completed" && "bg-primary/10 text-primary",
            status === "current" && "bg-primary text-primary-foreground",
            status === "upcoming" && "bg-muted text-muted-foreground"
          )}>
            {status === "completed" ? t.completedStage : status === "current" ? t.currentStage : t.upcomingStage}
          </span>
        </div>

        {/* Stage Info */}
        <h3 className={cn(
          "font-bold text-lg mb-1",
          status === "upcoming" ? "text-muted-foreground" : "text-foreground"
        )}>
          {stage.name[language]}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{stage.period[language]}</p>
        <p className={cn(
          "text-sm",
          status === "upcoming" ? "text-muted-foreground" : "text-foreground/80"
        )}>
          {stage.goal[language]}
        </p>

        {/* Progress Bar for current/completed */}
        {(status === "completed" || status === "current") && stage.milestones.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{t.progress}</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        )}

        {/* Tap hint */}
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <span>{t.tapToOpen}</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </motion.button>
    </div>
  );
}

export default function MyPath() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [language, setLanguage] = useState<Language>("ru");
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [stages, setStages] = useState<Stage[]>(defaultStages);
  const [path, setPath] = useState<{
    id: string;
    progress_percent: number;
  } | null>(null);

  useEffect(() => {
    if (user) fetchPath();
  }, [user]);

  const fetchPath = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("student_paths")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const milestones = (data.milestones as unknown as Milestone[]) || [];
        
        // Distribute milestones to stages based on order
        const milestonesPerStage = Math.ceil(milestones.length / defaultStages.length);
        const updatedStages = defaultStages.map((stage, idx) => {
          const stageStart = idx * milestonesPerStage;
          const stageEnd = stageStart + milestonesPerStage;
          return {
            ...stage,
            milestones: milestones.slice(stageStart, stageEnd),
          };
        });
        
        setStages(updatedStages);
        setPath({
          id: data.id,
          progress_percent: data.progress_percent,
        });
      }
    } catch (error) {
      console.error("Error fetching path:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneToggle = async (milestoneId: string) => {
    if (!path) return;

    // Find and update the milestone
    const updatedStages = stages.map(stage => ({
      ...stage,
      milestones: stage.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, status: m.status === "done" ? "not_started" as const : "done" as const }
          : m
      ),
    }));

    setStages(updatedStages);

    // Calculate new progress
    const allMilestones = updatedStages.flatMap(s => s.milestones);
    const doneCount = allMilestones.filter(m => m.status === "done").length;
    const progressPercent = allMilestones.length > 0 
      ? Math.round((doneCount / allMilestones.length) * 100)
      : 0;

    // Update in database
    try {
      await supabase
        .from("student_paths")
        .update({
          milestones: JSON.parse(JSON.stringify(allMilestones)),
          progress_percent: progressPercent,
        })
        .eq("id", path.id);

      setPath({ ...path, progress_percent: progressPercent });
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const getStageStatus = (stageIndex: number): "completed" | "current" | "upcoming" => {
    const stage = stages[stageIndex];
    const completedCount = stage.milestones.filter(m => m.status === "done").length;
    
    if (stage.milestones.length > 0 && completedCount === stage.milestones.length) {
      return "completed";
    }
    
    // Find first incomplete stage
    for (let i = 0; i < stages.length; i++) {
      const s = stages[i];
      const done = s.milestones.filter(m => m.status === "done").length;
      if (s.milestones.length === 0 || done < s.milestones.length) {
        return i === stageIndex ? "current" : i < stageIndex ? "completed" : "upcoming";
      }
    }
    
    return stageIndex === 0 ? "current" : "upcoming";
  };

  const generateParentCode = async () => {
    if (!user) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      await supabase.from("parent_link_codes").insert({
        student_id: user.id,
        code,
      });
      await navigator.clipboard.writeText(code);
      toast.success(t.codeCopied);
      toast.info(t.codeExpires);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  // Calculate overall progress
  const totalMilestones = stages.flatMap(s => s.milestones).length;
  const completedMilestones = stages.flatMap(s => s.milestones).filter(m => m.status === "done").length;
  const overallProgress = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : 0;

  // Find current stage index
  const currentStageIndex = stages.findIndex((_, idx) => getStageStatus(idx) === "current");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto"
          >
            <GraduationCap className="w-12 h-12 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{t.startJourney}</h1>
            <p className="text-muted-foreground">{t.stepByStep}</p>
          </div>
          <Button 
            size="lg"
            className="h-14 px-8 rounded-2xl font-bold text-lg"
            onClick={() => navigate("/student-onboarding")}
          >
            {t.createPath}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
            <button
              onClick={() => navigate("/settings")}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-accent rounded-3xl p-6 text-primary-foreground shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm opacity-80">{t.progress}</span>
              <p className="text-4xl font-bold">{overallProgress}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">{t.completed}</p>
              <p className="text-lg font-semibold">{completedMilestones}/{totalMilestones}</p>
            </div>
          </div>
          <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-primary-foreground rounded-full"
            />
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            className="w-full h-12 rounded-2xl font-semibold border-2"
            onClick={generateParentCode}
          >
            <Share2 className="w-5 h-5 mr-2" />
            {t.shareCode}
          </Button>
        </motion.div>

        {/* Visual Roadmap */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Path Drawing Animation Background */}
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute left-7 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-20 rounded-full"
          />

          {/* Roadmap Nodes */}
          <div className="space-y-0">
            {stages.map((stage, index) => (
              <RoadmapNode
                key={stage.id}
                stage={stage}
                index={index}
                totalStages={stages.length}
                status={getStageStatus(index)}
                language={language}
                onClick={() => setSelectedStage(stage)}
                isCurrent={getStageStatus(index) === "current"}
              />
            ))}
          </div>
        </motion.div>
      </main>

      {/* Stage Detail Panel */}
      <AnimatePresence>
        {selectedStage && (
          <StageDetailPanel
            stage={selectedStage}
            language={language}
            onClose={() => setSelectedStage(null)}
            onMilestoneToggle={handleMilestoneToggle}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
