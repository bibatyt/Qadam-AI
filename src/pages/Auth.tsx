import { useState, useEffect } from "react";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, User, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const authTranslations = {
  en: {
    welcomeBack: "Welcome back!",
    createAccount: "Create account",
    loginToContinue: "Sign in to continue your journey",
    startYourPath: "Start your path to your dream university",
    name: "Name",
    yourName: "Your name",
    email: "Email",
    password: "Password",
    loading: "Loading...",
    login: "Sign In",
    signUp: "Create Account",
    noAccount: "Don't have an account? Create one",
    haveAccount: "Already have an account? Sign in",
    welcome: "Welcome!",
    accountCreated: "Account created!",
    invalidCredentials: "Invalid email or password",
    alreadyRegistered: "This email is already registered",
    errorOccurred: "An error occurred. Please try again.",
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
    back: "Back",
  },
  ru: {
    welcomeBack: "С возвращением!",
    createAccount: "Создать аккаунт",
    loginToContinue: "Войдите, чтобы продолжить путь",
    startYourPath: "Начните свой путь к университету мечты",
    name: "Имя",
    yourName: "Ваше имя",
    email: "Email",
    password: "Пароль",
    loading: "Загрузка...",
    login: "Войти",
    signUp: "Создать аккаунт",
    noAccount: "Нет аккаунта? Создать",
    haveAccount: "Уже есть аккаунт? Войти",
    welcome: "Добро пожаловать!",
    accountCreated: "Аккаунт создан!",
    invalidCredentials: "Неверный email или пароль",
    alreadyRegistered: "Этот email уже зарегистрирован",
    errorOccurred: "Произошла ошибка. Попробуйте снова.",
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
    back: "Назад",
  },
  kz: {
    welcomeBack: "Қайта оралуыңызбен!",
    createAccount: "Аккаунт құру",
    loginToContinue: "Жолыңызды жалғастыру үшін кіріңіз",
    startYourPath: "Арманыңыздағы университетке жолыңызды бастаңыз",
    name: "Аты",
    yourName: "Сіздің атыңыз",
    email: "Email",
    password: "Құпия сөз",
    loading: "Жүктелуде...",
    login: "Кіру",
    signUp: "Аккаунт құру",
    noAccount: "Аккаунтыңыз жоқ па? Құру",
    haveAccount: "Аккаунтыңыз бар ма? Кіру",
    welcome: "Қош келдіңіз!",
    accountCreated: "Аккаунт құрылды!",
    invalidCredentials: "Email немесе құпия сөз қате",
    alreadyRegistered: "Бұл email тіркелген",
    errorOccurred: "Қате орын алды. Қайталап көріңіз.",
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
    back: "Артқа",
  }
};

type AuthStep = 'form' | 'verification';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<AuthStep>('form');
  const [verificationCode, setVerificationCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { language } = useLandingLanguage();
  const t = authTranslations[language];

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

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
      toast.error(t.errorOccurred);
      return false;
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: { email, code: verificationCode }
      });
      
      if (error || !data?.success) {
        toast.error(t.invalidCode);
        return;
      }
      
      // Code verified, now create the account
      const { error: signUpError } = await signUp(email, password, name);
      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          toast.error(t.alreadyRegistered);
        } else {
          toast.error(signUpError.message);
        }
        return;
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
      navigate("/dashboard");
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error(t.errorOccurred);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast.error(t.invalidCredentials);
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success(t.welcome);
        navigate("/dashboard");
      } else {
        // For signup, first send verification code
        setLoading(false);
        const sent = await sendVerificationCode();
        if (sent) {
          setStep('verification');
        }
      }
    } catch (error) {
      toast.error(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  // Verification screen
  if (step === 'verification') {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-elevated p-8 animate-scale-in">
            <button
              onClick={() => {
                setStep('form');
                setVerificationCode("");
              }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <Mail className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">
              {t.verifyEmail}
            </h1>
            <p className="text-muted-foreground text-center mb-2">
              {t.codeSentTo}
            </p>
            <p className="text-primary font-semibold text-center mb-8">
              {email}
            </p>
            
            <div className="space-y-6">
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
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={loading || verificationCode.length !== 6}
                onClick={verifyCode}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.verifying}
                  </>
                ) : (
                  <>
                    {t.verify}
                    <ArrowRight className="w-5 h-5" />
                  </>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-elevated p-8 animate-scale-in">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">
            {isLogin ? t.welcomeBack : t.createAccount}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isLogin ? t.loginToContinue : t.startYourPath}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t.yourName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={loading || sendingCode}
            >
              {loading || sendingCode ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {sendingCode ? t.sendingCode : t.loading}
                </>
              ) : (
                <>
                  {isLogin ? t.login : t.signUp}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? t.noAccount : t.haveAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
