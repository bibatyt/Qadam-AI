import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FooterCTA } from "@/components/landing/FooterCTA";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <TestimonialsSection />
        <FooterCTA />
      </main>
      <footer className="py-8 px-4 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          © 2024 Qadam. Все права защищены.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
