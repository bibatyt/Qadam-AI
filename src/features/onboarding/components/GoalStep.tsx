import { motion } from "framer-motion";
import { Target, Sparkles, GraduationCap, Briefcase } from "lucide-react";
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

export function GoalStep({ selectedGoal, onSelect, language }: GoalStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-extrabold text-foreground"
        >
          {language === 'ru' ? 'Какая твоя главная цель?' : 
           language === 'kk' ? 'Сенің басты мақсатың қандай?' :
           'What\'s your main goal?'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground"
        >
          {language === 'ru' ? 'Мы построим план специально для тебя' :
           language === 'kk' ? 'Біз саған арнайы жоспар құрамыз' :
           'We\'ll build a plan just for you'}
        </motion.p>
      </div>

      <div className="grid gap-4 mt-8">
        {GOALS.map((goal, index) => {
          const Icon = icons[goal.id as keyof typeof icons] || Target;
          const isSelected = selectedGoal === goal.id;
          
          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(goal.id)}
              className={`
                relative flex items-center gap-4 p-5 rounded-2xl text-left
                transition-all duration-300 border-2
                ${isSelected 
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" 
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                }
              `}
            >
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center shrink-0
                transition-colors duration-300
                ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
              `}>
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                {goal.label[language]}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
