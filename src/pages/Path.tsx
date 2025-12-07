import { useState, useEffect } from "react";
import { 
  Map, Target, GraduationCap, BookOpen, Award, FileText, 
  Users, Send, CheckCircle2, Circle, ChevronDown, ChevronUp, 
  Loader2, Sparkles, Trophy, Zap, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  completed: boolean;
}

interface Month {
  month: string;
  monthIndex: number;
  theme: string;
  tasks: Task[];
}

interface Roadmap {
  id: string;
  months: Month[];
}

const categoryIcons: Record<string, any> = {
  academic: BookOpen,
  test: Award,
  extracurricular: Trophy,
  essay: FileText,
  recommendation: Users,
  application: Send,
};

const categoryColors: Record<string, string> = {
  academic: "bg-primary/10 text-primary",
  test: "bg-accent/10 text-accent",
  extracurricular: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  essay: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  recommendation: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  application: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const Path = () => {
  const { user } = useAuth();
  const { profile, addXP } = useProfile();
  const { t, language } = useLanguage();

  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set([0]));

  // Form state
  const [gpa, setGpa] = useState("");
  const [satScore, setSatScore] = useState("");
  const [ieltsScore, setIeltsScore] = useState("");
  const [currentGrade, setCurrentGrade] = useState("");
  const [desiredMajor, setDesiredMajor] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [mainGoal, setMainGoal] = useState("");

  useEffect(() => {
    if (user) {
      fetchRoadmap();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      if (profile.sat_score) setSatScore(profile.sat_score.toString());
      if (profile.ielts_score) setIeltsScore(profile.ielts_score.toString());
    }
  }, [profile]);

  const fetchRoadmap = async () => {
    try {
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (roadmapError && roadmapError.code !== 'PGRST116') {
        throw roadmapError;
      }

      if (roadmapData) {
        const { data: tasksData, error: tasksError } = await supabase
          .from('roadmap_tasks')
          .select('*')
          .eq('roadmap_id', roadmapData.id)
          .order('month_index', { ascending: true });

        if (tasksError) throw tasksError;

        const plan = roadmapData.generated_plan as any;
        if (plan?.months) {
          // Merge task completion status from database
          const monthsWithStatus = plan.months.map((month: any, monthIdx: number) => ({
            ...month,
            tasks: month.tasks.map((task: any, taskIdx: number) => {
              const dbTask = tasksData?.find(
                t => t.month_index === monthIdx && t.task_title === task.title
              );
              return {
                ...task,
                id: dbTask?.id || `${monthIdx}-${taskIdx}`,
                completed: dbTask?.completed || false,
              };
            }),
          }));

          setRoadmap({
            id: roadmapData.id,
            months: monthsWithStatus,
          });
          setTasks(tasksData || []);
          setHasRoadmap(true);
        }
      }
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  const isGoalValid = mainGoal.trim().length >= 15;

  const generateRoadmap = async () => {
    if (!gpa || !currentGrade || !desiredMajor || !targetCountry || !mainGoal) {
      toast.error(t("fillAllFields"));
      return;
    }
    if (!isGoalValid) {
      toast.error(t("goalTooShort"));
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-roadmap', {
        body: {
          gpa: parseFloat(gpa),
          satScore: satScore ? parseInt(satScore) : undefined,
          ieltsScore: ieltsScore ? parseFloat(ieltsScore) : undefined,
          currentGrade,
          desiredMajor,
          targetCountry,
          mainGoal,
          language,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const generatedPlan = data.roadmap;

      // Save roadmap to database
      const { data: savedRoadmap, error: saveError } = await supabase
        .from('roadmaps')
        .insert({
          user_id: user?.id,
          gpa: parseFloat(gpa),
          sat_score: satScore ? parseInt(satScore) : null,
          ielts_score: ieltsScore ? parseFloat(ieltsScore) : null,
          current_grade: currentGrade,
          desired_major: desiredMajor,
          target_country: targetCountry,
          main_goal: mainGoal,
          generated_plan: generatedPlan,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Save individual tasks
      const tasksToInsert: any[] = [];
      generatedPlan.months.forEach((month: any, monthIdx: number) => {
        month.tasks.forEach((task: any) => {
          tasksToInsert.push({
            roadmap_id: savedRoadmap.id,
            user_id: user?.id,
            month: month.month,
            month_index: monthIdx,
            task_title: task.title,
            task_description: task.description,
            xp_reward: task.xpReward || 15,
            completed: false,
          });
        });
      });

      const { error: tasksError } = await supabase
        .from('roadmap_tasks')
        .insert(tasksToInsert);

      if (tasksError) throw tasksError;

      toast.success(t("roadmapGenerated"));
      await fetchRoadmap();
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast.error(t("roadmapError"));
    } finally {
      setGenerating(false);
    }
  };

  const toggleTask = async (monthIndex: number, taskTitle: string, currentStatus: boolean) => {
    try {
      const { data: taskData } = await supabase
        .from('roadmap_tasks')
        .select('*')
        .eq('roadmap_id', roadmap?.id)
        .eq('month_index', monthIndex)
        .eq('task_title', taskTitle)
        .single();

      if (!taskData) return;

      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('roadmap_tasks')
        .update({
          completed: newStatus,
          completed_at: newStatus ? new Date().toISOString() : null,
        })
        .eq('id', taskData.id);

      if (error) throw error;

      // Update local state
      if (roadmap) {
        const updatedMonths = roadmap.months.map((month, idx) => {
          if (idx === monthIndex) {
            return {
              ...month,
              tasks: month.tasks.map((task) =>
                task.title === taskTitle ? { ...task, completed: newStatus } : task
              ),
            };
          }
          return month;
        });
        setRoadmap({ ...roadmap, months: updatedMonths });
      }

      // Award XP if completing task
      if (newStatus) {
        await addXP(taskData.xp_reward);
        toast.success(`+${taskData.xp_reward} XP! 🎉`);
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error(t("errorSaving"));
    }
  };

  const toggleMonth = (monthIndex: number) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthIndex)) {
      newExpanded.delete(monthIndex);
    } else {
      newExpanded.add(monthIndex);
    }
    setExpandedMonths(newExpanded);
  };

  const resetRoadmap = async () => {
    if (!roadmap?.id) return;
    
    try {
      await supabase.from('roadmap_tasks').delete().eq('roadmap_id', roadmap.id);
      await supabase.from('roadmaps').delete().eq('id', roadmap.id);
      
      setRoadmap(null);
      setHasRoadmap(false);
      setTasks([]);
      toast.success(t("roadmapReset"));
    } catch (error) {
      console.error("Error resetting roadmap:", error);
      toast.error(t("errorSaving"));
    }
  };

  const getMonthProgress = (month: Month) => {
    const completed = month.tasks.filter(t => t.completed).length;
    return (completed / month.tasks.length) * 100;
  };

  const getTotalProgress = () => {
    if (!roadmap) return 0;
    const allTasks = roadmap.months.flatMap(m => m.tasks);
    const completed = allTasks.filter(t => t.completed).length;
    return allTasks.length > 0 ? (completed / allTasks.length) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show form if no roadmap exists
  if (!hasRoadmap) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-card border-b border-border px-4 py-4">
          <div className="container max-w-lg mx-auto">
            <h1 className="text-xl font-extrabold flex items-center gap-2">
              <Map className="w-6 h-6 text-primary" />
              {t("pathTitle")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t("pathSubtitle")}</p>
          </div>
        </header>

        <main className="container max-w-lg mx-auto px-4 py-5 space-y-4">
          <div className="duolingo-card p-5 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-primary">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-extrabold">{t("createRoadmap")}</h2>
                <p className="text-sm text-muted-foreground">{t("fillProfileInfo")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold">{t("gpa")} *</Label>
                  <Input
                    type="number"
                    placeholder="3.85"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className="h-12 rounded-xl"
                    step="0.01"
                    min="0"
                    max="4"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">{t("currentGradeLabel")} *</Label>
                  <Select value={currentGrade} onValueChange={setCurrentGrade}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder={t("selectGrade")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9th grade">{t("grade9")}</SelectItem>
                      <SelectItem value="10th grade">{t("grade10")}</SelectItem>
                      <SelectItem value="11th grade">{t("grade11")}</SelectItem>
                      <SelectItem value="12th grade">{t("grade12")}</SelectItem>
                      <SelectItem value="Gap year">{t("gapYear")}</SelectItem>
                      <SelectItem value="Bachelor's degree">{language === "ru" ? "Бакалавриат (→ Магистратура)" : language === "kk" ? "Бакалавриат (→ Магистратура)" : "Bachelor's (→ Master's)"}</SelectItem>
                      <SelectItem value="Master's degree">{language === "ru" ? "Магистратура (→ PhD)" : language === "kk" ? "Магистратура (→ PhD)" : "Master's (→ PhD)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold">SAT Score</Label>
                  <Input
                    type="number"
                    placeholder="1400"
                    value={satScore}
                    onChange={(e) => setSatScore(e.target.value)}
                    className="h-12 rounded-xl"
                    min="400"
                    max="1600"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">IELTS/TOEFL</Label>
                  <Input
                    type="number"
                    placeholder="7.5"
                    value={ieltsScore}
                    onChange={(e) => setIeltsScore(e.target.value)}
                    className="h-12 rounded-xl"
                    step="0.5"
                    min="1"
                    max="9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">{t("desiredMajor")} *</Label>
                <Input
                  placeholder={t("majorPlaceholder")}
                  value={desiredMajor}
                  onChange={(e) => setDesiredMajor(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">{t("targetCountry")} *</Label>
                <Select value={targetCountry} onValueChange={setTargetCountry}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder={t("selectCountry")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">🇺🇸 USA</SelectItem>
                    <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="Europe">🇪🇺 Europe</SelectItem>
                    <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                    <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                    <SelectItem value="Asia">🌏 Asia</SelectItem>
                    <SelectItem value="Kazakhstan">🇰🇿 Kazakhstan</SelectItem>
                    <SelectItem value="Turkey">🇹🇷 Turkey</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">{t("mainGoal")} *</Label>
                <Textarea
                  placeholder={t("goalPlaceholder")}
                  value={mainGoal}
                  onChange={(e) => setMainGoal(e.target.value)}
                  className="min-h-24 rounded-xl resize-none"
                  rows={3}
                />
                <p className={`text-xs ${mainGoal.length >= 15 ? 'text-muted-foreground' : 'text-destructive'}`}>
                  {t("goalMinLength")} ({mainGoal.length}/15)
                </p>
              </div>

              <Button
                onClick={generateRoadmap}
                disabled={generating || !isGoalValid || !gpa || !currentGrade || !desiredMajor || !targetCountry}
                className="w-full h-14 rounded-xl font-bold text-base shadow-primary"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {t("generatingPlan")}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t("generatePlan")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show roadmap
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-extrabold flex items-center gap-2">
              <Map className="w-6 h-6 text-primary" />
              {t("yourPath")}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetRoadmap}
              className="text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Overall Progress */}
          <div className="mt-3 p-3 bg-secondary/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">{t("overallProgress")}</span>
              <span className="text-sm font-bold text-primary">{Math.round(getTotalProgress())}%</span>
            </div>
            <Progress value={getTotalProgress()} className="h-3" />
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-5 space-y-3">
        {roadmap?.months.map((month, monthIndex) => {
          const isExpanded = expandedMonths.has(monthIndex);
          const progress = getMonthProgress(month);
          const completedCount = month.tasks.filter(t => t.completed).length;
          const IconComponent = categoryIcons[month.tasks[0]?.category] || Target;

          return (
            <div
              key={monthIndex}
              className="duolingo-card overflow-hidden animate-fade-in"
              style={{ animationDelay: `${monthIndex * 0.05}s` }}
            >
              {/* Month Header */}
              <button
                onClick={() => toggleMonth(monthIndex)}
                className="w-full p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  progress === 100 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {progress === 100 ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="font-extrabold text-lg">{monthIndex + 1}</span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold">{month.month}</h3>
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {completedCount}/{month.tasks.length}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{month.theme}</p>
                  <Progress value={progress} className="h-1.5 mt-2" />
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {/* Tasks */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
                  {month.tasks.map((task, taskIndex) => {
                    const TaskIcon = categoryIcons[task.category] || Target;
                    const colorClass = categoryColors[task.category] || "bg-muted text-muted-foreground";

                    return (
                      <div
                        key={taskIndex}
                        className={`p-4 rounded-xl border transition-all ${
                          task.completed 
                            ? "bg-muted/30 border-muted" 
                            : "bg-card border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTask(monthIndex, task.title, task.completed)}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {task.completed ? (
                              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 transition-colors">
                                <Circle className="w-3.5 h-3.5 text-muted-foreground/50" />
                              </div>
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${colorClass}`}>
                                {task.category}
                              </span>
                              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                                task.completed 
                                  ? "text-primary bg-primary/10" 
                                  : "text-xp bg-xp/10"
                              }`}>
                                +{task.xpReward} XP
                              </span>
                            </div>
                            <h4 className={`text-sm font-bold leading-snug mb-2 ${
                              task.completed ? "text-muted-foreground line-through" : "text-foreground"
                            }`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className={`text-sm leading-relaxed ${
                                task.completed ? "text-muted-foreground/70" : "text-muted-foreground"
                              }`}>
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Path;