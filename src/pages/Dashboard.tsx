import { useEffect } from "react";
import { Flame, Zap, Target, ListTodo, Lightbulb, Trophy, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { useDailyQuests } from "@/hooks/useDailyQuests";

const wisdomQuotes = [
  "Образование — это не подготовка к жизни; образование — это сама жизнь. — Джон Дьюи",
  "Будущее принадлежит тем, кто верит в красоту своей мечты. — Элеонора Рузвельт",
  "Успех — это не конечная точка, а путешествие. — Ральф Уолдо Эмерсон",
  "Единственный способ делать великую работу — любить то, что вы делаете. — Стив Джобс",
];

const Dashboard = () => {
  const { profile, loading, updateStreak } = useProfile();
  const { quests, toggleQuest, loading: questsLoading } = useDailyQuests();

  // Update streak on visit
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
  const wisdomQuote = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gamification stats */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="container max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
              {profile?.level || 1}
            </div>
            <Progress value={(currentLevelXP / xpToNextLevel) * 100} className="w-24 h-2" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Zap className="w-5 h-5 text-xp" />
              <span>{profile?.xp || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Flame className={`w-5 h-5 text-accent ${(profile?.streak || 0) > 0 ? 'animate-fire' : ''}`} />
              <span>{profile?.streak || 0}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <div className="gradient-primary rounded-3xl p-6 text-primary-foreground animate-slide-up">
          <h1 className="text-xl font-bold mb-1">
            С возвращением, {profile?.name || "Студент"} 👋
          </h1>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <span>Уровень {profile?.level || 1}</span>
            <span>•</span>
            <span>{profile?.xp || 0} XP</span>
          </div>
          <div className="mt-4 bg-primary-foreground/20 rounded-full px-3 py-1 inline-block text-sm">
            {xpToNextLevel - currentLevelXP} XP до Lvl {(profile?.level || 1) + 1}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Streak Card */}
          <div className="gamification-card bg-accent/10 border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Flame className={`w-6 h-6 text-accent ${(profile?.streak || 0) > 0 ? 'animate-fire' : ''}`} />
              <span className="text-2xl font-bold">{profile?.streak || 0}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              дн. 🔥 {(profile?.streak || 0) > 0 ? "В огне!" : "Начни серию!"}
            </p>
          </div>

          {/* Goal Card */}
          <div className="gamification-card">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">
              {profile?.target_university || "Поставь цель"}
            </p>
            <p className="text-xs text-muted-foreground">
              {profile?.target_university ? "Твоя цель" : "Выбери университет"}
            </p>
          </div>
        </div>

        {/* Daily Quests */}
        <div className="gamification-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Ежедневные задания</h2>
          </div>
          {questsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {quests.map((quest) => (
                <label
                  key={quest.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    quest.completed ? "bg-success/10" : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={quest.completed}
                    onChange={() => toggleQuest(quest.id, quest.completed)}
                    className="w-5 h-5 rounded-md border-2 border-primary text-primary focus:ring-primary"
                  />
                  <span className={`text-sm ${quest.completed ? "line-through text-muted-foreground" : ""}`}>
                    {quest.quest_title}
                  </span>
                  <span className="ml-auto text-xs text-primary font-medium">+{quest.xp_reward} XP</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Wisdom Card */}
        <div className="gradient-accent rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 mb-3 text-accent-foreground">
            <Lightbulb className="w-5 h-5" />
            <span className="font-semibold text-sm">Мудрость дня</span>
          </div>
          <p className="text-accent-foreground/90 text-sm leading-relaxed">
            "{wisdomQuote}"
          </p>
        </div>

        {/* Achievement Teaser */}
        <div className="gamification-card animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">
                {(profile?.xp || 0) >= 100 ? "Первый уровень!" : "Первые шаги"}
              </p>
              <p className="text-sm text-muted-foreground">
                {(profile?.xp || 0) >= 100 ? "Достигнут уровень 2" : "Завершите первое задание"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
