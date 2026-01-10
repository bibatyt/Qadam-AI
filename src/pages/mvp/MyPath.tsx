import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, ChevronRight, Loader2, Share2, Settings, LogOut, 
  BookOpen, Trophy, Target, FileText, Users, Lightbulb,
  Calendar, Star, X, GraduationCap, Brain, Award, AlertTriangle,
  Sparkles, Clock, TrendingUp, RefreshCw, Lock, Zap, MapPin
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
    subtitle: "Твой путь к мечте",
    progress: "Прогресс",
    completed: "выполнено",
    noPath: "План ещё не создан",
    createPath: "Начать путешествие",
    loading: "Загрузка...",
    generating: "AI создаёт персональный план...",
    nextStep: "Следующий шаг",
    shareCode: "Код для родителя",
    codeCopied: "Код скопирован!",
    codeExpires: "Действителен 7 дней",
    settings: "Настройки",
    subjects: "Предметы",
    exams: "Экзамены",
    skills: "Навыки",
    projects: "Проекты",
    weeklyActions: "На этой неделе",
    close: "Закрыть",
    stageComplete: "Этап завершён!",
    currentStage: "Ты здесь",
    upcomingStage: "Впереди",
    completedStage: "Пройдено",
    lockedStage: "Закрыто",
    tapToOpen: "Нажми для деталей",
    startJourney: "Начни свой путь",
    stepByStep: "AI создаст персональный план под твои цели",
    urgentAction: "Важно сейчас",
    recommendations: "Рекомендации",
    warnings: "Обрати внимание",
    yourGoal: "Цель",
    targetYear: "Поступление",
    regenerate: "Обновить с AI",
    todaysFocus: "Фокус сегодня",
    stageGoal: "Цель этапа",
    journeyProgress: "Твоё путешествие",
    stagesCompleted: "этапов пройдено",
    keepGoing: "Продолжай!",
    almostThere: "Почти у цели!",
    greatStart: "Отличное начало!",
  },
  kk: {
    title: "Qadam жолы",
    subtitle: "Арманға жолың",
    progress: "Прогресс",
    completed: "орындалды",
    noPath: "Жоспар әлі құрылмаған",
    createPath: "Саяхатты бастау",
    loading: "Жүктелуде...",
    generating: "AI жеке жоспар құруда...",
    nextStep: "Келесі қадам",
    shareCode: "Ата-анаға код",
    codeCopied: "Код көшірілді!",
    codeExpires: "7 күн жарамды",
    settings: "Баптаулар",
    subjects: "Пәндер",
    exams: "Емтихандар",
    skills: "Дағдылар",
    projects: "Жобалар",
    weeklyActions: "Осы аптада",
    close: "Жабу",
    stageComplete: "Кезең аяқталды!",
    currentStage: "Сен мұндасың",
    upcomingStage: "Алда",
    completedStage: "Өтті",
    lockedStage: "Жабық",
    tapToOpen: "Толығырақ үшін бас",
    startJourney: "Жолыңды баста",
    stepByStep: "AI сенің мақсаттарыңа жеке жоспар құрады",
    urgentAction: "Қазір маңызды",
    recommendations: "Ұсыныстар",
    warnings: "Назар аудар",
    yourGoal: "Мақсат",
    targetYear: "Түсу",
    regenerate: "AI-мен жаңарту",
    todaysFocus: "Бүгінгі фокус",
    stageGoal: "Кезең мақсаты",
    journeyProgress: "Сенің саяхатың",
    stagesCompleted: "кезең өтті",
    keepGoing: "Жалғастыр!",
    almostThere: "Мақсат жақын!",
    greatStart: "Керемет бастама!",
  },
};

// Icon mapping for stages
const stageIcons: Record<string, React.ReactNode> = {
  "1": <Target className="w-6 h-6" />,
  "2": <BookOpen className="w-6 h-6" />,
  "3": <FileText className="w-6 h-6" />,
  "4": <GraduationCap className="w-6 h-6" />,
  "5": <Trophy className="w-6 h-6" />,
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
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
      <button
        onClick={() => onLanguageChange("ru")}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
          language === "ru"
            ? "bg-white text-primary shadow-sm"
            : "text-white/70 hover:text-white"
        )}
      >
        RU
      </button>
      <button
        onClick={() => onLanguageChange("kk")}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
          language === "kk"
            ? "bg-white text-primary shadow-sm"
            : "text-white/70 hover:text-white"
        )}
      >
        KZ
      </button>
    </div>
  );
}

// Stage Detail Bottom Sheet
function StageDetailSheet({
  stage,
  language,
  onClose,
  onMilestoneToggle,
  status,
}: {
  stage: Stage;
  language: Language;
  onClose: () => void;
  onMilestoneToggle: (milestoneId: string) => void;
  status: "completed" | "current" | "locked";
}) {
  const t = translations[language];
  const completedCount = stage.milestones.filter(m => m.status === "done").length;
  const progress = stage.milestones.length > 0 
    ? Math.round((completedCount / stage.milestones.length) * 100) 
    : 0;

  const detailSections = [
    { key: "subjects", icon: <BookOpen className="w-4 h-4" />, label: t.subjects, items: stage.details?.subjects || [], color: "bg-blue-500" },
    { key: "exams", icon: <Award className="w-4 h-4" />, label: t.exams, items: stage.details?.exams || [], color: "bg-orange-500" },
    { key: "skills", icon: <Brain className="w-4 h-4" />, label: t.skills, items: stage.details?.skills || [], color: "bg-purple-500" },
    { key: "projects", icon: <Star className="w-4 h-4" />, label: t.projects, items: stage.details?.projects || [], color: "bg-yellow-500" },
    { key: "weeklyActions", icon: <Zap className="w-4 h-4" />, label: t.weeklyActions, items: stage.details?.weeklyActions || [], color: "bg-green-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="bg-background w-full max-w-lg max-h-[85vh] rounded-t-[32px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg",
                status === "completed" ? "bg-gradient-to-br from-green-400 to-green-600" :
                status === "current" ? "bg-gradient-to-br from-primary to-accent" :
                "bg-gradient-to-br from-gray-400 to-gray-500"
              )}
            >
              {status === "completed" ? <Check className="w-8 h-8" strokeWidth={3} /> : stage.icon}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{stage.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {stage.period}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6 space-y-5">
          {/* Goal Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {t.stageGoal}
              </span>
            </div>
            <p className="text-foreground font-medium">{stage.goal}</p>
          </motion.div>

          {/* Progress */}
          {stage.milestones.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">{t.progress}</span>
                <span className="font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* Milestones as Checklist */}
          {stage.milestones.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              {stage.milestones.map((milestone, idx) => (
                <motion.button
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + idx * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => status !== "locked" && onMilestoneToggle(milestone.id)}
                  disabled={status === "locked"}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left",
                    milestone.status === "done" 
                      ? "bg-green-500/10 border-2 border-green-500/30" 
                      : "bg-muted/50 hover:bg-muted border-2 border-transparent",
                    status === "locked" && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all",
                    milestone.status === "done"
                      ? "bg-green-500 text-white"
                      : "border-2 border-muted-foreground/30"
                  )}>
                    {milestone.status === "done" && <Check className="w-4 h-4" strokeWidth={3} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium",
                      milestone.status === "done" ? "text-muted-foreground line-through" : "text-foreground"
                    )}>
                      {milestone.title}
                    </p>
                    {milestone.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{milestone.description}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Detail Sections */}
          <div className="space-y-4 pt-2">
            {detailSections.filter(s => s.items.length > 0).map((section, idx) => (
              <motion.div 
                key={section.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white", section.color)}>
                    {section.icon}
                  </div>
                  <span className="text-sm font-bold text-foreground">{section.label}</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-8">
                  {section.items.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-muted text-foreground text-sm font-medium rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Duolingo-style Journey Node
function JourneyNode({
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
  status: "completed" | "current" | "locked";
  language: Language;
  onClick: () => void;
}) {
  const t = translations[language];
  const isLast = index === totalStages - 1;
  const isEven = index % 2 === 0;
  
  const completedCount = stage.milestones.filter(m => m.status === "done").length;
  const totalMilestones = stage.milestones.length;

  return (
    <div className={cn(
      "relative flex items-start",
      isEven ? "justify-start" : "justify-end",
      !isLast && "pb-4"
    )}>
      {/* Curved Path SVG */}
      {!isLast && (
        <svg
          className="absolute w-full h-full pointer-events-none"
          style={{ top: 0, left: 0 }}
          preserveAspectRatio="none"
        >
          <motion.path
            d={isEven 
              ? `M ${80} ${60} Q ${200} ${100} ${window.innerWidth > 400 ? 280 : 240} ${160}`
              : `M ${window.innerWidth > 400 ? 280 : 240} ${60} Q ${160} ${100} ${80} ${160}`
            }
            fill="none"
            stroke={status === "completed" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={status === "completed" ? "0" : "12 8"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
          />
        </svg>
      )}

      {/* Node Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: index * 0.1 
        }}
        className={cn(
          "relative z-10 flex flex-col items-center",
          isEven ? "ml-8" : "mr-8"
        )}
      >
        {/* Current Stage Indicator */}
        {status === "current" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold whitespace-nowrap shadow-lg"
          >
            <MapPin className="w-3 h-3" />
            {t.currentStage}
          </motion.div>
        )}

        {/* Main Node Button */}
        <motion.button
          whileHover={{ scale: status !== "locked" ? 1.08 : 1 }}
          whileTap={{ scale: status !== "locked" ? 0.95 : 1 }}
          onClick={onClick}
          className={cn(
            "relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300",
            status === "completed" && "bg-gradient-to-br from-green-400 to-green-600 text-white",
            status === "current" && "bg-gradient-to-br from-primary to-accent text-white ring-4 ring-primary/30",
            status === "locked" && "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-500 dark:from-gray-600 dark:to-gray-700"
          )}
        >
          {/* Pulse animation for current */}
          {status === "current" && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          {/* Icon */}
          {status === "completed" ? (
            <Check className="w-10 h-10" strokeWidth={3} />
          ) : status === "locked" ? (
            <Lock className="w-8 h-8" />
          ) : (
            <div className="relative">
              {stage.icon}
              {/* Progress ring for current */}
              <svg className="absolute -inset-5 w-[70px] h-[70px]">
                <circle
                  cx="35"
                  cy="35"
                  r="32"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="35"
                  cy="35"
                  r="32"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={201}
                  strokeDashoffset={201 - (201 * (completedCount / Math.max(totalMilestones, 1)))}
                  initial={{ strokeDashoffset: 201 }}
                  animate={{ strokeDashoffset: 201 - (201 * (completedCount / Math.max(totalMilestones, 1))) }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                />
              </svg>
            </div>
          )}
        </motion.button>

        {/* Stage Name & Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className={cn(
            "mt-3 text-center max-w-[140px]",
            isEven ? "items-start" : "items-end"
          )}
        >
          <h3 className={cn(
            "font-bold text-sm leading-tight",
            status === "locked" ? "text-muted-foreground" : "text-foreground"
          )}>
            {stage.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{stage.period}</p>
          
          {/* Milestone counter */}
          {totalMilestones > 0 && status !== "locked" && (
            <div className={cn(
              "inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
              status === "completed" 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-primary/10 text-primary"
            )}>
              <Check className="w-3 h-3" />
              {completedCount}/{totalMilestones}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Today's Focus Card
function TodaysFocusCard({ 
  text, 
  language 
}: { 
  text: string;
  language: Language;
}) {
  const t = translations[language];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
            {t.todaysFocus}
          </span>
          <p className="text-white font-semibold mt-0.5">{text}</p>
        </div>
      </div>
    </motion.div>
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
  const [selectedStatus, setSelectedStatus] = useState<"completed" | "current" | "locked">("current");
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
        
        if (aiStages && aiStages.length > 0) {
          const stagesWithIcons = aiStages.map((stage, idx) => ({
            ...stage,
            icon: stageIcons[stage.id] || stageIcons[String(idx + 1)] || <Target className="w-6 h-6" />,
            milestones: stage.milestones || milestones.filter(m => m.stageId === stage.id),
          }));
          setStages(stagesWithIcons);
        } else {
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

    const updatedStages = stages.map(stage => ({
      ...stage,
      milestones: stage.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, status: m.status === "done" ? "not_started" as const : "done" as const }
          : m
      ),
    }));

    setStages(updatedStages);
    
    if (selectedStage) {
      const updatedSelected = updatedStages.find(s => s.id === selectedStage.id);
      if (updatedSelected) setSelectedStage(updatedSelected);
    }

    const allMilestones = updatedStages.flatMap(s => s.milestones);
    const doneCount = allMilestones.filter(m => m.status === "done").length;
    const progressPercent = allMilestones.length > 0 
      ? Math.round((doneCount / allMilestones.length) * 100)
      : 0;

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

  const getStageStatus = (stageIndex: number): "completed" | "current" | "locked" => {
    const stage = stages[stageIndex];
    if (!stage) return "locked";
    
    const completedCount = stage.milestones.filter(m => m.status === "done").length;
    
    if (stage.milestones.length > 0 && completedCount === stage.milestones.length) {
      return "completed";
    }
    
    for (let i = 0; i < stages.length; i++) {
      const s = stages[i];
      const done = s.milestones.filter(m => m.status === "done").length;
      if (s.milestones.length === 0 || done < s.milestones.length) {
        return i === stageIndex ? "current" : i < stageIndex ? "completed" : "locked";
      }
    }
    
    return stageIndex === 0 ? "current" : "locked";
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

  const handleRegenerate = async () => {
    if (!user || regenerating) return;
    setRegenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-student-path', {
        body: { 
          userId: user.id,
          language,
          regenerate: true 
        }
      });

      if (error) throw error;
      
      toast.success(language === "ru" ? "План обновлён!" : "Жоспар жаңартылды!");
      fetchPath();
    } catch (error) {
      console.error("Error regenerating path:", error);
      toast.error(language === "ru" ? "Ошибка обновления" : "Жаңарту қатесі");
    } finally {
      setRegenerating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  // Calculate overall progress
  const completedStagesCount = stages.filter((_, i) => getStageStatus(i) === "completed").length;
  const totalMilestones = stages.flatMap(s => s.milestones).length;
  const completedMilestones = stages.flatMap(s => s.milestones).filter(m => m.status === "done").length;
  const overallProgress = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : pathData?.progress_percent || 0;

  // Get motivational message
  const getMotivation = () => {
    if (overallProgress >= 75) return t.almostThere;
    if (overallProgress >= 25) return t.keepGoing;
    return t.greatStart;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-muted-foreground font-medium">{t.loading}</p>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold">{t.title}</h1>
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
          </div>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-sm"
          >
            {/* Animated Journey Illustration */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-2xl"
              >
                <GraduationCap className="w-16 h-16 text-white" />
              </motion.div>
              
              {/* Decorative nodes */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-0 left-4 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-0 right-4 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center"
              >
                <Star className="w-4 h-4 text-white" />
              </motion.div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-3">{t.startJourney}</h1>
              <p className="text-muted-foreground text-lg">{t.stepByStep}</p>
            </div>

            <Button 
              size="lg"
              className="h-14 px-10 rounded-full font-bold text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-primary to-accent text-white shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold">{t.title}</h1>
              <p className="text-sm text-white/70">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
              <button
                onClick={() => navigate("/settings")}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">{t.journeyProgress}</span>
              <span className="font-bold">{overallProgress}%</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>{completedStagesCount}/{stages.length} {t.stagesCompleted}</span>
              <span className="font-medium">{getMotivation()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Today's Focus */}
      {pathData.urgentAction && (
        <TodaysFocusCard text={pathData.urgentAction} language={language} />
      )}

      {/* Journey Map */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-32">
        {/* Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.yourGoal}</span>
              <p className="text-foreground font-bold mt-1 line-clamp-2">
                {pathData.specific_goal || pathData.goal}
              </p>
            </div>
            <div className="text-right ml-4">
              <span className="text-xs text-muted-foreground">{t.targetYear}</span>
              <p className="text-2xl font-bold text-primary">{pathData.target_year}</p>
              <p className="text-xs text-muted-foreground">{monthsLeft} {language === "ru" ? "мес." : "ай"}</p>
            </div>
          </div>
        </motion.div>

        {/* Duolingo-style Journey Path */}
        <div className="relative">
          {stages.map((stage, index) => (
            <JourneyNode
              key={stage.id}
              stage={stage}
              index={index}
              totalStages={stages.length}
              status={getStageStatus(index)}
              language={language}
              onClick={() => {
                setSelectedStage(stage);
                setSelectedStatus(getStageStatus(index));
              }}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 space-y-3"
        >
          <Button
            variant="outline"
            className="w-full h-12 rounded-2xl font-semibold border-2"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            {regenerating ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5 mr-2" />
            )}
            {t.regenerate}
          </Button>

          <Button
            variant="ghost"
            className="w-full h-12 rounded-2xl font-medium text-muted-foreground"
            onClick={generateParentCode}
          >
            <Share2 className="w-5 h-5 mr-2" />
            {t.shareCode}
          </Button>
        </motion.div>
      </main>

      {/* Stage Detail Sheet */}
      <AnimatePresence>
        {selectedStage && (
          <StageDetailSheet
            stage={selectedStage}
            language={language}
            onClose={() => setSelectedStage(null)}
            onMilestoneToggle={handleMilestoneToggle}
            status={selectedStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
