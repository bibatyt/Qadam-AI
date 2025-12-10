import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Target, GraduationCap, FileText, DollarSign } from "lucide-react";

interface AnalyzingAnimationProps {
  onComplete: () => void;
  language: 'ru' | 'en' | 'kk';
}

const FACTORS = [
  { ru: "Анализ профиля", en: "Profile analysis", kk: "Профильді талдау", icon: Brain },
  { ru: "Подбор университетов", en: "University matching", kk: "Университеттер іздеу", icon: GraduationCap },
  { ru: "Расчёт дедлайнов", en: "Deadline calculation", kk: "Мерзімдерді есептеу", icon: Target },
  { ru: "Анализ финансов", en: "Financial analysis", kk: "Қаржылық талдау", icon: DollarSign },
  { ru: "Генерация плана", en: "Creating roadmap", kk: "Жоспар құру", icon: FileText },
  { ru: "AI оптимизация", en: "AI optimization", kk: "AI оңтайландыру", icon: Sparkles },
];

export function AnalyzingAnimation({ onComplete, language }: AnalyzingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 0.8;
      });
    }, 35);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= FACTORS.length - 1) return prev;
        return prev + 1;
      });
    }, 600);

    const timeout = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  const t = {
    title: {
      ru: "Создаём план",
      en: "Creating plan",
      kk: "Жоспар құрудамыз"
    },
    subtitle: {
      ru: "AI анализирует данные",
      en: "AI analyzing data",
      kk: "AI деректерді талдауда"
    }
  };

  const CurrentIcon = FACTORS[currentStep]?.icon || Brain;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-sm mx-auto w-full">
        {/* Main animated icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
          />
          
          {/* Middle pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-2 rounded-full border border-primary/30"
          />
          
          {/* Inner glowing circle */}
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px hsl(var(--primary) / 0.3)",
                "0 0 40px hsl(var(--primary) / 0.5)",
                "0 0 20px hsl(var(--primary) / 0.3)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-4 rounded-full gradient-primary flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.4 }}
              >
                <CurrentIcon className="w-10 h-10 text-primary-foreground" />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 1
              }}
              className="absolute inset-0"
            >
              <div 
                className="absolute w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50"
                style={{ top: '-6px', left: '50%', transform: 'translateX(-50%)' }}
              />
            </motion.div>
          ))}
        </div>

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

        {/* Progress bar with glow */}
        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full gradient-primary rounded-full relative"
            transition={{ ease: "easeOut" }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full blur-sm"
            />
          </motion.div>
        </div>

        {/* Current step display */}
        <div className="h-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-3"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                <CurrentIcon className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-base font-semibold text-foreground">
                {FACTORS[currentStep][language]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 mt-6">
          {FACTORS.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                width: i === currentStep ? 24 : 8
              }}
              transition={{ delay: i * 0.05 }}
              className={`h-2 rounded-full transition-colors duration-300 ${
                i <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Progress percentage */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-muted-foreground mt-4"
        >
          {Math.round(progress)}%
        </motion.p>
      </div>
    </div>
  );
}
