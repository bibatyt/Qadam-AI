import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import {
  StepIndicator,
  GoalStep,
  ProfileStep,
  AuthStep,
  AnalyzingAnimation,
  RoleStep,
  EFCStep,
  AcademicStep,
  ParentQuestionsStep,
  TOP_UNIVERSITIES,
  calculateEFCSegment,
  type OnboardingStep,
  type IncomeRange,
  type BudgetRange,
} from "@/features/onboarding";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, signUp, loading: authLoading } = useAuth();
  const { language } = useLandingLanguage();
  
  // Check if user is already logged in - they skip auth step
  const isLoggedIn = !!user;
  const totalSteps = isLoggedIn ? 5 : 6;
  
  const [step, setStep] = useState<OnboardingStep>(1);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [residenceCountry, setResidenceCountry] = useState("");
  const [incomeRange, setIncomeRange] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [grade, setGrade] = useState("");
  const [country, setCountry] = useState("");
  const [universities, setUniversities] = useState<string[]>([]);
  
  // New academic fields
  const [satScore, setSatScore] = useState("");
  const [ieltsScore, setIeltsScore] = useState("");
  const [gpa, setGpa] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  const [deadline, setDeadline] = useState("");
  const [desiredMajor, setDesiredMajor] = useState("");
  
  // Parent-specific fields
  const [childGrade, setChildGrade] = useState("");
  const [childGoal, setChildGoal] = useState("");
  const [involvementLevel, setInvolvementLevel] = useState("");
  
  // Map 'kz' to 'kk' for components
  const componentLang = language === 'kz' ? 'kk' : language;

  const isParent = role === 'parent';

  const canProceed = () => {
    if (step === 1) return !!role;
    if (step === 2) {
      if (isParent) {
        return !!childGrade && !!childGoal && !!involvementLevel;
      }
      return !!goal;
    }
    if (step === 3) return !!residenceCountry && !!incomeRange && !!budgetRange;
    if (step === 4) return !!grade && !!country;
    if (step === 5) return !!englishLevel && !!deadline && !!desiredMajor;
    return true;
  };

  const handleNext = async () => {
    // If logged in and on step 5, save data and show analyzing
    if (isLoggedIn && step === 5) {
      await saveOnboardingData();
      return;
    }
    
    if (step < totalSteps) {
      setStep((step + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as OnboardingStep);
    }
  };

  const toastMessages = {
    en: {
      emailExists: "This email is already registered",
      error: "An error occurred. Please try again.",
      welcome: "Welcome! Your personal path is ready."
    },
    ru: {
      emailExists: "Этот email уже зарегистрирован",
      error: "Произошла ошибка. Попробуйте снова.",
      welcome: "Добро пожаловать! Твой персональный путь готов."
    },
    kz: {
      emailExists: "Бұл email тіркелген",
      error: "Қате болды. Қайтадан көріңіз.",
      welcome: "Қош келдіңіз! Жеке жолыңыз дайын."
    }
  };

  // Function to save onboarding data for already logged-in users
  const saveOnboardingData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Calculate EFC segment
      const efcSegment = calculateEFCSegment(
        incomeRange as IncomeRange, 
        budgetRange as BudgetRange
      );

      // Save EFC data
      await supabase.from('user_efc_data').insert({
        user_id: user.id,
        role: role,
        residence_country: residenceCountry,
        income_range: incomeRange,
        budget_range: budgetRange,
        efc_segment: efcSegment,
      });

      // Get university names for display
      const selectedUniNames = universities
        .map(id => TOP_UNIVERSITIES.find(u => u.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      // Save roadmap data
      const effectiveGoal = isParent ? childGoal : goal;
      const effectiveGrade = isParent ? childGrade : grade;
      
      await supabase.from('roadmaps').insert({
        user_id: user.id,
        main_goal: effectiveGoal,
        current_grade: effectiveGrade,
        target_country: country,
        desired_major: desiredMajor,
        sat_score: satScore ? parseInt(satScore) : null,
        ielts_score: ieltsScore ? parseFloat(ieltsScore) : null,
        gpa: gpa ? parseFloat(gpa) : null,
      });
      
      // Update profile with target universities and scores
      await supabase.from('profiles').update({
        target_university: selectedUniNames || country,
        sat_score: satScore ? parseInt(satScore) : null,
        ielts_score: ieltsScore ? parseFloat(ieltsScore) : null,
      }).eq('user_id', user.id);

      // Show analyzing animation
      setShowAnalyzing(true);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error(toastMessages[language].error);
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { error } = await signUp(email, password, name);
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error(toastMessages[language].emailExists);
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      // Save onboarding data
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Calculate EFC segment
        const efcSegment = calculateEFCSegment(
          incomeRange as IncomeRange, 
          budgetRange as BudgetRange
        );

        // Save EFC data with parent info if applicable
        await supabase.from('user_efc_data').insert({
          user_id: user.id,
          role: role,
          residence_country: residenceCountry,
          income_range: incomeRange,
          budget_range: budgetRange,
          efc_segment: efcSegment,
        });

        // Get university names for display
        const selectedUniNames = universities
          .map(id => TOP_UNIVERSITIES.find(u => u.id === id)?.name)
          .filter(Boolean)
          .join(', ');

        // Save roadmap data with new fields (use parent's child data if parent)
        const effectiveGoal = isParent ? childGoal : goal;
        const effectiveGrade = isParent ? childGrade : grade;
        
        await supabase.from('roadmaps').insert({
          user_id: user.id,
          main_goal: effectiveGoal,
          current_grade: effectiveGrade,
          target_country: country,
          desired_major: desiredMajor,
          sat_score: satScore ? parseInt(satScore) : null,
          ielts_score: ieltsScore ? parseFloat(ieltsScore) : null,
          gpa: gpa ? parseFloat(gpa) : null,
        });
        
        // Update profile with target universities and scores
        await supabase.from('profiles').update({
          target_university: selectedUniNames || country,
          sat_score: satScore ? parseInt(satScore) : null,
          ielts_score: ieltsScore ? parseFloat(ieltsScore) : null,
        }).eq('user_id', user.id);
      }

      // Show analyzing animation
      setShowAnalyzing(true);
      
    } catch (error) {
      toast.error(toastMessages[language].error);
      setLoading(false);
    }
  };

  const handleAnalyzingComplete = () => {
    toast.success(toastMessages[language].welcome);
    navigate("/dashboard", { replace: true });
  };

  if (showAnalyzing) {
    return (
      <AnalyzingAnimation 
        onComplete={handleAnalyzingComplete}
        language={componentLang}
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
        
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
        
        <LanguageSwitcher />
      </header>

      {/* Content */}
      <main className="flex-1 px-6 pb-6 flex flex-col overflow-hidden">
        <div className="flex-1 max-w-lg mx-auto w-full overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <RoleStep
                key="role"
                selectedRole={role}
                onSelect={setRole}
                language={componentLang}
              />
            )}
            {step === 2 && !isParent && (
              <GoalStep
                key="goal"
                selectedGoal={goal}
                onSelect={setGoal}
                language={componentLang}
              />
            )}
            {step === 2 && isParent && (
              <ParentQuestionsStep
                key="parent-questions"
                childGrade={childGrade}
                childGoal={childGoal}
                involvementLevel={involvementLevel}
                onChildGradeSelect={setChildGrade}
                onChildGoalSelect={setChildGoal}
                onInvolvementSelect={setInvolvementLevel}
                language={componentLang}
              />
            )}
            {step === 3 && (
              <EFCStep
                key="efc"
                residenceCountry={residenceCountry}
                incomeRange={incomeRange}
                budgetRange={budgetRange}
                onResidenceSelect={setResidenceCountry}
                onIncomeSelect={setIncomeRange}
                onBudgetSelect={setBudgetRange}
                language={componentLang}
              />
            )}
            {step === 4 && (
              <ProfileStep
                key="profile"
                grade={grade}
                country={country}
                universities={universities}
                onGradeSelect={setGrade}
                onCountrySelect={setCountry}
                onUniversitiesChange={setUniversities}
                language={componentLang}
              />
            )}
            {step === 5 && (
              <AcademicStep
                key="academic"
                satScore={satScore}
                ieltsScore={ieltsScore}
                gpa={gpa}
                englishLevel={englishLevel}
                deadline={deadline}
                desiredMajor={desiredMajor}
                onSatChange={setSatScore}
                onIeltsChange={setIeltsScore}
                onGpaChange={setGpa}
                onEnglishLevelSelect={setEnglishLevel}
                onDeadlineSelect={setDeadline}
                onMajorSelect={setDesiredMajor}
                language={componentLang}
              />
            )}
            {step === 6 && !isLoggedIn && (
              <AuthStep
                key="auth"
                onSubmit={handleAuthSubmit}
                loading={loading}
                language={componentLang}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Button (for steps 1-5, or 1-4 if logged in) */}
        {step < totalSteps || (isLoggedIn && step === 5) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 max-w-lg mx-auto w-full shrink-0"
          >
            <Button
              variant="hero"
              size="lg"
              className="w-full h-14 text-lg"
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLoggedIn && step === 5 ? (
                componentLang === 'ru' ? 'Создать путь' :
                componentLang === 'kk' ? 'Жол құру' :
                'Create Path'
              ) : (
                componentLang === 'ru' ? 'Продолжить' :
                componentLang === 'kk' ? 'Жалғастыру' :
                'Continue'
              )}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </motion.div>
        ) : null}
      </main>
    </div>
  );
};

export default Onboarding;
