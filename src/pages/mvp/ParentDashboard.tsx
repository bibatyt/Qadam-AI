import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Circle, Loader2, Link2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    currentStage: "Следующий шаг",
    noLink: "Привяжите аккаунт ребёнка",
    enterCode: "Введите код, который ребёнок создал в приложении",
    codePlaceholder: "Код (например: ABC123)",
    linkChild: "Привязать",
    loading: "Загрузка...",
    notStarted: "Не начато",
    inProgress: "В процессе",
    done: "Выполнено",
    invalidCode: "Неверный или истёкший код",
    linked: "Аккаунт привязан",
    completed: "Выполнено",
    upcoming: "Предстоящие шаги",
    viewOnly: "Только просмотр",
    logout: "Выйти",
  },
  en: {
    title: "Child's Progress",
    progress: "Overall progress",
    currentStage: "Next step",
    noLink: "Link your child's account",
    enterCode: "Enter the code your child created in the app",
    codePlaceholder: "Code (e.g. ABC123)",
    linkChild: "Link",
    loading: "Loading...",
    notStarted: "Not started",
    inProgress: "In progress",
    done: "Done",
    invalidCode: "Invalid or expired code",
    linked: "Account linked",
    completed: "Completed",
    upcoming: "Upcoming steps",
    viewOnly: "View only",
    logout: "Logout",
  },
  kk: {
    title: "Баланың прогресі",
    progress: "Жалпы прогресс",
    currentStage: "Келесі қадам",
    noLink: "Баланың аккаунтын байланыстырыңыз",
    enterCode: "Бала қосымшада жасаған кодты енгізіңіз",
    codePlaceholder: "Код (мысалы: ABC123)",
    linkChild: "Байланыстыру",
    loading: "Жүктелуде...",
    notStarted: "Басталмаған",
    inProgress: "Орындалуда",
    done: "Орындалды",
    invalidCode: "Жарамсыз немесе мерзімі өткен код",
    linked: "Аккаунт байланыстырылды",
    completed: "Орындалған",
    upcoming: "Алдағы қадамдар",
    viewOnly: "Тек көру",
    logout: "Шығу",
  },
};

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [language] = useState<Language>("ru");
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [code, setCode] = useState("");
  const [linkedStudentId, setLinkedStudentId] = useState<string | null>(null);
  const [path, setPath] = useState<{
    id: string;
    milestones: Milestone[];
    progress_percent: number;
    current_stage: string;
  } | null>(null);

  useEffect(() => {
    if (user) checkLinkAndFetchPath();
  }, [user]);

  const checkLinkAndFetchPath = async () => {
    if (!user) return;
    try {
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

      await supabase
        .from("parent_link_codes")
        .update({ used: true })
        .eq("code", code.trim().toUpperCase());

      await supabase.from("user_roles").upsert({
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

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_started": return t.notStarted;
      case "in_progress": return t.inProgress;
      case "done": return t.done;
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!linkedStudentId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 flex items-center justify-between px-4 border-b border-border">
          <span className="text-lg font-semibold text-foreground">Qadam</span>
          <button
            onClick={handleLogout}
            className="p-2 rounded hover:bg-muted transition-colors text-muted-foreground"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-sm w-full space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">{t.noLink}</h1>
              <p className="text-sm text-muted-foreground mt-2">{t.enterCode}</p>
            </div>

            <div className="space-y-3">
              <Input
                placeholder={t.codePlaceholder}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center text-lg tracking-widest h-11"
                maxLength={6}
              />
              <Button
                className="w-full h-11"
                onClick={handleLinkChild}
                disabled={!code.trim() || linking}
              >
                {linking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t.linkChild
                )}
              </Button>
            </div>
          </div>
        </main>
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
  const nextStep = upcomingMilestones.sort((a, b) => a.order - b.order)[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">{t.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
              {t.viewOnly}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded hover:bg-muted transition-colors text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-5">
        {/* Progress Card */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{t.progress}</span>
            <span className="text-3xl font-semibold text-primary">
              {path.progress_percent}%
            </span>
          </div>
          <div className="progress-track h-3">
            <div
              className="progress-fill"
              style={{ width: `${path.progress_percent}%` }}
            />
          </div>
        </div>

        {/* Next Step */}
        {nextStep && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <span className="text-xs text-primary font-medium">{t.currentStage}</span>
            <p className="text-sm font-medium text-foreground mt-1">
              {nextStep.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {nextStep.description}
            </p>
          </div>
        )}

        {/* Completed Section */}
        {completedMilestones.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              {t.completed} ({completedMilestones.length})
            </h2>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {completedMilestones.map((milestone) => (
                <div key={milestone.id} className="p-4 flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground line-through">
                      {milestone.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Section */}
        {upcomingMilestones.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              {t.upcoming} ({upcomingMilestones.length})
            </h2>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {upcomingMilestones
                .sort((a, b) => a.order - b.order)
                .map((milestone) => (
                  <div key={milestone.id} className="p-4">
                    <div className="flex gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          milestone.status === "in_progress"
                            ? "border-2 border-warning bg-warning/10"
                            : "border-2 border-border"
                        }`}
                      >
                        {milestone.status === "in_progress" && (
                          <Circle className="w-2 h-2 fill-warning text-warning" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium text-foreground">
                            {milestone.title}
                          </h3>
                          <span
                            className={`shrink-0 text-xs px-2 py-0.5 rounded ${
                              milestone.status === "in_progress"
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
          </div>
        )}
      </main>
    </div>
  );
}
