import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AIBackground } from "./AIBackground";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function HeroSection() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[90vh] flex items-center">
      <AIBackground />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container max-w-4xl mx-auto text-center relative z-10">
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 animate-fade-in shadow-sm"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          {t.aiPowered}
        </div>
        
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {t.heroTitle}{" "}
          <span className="text-gradient relative">
            {t.heroTitleHighlight}
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
              <path 
                d="M0 4 Q50 0, 100 4 T200 4" 
                stroke="hsl(162, 73%, 46%)" 
                strokeWidth="3" 
                fill="none"
                className="animate-draw-line"
              />
            </svg>
          </span>{" "}
          {t.heroTitleEnd}
        </h1>
        
        <p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {t.heroDescription}
        </p>
        
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Link to="/auth">
            <Button variant="hero" size="lg" className="w-full sm:w-auto group">
              {t.startJourney}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto hover:bg-secondary transition-colors">
            {t.freeConsultation}
          </Button>
        </div>
        
        {/* Stats */}
        <div 
          className="flex items-center justify-center gap-8 sm:gap-16 mt-16 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="text-center group cursor-default">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary group-hover:scale-110 transition-transform">99%</div>
            <div className="text-sm text-muted-foreground">{t.successRate}</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center group cursor-default">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary group-hover:scale-110 transition-transform">99+</div>
            <div className="text-sm text-muted-foreground">{t.universities}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
