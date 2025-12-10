import { motion } from "framer-motion";
import { Target, Sparkles, GraduationCap, Briefcase, Check } from "lucide-react";
import { GOALS } from "../types";

interface GoalStepProps {
  selectedGoal: string;
  onSelect: (goal: string) => void;
  language: 'ru' | 'en' | 'kk';
}

const icons = {
  top_uni: GraduationCap,
  scholarship: Sparkles,
  abroad: Target,
  career: Briefcase,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 }
};

export function GoalStep({ selectedGoal, onSelect, language }: GoalStepProps) {
  const t = {
    title: {
      ru: "Какая твоя мечта?",
      en: "What's your dream?",
      kk: "Сенің арманың қандай?"
    },
    subtitle: {
      ru: "Выбери главную цель",
      en: "Choose your main goal",
      kk: "Басты мақсатыңды таңда"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col min-h-[60vh] justify-center"
    >
      {/* Magic sparkle decoration */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center shadow-primary"
      >
        <Sparkles className="w-10 h-10 text-primary-foreground" />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-black text-center text-foreground mb-2"
      >
        {t.title[language]}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-center text-muted-foreground mb-10"
      >
        {t.subtitle[language]}
      </motion.p>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {GOALS.map((goal) => {
          const Icon = icons[goal.id as keyof typeof icons] || Target;
          const isSelected = selectedGoal === goal.id;
          
          return (
            <motion.button
              key={goal.id}
              variants={item}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(goal.id)}
              className={`
                w-full relative flex items-center gap-5 p-5 rounded-2xl text-left
                transition-all duration-300 border-2 touch-target
                ${isSelected 
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" 
                  : "border-border bg-card hover:border-primary/40"
                }
              `}
            >
              <motion.div 
                animate={isSelected ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center shrink-0
                  transition-all duration-300
                  ${isSelected ? "gradient-primary shadow-primary" : "bg-muted"}
                `}
              >
                <Icon className={`w-8 h-8 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </motion.div>
              
              <span className="text-xl font-bold text-foreground flex-1">
                {goal.label[language]}
              </span>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-primary-foreground" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
