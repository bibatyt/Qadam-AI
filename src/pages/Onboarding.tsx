import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  StepIndicator,
  GoalStep,
  ProfileStep,
  AuthStep,
  AnalyzingAnimation,
  type OnboardingStep,
} from "@/features/onboarding";

const Onboarding = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [step, setStep] = useState<OnboardingStep>(1);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [goal, setGoal] = useState("");
  const [grade, setGrade] = useState("");
  const [country, setCountry] = useState("");
  
  // Language (можно потом связать с контекстом)
  const language = 'ru' as const;

  const canProceed = () => {
    if (step === 1) return !!goal;
    if (step === 2) return !!grade && !!country;
    return true;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as OnboardingStep);
    }
  };

  const handleAuthSubmit = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { error } = await signUp(email, password, name);
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Этот email уже зарегистрирован");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      // Save onboarding data to roadmaps table
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('roadmaps').insert({
          user_id: user.id,
          main_goal: goal,
          current_grade: grade,
          target_country: country,
          desired_major: '',
        });
        
        // Update profile with target country
        await supabase.from('profiles').update({
          target_university: country
        }).eq('user_id', user.id);
      }

      // Show analyzing animation
      setShowAnalyzing(true);
      
    } catch (error) {
      toast.error("Произошла ошибка. Попробуйте снова.");
      setLoading(false);
    }
  };

  const handleAnalyzingComplete = () => {
    toast.success("Добро пожаловать! Твой план готов.");
    navigate("/dashboard", { replace: true });
  };

  if (showAnalyzing) {
    return (
      <AnalyzingAnimation 
        onComplete={handleAnalyzingComplete}
        language={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        {step > 1 ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-muted-foreground" />
          </motion.button>
        ) : (
          <div className="w-10" />
        )}
        
        <StepIndicator currentStep={step} totalSteps={3} />
        
        <div className="w-10" />
      </header>

      {/* Content */}
      <main className="flex-1 px-6 pb-6 flex flex-col">
        <div className="flex-1 max-w-lg mx-auto w-full">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <GoalStep
                key="goal"
                selectedGoal={goal}
                onSelect={setGoal}
                language={language}
              />
            )}
            {step === 2 && (
              <ProfileStep
                key="profile"
                grade={grade}
                country={country}
                onGradeSelect={setGrade}
                onCountrySelect={setCountry}
                language={language}
              />
            )}
            {step === 3 && (
              <AuthStep
                key="auth"
                onSubmit={handleAuthSubmit}
                loading={loading}
                language={language}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Button (only for steps 1-2) */}
        {step < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-lg mx-auto w-full"
          >
            <Button
              variant="hero"
              size="lg"
              className="w-full h-14 text-lg"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {language === 'ru' ? 'Продолжить' :
               language === 'kk' ? 'Жалғастыру' :
               'Continue'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Onboarding;
