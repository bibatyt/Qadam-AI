import { Globe, Bot, Target, Users } from "lucide-react";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function FeaturesSection() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  const features = [
    {
      icon: Globe,
      title: t.globalAccess,
      description: t.globalAccessDesc,
    },
    {
      icon: Bot,
      title: t.aiPersonalization,
      description: t.aiPersonalizationDesc,
    },
    {
      icon: Target,
      title: t.goalAdmission,
      description: t.goalAdmissionDesc,
    },
    {
      icon: Users,
      title: t.community,
      description: t.communityDesc,
    },
  ];

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-[80px]" />
      </div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 animate-fade-in">
          {t.whyQadam}
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="gamification-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
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
