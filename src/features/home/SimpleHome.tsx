import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";

const homeContent = {
  en: {
    greeting: "Welcome to Qadam",
    question: "What should I do first?",
    cta: "Build my path",
    helper: "Answer a few questions and get a personalized plan",
    features: [
      { icon: "🎯", text: "Personalized university recommendations" },
      { icon: "📅", text: "Clear deadlines and tasks" },
      { icon: "💡", text: "AI-powered guidance" },
    ],
  },
  ru: {
    greeting: "Добро пожаловать в Qadam",
    question: "С чего начать?",
    cta: "Построить мой путь",
    helper: "Ответьте на несколько вопросов и получите персональный план",
    features: [
      { icon: "🎯", text: "Персональные рекомендации университетов" },
      { icon: "📅", text: "Понятные дедлайны и задачи" },
      { icon: "💡", text: "AI-помощник" },
    ],
  },
  kk: {
    greeting: "Qadam-ға қош келдіңіз",
    question: "Неден бастау керек?",
    cta: "Жолымды құру",
    helper: "Бірнеше сұраққа жауап беріп, жеке жоспар алыңыз",
    features: [
      { icon: "🎯", text: "Жеке университет ұсыныстары" },
      { icon: "📅", text: "Түсінікті мерзімдер мен тапсырмалар" },
      { icon: "💡", text: "AI-көмекші" },
    ],
  },
};

interface SimpleHomeProps {
  userName?: string;
}

export function SimpleHome({ userName }: SimpleHomeProps) {
  const navigate = useNavigate();
  const { language } = useLandingLanguage();
  const content = homeContent[language];

  const handleBuildPath = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6"
        >
          <Compass className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        {/* Greeting */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {userName ? `${content.greeting}, ${userName}!` : content.greeting}
        </h1>

        {/* Main question */}
        <p className="text-3xl font-bold text-primary mb-8">
          {content.question}
        </p>

        {/* Primary CTA - the main focus */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="hero"
            size="lg"
            className="w-full h-16 text-xl font-bold shadow-lg mb-4"
            onClick={handleBuildPath}
          >
            {content.cta}
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
          
          {/* Helper text */}
          <p className="text-sm text-muted-foreground">
            {content.helper}
          </p>
        </motion.div>
      </motion.div>

      {/* Features - minimal, below the fold */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-16 space-y-4 max-w-md w-full"
      >
        {content.features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl"
          >
            <span className="text-2xl">{feature.icon}</span>
            <span className="text-sm font-medium text-foreground">
              {feature.text}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
