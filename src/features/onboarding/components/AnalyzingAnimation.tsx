import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalyzingAnimationProps {
  onComplete: () => void;
  language: 'ru' | 'en' | 'kk';
}

const FACTORS = [
  { ru: "Анализ профиля", en: "Profile analysis", kk: "Профильді талдау", emoji: "👤" },
  { ru: "Поиск университетов", en: "University matching", kk: "Университеттер іздеу", emoji: "🎓" },
  { ru: "Расчёт дедлайнов", en: "Deadline calculation", kk: "Мерзімдерді есептеу", emoji: "📅" },
  { ru: "Создание плана", en: "Creating roadmap", kk: "Жоспар құру", emoji: "🗺️" },
  { ru: "AI персонализация", en: "AI personalization", kk: "AI жекелеу", emoji: "✨" },
];

export function AnalyzingAnimation({ onComplete, language }: AnalyzingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 35);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= FACTORS.length - 1) return prev;
        return prev + 1;
      });
    }, 700);

    const timeout = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  const t = {
    title: {
      ru: "Создаём твой план",
      en: "Creating your plan",
      kk: "Жоспарыңды құрудамыз"
    },
    subtitle: {
      ru: "Анализируем 120+ факторов",
      en: "Analyzing 120+ factors",
      kk: "120+ факторды талдаудамыз"
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0.3 }}
            animate={{ 
              scale: [1, 2, 3],
              opacity: [0.3, 0.1, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/20"
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-sm mx-auto">
        {/* Main icon */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
          className="w-24 h-24 mx-auto mb-8 rounded-3xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30"
        >
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-4xl"
          >
            🚀
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-foreground mb-2"
        >
          {t.title[language]}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mb-8"
        >
          {t.subtitle[language]}
        </motion.p>

        {/* Progress bar */}
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full gradient-primary rounded-full"
            transition={{ ease: "easeOut" }}
          />
        </div>

        {/* Current step */}
        <div className="h-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-3"
            >
              <span className="text-2xl">{FACTORS[currentStep].emoji}</span>
              <span className="text-lg font-semibold text-foreground">
                {FACTORS[currentStep][language]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Steps indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {FACTORS.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                backgroundColor: i <= currentStep ? "hsl(var(--primary))" : "hsl(var(--muted))"
              }}
              transition={{ delay: i * 0.1 }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
