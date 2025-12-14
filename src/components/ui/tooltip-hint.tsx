import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TooltipHintProps {
  id: string;
  children: React.ReactNode;
  message: string;
  position?: "top" | "bottom" | "left" | "right";
  showOnce?: boolean;
  delay?: number;
  pulse?: boolean;
  fullWidth?: boolean;
}

const DISMISSED_TOOLTIPS_KEY = "qadam_dismissed_tooltips";

function getDismissedTooltips(): string[] {
  try {
    const stored = localStorage.getItem(DISMISSED_TOOLTIPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function dismissTooltip(id: string) {
  const dismissed = getDismissedTooltips();
  if (!dismissed.includes(id)) {
    dismissed.push(id);
    localStorage.setItem(DISMISSED_TOOLTIPS_KEY, JSON.stringify(dismissed));
  }
}

export function TooltipHint({
  id,
  children,
  message,
  position = "bottom",
  showOnce = true,
  delay = 800,
  pulse = false,
  fullWidth = false,
}: TooltipHintProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showOnce) {
      const dismissed = getDismissedTooltips();
      if (!dismissed.includes(id)) {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [id, showOnce, delay]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (showOnce) {
      dismissTooltip(id);
    }
  };

  // Auto-dismiss on interaction with the element
  const handleInteraction = () => {
    if (isVisible) {
      handleDismiss();
    }
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-primary",
    left: "left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-primary",
    right: "right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-primary",
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full block' : 'inline-block'}`} onClick={handleInteraction}>
      {/* Pulse ring effect */}
      <AnimatePresence>
        {isVisible && pulse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-xl"
          >
            <div className="absolute inset-0 rounded-xl border-2 border-primary animate-ping opacity-75" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'bottom' ? -10 : position === 'top' ? 10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`absolute z-50 ${positionClasses[position]}`}
          >
            <div className="relative bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-lg max-w-[220px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-background text-foreground rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors border border-border"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="text-sm font-medium pr-3 leading-snug">{message}</p>
              {/* Arrow */}
              <div
                className={`absolute w-0 h-0 ${arrowClasses[position]}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook to check if a tooltip was dismissed
export function useTooltipDismissed(id: string): boolean {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const dismissedList = getDismissedTooltips();
    setDismissed(dismissedList.includes(id));
  }, [id]);

  return dismissed;
}

// Function to reset all tooltips (for testing)
export function resetAllTooltips() {
  localStorage.removeItem(DISMISSED_TOOLTIPS_KEY);
}

// Tooltip content translations
export const tooltipContent = {
  en: {
    continueOnboarding: "Tap to continue to the next step",
    viewPath: "View your personalized admission path",
    completeTask: "Tap to mark as complete",
    aiMentor: "Need help? Ask our AI mentor!",
    checkEssay: "Get feedback on your essay",
  },
  ru: {
    continueOnboarding: "Нажмите, чтобы перейти к следующему шагу",
    viewPath: "Посмотрите ваш персональный путь к поступлению",
    completeTask: "Нажмите, чтобы отметить выполненным",
    aiMentor: "Нужна помощь? Спросите AI-ментора!",
    checkEssay: "Получите обратную связь по эссе",
  },
  kk: {
    continueOnboarding: "Келесі қадамға өту үшін басыңыз",
    viewPath: "Жеке түсу жолыңызды қараңыз",
    completeTask: "Орындалды деп белгілеу үшін басыңыз",
    aiMentor: "Көмек керек пе? AI-тәлімгерден сұраңыз!",
    checkEssay: "Эссеңіз бойынша кері байланыс алыңыз",
  },
};
