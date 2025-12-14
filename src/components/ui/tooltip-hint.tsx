import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TooltipHintProps {
  id: string;
  children: React.ReactNode;
  message: string;
  position?: "top" | "bottom" | "left" | "right";
  showOnce?: boolean;
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
}: TooltipHintProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showOnce) {
      const dismissed = getDismissedTooltips();
      if (!dismissed.includes(id)) {
        // Show after a short delay
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(true);
    }
  }, [id, showOnce]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (showOnce) {
      dismissTooltip(id);
    }
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-primary",
    bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-primary",
    left: "right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-transparent border-b-transparent border-r-transparent border-l-primary",
    right: "left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-transparent border-b-transparent border-l-transparent border-r-primary",
  };

  return (
    <div className="relative inline-block">
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 ${positionClasses[position]}`}
          >
            <div className="relative bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg max-w-[200px]">
              <button
                onClick={handleDismiss}
                className="absolute -top-1 -right-1 w-5 h-5 bg-background text-foreground rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <p className="text-xs font-medium pr-2">{message}</p>
              <div
                className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
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
