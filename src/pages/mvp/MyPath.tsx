import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Circle, Loader2, Share2, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    title: "Мой план",
    progress: "Прогресс",
    currentStage: "Текущий этап",
    noPath: "План ещё не создан",
    createPath: "Создать план",
    loading: "Загрузка...",
    notStarted: "Не начато",
    inProgress: "В процессе",
    done: "Выполнено",
    shareWithParent: "Код для родителя",
    codeCopied: "Код скопирован",
    codeExpires: "Действителен 7 дней",
    nextStep: "Следующий шаг",
    logout: "Выйти",
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
    logout: "Logout",
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
    done: "Орындалды",
    shareWithParent: "Ата-анаға код",
    codeCopied: "Код көшірілді",
    codeExpires: "7 күн жарамды",
    nextStep: "Келесі қадам",
    logout: "Шығу",
  },
};

export default function MyPath() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
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
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-semibold text-foreground">{t.noPath}</h1>
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
      case "not_started": return t.notStarted;
      case "in_progress": return t.inProgress;
      case "done": return t.done;
      default: return status;
    }
  };

  const nextStep = path.milestones
    .sort((a, b) => a.order - b.order)
    .find((m) => m.status !== "done");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">{t.title}</h1>
          <button
            onClick={handleLogout}
            className="p-2 rounded hover:bg-muted transition-colors text-muted-foreground"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-5">
        {/* Progress Card */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{t.progress}</span>
            <span className="text-2xl font-semibold text-primary">
              {path.progress_percent}%
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${path.progress_percent}%` }}
            />
          </div>
        </div>

        {/* Current Stage */}
        {nextStep && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <span className="text-xs text-primary font-medium">{t.nextStep}</span>
            <p className="text-sm font-medium text-foreground mt-1">
              {nextStep.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {nextStep.description}
            </p>
          </div>
        )}

        {/* Share Button */}
        <Button
          variant="outline"
          className="w-full h-10"
          onClick={generateParentCode}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t.shareWithParent}
        </Button>

        {/* Milestones */}
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {path.milestones
            .sort((a, b) => a.order - b.order)
            .map((milestone) => (
              <div key={milestone.id} className="p-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => cycleStatus(milestone)}
                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors mt-0.5 ${
                      milestone.status === "done"
                        ? "bg-accent text-accent-foreground"
                        : milestone.status === "in_progress"
                        ? "border-2 border-warning bg-warning/10"
                        : "border-2 border-border hover:border-primary/50"
                    }`}
                  >
                    {milestone.status === "done" && <Check className="w-3 h-3" />}
                    {milestone.status === "in_progress" && (
                      <Circle className="w-2 h-2 fill-warning text-warning" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm font-medium ${
                          milestone.status === "done"
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {milestone.title}
                      </h3>
                      <span
                        className={`shrink-0 text-xs px-2 py-0.5 rounded ${
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
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
