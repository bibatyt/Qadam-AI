import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Loader2, GraduationCap, Users, Mail, Lock, User, 
  Eye, EyeOff, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

type Language = "ru" | "en" | "kk";
type UserType = "student" | "parent" | null;
type AuthMode = "login" | "signup";
type AuthStep = "role" | "form" | "forgot" | "reset-sent";

// Validation schemas
const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const translations = {
  ru: {
    selectRole: "Выберите роль",
    student: "Школьник",
    studentDesc: "Создам свой план поступления",
    parent: "Родитель",
    parentDesc: "Буду следить за прогрессом ребёнка",
    login: "Вход",
    signup: "Регистрация",
    email: "Email",
    password: "Пароль",
    name: "Имя",
    loginButton: "Войти",
    signupButton: "Зарегистрироваться",
    switchToSignup: "Нет аккаунта? Зарегистрируйтесь",
    switchToLogin: "Уже есть аккаунт? Войдите",
    error: "Произошла ошибка. Попробуйте снова.",
    emailExists: "Этот email уже зарегистрирован",
    invalidCredentials: "Неверный email или пароль",
    continueWithGoogle: "Продолжить с Google",
    orContinueWith: "или",
    success: "Добро пожаловать!",
    back: "Назад",
    forgotPassword: "Забыли пароль?",
    resetPassword: "Сбросить пароль",
    resetPasswordDesc: "Введите email для восстановления пароля",
    sendResetLink: "Отправить ссылку",
    resetLinkSent: "Ссылка отправлена!",
    resetLinkSentDesc: "Проверьте почту и перейдите по ссылке",
    backToLogin: "Вернуться к входу",
    passwordRequirements: "Минимум 6 символов",
  },
  en: {
    selectRole: "Select your role",
    student: "Student",
    studentDesc: "I'll create my admission plan",
    parent: "Parent",
    parentDesc: "I'll track my child's progress",
    login: "Login",
    signup: "Sign up",
    email: "Email",
    password: "Password",
    name: "Name",
    loginButton: "Login",
    signupButton: "Sign up",
    switchToSignup: "No account? Sign up",
    switchToLogin: "Already have an account? Login",
    error: "An error occurred. Please try again.",
    emailExists: "This email is already registered",
    invalidCredentials: "Invalid email or password",
    continueWithGoogle: "Continue with Google",
    orContinueWith: "or",
    success: "Welcome!",
    back: "Back",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset Password",
    resetPasswordDesc: "Enter your email to reset password",
    sendResetLink: "Send Reset Link",
    resetLinkSent: "Link Sent!",
    resetLinkSentDesc: "Check your email and click the link",
    backToLogin: "Back to login",
    passwordRequirements: "At least 6 characters",
  },
  kz: {
    selectRole: "Рөлді таңдаңыз",
    student: "Оқушы",
    studentDesc: "Өз түсу жоспарымды құрамын",
    parent: "Ата-ана",
    parentDesc: "Баланың прогресін бақылаймын",
    login: "Кіру",
    signup: "Тіркелу",
    email: "Email",
    password: "Құпия сөз",
    name: "Аты",
    loginButton: "Кіру",
    signupButton: "Тіркелу",
    switchToSignup: "Аккаунт жоқ па? Тіркеліңіз",
    switchToLogin: "Аккаунт бар ма? Кіріңіз",
    error: "Қате болды. Қайтадан көріңіз.",
    emailExists: "Бұл email тіркелген",
    invalidCredentials: "Қате email немесе құпия сөз",
    continueWithGoogle: "Google арқылы жалғастыру",
    orContinueWith: "немесе",
    success: "Қош келдіңіз!",
    back: "Артқа",
    forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
    resetPassword: "Құпия сөзді қалпына келтіру",
    resetPasswordDesc: "Қалпына келтіру үшін email енгізіңіз",
    sendResetLink: "Сілтеме жіберу",
    resetLinkSent: "Сілтеме жіберілді!",
    resetLinkSentDesc: "Поштаңызды тексеріп, сілтемеге өтіңіз",
    backToLogin: "Кіруге қайту",
    passwordRequirements: "Кемінде 6 таңба",
  },
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const [language] = useState<Language>("ru");
  const t = translations[language];

  const [userType, setUserType] = useState<UserType>(null);
  const [mode, setMode] = useState<AuthMode>("signup");
  const [step, setStep] = useState<AuthStep>("role");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Check for redirect params (for OAuth callback)
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "student" || type === "parent") {
      setUserType(type);
      setStep("form");
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      checkAndRedirect();
    }
  }, [user]);

  const checkAndRedirect = async () => {
    if (!user) return;
    
    // Check user role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role === 'parent') {
      navigate("/parent-dashboard", { replace: true });
      return;
    }

    // Check if student has a path
    const { data: pathData } = await supabase
      .from('student_paths')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (!pathData || pathData.length === 0) {
      navigate("/student-onboarding", { replace: true });
    } else {
      navigate("/my-path", { replace: true });
    }
  };

  const validateEmail = (value: string) => {
    try {
      emailSchema.parse(value);
      setEmailError("");
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setEmailError(e.errors[0].message);
      }
      return false;
    }
  };

  const validatePassword = (value: string) => {
    try {
      passwordSchema.parse(value);
      setPasswordError("");
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setPasswordError(e.errors[0].message);
      }
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Store user type for after OAuth callback
      if (userType) {
        localStorage.setItem('pending_user_type', userType);
      }
      await signInWithGoogle();
    } catch (error) {
      toast.error(t.error);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setStep("reset-sent");
    } catch (error) {
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email) || !validatePassword(password)) return;
    if (!userType) return;

    setLoading(true);
    try {
      if (mode === "signup") {
        // Sign up the user directly (auto-confirm is enabled)
        const { error: signUpError } = await signUp(email, password, name);
        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            toast.error(t.emailExists);
          } else {
            toast.error(signUpError.message);
          }
          setLoading(false);
          return;
        }

        // Wait for auth to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the user
        const { data: { user: newUser } } = await supabase.auth.getUser();
        
        if (newUser && userType) {
          // Create user role
          await supabase.from('user_roles').upsert({
            user_id: newUser.id,
            role: userType
          });

          // Create profile
          await supabase.from('profiles').upsert({
            user_id: newUser.id,
            name: name || 'Студент'
          });
        }
        
        toast.success(t.success);
        
        // Redirect based on user type
        if (userType === "parent") {
          navigate("/parent-dashboard", { replace: true });
        } else {
          navigate("/student-onboarding", { replace: true });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(t.invalidCredentials);
          setLoading(false);
          return;
        }
        
        toast.success(t.success);
        
        // Check user role and redirect
        const { data: { user: loggedInUser } } = await supabase.auth.getUser();
        if (loggedInUser) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', loggedInUser.id)
            .single();

          if (roleData?.role === 'parent') {
            navigate("/parent-dashboard", { replace: true });
          } else {
            const { data: pathData } = await supabase
              .from('student_paths')
              .select('id')
              .eq('user_id', loggedInUser.id)
              .limit(1);

            if (!pathData || pathData.length === 0) {
              navigate("/student-onboarding", { replace: true });
            } else {
              navigate("/my-path", { replace: true });
            }
          }
        }
      }
    } catch (error) {
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  // Role Selection Step
  if (step === "role") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 flex items-center px-4 border-b border-border">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm w-full space-y-6"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t.selectRole}
              </h1>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setUserType("student");
                  setStep("form");
                }}
                className="w-full p-4 bg-card border-2 border-border rounded-xl flex items-start gap-4 hover:border-primary/50 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block text-lg">{t.student}</span>
                  <span className="text-sm text-muted-foreground">{t.studentDesc}</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setUserType("parent");
                  setStep("form");
                }}
                className="w-full p-4 bg-card border-2 border-border rounded-xl flex items-start gap-4 hover:border-accent/50 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block text-lg">{t.parent}</span>
                  <span className="text-sm text-muted-foreground">{t.parentDesc}</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Forgot Password Step
  if (step === "forgot") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 flex items-center px-4 border-b border-border">
          <button
            onClick={() => setStep("form")}
            className="p-2 -ml-2 rounded hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm w-full space-y-6"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t.resetPassword}
              </h1>
              <p className="text-muted-foreground">
                {t.resetPasswordDesc}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reset-email">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    className={`h-11 pl-10 ${emailError ? 'border-destructive' : ''}`}
                    placeholder="your@email.com"
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-destructive">{emailError}</p>
                )}
              </div>

              <Button
                className="w-full h-11"
                disabled={loading || !email}
                onClick={handleForgotPassword}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t.sendResetLink
                )}
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Reset Link Sent Step
  if (step === "reset-sent") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm w-full space-y-6 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {t.resetLinkSent}
            </h1>
            <p className="text-muted-foreground">
              {t.resetLinkSentDesc}
            </p>
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => {
                setStep("form");
                setMode("login");
              }}
            >
              {t.backToLogin}
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  // Main Auth Form
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 flex items-center px-4 border-b border-border">
        <button
          onClick={() => {
            setUserType(null);
            setStep("role");
          }}
          className="p-2 -ml-2 rounded hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full space-y-6"
        >
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full mb-4">
              {userType === "student" ? (
                <GraduationCap className="w-4 h-4 text-primary" />
              ) : (
                <Users className="w-4 h-4 text-accent" />
              )}
              <span className="text-sm font-medium text-foreground">
                {userType === "student" ? t.student : t.parent}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "login" ? t.login : t.signup}
            </h1>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full h-11 gap-2"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t.continueWithGoogle}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t.orContinueWith}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <Label htmlFor="name">{t.name}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <Label htmlFor="email">{t.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (mode === "signup") validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  required
                  className={`h-11 pl-10 ${emailError ? 'border-destructive' : ''}`}
                  placeholder="your@email.com"
                />
              </div>
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t.password}</Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setStep("forgot")}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t.forgotPassword}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (mode === "signup") validatePassword(e.target.value);
                  }}
                  required
                  minLength={6}
                  className={`h-11 pl-10 pr-10 ${passwordError ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-destructive">{passwordError}</p>
              )}
              {mode === "signup" && !passwordError && (
                <p className="text-xs text-muted-foreground">{t.passwordRequirements}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                t.loginButton
              ) : (
                t.signupButton
              )}
            </Button>
          </form>

          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {mode === "login" ? t.switchToSignup : t.switchToLogin}
          </button>
        </motion.div>
      </main>
    </div>
  );
}