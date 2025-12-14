import { motion } from "framer-motion";
import { ChevronRight, Target, GraduationCap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { TooltipHint, tooltipContent } from "@/components/ui/tooltip-hint";

interface MyPathCardProps {
  university?: string;
  progress: number;
  totalSteps: number;
  completedSteps: number;
  nextStep?: string;
  currentPart?: number;
  totalParts?: number;
}

const pathCardContent = {
  en: {
    myPath: "My Path",
    viewPath: "View full path",
    progress: "Progress",
    nextStep: "Next step",
    noNextStep: "All done! 🎉",
    part: "Part",
    of: "of",
    stepsCompleted: "steps completed",
  },
  ru: {
    myPath: "Мой путь",
    viewPath: "Открыть полный путь",
    progress: "Прогресс",
    nextStep: "Следующий шаг",
    noNextStep: "Всё готово! 🎉",
    part: "Часть",
    of: "из",
    stepsCompleted: "шагов выполнено",
  },
  kk: {
    myPath: "Менің жолым",
    viewPath: "Толық жолды ашу",
    progress: "Прогресс",
    nextStep: "Келесі қадам",
    noNextStep: "Бәрі дайын! 🎉",
    part: "Бөлім",
    of: "ішінен",
    stepsCompleted: "қадам орындалды",
  },
};

export function MyPathCard({
  university,
  progress,
  totalSteps,
  completedSteps,
  nextStep,
  currentPart = 1,
  totalParts = 5,
}: MyPathCardProps) {
  const navigate = useNavigate();
  const { language } = useLandingLanguage();
  const content = pathCardContent[language];

  return (
    <TooltipHint
      id="dashboard-view-path"
      message={tooltipContent[language].viewPath}
      position="top"
      delay={2000}
      fullWidth
    >
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/path")}
        className="w-full bg-card border border-border rounded-2xl p-4 text-left hover:border-primary/30 transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">{content.myPath}</h3>
              <p className="text-xs text-muted-foreground">
                {content.part} {currentPart} {content.of} {totalParts}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* University if set */}
        {university && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-lg">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground truncate">
              {university}
            </span>
          </div>
        )}

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{content.progress}</span>
            <span>
              {completedSteps} {content.of} {totalSteps} {content.stepsCompleted}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Next step recommendation */}
        <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/10">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <p className="text-xs text-foreground font-medium truncate">
            {nextStep || content.noNextStep}
          </p>
        </div>
      </motion.button>
    </TooltipHint>
  );
}
