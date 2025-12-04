import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 px-4 gradient-hero overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 animate-slide-up">
          <Sparkles className="w-4 h-4" />
          AI-powered образование
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Поступи в университет{" "}
          <span className="text-gradient">мечты</span> с AI
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Персональный AI-помощник проведёт тебя от первого шага до зачисления в топовые университеты мира
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/auth">
            <Button variant="hero" size="lg" className="w-full sm:w-auto">
              Начать путь
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Бесплатная консультация
          </Button>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">99%</div>
            <div className="text-sm text-muted-foreground">Успех</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">99+</div>
            <div className="text-sm text-muted-foreground">Университетов</div>
          </div>
        </div>
      </div>
    </section>
  );
}
