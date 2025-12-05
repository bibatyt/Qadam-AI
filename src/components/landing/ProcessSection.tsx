import { ClipboardList, CalendarCheck, Rocket } from "lucide-react";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function ProcessSection() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  const steps = [
    {
      number: "01",
      icon: ClipboardList,
      title: t.step1Title,
      description: t.step1Desc,
    },
    {
      number: "02",
      icon: CalendarCheck,
      title: t.step2Title,
      description: t.step2Desc,
    },
    {
      number: "03",
      icon: Rocket,
      title: t.step3Title,
      description: t.step3Desc,
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30 relative overflow-hidden">
      {/* Connecting line animation */}
      <div className="absolute left-1/2 top-32 bottom-32 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden md:block" />
      
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 animate-fade-in">
          {t.howItWorks}
        </h2>
        
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex gap-4 items-start animate-fade-in group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-streak animate-bounce" style={{ animationDelay: `${index * 0.2}s`, animationDuration: '2s' }}>
                  {step.number}
                </div>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
