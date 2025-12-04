import { BarChart3, TrendingUp, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Statistics = () => {
  const stats = {
    satScore: null as number | null,
    ieltsScore: null as number | null,
    totalXP: 0,
    daysActive: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Статистика</h1>
          <Button variant="secondary" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Активность
          </Button>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* XP Graph Card */}
        <div className="gamification-card animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">XP за последние 7 дней</h2>
          </div>
          <div className="h-48 bg-muted/50 rounded-xl flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Начните выполнять задания</p>
              <p className="text-xs">чтобы увидеть прогресс</p>
            </div>
          </div>
        </div>

        {/* Test Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="gamification-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SAT Score</span>
            </div>
            <div className="text-3xl font-bold">
              {stats.satScore ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.satScore ? `Из 1600` : "Добавьте результат"}
            </p>
          </div>

          <div className="gamification-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-accent" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">IELTS</span>
            </div>
            <div className="text-3xl font-bold">
              {stats.ieltsScore ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.ieltsScore ? `Из 9.0` : "Добавьте результат"}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="gamification-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-semibold mb-4">Общая статистика</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/50 rounded-xl text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalXP}</div>
              <div className="text-xs text-muted-foreground">Всего XP</div>
            </div>
            <div className="p-4 bg-secondary/50 rounded-xl text-center">
              <div className="text-2xl font-bold text-primary">{stats.daysActive}</div>
              <div className="text-xs text-muted-foreground">Дней активности</div>
            </div>
          </div>
        </div>

        {/* Add Score CTA */}
        <div className="text-center py-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground mb-3">
            Добавьте свои результаты тестов в настройках
          </p>
          <Button variant="outline" size="sm">
            Добавить результаты
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
