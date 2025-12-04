import { Globe, Bot, Target, Users } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Глобальный доступ",
    description: "Стратегии для США, Европы, Азии и других регионов",
  },
  {
    icon: Bot,
    title: "AI-персонализация",
    description: "Индивидуальный план подготовки под ваш профиль",
  },
  {
    icon: Target,
    title: "Цель — поступление",
    description: "Фокус на результате: от первых шагов до зачисления",
  },
  {
    icon: Users,
    title: "Сообщество",
    description: "Присоединяйтесь к тысячам студентов по всему миру",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          Почему Qadam?
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="gamification-card hover:shadow-elevated transition-shadow duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
