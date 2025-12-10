import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Target, TrendingUp, CheckCircle2 } from "lucide-react";

interface AnalyzingAnimationProps {
  onComplete: () => void;
  language: 'ru' | 'en' | 'kk';
}

const analysisSteps = [
  { icon: Brain, key: 'profile' },
  { icon: Target, key: 'universities' },
  { icon: TrendingUp, key: 'deadlines' },
  { icon: Sparkles, key: 'plan' },
];

const stepTexts = {
  profile: {
    ru: 'Анализируем профиль...',
    en: 'Analyzing your profile...',
    kk: 'Профильді талдау...'
  },
  universities: {
    ru: 'Подбираем университеты...',
    en: 'Matching universities...',
    kk: 'Университеттерді таңдау...'
  },
  deadlines: {
    ru: 'Рассчитываем дедлайны...',
    en: 'Calculating deadlines...',
    kk: 'Дедлайндарды есептеу...'
  },
  plan: {
    ru: 'Создаём персональный план...',
    en: 'Creating your personal plan...',
    kk: 'Жеке жоспар жасау...'
  }
};

export function AnalyzingAnimation({ onComplete, language }: AnalyzingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [factorCount, setFactorCount] = useState(0);

  useEffect(() => {
    // Animate factor count
    const countInterval = setInterval(() => {
      setFactorCount(prev => {
        if (prev >= 120) {
          clearInterval(countInterval);
          return 120;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 50);

    // Progress through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= analysisSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    return () => {
      clearInterval(countInterval);
      clearInterval(stepInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6"
    >
      {/* Main Animation Container */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="relative mb-12"
      >
        {/* Pulsing rings */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 w-32 h-32 rounded-full bg-primary/20"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.05, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="absolute inset-0 w-32 h-32 rounded-full bg-primary/10"
        />
        
        {/* Center icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center shadow-2xl shadow-primary/30"
        >
          <Brain className="w-14 h-14 text-primary-foreground" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              rotate: i * 60
            }}
            animate={{ 
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 80],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 80],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: "easeOut"
            }}
            className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-primary"
          />
        ))}
      </motion.div>

      {/* Factor Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <div className="text-6xl font-extrabold text-primary mb-2">
          {Math.min(factorCount, 120)}
        </div>
        <div className="text-lg text-muted-foreground">
          {language === 'ru' ? 'факторов анализируется' :
           language === 'kk' ? 'фактор талданады' :
           'factors being analyzed'}
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="w-full max-w-sm space-y-3">
        {analysisSteps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`
                flex items-center gap-4 p-3 rounded-xl transition-all duration-300
                ${isCurrent ? "bg-primary/10" : ""}
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isComplete ? "bg-primary text-primary-foreground" : 
                  isCurrent ? "bg-primary/20 text-primary" : 
                  "bg-muted text-muted-foreground"}
              `}>
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
                )}
              </div>
              <span className={`
                font-medium transition-colors duration-300
                ${isComplete ? "text-primary" : 
                  isCurrent ? "text-foreground" : 
                  "text-muted-foreground"}
              `}>
                {stepTexts[step.key as keyof typeof stepTexts][language]}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
