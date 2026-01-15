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
    switchToSignup: "Нет аккаунта? Зарегистрируйтесь",
    switchToLogin: "Уже есть аккаунт? Войдите",
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
    // Verification
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
    switchToSignup: "No account? Sign up",
    switchToLogin: "Already have an account? Login",
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
    // Verification
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
    createPassword: "Құпия сөз ойлап табыңыз",
    loginButton: "Кіру",
    signupButton: "Жалғастыру",
    switchToSignup: "Аккаунт жоқ па? Тіркеліңіз",
    switchToLogin: "Аккаунт бар ма? Кіріңіз",
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
    // Verification
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
  },
};

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
      
      // Code verified, now create the account
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
      
      // Send welcome email
      await supabase.functions.invoke('send-auth-email', {
        body: {
          to: email,
          type: 'welcome',
          name: name,
          language: language
        }
      });
      
      toast.success(t.emailVerified);
      
      // Redirect based on user type
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
        // For signup, first send verification code
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
                  // Redirect to student onboarding wizard
                  navigate("/student-onboarding");
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

  // Email Verification Step
  if (step === "verification") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 flex items-center px-4 border-b border-border">
          <button
            onClick={() => {
              setStep("form");
              setVerificationCode("");
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
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t.verifyEmail}
              </h1>
              <p className="text-muted-foreground">
                {t.codeSentTo}
              </p>
              <p className="text-primary font-semibold mt-1">
                {email}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-center block">{t.enterCode}</Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={verificationCode}
                    onChange={setVerificationCode}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
                      <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                      <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                      <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                      <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                      <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                className="w-full h-11"
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
                <Label htmlFor="password">{mode === "signup" ? t.createPassword : t.password}</Label>
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
                  placeholder="••••••••"
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

            <Button type="submit" className="w-full h-11" disabled={loading || sendingCode}>
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
