import { ClipboardList, CalendarCheck, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Расскажи о себе",
    description: "Заполни профиль: оценки, тесты, цели и интересы",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Получи AI-план",
    description: "AI создаст персональный план подготовки по месяцам",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Поступи в мечту",
    description: "Следуй плану, выполняй задания и поступи в топовый университет",
  },
];

export function ProcessSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          Как это работает?
        </h2>
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex gap-4 items-start animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                  {step.number}
                </div>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
