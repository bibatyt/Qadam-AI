import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, GraduationCap, CheckCircle, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";

interface WelcomeOnboardingProps {
  onComplete: () => void;
}

const welcomeContent = {
  en: {
    screens: [
      {
        icon: "🎓",
        title: "Qadam — AI navigator for university admission",
        subtitle: "From choosing a university to a clear step-by-step plan",
      },
      {
        icon: "✨",
        title: "We help you:",
        bullets: [
          "Choose a university",
          "Understand requirements and deadlines",
          "Build a personalized admission path",
        ],
      },
      {
        icon: "🚀",
        title: "Start your admission journey",
        cta: "Build my path",
      },
    ],
    skip: "Skip",
    next: "Next",
  },
  ru: {
    screens: [
      {
        icon: "🎓",
        title: "Qadam — AI-навигатор для поступления",
        subtitle: "От выбора университета до понятного пошагового плана",
      },
      {
        icon: "✨",
        title: "Мы помогаем:",
        bullets: [
          "Выбрать университет",
          "Понять требования и дедлайны",
          "Построить персональный путь к поступлению",
        ],
      },
      {
        icon: "🚀",
        title: "Начните путь к поступлению",
        cta: "Построить мой путь",
      },
    ],
    skip: "Пропустить",
    next: "Далее",
  },
  kk: {
    screens: [
      {
        icon: "🎓",
        title: "Qadam — түсу үшін AI-навигатор",
        subtitle: "Университет таңдаудан бастап түсінікті қадамдық жоспарға дейін",
      },
      {
        icon: "✨",
        title: "Біз көмектесеміз:",
        bullets: [
          "Университет таңдау",
          "Талаптар мен мерзімдерді түсіну",
          "Жеке түсу жолын құру",
        ],
      },
      {
        icon: "🚀",
        title: "Түсу жолыңызды бастаңыз",
        cta: "Жолымды құру",
      },
    ],
    skip: "Өткізіп жіберу",
    next: "Келесі",
  },
};

export function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const { language } = useLandingLanguage();
  const content = welcomeContent[language];
  const screen = content.screens[currentScreen];

  const handleNext = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentScreen
                ? "w-8 bg-primary"
                : i < currentScreen
                ? "w-2 bg-primary/50"
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Skip button */}
      {currentScreen < 2 && (
        <div className="absolute top-4 right-4">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
          >
            {content.skip}
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-sm"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="text-7xl mb-8"
            >
              {screen.icon}
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
              {screen.title}
            </h1>

            {/* Subtitle or bullets */}
            {screen.subtitle && (
              <p className="text-muted-foreground text-lg">
                {screen.subtitle}
              </p>
            )}

            {screen.bullets && (
              <ul className="space-y-4 text-left mt-6">
                {screen.bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action */}
      <div className="px-6 pb-8 pt-4">
        <Button
          variant="hero"
          size="lg"
          className="w-full h-14 text-lg font-bold"
          onClick={handleNext}
        >
          {currentScreen === 2 ? screen.cta : content.next}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
