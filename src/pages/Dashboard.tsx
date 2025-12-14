import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, CheckCircle2, Clock, 
  ChevronDown, Loader2, Trophy, Sparkles, FileText 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { MyPathCard } from "@/features/path";

const Dashboard = () => {
  const { profile, loading, updateStreak } = useProfile();
  const { quests, toggleQuest, loading: questsLoading } = useDailyQuests();
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState("");
  const [showOtherTasks, setShowOtherTasks] = useState(false);
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];
  const { user } = useAuth();
  const [checkingRoadmap, setCheckingRoadmap] = useState(true);
  const [pathData, setPathData] = useState<{
    university?: string;
    totalSteps: number;
    completedSteps: number;
    nextStep?: string;
    currentPart: number;
    totalParts: number;
  } | null>(null);

  // Check if user has a roadmap, if not redirect to onboarding
  useEffect(() => {
    const checkRoadmap = async () => {
      if (!user) return;
      
      const { data: roadmaps } = await supabase
        .from('roadmaps')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (!roadmaps || roadmaps.length === 0) {
        // No roadmap found, redirect to onboarding
        navigate('/onboarding', { replace: true });
      } else {
        setCheckingRoadmap(false);
        // Fetch path data for the card
        fetchPathData();
      }
    };
    
    if (user) {
      checkRoadmap();
    }
  }, [user, navigate]);

  const fetchPathData = async () => {
    if (!user) return;
    
    try {
      const { data: milestones } = await supabase
        .from('path_milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index');
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('target_university')
        .eq('user_id', user.id)
        .single();
      
      if (milestones && milestones.length > 0) {
        const completed = milestones.filter(m => m.completed).length;
        const nextMilestone = milestones.find(m => !m.completed);
        const firstIncomplete = milestones.find(m => !m.completed);
        const currentPart = firstIncomplete 
          ? Math.ceil(firstIncomplete.order_index / 10)
          : 5;
        
        setPathData({
          university: profileData?.target_university || undefined,
          totalSteps: milestones.length,
          completedSteps: completed,
          nextStep: nextMilestone?.title,
          currentPart: Math.min(currentPart, 5),
          totalParts: 5,
        });
      }
    } catch (error) {
      console.error('Error fetching path data:', error);
    }
  };

  useEffect(() => {
    if (profile) {
      updateStreak();
    }
  }, [profile?.id]);

  const triggerConfetti = useCallback(() => {
    const messages = language === 'ru' 
      ? ["Ты супер! 🔥", "Так держать! 💪", "Молодец! ⚡", "Отлично! 🎯", "Невероятно! ✨"]
      : language === 'kk'
      ? ["Сен керемет! 🔥", "Осылай жалғастыр! 💪", "Жарайсың! ⚡", "Тамаша! 🎯", "Керемет! ✨"]
      : ["You're amazing! 🔥", "Keep it up! 💪", "Great job! ⚡", "Excellent! 🎯", "Incredible! ✨"];
    setCelebrationText(messages[Math.floor(Math.random() * messages.length)]);
    
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899'],
    });
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  }, [language]);

  const handleTaskComplete = async (questId: string, completed: boolean) => {
    await toggleQuest(questId, completed);
    if (!completed) {
      triggerConfetti();
    }
  };

  if (loading || checkingRoadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const progressPercent = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;
  const taskOfDay = quests.find(q => !q.completed);
  const allCompleted = completedQuests === totalQuests && totalQuests > 0;

  const getProgressMessage = () => {
    if (allCompleted) return { text: t.heroOfDay, emoji: "🏆" };
    if (progressPercent >= 66) return { text: t.almostThere, emoji: "🔥" };
    if (progressPercent >= 33) return { text: t.goodPace, emoji: "💪" };
    if ((profile?.streak || 0) > 3) return { text: `${profile?.streak} ${t.daysInRow}`, emoji: "⚡" };
    return { text: t.startWithOneTask, emoji: "🎯" };
  };

  const progressInfo = getProgressMessage();

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="gradient-primary text-primary-foreground px-10 py-5 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <Trophy className="w-10 h-10" />
                <div>
                  <p className="text-2xl font-black">{celebrationText}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Compact Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14 border-2 border-primary shadow-primary">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="gradient-primary text-primary-foreground font-black text-lg">
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-black text-lg text-foreground">{profile?.name || t.student}</p>
              <p className="text-sm text-muted-foreground">
                {profile?.target_university || t.futureStudent}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <NotificationBell />
            
            {/* Streak Badge */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl gradient-streak text-white shadow-streak"
            >
              <Flame className={`w-6 h-6 ${(profile?.streak || 0) > 0 ? 'animate-pulse' : ''}`} />
              <span className="font-black text-xl">{profile?.streak || 0}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* MAIN FOCUS: Task of the Day - Takes ~60% of mobile screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="duolingo-card overflow-hidden"
          style={{ minHeight: '45vh' }}
        >
          {/* Header gradient */}
          <div className="gradient-primary p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold">{t.taskOfDay}</span>
              </div>
              <span className="text-sm bg-white/20 px-3 py-1.5 rounded-full font-semibold">
                {t.approxTime}
              </span>
            </div>
            <h2 className="text-2xl font-black leading-tight">
              {allCompleted 
                ? t.allTasksCompleted 
                : taskOfDay?.quest_title || t.loading}
            </h2>
          </div>

          {/* Action area */}
          <div className="p-6 flex flex-col justify-center" style={{ minHeight: '25vh' }}>
            {allCompleted ? (
              <div className="text-center py-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-7xl mb-6"
                >
                  🏆
                </motion.div>
                <p className="text-xl font-bold text-foreground mb-2">{t.incredible}</p>
                <p className="text-muted-foreground">{t.comeBackTomorrow}</p>
              </div>
            ) : taskOfDay && (
              <>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-2xl"
                  >
                    ✨
                  </motion.div>
                  <span className="font-bold text-muted-foreground">
                    {t.completeAndProgress}
                  </span>
                </div>
                
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full h-16 text-xl font-black shadow-primary"
                  onClick={() => handleTaskComplete(taskOfDay.id, taskOfDay.completed)}
                >
                  <CheckCircle2 className="w-7 h-7 mr-3" />
                  {t.completed}
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Emotional Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="duolingo-card p-5"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl"
            >
              {progressInfo.emoji}
            </motion.div>
            <div className="flex-1">
              <p className="font-bold text-foreground mb-2">{progressInfo.text}</p>
              <div className="flex items-center gap-3">
                <Progress value={progressPercent} className="h-3 flex-1" />
                <span className="text-sm font-black text-primary">
                  {completedQuests}/{totalQuests}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* My Path Card - Always accessible */}
        {pathData && (
          <MyPathCard
            university={pathData.university}
            progress={pathData.totalSteps > 0 ? (pathData.completedSteps / pathData.totalSteps) * 100 : 0}
            totalSteps={pathData.totalSteps}
            completedSteps={pathData.completedSteps}
            nextStep={pathData.nextStep}
            currentPart={pathData.currentPart}
            totalParts={pathData.totalParts}
          />
        )}

        {/* Quick Action - Essay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => navigate("/essay")}
            className="w-full duolingo-card p-4 text-left hover:shadow-lg transition-all active:scale-[0.98] touch-target"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-bold text-foreground">{t.checkEssay}</p>
                <p className="text-xs text-muted-foreground">{t.getImpactScore}</p>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Other Quests (collapsible) */}
        {quests.filter(q => q.id !== taskOfDay?.id).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="duolingo-card overflow-hidden"
          >
            <button
              onClick={() => setShowOtherTasks(!showOtherTasks)}
              className="w-full flex items-center justify-between p-4 touch-target"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <span className="font-bold text-foreground">{t.otherTasks}</span>
                <span className="text-sm text-muted-foreground">
                  ({quests.filter(q => q.id !== taskOfDay?.id).length})
                </span>
              </div>
              <motion.div
                animate={{ rotate: showOtherTasks ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {showOtherTasks && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {quests.filter(q => q.id !== taskOfDay?.id).map((quest) => (
                      <button
                        key={quest.id}
                        onClick={() => handleTaskComplete(quest.id, quest.completed)}
                        className={`
                          w-full flex items-center gap-3 p-4 rounded-xl transition-all touch-target
                          ${quest.completed 
                            ? "bg-primary/10 border border-primary/20" 
                            : "bg-muted/50 hover:bg-muted active:scale-[0.98]"
                          }
                        `}
                      >
                        <div className={`
                          w-7 h-7 rounded-full flex items-center justify-center shrink-0
                          ${quest.completed 
                            ? "gradient-primary" 
                            : "border-2 border-muted-foreground/30"
                          }
                        `}>
                          {quest.completed && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                        </div>
                        <span className={`text-sm text-left flex-1 font-medium ${
                          quest.completed ? "line-through text-muted-foreground" : "text-foreground"
                        }`}>
                          {quest.quest_title}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* AI Mentor Hint */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="gradient-wisdom rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-wisdom-foreground" />
            </div>
            <div>
              <p className="text-xs font-bold text-wisdom-foreground/80 uppercase tracking-wider mb-0.5">
                {t.aiMentor}
              </p>
              <p className="text-sm text-wisdom-foreground font-semibold">
                {t.clickForHelp}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;