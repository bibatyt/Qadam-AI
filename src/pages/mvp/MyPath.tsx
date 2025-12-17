import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Circle, Loader2, Share2, ArrowRight, LogOut, Settings, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

type Language = "ru" | "en" | "kk";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "done";
  category: string;
  order: number;
}

const translations = {
  ru: {
    title: "Мой план",
    progress: "Прогресс",
    currentStage: "Текущий этап",
    noPath: "План ещё не создан",
    createPath: "Создать план",
    loading: "Загрузка...",
    notStarted: "Не начато",
    inProgress: "В процессе",
    done: "Готово",
    shareWithParent: "Код для родителя",
    codeCopied: "Код скопирован",
    codeExpires: "Действителен 7 дней",
    nextStep: "Следующий шаг",
    settings: "Настройки",
    completed: "Выполнено",
    tasksLeft: "задач осталось",
  },
  en: {
    title: "My Plan",
    progress: "Progress",
    currentStage: "Current stage",
    noPath: "No plan created yet",
    createPath: "Create plan",
    loading: "Loading...",
    notStarted: "Not started",
    inProgress: "In progress",
    done: "Done",
    shareWithParent: "Code for parent",
    codeCopied: "Code copied",
    codeExpires: "Valid for 7 days",
    nextStep: "Next step",
    settings: "Settings",
    completed: "Completed",
    tasksLeft: "tasks left",
  },
  kk: {
    title: "Менің жоспарым",
    progress: "Прогресс",
    currentStage: "Ағымдағы кезең",
    noPath: "Жоспар әлі құрылмаған",
    createPath: "Жоспар құру",
    loading: "Жүктелуде...",
    notStarted: "Басталмаған",
    inProgress: "Орындалуда",
    done: "Дайын",
    shareWithParent: "Ата-анаға код",
    codeCopied: "Код көшірілді",
    codeExpires: "7 күн жарамды",
    nextStep: "Келесі қадам",
    settings: "Баптаулар",
    completed: "Орындалды",
    tasksLeft: "тапсырма қалды",
  },
};

export default function MyPath() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [language] = useState<Language>("ru");
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [celebrateId, setCelebrateId] = useState<string | null>(null);
  const [path, setPath] = useState<{
    id: string;
    grade: string;
    goal: string;
    exams: string[];
    target_year: number;
    milestones: Milestone[];
    progress_percent: number;
    current_stage: string;
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
        setPath({
          ...data,
          milestones: (data.milestones as unknown as Milestone[]) || [],
        });
      }
    } catch (error) {
      console.error("Error fetching path:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMilestoneStatus = async (
    milestoneId: string,
    newStatus: "not_started" | "in_progress" | "done"
  ) => {
    if (!path || !user) return;

    // Trigger celebration animation
    if (newStatus === "done") {
      setCelebrateId(milestoneId);
      setTimeout(() => setCelebrateId(null), 600);
    }

    const updatedMilestones = path.milestones.map((m) =>
      m.id === milestoneId ? { ...m, status: newStatus } : m
    );

    const doneCount = updatedMilestones.filter((m) => m.status === "done").length;
    const progressPercent = Math.round((doneCount / updatedMilestones.length) * 100);

    const inProgressMilestone = updatedMilestones.find((m) => m.status === "in_progress");
    const nextTodo = updatedMilestones.find((m) => m.status === "not_started");
    const currentStage = inProgressMilestone?.title || nextTodo?.title || path.current_stage;

    try {
      const { error } = await supabase
        .from("student_paths")
        .update({
          milestones: JSON.parse(JSON.stringify(updatedMilestones)),
          progress_percent: progressPercent,
          current_stage: currentStage,
        })
        .eq("id", path.id);

      if (error) throw error;

      setPath({
        ...path,
        milestones: updatedMilestones,
        progress_percent: progressPercent,
        current_stage: currentStage,
      });
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const cycleStatus = (milestone: Milestone) => {
    const statusOrder: Array<"not_started" | "in_progress" | "done"> = [
      "not_started",
      "in_progress",
      "done",
    ];
    const currentIndex = statusOrder.indexOf(milestone.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateMilestoneStatus(milestone.id, nextStatus);
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
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t.noPath}</h1>
          <Button 
            size="lg"
            className="h-14 px-8 rounded-2xl font-semibold"
            onClick={() => navigate("/student-onboarding")}
          >
            {t.createPath}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_started": return t.notStarted;
      case "in_progress": return t.inProgress;
      case "done": return t.done;
      default: return status;
    }
  };

  const nextStep = path.milestones
    .sort((a, b) => a.order - b.order)
    .find((m) => m.status !== "done");

  const doneCount = path.milestones.filter((m) => m.status === "done").length;
  const tasksLeft = path.milestones.length - doneCount;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-card border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/settings")}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-5">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-accent rounded-3xl p-6 text-primary-foreground shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm opacity-80">{t.progress}</span>
              <p className="text-4xl font-bold">{path.progress_percent}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">{t.completed}</p>
              <p className="text-lg font-semibold">{doneCount}/{path.milestones.length}</p>
            </div>
          </div>
          <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${path.progress_percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-primary-foreground rounded-full"
            />
          </div>
          {tasksLeft > 0 && (
            <p className="text-sm mt-3 opacity-80">
              {tasksLeft} {t.tasksLeft}
            </p>
          )}
        </motion.div>

        {/* Current Stage */}
        {nextStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary/50 border border-primary/20 rounded-2xl p-5"
          >
            <span className="text-xs text-primary font-bold uppercase tracking-wide">{t.nextStep}</span>
            <p className="text-base font-semibold text-foreground mt-2">
              {nextStep.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {nextStep.description}
            </p>
          </motion.div>
        )}

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Button
            variant="outline"
            className="w-full h-12 rounded-2xl font-semibold border-2"
            onClick={generateParentCode}
          >
            <Share2 className="w-5 h-5 mr-2" />
            {t.shareWithParent}
          </Button>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border"
        >
          <AnimatePresence>
            {path.milestones
              .sort((a, b) => a.order - b.order)
              .map((milestone, i) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 ${celebrateId === milestone.id ? "animate-celebrate" : ""}`}
                >
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => cycleStatus(milestone)}
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all mt-0.5 ${
                        milestone.status === "done"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : milestone.status === "in_progress"
                          ? "border-3 border-warning bg-warning/20"
                          : "border-2 border-border hover:border-primary/50"
                      }`}
                    >
                      {milestone.status === "done" && <Check className="w-4 h-4" strokeWidth={3} />}
                      {milestone.status === "in_progress" && (
                        <Circle className="w-3 h-3 fill-warning text-warning" />
                      )}
                    </motion.button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`text-sm font-semibold transition-all ${
                            milestone.status === "done"
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {milestone.title}
                        </h3>
                        <span
                          className={`shrink-0 status-badge ${
                            milestone.status === "done"
                              ? "status-done"
                              : milestone.status === "in_progress"
                              ? "status-in-progress"
                              : "status-not-started"
                          }`}
                        >
                          {getStatusLabel(milestone.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
