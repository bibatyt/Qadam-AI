import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Circle, Loader2, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
    title: "Мой путь",
    progress: "Прогресс",
    currentStage: "Текущий этап",
    noPath: "Путь ещё не создан",
    createPath: "Создать путь",
    loading: "Загрузка...",
    notStarted: "Не начато",
    inProgress: "В процессе",
    done: "Готово",
    shareWithParent: "Поделиться с родителем",
    codeCopied: "Код скопирован!",
    codeExpires: "Код действителен 7 дней",
  },
  en: {
    title: "My Path",
    progress: "Progress",
    currentStage: "Current stage",
    noPath: "No path created yet",
    createPath: "Create path",
    loading: "Loading...",
    notStarted: "Not started",
    inProgress: "In progress",
    done: "Done",
    shareWithParent: "Share with parent",
    codeCopied: "Code copied!",
    codeExpires: "Code valid for 7 days",
  },
  kk: {
    title: "Менің жолым",
    progress: "Прогресс",
    currentStage: "Ағымдағы кезең",
    noPath: "Жол әлі құрылмаған",
    createPath: "Жол құру",
    loading: "Жүктелуде...",
    notStarted: "Басталмаған",
    inProgress: "Орындалуда",
    done: "Дайын",
    shareWithParent: "Ата-анамен бөлісу",
    codeCopied: "Код көшірілді!",
    codeExpires: "Код 7 күн жарамды",
  },
};

const statusColors = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function MyPath() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [language] = useState<Language>("ru");
  const t = translations[language];

  const [loading, setLoading] = useState(true);
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
    if (user) {
      fetchPath();
    }
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

    const updatedMilestones = path.milestones.map((m) =>
      m.id === milestoneId ? { ...m, status: newStatus } : m
    );

    const doneCount = updatedMilestones.filter((m) => m.status === "done").length;
    const progressPercent = Math.round((doneCount / updatedMilestones.length) * 100);

    const inProgressMilestone = updatedMilestones.find((m) => m.status === "in_progress");
    const currentStage = inProgressMilestone?.title || path.current_stage;

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
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">{t.noPath}</h1>
          <Button onClick={() => navigate("/student-onboarding")}>
            {t.createPath}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_started":
        return t.notStarted;
      case "in_progress":
        return t.inProgress;
      case "done":
        return t.done;
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border/50 p-4 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Progress Card */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t.progress}</span>
            <span className="text-2xl font-bold text-primary">
              {path.progress_percent}%
            </span>
          </div>
          <Progress value={path.progress_percent} className="h-2" />
          {path.current_stage && (
            <div className="pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground">{t.currentStage}</span>
              <p className="text-sm font-medium text-foreground mt-1">
                {path.current_stage}
              </p>
            </div>
          )}
        </div>

        {/* Share Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={generateParentCode}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t.shareWithParent}
        </Button>

        {/* Milestones */}
        <div className="space-y-3">
          {path.milestones
            .sort((a, b) => a.order - b.order)
            .map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex gap-3">
                  <button
                    onClick={() => cycleStatus(milestone)}
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      milestone.status === "done"
                        ? "bg-emerald-500 text-white"
                        : milestone.status === "in_progress"
                        ? "bg-amber-500 text-white"
                        : "border-2 border-muted-foreground/30"
                    }`}
                  >
                    {milestone.status === "done" ? (
                      <Check className="w-4 h-4" />
                    ) : milestone.status === "in_progress" ? (
                      <Circle className="w-3 h-3 fill-current" />
                    ) : null}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-medium ${
                          milestone.status === "done"
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {milestone.title}
                      </h3>
                      <span
                        className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                          statusColors[milestone.status]
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
        </div>
      </main>
    </div>
  );
}
