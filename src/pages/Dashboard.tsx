import { Flame, Zap, Target, ListTodo, Lightbulb, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const user = {
    name: "Студент",
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 0,
  };

  const dailyQuests = [
    { id: 1, title: "Прочитать 1 статью об университетах", completed: false },
    { id: 2, title: "Пройти мини-тест по английскому", completed: false },
    { id: 3, title: "Написать 100 слов для эссе", completed: false },
  ];

  const wisdomQuote = "Образование — это не подготовка к жизни; образование — это сама жизнь. — Джон Дьюи";

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gamification stats */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="container max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
              {user.level}
            </div>
            <Progress value={(user.xp / user.xpToNextLevel) * 100} className="w-24 h-2" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Zap className="w-5 h-5 text-xp" />
              <span>{user.xp}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Flame className="w-5 h-5 text-accent" />
              <span>{user.streak}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <div className="gradient-primary rounded-3xl p-6 text-primary-foreground animate-slide-up">
          <h1 className="text-xl font-bold mb-1">
            С возвращением, {user.name} 👋
          </h1>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <span>Уровень {user.level}</span>
            <span>•</span>
            <span>{user.xp} XP</span>
          </div>
          <div className="mt-4 bg-primary-foreground/20 rounded-full px-3 py-1 inline-block text-sm">
            {user.xpToNextLevel - user.xp} XP до Lvl {user.level + 1}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Streak Card */}
          <div className="gamification-card bg-accent/10 border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Flame className={`w-6 h-6 text-accent ${user.streak > 0 ? 'animate-fire' : ''}`} />
              <span className="text-2xl font-bold">{user.streak}</span>
            </div>
            <p className="text-sm text-muted-foreground">дн. 🔥 В огне!</p>
          </div>

          {/* Goal Card */}
          <div className="gamification-card">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Поставь цель</p>
            <p className="text-xs text-muted-foreground">Выбери университет</p>
          </div>
        </div>

        {/* Daily Quests */}
        <div className="gamification-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Ежедневные задания</h2>
          </div>
          <div className="space-y-3">
            {dailyQuests.map((quest) => (
              <label
                key={quest.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md border-2 border-primary text-primary focus:ring-primary"
                />
                <span className="text-sm">{quest.title}</span>
              </label>
            ))}
          </div>
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
              <p className="font-semibold">Первые шаги</p>
              <p className="text-sm text-muted-foreground">Завершите первое задание</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
