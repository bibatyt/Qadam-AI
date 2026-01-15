import { motion } from "framer-motion";
import { Sparkles, Brain, Target, Rocket, CheckCircle2 } from "lucide-react";

type Language = "ru" | "en" | "kk";

interface AIGeneratingAnimationProps {
  language: Language;
}

const translations = {
  ru: {
    title: "AI создаёт ваш план",
    analyzing: "Анализируем ваши данные...",
    generating: "Генерируем персональный путь...",
    optimizing: "Оптимизируем рекомендации...",
    finalizing: "Завершаем создание плана...",
  },
  en: {
    title: "AI is creating your plan",
    analyzing: "Analyzing your data...",
    generating: "Generating personal path...",
    optimizing: "Optimizing recommendations...",
    finalizing: "Finalizing your plan...",
  },
  kk: {
    title: "AI жоспарыңызды құруда",
    analyzing: "Деректеріңізді талдауда...",
    generating: "Жеке жолыңызды құруда...",
    optimizing: "Ұсыныстарды оңтайландыруда...",
    finalizing: "Жоспарды аяқтауда...",
  },
};

const steps = [
  { icon: Brain, delay: 0 },
  { icon: Target, delay: 1.5 },
  { icon: Sparkles, delay: 3 },
  { icon: Rocket, delay: 4.5 },
];

export function AIGeneratingAnimation({ language }: AIGeneratingAnimationProps) {
  const t = translations[language];
  const stepTexts = [t.analyzing, t.generating, t.optimizing, t.finalizing];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Main animation container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Glowing background circle */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-32 h-32 rounded-full bg-primary/20 blur-xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
        />

        {/* Central brain icon */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl shadow-primary/30"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Brain className="w-12 h-12 text-primary-foreground" />
          </motion.div>
        </motion.div>

        {/* Orbiting particles */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
            style={{ transformOrigin: "center center" }}
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute w-2 h-2 rounded-full bg-primary"
              style={{
                top: "50%",
                left: `${-20 - i * 10}px`,
                transform: "translateY(-50%)",
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-foreground mt-10 mb-8 text-center"
      >
        {t.title}
      </motion.h1>

      {/* Progress steps */}
      <div className="space-y-4 w-full max-w-xs">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay }}
            className="flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step.delay + 0.2, type: "spring" }}
              className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
            >
              <step.icon className="w-5 h-5 text-primary" />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: step.delay + 0.4, duration: 1 }}
              className="flex-1 h-1 bg-muted rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: step.delay + 0.5, duration: 1.2 }}
                className="h-full bg-primary rounded-full"
              />
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: step.delay + 0.3 }}
              className="text-sm text-muted-foreground flex-shrink-0 w-32"
            >
              {stepTexts[index]}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Bottom sparkle text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
        className="mt-10 flex items-center gap-2 text-muted-foreground"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-4 h-4 text-primary" />
        </motion.div>
        <span className="text-sm">
          {language === "ru" 
            ? "Это займёт несколько секунд..." 
            : language === "kk" 
            ? "Бұл бірнеше секунд алады..." 
            : "This will take a few seconds..."}
        </span>
      </motion.div>
    </div>
  );
}
