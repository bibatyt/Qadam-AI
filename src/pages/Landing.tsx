import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FooterCTA } from "@/components/landing/FooterCTA";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

const Landing = () => {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <TestimonialsSection />
        <ReviewsSection />
        <FAQSection />
        <FooterCTA />
      </main>
      <footer className="py-8 px-4 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          {t.copyright}
        </div>
      </footer>
    </div>
  );
};

export default Landing;
