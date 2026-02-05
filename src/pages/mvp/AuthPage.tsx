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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Language = "ru" | "en" | "kk";
type UserType = "student" | "parent" | null;
type AuthMode = "login" | "signup";
type AuthStep = "role" | "form" | "verification" | "forgot" | "reset-sent";

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
    createPassword: "Придумайте пароль",
    loginButton: "Войти",
    signupButton: "Продолжить",
    switchToSignup: "Нет аккаунта?",
    switchToSignupLink: "Зарегистрируйтесь",
    switchToLogin: "Уже есть аккаунт?",
    switchToLoginLink: "Войдите",
    error: "Произошла ошибка. Попробуйте снова.",
    emailExists: "Этот email уже зарегистрирован",
    invalidCredentials: "Неверный email или пароль",
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
    verifyEmail: "Подтвердите email",
    codeSentTo: "Мы отправили 6-значный код на",
    enterCode: "Введите код подтверждения",
    verify: "Подтвердить",
    resendCode: "Отправить код снова",
    codeResent: "Код отправлен!",
    invalidCode: "Неверный или истёкший код",
    emailVerified: "Email подтверждён!",
    sendingCode: "Отправка кода...",
    verifying: "Проверка...",
    welcome: "Добро пожаловать в Qadam",
    welcomeDesc: "Твой персональный гид в мир образования",
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
    createPassword: "Create a password",
    loginButton: "Login",
    signupButton: "Continue",
    switchToSignup: "No account?",
    switchToSignupLink: "Sign up",
    switchToLogin: "Already have an account?",
    switchToLoginLink: "Login",
    error: "An error occurred. Please try again.",
    emailExists: "This email is already registered",
    invalidCredentials: "Invalid email or password",
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
    verifyEmail: "Verify your email",
    codeSentTo: "We sent a 6-digit code to",
    enterCode: "Enter verification code",
    verify: "Verify",
    resendCode: "Resend code",
    codeResent: "Code sent!",
    invalidCode: "Invalid or expired code",
    emailVerified: "Email verified!",
    sendingCode: "Sending code...",
    verifying: "Verifying...",
    welcome: "Welcome to Qadam",
    welcomeDesc: "Your personal guide to education",
  },
  kk: {
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
    createPassword: "Құпия сөз ойлап табыңыз",
    loginButton: "Кіру",
    signupButton: "Жалғастыру",
    switchToSignup: "Аккаунт жоқ па?",
    switchToSignupLink: "Тіркеліңіз",
    switchToLogin: "Аккаунт бар ма?",
    switchToLoginLink: "Кіріңіз",
    error: "Қате болды. Қайтадан көріңіз.",
    emailExists: "Бұл email тіркелген",
    invalidCredentials: "Қате email немесе құпия сөз",
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
    verifyEmail: "Email-ді растаңыз",
    codeSentTo: "6 санды код жібердік:",
    enterCode: "Растау кодын енгізіңіз",
    verify: "Растау",
    resendCode: "Кодты қайта жіберу",
    codeResent: "Код жіберілді!",
    invalidCode: "Код қате немесе мерзімі өткен",
    emailVerified: "Email расталды!",
    sendingCode: "Код жіберілуде...",
    verifying: "Тексерілуде...",
    welcome: "Qadam-ға қош келдіңіз",
    welcomeDesc: "Білім әлеміне жеке нұсқаулығыңыз",
  },
};

// Logo Component
function QadamLogo({ size = 48 }: { size?: number }) {
  return (
    <div 
      className="rounded-2xl bg-primary flex items-center justify-center shadow-lg"
      style={{ width: size, height: size }}
    >
      <span 
        className="text-primary-foreground font-bold"
        style={{ fontSize: size * 0.5 }}
      >
        Q
      </span>
    </div>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp } = useAuth();
  const [language] = useState<Language>("ru");
  const t = translations[language];

  const [userType, setUserType] = useState<UserType>(null);
  const [mode, setMode] = useState<AuthMode>("signup");
  const [step, setStep] = useState<AuthStep>("role");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "student" || type === "parent") {
      setUserType(type);
      setStep("form");
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      checkAndRedirect();
    }
  }, [user]);

  const checkAndRedirect = async () => {
    if (!user) return;
    
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role === 'parent') {
      navigate("/parent-dashboard", { replace: true });
      return;
    }

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

  const sendVerificationCode = async () => {
    setSendingCode(true);
    try {
      const { error } = await supabase.functions.invoke('send-auth-email', {
        body: {
          to: email,
          type: 'verification',
          name: name,
          language: language
        }
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error(t.error);
      return false;
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCodeAndSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: { email, code: verificationCode }
      });
      
      if (error || !data?.success) {
        toast.error(t.invalidCode);
        setLoading(false);
        return;
      }
      
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

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: { user: newUser } } = await supabase.auth.getUser();
      
      if (newUser && userType) {
        await supabase.from('user_roles').upsert({
          user_id: newUser.id,
          role: userType
        });

        await supabase.from('profiles').upsert({
          user_id: newUser.id,
          name: name || 'Студент'
        });
      }
      
      await supabase.functions.invoke('send-auth-email', {
        body: {
          to: email,
          type: 'welcome',
          name: name,
          language: language
        }
      });
      
      toast.success(t.emailVerified);
      
      if (userType === "parent") {
        navigate("/parent-dashboard", { replace: true });
      } else {
        navigate("/student-onboarding", { replace: true });
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    const sent = await sendVerificationCode();
    if (sent) {
      toast.success(t.codeResent);
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
        setLoading(false);
        const sent = await sendVerificationCode();
        if (sent) {
          setStep("verification");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(t.invalidCredentials);
          setLoading(false);
          return;
        }
        
        toast.success(t.success);
        
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
        {/* Header */}
        <header className="h-14 flex items-center px-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full space-y-8"
          >
            {/* Logo and Welcome */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="flex justify-center"
              >
                <QadamLogo size={64} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t.welcome}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {t.welcomeDesc}
                </p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-center text-muted-foreground">
                {t.selectRole}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/student-onboarding")}
                className="w-full p-5 bg-card border-2 border-border rounded-2xl flex items-center gap-4 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-foreground text-lg block">{t.student}</span>
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
                className="w-full p-5 bg-card border-2 border-border rounded-2xl flex items-center gap-4 hover:border-secondary hover:bg-secondary/5 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-foreground text-lg block">{t.parent}</span>
                  <span className="text-sm text-muted-foreground">{t.parentDesc}</span>
                </div>
              </motion.button>
            </div>

            {/* Login link */}
            <div className="text-center">
              <span className="text-sm text-muted-foreground">{t.switchToLogin} </span>
              <button
                onClick={() => {
                  setMode("login");
                  setUserType("student");
                  setStep("form");
                }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {t.switchToLoginLink}
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Email Verification Step
  if (step === "verification") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 flex items-center px-4">
          <button
            onClick={() => {
              setStep("form");
              setVerificationCode("");
            }}
            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
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
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t.verifyEmail}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {t.codeSentTo}
                </p>
                <p className="text-primary font-semibold mt-1">
                  {email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-center block text-sm text-muted-foreground">{t.enterCode}</Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={verificationCode}
                    onChange={setVerificationCode}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-14 text-xl rounded-xl" />
                      <InputOTPSlot index={1} className="w-12 h-14 text-xl rounded-xl" />
                      <InputOTPSlot index={2} className="w-12 h-14 text-xl rounded-xl" />
                      <InputOTPSlot index={3} className="w-12 h-14 text-xl rounded-xl" />
                      <InputOTPSlot index={4} className="w-12 h-14 text-xl rounded-xl" />
                      <InputOTPSlot index={5} className="w-12 h-14 text-xl rounded-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl text-base font-semibold"
                disabled={loading || verificationCode.length !== 6}
                onClick={verifyCodeAndSignUp}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {t.verifying}
                  </>
                ) : (
                  t.verify
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={sendingCode}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  {sendingCode ? t.sendingCode : t.resendCode}
                </button>
              </div>
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
        <header className="h-14 flex items-center px-4">
          <button
            onClick={() => setStep("form")}
            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
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
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {t.resetPassword}
              </h1>
              <p className="text-muted-foreground">
                {t.resetPasswordDesc}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    className={`h-12 pl-12 rounded-xl text-base ${emailError ? 'border-destructive' : ''}`}
                    placeholder="your@email.com"
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-destructive">{emailError}</p>
                )}
              </div>

              <Button
                className="w-full h-12 rounded-xl text-base font-semibold"
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
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {t.resetLinkSent}
            </h1>
            <p className="text-muted-foreground">
              {t.resetLinkSentDesc}
            </p>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-base"
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
      <header className="h-14 flex items-center px-4">
        <button
          onClick={() => {
            setUserType(null);
            setStep("role");
          }}
          className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
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
          {/* Header with Logo */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="flex justify-center"
            >
              <QadamLogo size={56} />
            </motion.div>
            
            <div>
              <div className="inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full mb-3">
                {userType === "student" ? (
                  <GraduationCap className="w-4 h-4 text-primary" />
                ) : (
                  <Users className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {userType === "student" ? t.student : t.parent}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {mode === "login" ? t.login : t.signup}
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-sm font-medium">{t.name}</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 pl-12 rounded-xl text-base"
                      placeholder="Ваше имя"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t.email}</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  className={`h-12 pl-12 rounded-xl text-base ${emailError ? 'border-destructive' : ''}`}
                  placeholder="your@email.com"
                />
              </div>
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  {mode === "signup" ? t.createPassword : t.password}
                </Label>
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
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  placeholder="••••••••"
                  className={`h-12 pl-12 pr-12 rounded-xl text-base ${passwordError ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-destructive">{passwordError}</p>
              )}
              {mode === "signup" && !passwordError && (
                <p className="text-xs text-muted-foreground">{t.passwordRequirements}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-semibold mt-2" 
              disabled={loading || sendingCode}
            >
              {loading || sendingCode ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {sendingCode ? t.sendingCode : t.verifying}
                </>
              ) : mode === "login" ? (
                t.loginButton
              ) : (
                t.signupButton
              )}
            </Button>
          </form>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {mode === "login" ? t.switchToSignup : t.switchToLogin}{" "}
            </span>
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {mode === "login" ? t.switchToSignupLink : t.switchToLoginLink}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
