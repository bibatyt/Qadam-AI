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
      {/* Animated connecting line */}
      <div className="absolute left-1/2 top-32 bottom-32 w-px hidden md:block overflow-hidden">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-primary/40 to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-primary/60 to-transparent animate-slide-down" />
      </div>
      
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 animate-fade-in">
          {t.howItWorks}
        </h2>
        
        <div className="space-y-10">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex gap-5 items-start animate-fade-in group relative"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Animated glow effect on hover */}
              <div className="absolute -inset-4 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <step.icon className="w-7 h-7 text-primary-foreground group-hover:animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-streak group-hover:scale-125 transition-transform">
                  {step.number}
                </div>
                {/* Pulse ring animation */}
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
              </div>
              <div className="flex-1 pt-2 relative z-10">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
