import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, ChevronRight, Loader2, Share2, Settings, LogOut, 
  BookOpen, Trophy, Target, FileText, Users, Lightbulb,
  Calendar, Star, X, GraduationCap, Brain, Award, AlertTriangle,
  Sparkles, Clock, TrendingUp, RefreshCw
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
  category?: string;
  order?: number;
  stageId?: string;
}

interface StageDetails {
  subjects: string[];
  exams: string[];
  skills: string[];
  projects: string[];
  weeklyActions: string[];
}

interface Stage {
  id: string;
  name: string;
  period: string;
  goal: string;
  icon: React.ReactNode;
  milestones: Milestone[];
  details: StageDetails;
}

interface PathData {
  id: string;
  grade: string;
  goal: string;
  specific_goal: string;
  exams: string[];
  target_year: number;
  milestones: Milestone[];
  progress_percent: number;
  current_stage: string;
  ai_recommendations: string[];
  ai_warnings: string[];
  stages?: Stage[];
  urgentAction?: string;
}

const translations = {
  ru: {
    title: "Qadam жолы",
    subtitle: "Твой персональный путь",
    progress: "Прогресс",
    completed: "выполнено",
    noPath: "План ещё не создан",
    createPath: "Создать персональный план",
    loading: "Загрузка...",
    generating: "AI создаёт персональный план...",
    nextStep: "Следующий шаг",
    shareCode: "Код для родителя",
    codeCopied: "Код скопирован!",
    codeExpires: "Действителен 7 дней",
    settings: "Настройки",
    subjects: "Предметы для изучения",
    exams: "Экзамены и тесты",
    skills: "Навыки для развития",
    projects: "Проекты и олимпиады",
    weeklyActions: "Действия на эту неделю",
    close: "Закрыть",
    stageComplete: "Этап завершён!",
    currentStage: "Сейчас",
    upcomingStage: "Впереди",
    completedStage: "Готово",
    tapToOpen: "Нажми для деталей",
    startJourney: "Начни путь к мечте",
    stepByStep: "AI создаст персональный план под твои цели",
    urgentAction: "Важно сейчас",
    recommendations: "Рекомендации для тебя",
    warnings: "На что обратить внимание",
    yourGoal: "Твоя цель",
    targetYear: "Поступление",
    regenerate: "Обновить план",
    todayIs: "Сегодня",
    monthsLeft: "мес. до цели",
    stageGoal: "Цель этапа",
  },
  kk: {
    title: "Qadam жолы",
    subtitle: "Сенің жеке жолың",
    progress: "Прогресс",
    completed: "орындалды",
    noPath: "Жоспар әлі құрылмаған",
    createPath: "Жеке жоспар құру",
    loading: "Жүктелуде...",
    generating: "AI жеке жоспар құруда...",
    nextStep: "Келесі қадам",
    shareCode: "Ата-анаға код",
    codeCopied: "Код көшірілді!",
    codeExpires: "7 күн жарамды",
    settings: "Баптаулар",
    subjects: "Оқитын пәндер",
    exams: "Емтихандар мен тесттер",
    skills: "Дамытатын дағдылар",
    projects: "Жобалар мен олимпиадалар",
    weeklyActions: "Осы аптаға әрекеттер",
    close: "Жабу",
    stageComplete: "Кезең аяқталды!",
    currentStage: "Қазір",
    upcomingStage: "Алда",
    completedStage: "Дайын",
    tapToOpen: "Толығырақ үшін бас",
    startJourney: "Арманға жол баста",
    stepByStep: "AI сенің мақсаттарыңа жеке жоспар құрады",
    urgentAction: "Қазір маңызды",
    recommendations: "Саған ұсыныстар",
    warnings: "Неге назар аудару керек",
    yourGoal: "Сенің мақсатың",
    targetYear: "Түсу",
    regenerate: "Жоспарды жаңарту",
    todayIs: "Бүгін",
    monthsLeft: "ай мақсатқа дейін",
    stageGoal: "Кезең мақсаты",
  },
};

// Icon mapping for stages
const stageIcons: Record<string, React.ReactNode> = {
  "1": <Target className="w-5 h-5" />,
  "2": <BookOpen className="w-5 h-5" />,
  "3": <FileText className="w-5 h-5" />,
  "4": <GraduationCap className="w-5 h-5" />,
  "5": <Trophy className="w-5 h-5" />,
};

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
    { key: "subjects", icon: <BookOpen className="w-4 h-4" />, label: t.subjects, items: stage.details?.subjects || [] },
    { key: "exams", icon: <Award className="w-4 h-4" />, label: t.exams, items: stage.details?.exams || [] },
    { key: "skills", icon: <Brain className="w-4 h-4" />, label: t.skills, items: stage.details?.skills || [] },
    { key: "projects", icon: <Star className="w-4 h-4" />, label: t.projects, items: stage.details?.projects || [] },
    { key: "weeklyActions", icon: <Calendar className="w-4 h-4" />, label: t.weeklyActions, items: stage.details?.weeklyActions || [] },
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
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              {stage.icon}
            </div>
            <div>
              <h3 className="font-bold text-foreground">{stage.name}</h3>
              <p className="text-xs text-muted-foreground">{stage.period}</p>
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
                {t.stageGoal}
              </span>
            </div>
            <p className="text-sm text-foreground">{stage.goal}</p>
          </div>

          {/* Progress */}
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
                      : "bg-muted/50 hover:bg-muted border border-transparent"
                  )}
                >
                  <div className={cn(
                    "shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 transition-all",
                    milestone.status === "done"
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-border hover:border-primary/50"
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
          <div className="space-y-4">
            {detailSections.filter(s => s.items.length > 0).map((section) => (
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
}: {
  stage: Stage;
  index: number;
  totalStages: number;
  status: "completed" | "current" | "upcoming";
  language: Language;
  onClick: () => void;
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
        whileHover={{ scale: 1.01, x: 4 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={cn(
          "flex-1 text-left p-4 rounded-2xl border transition-all duration-200 mb-4",
          status === "completed" && "bg-primary/5 border-primary/20",
          status === "current" && "bg-card border-primary shadow-card",
          status === "upcoming" && "bg-card/50 border-border opacity-60 hover:opacity-100"
        )}
      >
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            status === "completed" && "bg-primary/10 text-primary",
            status === "current" && "bg-primary text-primary-foreground",
            status === "upcoming" && "bg-muted text-muted-foreground"
          )}>
            {status === "completed" ? t.completedStage : status === "current" ? t.currentStage : t.upcomingStage}
          </span>
          
          {/* Milestone counter */}
          {stage.milestones.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {completedCount}/{stage.milestones.length}
            </span>
          )}
        </div>

        {/* Stage Info */}
        <h3 className={cn(
          "font-bold text-base mb-1",
          status === "upcoming" ? "text-muted-foreground" : "text-foreground"
        )}>
          {stage.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {stage.period}
        </p>
        <p className={cn(
          "text-sm line-clamp-2",
          status === "upcoming" ? "text-muted-foreground" : "text-foreground/80"
        )}>
          {stage.goal}
        </p>

        {/* Progress Bar */}
        {(status === "completed" || status === "current") && stage.milestones.length > 0 && (
          <div className="mt-3">
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
  const [regenerating, setRegenerating] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);

  // Calculate months until target
  const now = new Date();
  const monthsLeft = pathData?.target_year 
    ? Math.max(0, (pathData.target_year - now.getFullYear()) * 12 - now.getMonth())
    : 0;

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
        const aiStages = (data as any).stages as Stage[] | undefined;
        
        // If we have AI-generated stages, use them
        if (aiStages && aiStages.length > 0) {
          const stagesWithIcons = aiStages.map((stage, idx) => ({
            ...stage,
            icon: stageIcons[stage.id] || stageIcons[String(idx + 1)] || <Target className="w-5 h-5" />,
            milestones: stage.milestones || milestones.filter(m => m.stageId === stage.id),
          }));
          setStages(stagesWithIcons);
        } else {
          // Fallback: distribute milestones across default stages
          const stageCount = 5;
          const milestonesPerStage = Math.ceil(milestones.length / stageCount);
          
          const defaultStages: Stage[] = [
            { id: "1", name: language === "ru" ? "Подготовка" : "Дайындық", period: "", goal: "", icon: stageIcons["1"], milestones: [], details: { subjects: [], exams: [], skills: [], projects: [], weeklyActions: [] } },
            { id: "2", name: language === "ru" ? "Экзамены" : "Емтихандар", period: "", goal: "", icon: stageIcons["2"], milestones: [], details: { subjects: [], exams: [], skills: [], projects: [], weeklyActions: [] } },
            { id: "3", name: language === "ru" ? "Эссе" : "Эссе", period: "", goal: "", icon: stageIcons["3"], milestones: [], details: { subjects: [], exams: [], skills: [], projects: [], weeklyActions: [] } },
            { id: "4", name: language === "ru" ? "Заявки" : "Өтінімдер", period: "", goal: "", icon: stageIcons["4"], milestones: [], details: { subjects: [], exams: [], skills: [], projects: [], weeklyActions: [] } },
            { id: "5", name: language === "ru" ? "Финиш" : "Финиш", period: "", goal: "", icon: stageIcons["5"], milestones: [], details: { subjects: [], exams: [], skills: [], projects: [], weeklyActions: [] } },
          ];
          
          defaultStages.forEach((stage, idx) => {
            const start = idx * milestonesPerStage;
            const end = start + milestonesPerStage;
            stage.milestones = milestones.slice(start, end);
          });
          
          setStages(defaultStages);
        }
        
        setPathData({
          id: data.id,
          grade: data.grade,
          goal: data.goal,
          specific_goal: data.specific_goal || "",
          exams: data.exams || [],
          target_year: data.target_year,
          milestones,
          progress_percent: data.progress_percent,
          current_stage: data.current_stage || "",
          ai_recommendations: (data.ai_recommendations as string[]) || [],
          ai_warnings: (data.ai_warnings as string[]) || [],
          urgentAction: (data as any).urgentAction,
        });
      }
    } catch (error) {
      console.error("Error fetching path:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneToggle = async (milestoneId: string) => {
    if (!pathData) return;

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
    
    // Update selected stage if open
    if (selectedStage) {
      const updatedSelected = updatedStages.find(s => s.id === selectedStage.id);
      if (updatedSelected) setSelectedStage(updatedSelected);
    }

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
        .eq("id", pathData.id);

      setPathData({ ...pathData, progress_percent: progressPercent, milestones: allMilestones });
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const getStageStatus = (stageIndex: number): "completed" | "current" | "upcoming" => {
    const stage = stages[stageIndex];
    if (!stage) return "upcoming";
    
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
    : pathData?.progress_percent || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
          </div>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6">
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
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-4">
        {/* Goal & Timeline Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-accent rounded-3xl p-5 text-primary-foreground shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className="text-xs opacity-80 uppercase tracking-wide">{t.yourGoal}</span>
              <p className="text-lg font-bold mt-1 line-clamp-2">
                {pathData.specific_goal || pathData.goal}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs opacity-80">{t.targetYear}</span>
              <p className="text-2xl font-bold">{pathData.target_year}</p>
              <p className="text-xs opacity-80">{monthsLeft} {t.monthsLeft}</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-80">{t.progress}</span>
              <span className="font-bold">{overallProgress}% {t.completed}</span>
            </div>
            <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-primary-foreground rounded-full"
              />
            </div>
            <p className="text-xs opacity-80 text-center">
              {completedMilestones} / {totalMilestones}
            </p>
          </div>
        </motion.div>

        {/* Urgent Action */}
        {pathData.urgentAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-warning/10 border border-warning/30 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-warning" />
              </div>
              <div>
                <span className="text-xs font-bold text-warning uppercase tracking-wide">{t.urgentAction}</span>
                <p className="text-sm text-foreground mt-1">{pathData.urgentAction}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Recommendations */}
        {pathData.ai_recommendations && pathData.ai_recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wide">{t.recommendations}</span>
            </div>
            <ul className="space-y-2">
              {pathData.ai_recommendations.slice(0, 3).map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                  <TrendingUp className="w-3 h-3 text-primary mt-1 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* AI Warnings */}
        {pathData.ai_warnings && pathData.ai_warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-bold text-destructive uppercase tracking-wide">{t.warnings}</span>
            </div>
            <ul className="space-y-2">
              {pathData.ai_warnings.slice(0, 2).map((warn, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-destructive">•</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.25 }}
          className="relative pt-4"
        >
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
