import { useState, useEffect } from "react";
import {
  Header,
  HeroSection,
  ScreenshotsSection,
  AdvantagesSection,
  ProcessSection,
  EFCSection,
  SuccessStoriesSection,
  FeedbackFormSection,
  FooterSection,
} from "@/features/landing";
import { WelcomeOnboarding } from "@/features/welcome";

const WELCOME_SEEN_KEY = "qadam_welcome_seen";

const Landing = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has seen welcome before
    const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
    setIsChecking(false);
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setShowWelcome(false);
  };

  // Don't render anything while checking
  if (isChecking) {
    return null;
  }

  // Show welcome onboarding for first-time visitors
  if (showWelcome) {
    return <WelcomeOnboarding onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ScreenshotsSection />
        <AdvantagesSection />
        <ProcessSection />
        <EFCSection />
        <SuccessStoriesSection />
        <FeedbackFormSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Landing;
