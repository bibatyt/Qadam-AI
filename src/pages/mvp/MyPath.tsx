import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, ChevronRight, Loader2, Share2, Settings, 
  BookOpen, Trophy, Target, FileText, Users, Lightbulb,
  Calendar, Star, GraduationCap, Brain, Award, 
  Sparkles, Clock, TrendingUp, RefreshCw, Zap, 
  Rocket, Flame, Lock, Unlock, ArrowRight, CheckCircle2,
  AlertCircle, Info, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PhaseProgressionSystem } from "@/features/phases";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { AppLanguageSwitcher } from "@/components/ui/AppLanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

type Language = "ru" | "kk" | "en";

interface AcademicSnapshot {
  gpa: string;
  ielts: string;
  sat: string;
  ent: string;
}

interface GoalDefinition {
  targetUniversity: string;
  goal: string;
  intendedMajor: string;
  applicationCycle: string;
  scholarshipGoal: string;
  academicSnapshot: AcademicSnapshot;
}

interface StrategyPillar {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CurrentPhase {
  phase: "foundation" | "differentiation" | "application";
  phaseName: string;
  explanation: string;
}

interface MonthFocus {
  objective: string;
  month: string;
  whyItMatters: string;
}

interface HighImpactAction {
  id: string;
  description: string;
  impact: "high" | "medium" | "low";
  impactLabel: string;
  whyNow: string;
  deadline: string;
  completed?: boolean;
}

interface SuccessMetric {
  condition: string;
  examples: string[];
}

interface NextTrigger {
  trigger: string;
  unlocksPhase: string;
}

interface QadamPathData {
  id?: string;
  goalDefinition: GoalDefinition;
  strategy: { pillars: StrategyPillar[] };
  currentPhase: CurrentPhase;
  thisMonthFocus: MonthFocus;
  highImpactActions: HighImpactAction[];
  successMetric: SuccessMetric;
  nextTrigger: NextTrigger;
  progressPercent: number;
}

const translations = {
  ru: {
    title: "Qadam AI",
    subtitle: "Твой стратег поступления",
    loading: "Загрузка...",
    generating: "AI создаёт стратегию...",
    noPath: "Стратегия ещё не создана",
    createPath: "Начать с AI",
    startJourney: "Создай свою стратегию",
    stepByStep: "Qadam AI построит персональный план поступления",
    goalTitle: "Цель",
    targetUni: "Целевой университет",
    major: "Специальность",
    cycle: "Цикл подачи",
    scholarship: "Стипендия",
    strategyTitle: "Стратегия",
    pillars: "Ключевые направления",
    phaseTitle: "Текущая фаза",
    foundation: "Фаза 1: Фундамент",
    differentiation: "Фаза 2: Дифференциация",
    application: "Фаза 3: Подача",
    focusTitle: "Фокус месяца",
    whyMatters: "Почему это важно",
    actionsTitle: "Ключевые действия",
    highImpact: "Обязательно для поступления",
    mediumImpact: "Усиливает профиль",
    lowImpact: "Опционально",
    whyNow: "Почему сейчас",
    deadline: "Дедлайн",
    markDone: "Выполнено",
    metricTitle: "Метрика успеха",
    examples: "Примеры",
    triggerTitle: "Следующий этап",
    unlocks: "Разблокирует",
    regenerate: "Обновить с AI",
    shareCode: "Код для родителя",
    codeCopied: "Код скопирован!",
    codeExpires: "Действителен 7 дней",
    progress: "Прогресс",
    settings: "Настройки",
  },
  kk: {
    title: "Qadam AI",
    subtitle: "Түсу стратегиясы",
    loading: "Жүктелуде...",
    generating: "AI стратегия құруда...",
    noPath: "Стратегия әлі құрылмаған",
    createPath: "AI-мен бастау",
    startJourney: "Стратегияңды құр",
    stepByStep: "Qadam AI жеке түсу жоспарын құрады",
    goalTitle: "Мақсат",
    targetUni: "Мақсатты университет",
    major: "Мамандық",
    cycle: "Өтініш циклі",
    scholarship: "Стипендия",
    strategyTitle: "Стратегия",
    pillars: "Негізгі бағыттар",
    phaseTitle: "Ағымдағы фаза",
    foundation: "Фаза 1: Негіз",
    differentiation: "Фаза 2: Дифференциация",
    application: "Фаза 3: Өтініш",
    focusTitle: "Ай фокусы",
    whyMatters: "Неге маңызды",
    actionsTitle: "Негізгі әрекеттер",
    highImpact: "Түсу үшін міндетті",
    mediumImpact: "Профильді күшейтеді",
    lowImpact: "Қосымша",
    whyNow: "Неге қазір",
    deadline: "Дедлайн",
    markDone: "Орындалды",
    metricTitle: "Табыс метрикасы",
    examples: "Мысалдар",
    triggerTitle: "Келесі кезең",
    unlocks: "Ашады",
    regenerate: "AI-мен жаңарту",
    shareCode: "Ата-анаға код",
    codeCopied: "Код көшірілді!",
    codeExpires: "7 күн жарамды",
    progress: "Прогресс",
    settings: "Баптаулар",
  },
  en: {
    title: "Qadam AI",
    subtitle: "Your admission strategist",
    loading: "Loading...",
    generating: "AI is creating strategy...",
    noPath: "Strategy not created yet",
    createPath: "Start with AI",
    startJourney: "Create your strategy",
    stepByStep: "Qadam AI will build a personalized admission plan",
    goalTitle: "Goal",
    targetUni: "Target university",
    major: "Major",
    cycle: "Application cycle",
    scholarship: "Scholarship",
    strategyTitle: "Strategy",
    pillars: "Key pillars",
    phaseTitle: "Current phase",
    foundation: "Phase 1: Foundation",
    differentiation: "Phase 2: Differentiation",
    application: "Phase 3: Application",
    focusTitle: "This month's focus",
    whyMatters: "Why it matters",
    actionsTitle: "Key actions",
    highImpact: "Required for admission",
    mediumImpact: "Strengthens profile",
    lowImpact: "Optional",
    whyNow: "Why now",
    deadline: "Deadline",
    markDone: "Done",
    metricTitle: "Success metric",
    examples: "Examples",
    triggerTitle: "Next stage",
    unlocks: "Unlocks",
    regenerate: "Update with AI",
    shareCode: "Parent code",
    codeCopied: "Code copied!",
    codeExpires: "Valid for 7 days",
    progress: "Progress",
    settings: "Settings",
  },
};

// Icon mapping for pillars
const pillarIcons: Record<string, React.ReactNode> = {
  academics: <BookOpen className="w-5 h-5" />,
  english: <FileText className="w-5 h-5" />,
  spike: <Rocket className="w-5 h-5" />,
  research: <Brain className="w-5 h-5" />,
  narrative: <Sparkles className="w-5 h-5" />,
  leadership: <Users className="w-5 h-5" />,
};

// Phase colors - Updated with new yellow palette
const phaseColors = {
  foundation: "from-primary to-warning",
  differentiation: "from-warning to-destructive/70",
  application: "from-success to-accent",
};

const phaseIcons = {
  foundation: <Target className="w-6 h-6" />,
  differentiation: <Flame className="w-6 h-6" />,
  application: <GraduationCap className="w-6 h-6" />,
};

// Step Card Component - Updated with new rounded design
function StepCard({ 
  stepNumber, 
  title, 
  children, 
  delay = 0,
  accentColor = "primary"
}: { 
  stepNumber: number; 
  title: string; 
  children: React.ReactNode;
  delay?: number;
  accentColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card-modern overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold bg-primary text-foreground shadow-sm">
          {stepNumber}
        </div>
        <h3 className="font-bold text-foreground text-lg">{title}</h3>
      </div>
      <div>
        {children}
      </div>
    </motion.div>
  );
}

// Goal Definition Card (Step 1)
function GoalCard({ goal, language }: { goal: GoalDefinition; language: Language }) {
  const t = translations[language];
  
  return (
    <div className="space-y-4">
      {/* Target University */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{t.targetUni}</span>
          <p className="font-bold text-foreground text-lg">{goal.targetUniversity}</p>
        </div>
      </div>
      
      {/* Goal Statement */}
      <p className="text-foreground/80 bg-muted/50 rounded-xl p-3 text-sm leading-relaxed">
        {goal.goal}
      </p>
      
      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/30 rounded-xl p-3">
          <span className="text-xs text-muted-foreground">{t.major}</span>
          <p className="font-semibold text-foreground text-sm mt-0.5">{goal.intendedMajor}</p>
        </div>
        <div className="bg-muted/30 rounded-xl p-3">
          <span className="text-xs text-muted-foreground">{t.cycle}</span>
          <p className="font-semibold text-foreground text-sm mt-0.5">{goal.applicationCycle}</p>
        </div>
        <div className="bg-muted/30 rounded-xl p-3 col-span-2">
          <span className="text-xs text-muted-foreground">{t.scholarship}</span>
          <p className="font-semibold text-foreground text-sm mt-0.5">{goal.scholarshipGoal}</p>
        </div>
      </div>
      
      {/* Academic Snapshot */}
      <div className="flex flex-wrap gap-2">
        {goal.academicSnapshot.gpa && goal.academicSnapshot.gpa !== "Unknown/5" && (
          <span className="px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
            GPA: {goal.academicSnapshot.gpa}
          </span>
        )}
        {goal.academicSnapshot.ielts && goal.academicSnapshot.ielts !== "Not taken" && (
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
            IELTS: {goal.academicSnapshot.ielts}
          </span>
        )}
        {goal.academicSnapshot.sat && goal.academicSnapshot.sat !== "Not taken" && (
          <span className="px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold">
            SAT: {goal.academicSnapshot.sat}
          </span>
        )}
        {goal.academicSnapshot.ent && goal.academicSnapshot.ent !== "Not taken" && (
          <span className="px-3 py-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-xs font-semibold">
            ЕНТ: {goal.academicSnapshot.ent}
          </span>
        )}
      </div>
    </div>
  );
}

// Strategy Pillars Card (Step 2)
function StrategyCard({ pillars, language }: { pillars: StrategyPillar[]; language: Language }) {
  const t = translations[language];
  
  return (
    <div className="space-y-3">
      {pillars.map((pillar, idx) => (
        <motion.div
          key={pillar.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 text-primary">
            {pillarIcons[pillar.icon] || <Target className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground">{pillar.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{pillar.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Phase Card (Step 3)
function PhaseCard({ phase, language }: { phase: CurrentPhase; language: Language }) {
  const t = translations[language];
  
  return (
    <div className="space-y-3">
      <div className={cn(
        "p-4 rounded-xl bg-gradient-to-r text-white",
        phaseColors[phase.phase]
      )}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            {phaseIcons[phase.phase]}
          </div>
          <div>
            <p className="font-bold text-lg">{phase.phaseName}</p>
            <p className="text-sm text-white/80">
              {phase.phase === "foundation" && (language === "ru" ? "Строим базу" : "Негіз құру")}
              {phase.phase === "differentiation" && (language === "ru" ? "Выделяемся" : "Ерекшелену")}
              {phase.phase === "application" && (language === "ru" ? "Подаёмся" : "Өтініш беру")}
            </p>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
        {phase.explanation}
      </p>
    </div>
  );
}

// Month Focus Card (Step 4)
function FocusCard({ focus, language }: { focus: MonthFocus; language: Language }) {
  const t = translations[language];
  
  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5" />
          <span className="text-sm font-medium text-white/80">{focus.month}</span>
        </div>
        <p className="font-bold text-lg">{focus.objective}</p>
      </div>
      <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">{t.whyMatters}</span>
          <p className="text-sm text-foreground/80 mt-0.5">{focus.whyItMatters}</p>
        </div>
      </div>
    </div>
  );
}

// Actions Card (Step 5)
function ActionsCard({ 
  actions, 
  language, 
  onToggleAction 
}: { 
  actions: HighImpactAction[]; 
  language: Language;
  onToggleAction: (id: string) => void;
}) {
  const t = translations[language];
  
  const impactColors = {
    high: "border-emerald-500 bg-emerald-500/5",
    medium: "border-amber-500 bg-amber-500/5",
    low: "border-gray-400 bg-gray-400/5",
  };
  
  const impactDotColors = {
    high: "bg-emerald-500",
    medium: "bg-amber-500",
    low: "bg-gray-400",
  };

  return (
    <div className="space-y-3">
      {actions.map((action, idx) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={cn(
            "p-4 rounded-xl border-2 transition-all",
            action.completed ? "border-emerald-500 bg-emerald-500/10" : impactColors[action.impact]
          )}
        >
          <div className="flex items-start gap-3">
            {/* Toggle Button */}
            <button
              onClick={() => onToggleAction(action.id)}
              className={cn(
                "shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all mt-0.5",
                action.completed 
                  ? "bg-emerald-500 text-white" 
                  : "border-2 border-muted-foreground/30 hover:border-primary"
              )}
            >
              {action.completed && <Check className="w-4 h-4" strokeWidth={3} />}
            </button>
            
            <div className="flex-1 min-w-0">
              {/* Impact Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn("w-2 h-2 rounded-full", impactDotColors[action.impact])} />
                <span className="text-xs font-semibold text-muted-foreground">
                  {action.impact === "high" && t.highImpact}
                  {action.impact === "medium" && t.mediumImpact}
                  {action.impact === "low" && t.lowImpact}
                </span>
              </div>
              
              {/* Description */}
              <p className={cn(
                "font-semibold text-foreground",
                action.completed && "line-through text-muted-foreground"
              )}>
                {action.description}
              </p>
              
              {/* Why Now */}
              {!action.completed && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                    <span><strong>{t.whyNow}:</strong> {action.whyNow}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span><strong>{t.deadline}:</strong> {action.deadline}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Metric Card (Step 6)
function MetricCard({ metric, language }: { metric: SuccessMetric; language: Language }) {
  const t = translations[language];
  
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="font-semibold text-foreground">{metric.condition}</p>
      </div>
      {metric.examples && metric.examples.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase">{t.examples}:</span>
          <ul className="space-y-1">
            {metric.examples.map((example, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-3 h-3 text-emerald-500" />
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Trigger Card (Step 7)
function TriggerCard({ trigger, language }: { trigger: NextTrigger; language: Language }) {
  const t = translations[language];
  
  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-800/50">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
        <Unlock className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-foreground">{trigger.trigger}</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          <span className="text-purple-600 dark:text-purple-400 font-semibold">{t.unlocks}:</span> {trigger.unlocksPhase}
        </p>
      </div>
      <ArrowRight className="w-5 h-5 text-purple-500" />
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
  const [pathData, setPathData] = useState<QadamPathData | null>(null);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const feedbackShownRef = useRef(false);

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
        // Parse stored Qadam AI data
        const milestones = data.milestones as any;
        
        // Check if it's new Qadam format or old format
        if (milestones?.goalDefinition) {
          setPathData({
            id: data.id,
            ...milestones,
            progressPercent: data.progress_percent || milestones.progressPercent || 0,
          });
        } else {
          // Old format - need to regenerate
          setPathData(null);
        }
      }
    } catch (error) {
      console.error("Error fetching path:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAction = async (actionId: string) => {
    if (!pathData || !user) return;

    const previousCompletedCount = pathData.highImpactActions.filter(a => a.completed).length;
    const actionToToggle = pathData.highImpactActions.find(a => a.id === actionId);
    const isCompleting = actionToToggle && !actionToToggle.completed;
    
    const updatedActions = pathData.highImpactActions.map(action => 
      action.id === actionId 
        ? { ...action, completed: !action.completed }
        : action
    );

    const completedCount = updatedActions.filter(a => a.completed).length;
    const baseProgress = 
      pathData.currentPhase?.phase === "foundation" ? 5 :
      pathData.currentPhase?.phase === "differentiation" ? 35 : 65;
    
    const actionProgress = (completedCount / updatedActions.length) * 25;
    const newProgress = Math.round(baseProgress + actionProgress);

    const updatedPathData = {
      ...pathData,
      highImpactActions: updatedActions,
      progressPercent: newProgress,
    };

    setPathData(updatedPathData);

    try {
      await supabase
        .from("student_paths")
        .update({
          milestones: JSON.parse(JSON.stringify(updatedPathData)),
          progress_percent: newProgress,
        })
        .eq("id", pathData.id);
      
      // Sync with phase progression system - map action to phase requirement
      // Map UI phase to DB phase type
      type DbPhase = "foundation" | "differentiation" | "proof" | "leverage";
      const uiPhase = pathData.currentPhase?.phase;
      const dbPhase: DbPhase = 
        uiPhase === "application" ? "proof" : 
        (uiPhase as DbPhase) || "foundation";
      const requirementKey = `action_${actionId}`;
      
      if (isCompleting) {
        // Insert or update requirement as completed
        const { data: existingReq } = await supabase
          .from("phase_requirements")
          .select("id")
          .eq("user_id", user.id)
          .eq("phase", dbPhase)
          .eq("requirement_key", requirementKey)
          .maybeSingle();
        
        if (existingReq) {
          await supabase.from("phase_requirements")
            .update({ completed: true, completed_at: new Date().toISOString() })
            .eq("id", existingReq.id);
        } else {
          await supabase.from("phase_requirements").insert({
            user_id: user.id,
            phase: dbPhase,
            requirement_key: requirementKey,
            requirement_label: actionToToggle?.description || actionId,
            completed: true,
            completed_at: new Date().toISOString(),
          });
        }
        
        // Check if all actions are completed to unlock next phase
        if (completedCount === updatedActions.length) {
          await unlockNextPhase(dbPhase);
        }
      } else {
        // Mark as not completed
        await supabase.from("phase_requirements")
          .update({ completed: false, completed_at: null })
          .eq("user_id", user.id)
          .eq("phase", dbPhase)
          .eq("requirement_key", requirementKey);
      }
      
      // Navigate to feedback page after completing 3+ actions (only once per session)
      if (completedCount >= 3 && previousCompletedCount < 3 && !feedbackShownRef.current) {
        feedbackShownRef.current = true;
        setTimeout(() => navigate("/feedback?return=/my-path"), 1000);
      }
    } catch (error) {
      console.error("Error updating action:", error);
    }
  };

  const unlockNextPhase = async (currentPhase: "foundation" | "differentiation" | "proof" | "leverage") => {
    if (!user) return;
    
    const phaseOrder: ("foundation" | "differentiation" | "proof" | "leverage")[] = 
      ["foundation", "differentiation", "proof", "leverage"];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    const nextPhase = phaseOrder[currentIndex + 1];
    
    if (!nextPhase) return;
    
    try {
      // Update phase_progress to unlock next phase and mark current as complete
      await supabase.from("phase_progress")
        .update({
          [`${currentPhase}_completed`]: true,
          [`${nextPhase}_unlocked`]: true,
          current_phase: nextPhase,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
      
      toast.success(
        language === "ru" 
          ? `🎉 Фаза "${currentPhase}" завершена! Разблокирована следующая фаза.`
          : `🎉 "${currentPhase}" фазасы аяқталды! Келесі фаза ашылды.`,
        { duration: 5000 }
      );
    } catch (error) {
      console.error("Error unlocking next phase:", error);
    }
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
      
      toast.success(language === "ru" ? "Стратегия обновлена!" : "Стратегия жаңартылды!");
      fetchPath();
    } catch (error) {
      console.error("Error regenerating path:", error);
      toast.error(language === "ru" ? "Ошибка обновления" : "Жаңарту қатесі");
    } finally {
      setRegenerating(false);
    }
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
      <div className="min-h-screen bg-background flex flex-col">
        {/* Minimal Header */}
        <header className="bg-card border-b border-border">
          <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
            <AppLanguageSwitcher />
          </div>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-sm"
          >
            {/* Animated Illustration */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-32 h-32 rounded-full bg-primary flex items-center justify-center mx-auto shadow-lg"
              >
                <Brain className="w-16 h-16 text-foreground" />
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-0 right-8 w-10 h-10 rounded-full bg-warning flex items-center justify-center"
              >
                <Zap className="w-5 h-5 text-foreground" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-0 left-8 w-10 h-10 rounded-full bg-success flex items-center justify-center"
              >
                <Target className="w-5 h-5 text-success-foreground" />
              </motion.div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-3">{t.startJourney}</h1>
              <p className="text-muted-foreground text-lg">{t.stepByStep}</p>
            </div>

            <Button 
              size="lg"
              className="h-14 px-10 rounded-full font-bold text-lg btn-primary shadow-lg"
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

  const completedActions = pathData.highImpactActions?.filter(a => a.completed).length || 0;
  const totalActions = pathData.highImpactActions?.length || 0;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Mobile Header */}
      <MobileHeader 
        userName={user?.email?.split("@")[0] || "User"}
        greeting={language === "ru" ? `Привет! 👋` : `Сәлем! 👋`}
      />

      {/* Stats Bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center p-3 bg-muted/50 rounded-2xl">
              <p className="text-2xl font-bold text-foreground">{pathData.progressPercent}%</p>
              <p className="text-xs text-muted-foreground">{t.progress}</p>
            </div>
            <div className="flex-1 text-center p-3 bg-muted/50 rounded-2xl">
              <p className="text-2xl font-bold text-foreground">{completedActions}</p>
              <p className="text-xs text-muted-foreground">{language === "ru" ? "Выполнено" : "Орындалды"}</p>
            </div>
            <div className="flex-1 text-center p-3 bg-muted/50 rounded-2xl">
              <p className="text-2xl font-bold text-foreground">{totalActions - completedActions}</p>
              <p className="text-xs text-muted-foreground">{language === "ru" ? "Осталось" : "Қалды"}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pathData.progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{pathData.currentPhase?.phaseName}</span>
              <AppLanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Step 1: Goal Definition */}
        {pathData.goalDefinition && (
          <StepCard stepNumber={1} title={t.goalTitle} delay={0.1}>
            <GoalCard goal={pathData.goalDefinition} language={language} />
          </StepCard>
        )}

        {/* Step 2: Strategy Pillars */}
        {pathData.strategy?.pillars && pathData.strategy.pillars.length > 0 && (
          <StepCard stepNumber={2} title={t.strategyTitle} delay={0.2}>
            <StrategyCard pillars={pathData.strategy.pillars} language={language} />
          </StepCard>
        )}

        {/* Step 3: Current Phase */}
        {pathData.currentPhase && (
          <StepCard stepNumber={3} title={t.phaseTitle} delay={0.3}>
            <PhaseCard phase={pathData.currentPhase} language={language} />
          </StepCard>
        )}

        {/* Step 4: This Month Focus */}
        {pathData.thisMonthFocus && (
          <StepCard stepNumber={4} title={t.focusTitle} delay={0.4}>
            <FocusCard focus={pathData.thisMonthFocus} language={language} />
          </StepCard>
        )}

        {/* Step 5: High-Impact Actions */}
        {pathData.highImpactActions && pathData.highImpactActions.length > 0 && (
          <StepCard stepNumber={5} title={t.actionsTitle} delay={0.5}>
            <ActionsCard 
              actions={pathData.highImpactActions} 
              language={language} 
              onToggleAction={handleToggleAction}
            />
          </StepCard>
        )}

        {/* Step 6: Success Metric */}
        {pathData.successMetric && (
          <StepCard stepNumber={6} title={t.metricTitle} delay={0.6}>
            <MetricCard metric={pathData.successMetric} language={language} />
          </StepCard>
        )}

        {/* Step 7: Phase Progression System */}
        {user && (
          <StepCard stepNumber={7} title={language === "ru" ? "Система прогрессии" : "Прогрессия жүйесі"} delay={0.7}>
            <PhaseProgressionSystem 
              userId={user.id} 
              language={language} 
              userBaseline={{
                goal: pathData.goalDefinition?.goal || "",
                specificGoal: pathData.goalDefinition?.targetUniversity || "",
                academicSnapshot: pathData.goalDefinition?.academicSnapshot,
              }}
            />
          </StepCard>
        )}

        {/* Step 8: Next Trigger */}
        {pathData.nextTrigger && (
          <StepCard stepNumber={7} title={t.triggerTitle} delay={0.7}>
            <TriggerCard trigger={pathData.nextTrigger} language={language} />
          </StepCard>
        )}

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-6 space-y-3"
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

    </div>
  );
}
