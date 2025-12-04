import { Lock, CheckCircle2, Circle, Sparkles, GraduationCap } from "lucide-react";

const pathSteps = [
  { id: 1, title: "Создай профиль", description: "Расскажи о себе", status: "completed" as const },
  { id: 2, title: "Выбери цель", description: "Определи университет мечты", status: "current" as const },
  { id: 3, title: "Пройди тест", description: "Узнай свой уровень", status: "locked" as const },
  { id: 4, title: "Начни подготовку", description: "Первый урок", status: "locked" as const },
  { id: 5, title: "Напиши эссе", description: "Черновик эссе", status: "locked" as const },
  { id: 6, title: "Подай заявку", description: "Отправь документы", status: "locked" as const },
];

const Path = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container max-w-lg mx-auto">
          <h1 className="text-xl font-bold">Твой путь</h1>
          <p className="text-sm text-muted-foreground">К университету мечты</p>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6">
        {/* Goal Card */}
        <div className="gradient-primary rounded-3xl p-6 text-primary-foreground mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-80">Твоя цель</p>
              <p className="font-bold text-lg">Топовый университет</p>
            </div>
          </div>
          <p className="text-sm opacity-90">
            Выбери конкретный университет, чтобы получить персональный план
          </p>
        </div>

        {/* Path Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />

          <div className="space-y-4">
            {pathSteps.map((step, index) => (
              <div
                key={step.id}
                className="relative flex gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Step indicator */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.status === "completed"
                      ? "gradient-primary text-primary-foreground"
                      : step.status === "current"
                      ? "bg-secondary border-2 border-primary text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : step.status === "current" ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>

                {/* Step content */}
                <div
                  className={`flex-1 gamification-card ${
                    step.status === "current"
                      ? "border-primary/30 shadow-lg shadow-primary/10"
                      : step.status === "locked"
                      ? "opacity-60"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {step.status === "current" && (
                      <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        Сейчас
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation */}
        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <p className="text-sm text-muted-foreground">
            🎯 Выполняй задания каждый день и получай XP!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Path;
