import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { OnboardingStep } from "../types";

interface StepIndicatorProps {
  currentStep: OnboardingStep;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <motion.div
          key={step}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: step * 0.1 }}
          className="flex items-center"
        >
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
              transition-all duration-300
              ${step < currentStep 
                ? "bg-primary text-primary-foreground" 
                : step === currentStep 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110" 
                  : "bg-muted text-muted-foreground"
              }
            `}
          >
            {step < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              step
            )}
          </div>
          {step < totalSteps && (
            <div 
              className={`w-8 h-1 mx-1 rounded-full transition-colors duration-300 ${
                step < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
