import { useEffect, useState } from "react";
import { Flame, Target, Lightbulb, CheckCircle2, Circle, ChevronRight, Loader2, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { useLanguage } from "@/hooks/useLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { profile, loading, updateStreak } = useProfile();
  const { quests, toggleQuest, loading: questsLoading } = useDailyQuests();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [wisdomIndex] = useState(() => Math.floor(Math.random() * 4));

  useEffect(() => {
    if (profile) {
      updateStreak();
    }
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const xpToNextLevel = 100;
  const currentLevelXP = profile ? profile.xp % xpToNextLevel : 0;
  const wisdomKeys = ["wisdom1", "wisdom2", "wisdom3", "wisdom4"];

  const getLevelTitle = (level: number) => {
    if (level <= 2) return t("newbie");
    if (level <= 5) return t("explorer");
    if (level <= 10) return t("scholar");
    return t("master");
  };

  const completedQuests = quests.filter(q => q.completed).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="container max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Profile Header with Level Badge */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="relative">
            <Avatar className="w-14 h-14 border-[3px] border-primary ring-2 ring-primary/20">
              <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg">
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm border border-primary-foreground/20">
              {profile?.level || 1}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("level")} {profile?.level || 1}
              </span>
              <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full font-semibold">
                {getLevelTitle(profile?.level || 1)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={(currentLevelXP / xpToNextLevel) * 100} className="h-2 flex-1" />
              <span className="text-xs font-bold text-primary">{currentLevelXP}/{xpToNextLevel}</span>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="duolingo-card p-5 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <h1 className="text-xl font-extrabold text-foreground mb-1">
            {t("welcomeBack")}, {profile?.name || "Студент"} 👋
          </h1>
          <p className="text-muted-foreground text-sm">{t("readyToConquer")}</p>
          
          {/* XP Progress */}
          <div className="mt-4 p-3 bg-secondary/50 rounded-xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-xp" />
                <span className="font-bold text-foreground">{profile?.xp || 0} XP</span>
              </div>
              <span className="text-muted-foreground text-xs">
                {xpToNextLevel - currentLevelXP} {t("xpToLevel")} {(profile?.level || 1) + 1}
              </span>
            </div>
            <Progress value={(currentLevelXP / xpToNextLevel) * 100} className="h-3" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Streak Card */}
          <div className="gradient-streak rounded-2xl p-4 text-white shadow-streak">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Flame className={`w-6 h-6 ${(profile?.streak || 0) > 0 ? 'animate-fire' : ''}`} />
              </div>
            </div>
            <p className="text-3xl font-extrabold mt-3">
              {profile?.streak || 0} <span className="text-base font-bold opacity-90">{t("days")}</span>
            </p>
            <p className="text-white/80 text-sm font-medium mt-0.5">
              🔥 {(profile?.streak || 0) > 0 ? t("onFire") : t("startStreak")}
            </p>
          </div>

          {/* Goal Card */}
          <button 
            onClick={() => navigate("/settings")}
            className="duolingo-card p-4 text-left transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-3">{t("goal")}</p>
            <p className="font-bold text-foreground text-sm truncate mt-0.5">
              {profile?.target_university || t("setGoal")}
            </p>
          </button>
        </div>

        {/* Daily Quests */}
        <div className="duolingo-card animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between p-4 pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h2 className="font-extrabold text-foreground">{t("dailyQuests")}</h2>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {completedQuests}/{quests.length}
            </span>
          </div>
          
          {questsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {quests.map((quest, index) => (
                <button
                  key={quest.id}
                  onClick={() => toggleQuest(quest.id, quest.completed)}
                  className={`quest-item w-full ${
                    quest.completed ? "quest-item-completed" : "quest-item-pending"
                  }`}
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  {quest.completed ? (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center flex-shrink-0">
                      <Circle className="w-4 h-4 text-muted-foreground/50" />
                    </div>
                  )}
                  <span className={`text-sm text-left flex-1 font-semibold ${
                    quest.completed ? "text-muted-foreground line-through" : "text-foreground"
                  }`}>
                    {quest.quest_title}
                  </span>
                  <span className={`text-sm font-extrabold whitespace-nowrap px-2 py-0.5 rounded-lg ${
                    quest.completed 
                      ? "text-primary bg-primary/10" 
                      : "text-xp bg-xp/10"
                  }`}>
                    +{quest.xp_reward} XP
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wisdom Card */}
        <div className="gradient-wisdom rounded-2xl p-4 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Lightbulb className="w-5 h-5 text-wisdom-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-extrabold text-wisdom-foreground/80 uppercase tracking-wider mb-1.5">
                {t("wisdomOfDay")}
              </p>
              <p className="text-sm text-wisdom-foreground font-semibold leading-relaxed">
                "{t(wisdomKeys[wisdomIndex])}"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;