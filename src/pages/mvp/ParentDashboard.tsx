import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Circle, Loader2, Link2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    title: "Прогресс ребёнка",
    progress: "Общий прогресс",
    currentStage: "Текущий этап",
    noLink: "Ребёнок ещё не привязан",
    enterCode: "Введите код от ребёнка",
    codePlaceholder: "Код (например: ABC123)",
    linkChild: "Привязать",
    loading: "Загрузка...",
    notStarted: "Не начато",
    inProgress: "В процессе",
    done: "Готово",
    invalidCode: "Неверный или истёкший код",
    linked: "Ребёнок привязан!",
    completed: "Выполнено",
    upcoming: "Предстоящие шаги",
    viewOnly: "Режим просмотра",
  },
  en: {
    title: "Child's Progress",
    progress: "Overall progress",
    currentStage: "Current stage",
    noLink: "No child linked yet",
    enterCode: "Enter code from your child",
    codePlaceholder: "Code (e.g. ABC123)",
    linkChild: "Link",
    loading: "Loading...",
    notStarted: "Not started",
    inProgress: "In progress",
    done: "Done",
    invalidCode: "Invalid or expired code",
    linked: "Child linked!",
    completed: "Completed",
    upcoming: "Upcoming steps",
    viewOnly: "View only",
  },
  kk: {
    title: "Баланың прогресі",
    progress: "Жалпы прогресс",
    currentStage: "Ағымдағы кезең",
    noLink: "Бала әлі байланыстырылмаған",
    enterCode: "Баладан алған кодты енгізіңіз",
    codePlaceholder: "Код (мысалы: ABC123)",
    linkChild: "Байланыстыру",
    loading: "Жүктелуде...",
    notStarted: "Басталмаған",
    inProgress: "Орындалуда",
    done: "Дайын",
    invalidCode: "Жарамсыз немесе мерзімі өткен код",
    linked: "Бала байланыстырылды!",
    completed: "Орындалған",
    upcoming: "Алдағы қадамдар",
    viewOnly: "Тек көру режимі",
  },
};

const statusColors = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [language] = useState<Language>("ru");
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [code, setCode] = useState("");
  const [linkedStudentId, setLinkedStudentId] = useState<string | null>(null);
  const [path, setPath] = useState<{
    id: string;
    grade: string;
    goal: string;
    milestones: Milestone[];
    progress_percent: number;
    current_stage: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      checkLinkAndFetchPath();
    }
  }, [user]);

  const checkLinkAndFetchPath = async () => {
    if (!user) return;

    try {
      // Check if parent has a linked student
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("linked_student_id")
        .eq("user_id", user.id)
        .eq("role", "parent")
        .maybeSingle();

      if (roleData?.linked_student_id) {
        setLinkedStudentId(roleData.linked_student_id);
        await fetchStudentPath(roleData.linked_student_id);
      }
    } catch (error) {
      console.error("Error checking link:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentPath = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from("student_paths")
        .select("*")
        .eq("user_id", studentId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPath({
          ...data,
          milestones: (data.milestones as unknown as Milestone[]) || [],
        });
      }
    } catch (error) {
      console.error("Error fetching student path:", error);
    }
  };

  const handleLinkChild = async () => {
    if (!user || !code.trim()) return;

    setLinking(true);
    try {
      // Find the code
      const { data: codeData, error: codeError } = await supabase
        .from("parent_link_codes")
        .select("student_id, used, expires_at")
        .eq("code", code.trim().toUpperCase())
        .maybeSingle();

      if (codeError || !codeData) {
        toast.error(t.invalidCode);
        return;
      }

      if (codeData.used || new Date(codeData.expires_at) < new Date()) {
        toast.error(t.invalidCode);
        return;
      }

      // Mark code as used
      await supabase
        .from("parent_link_codes")
        .update({ used: true })
        .eq("code", code.trim().toUpperCase());

      // Update parent's role with linked student
      await supabase
        .from("user_roles")
        .upsert({
          user_id: user.id,
          role: "parent" as const,
          linked_student_id: codeData.student_id,
        });

      setLinkedStudentId(codeData.student_id);
      await fetchStudentPath(codeData.student_id);
      toast.success(t.linked);
    } catch (error) {
      console.error("Error linking child:", error);
      toast.error(t.invalidCode);
    } finally {
      setLinking(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!linkedStudentId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-6">
          <div className="text-center">
            <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-foreground">{t.noLink}</h1>
            <p className="text-muted-foreground mt-2">{t.enterCode}</p>
          </div>

          <div className="space-y-3">
            <Input
              placeholder={t.codePlaceholder}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
            <Button
              className="w-full"
              onClick={handleLinkChild}
              disabled={!code.trim() || linking}
            >
              {linking ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Link2 className="w-4 h-4 mr-2" />
              )}
              {t.linkChild}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  const completedMilestones = path.milestones.filter((m) => m.status === "done");
  const upcomingMilestones = path.milestones.filter((m) => m.status !== "done");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border/50 p-4 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
            {t.viewOnly}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Progress Card */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t.progress}</span>
            <span className="text-3xl font-bold text-primary">
              {path.progress_percent}%
            </span>
          </div>
          <Progress value={path.progress_percent} className="h-3" />
          {path.current_stage && (
            <div className="pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground">{t.currentStage}</span>
              <p className="text-sm font-medium text-foreground mt-1">
                {path.current_stage}
              </p>
            </div>
          )}
        </div>

        {/* Completed Section */}
        {completedMilestones.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground px-1">
              {t.completed} ({completedMilestones.length})
            </h2>
            {completedMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-4"
              >
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-700 dark:text-emerald-400">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-emerald-600/70 dark:text-emerald-400/60 mt-0.5">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Upcoming Section */}
        {upcomingMilestones.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground px-1">
              {t.upcoming} ({upcomingMilestones.length})
            </h2>
            {upcomingMilestones
              .sort((a, b) => a.order - b.order)
              .map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex gap-3">
                    <div
                      className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        milestone.status === "in_progress"
                          ? "bg-amber-500 text-white"
                          : "border-2 border-muted-foreground/30"
                      }`}
                    >
                      {milestone.status === "in_progress" && (
                        <Circle className="w-3 h-3 fill-current" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-foreground">
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
        )}
      </main>
    </div>
  );
}
