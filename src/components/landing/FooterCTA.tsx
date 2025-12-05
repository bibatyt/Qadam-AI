import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function FooterCTA() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container max-w-2xl mx-auto text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 animate-fade-in">
          {t.readyToStart}
        </h2>
        <p className="text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {t.footerDesc}
        </p>
        <Link to="/auth" className="animate-fade-in inline-block" style={{ animationDelay: '0.2s' }}>
          <Button variant="hero" size="lg" className="group">
            {t.startFree}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
