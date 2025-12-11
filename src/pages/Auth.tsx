import { useState, useEffect } from "react";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";

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
    accountCreated: "Account created! Welcome!",
    invalidCredentials: "Invalid email or password",
    alreadyRegistered: "This email is already registered",
    errorOccurred: "An error occurred. Please try again.",
    welcomeEmailSent: "Welcome email sent!",
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
    accountCreated: "Аккаунт создан! Добро пожаловать!",
    invalidCredentials: "Неверный email или пароль",
    alreadyRegistered: "Этот email уже зарегистрирован",
    errorOccurred: "Произошла ошибка. Попробуйте снова.",
    welcomeEmailSent: "Приветственное письмо отправлено!",
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
    accountCreated: "Аккаунт құрылды! Қош келдіңіз!",
    invalidCredentials: "Email немесе құпия сөз қате",
    alreadyRegistered: "Бұл email тіркелген",
    errorOccurred: "Қате орын алды. Қайталап көріңіз.",
    welcomeEmailSent: "Құттықтау хаты жіберілді!",
  }
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const sendWelcomeEmail = async (userEmail: string, userName: string) => {
    try {
      await supabase.functions.invoke('send-auth-email', {
        body: {
          to: userEmail,
          type: 'welcome',
          name: userName,
          language: language
        }
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
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
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error(t.alreadyRegistered);
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        // Send welcome email
        await sendWelcomeEmail(email, name);
        
        toast.success(t.accountCreated);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

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
              disabled={loading}
            >
              {loading ? t.loading : (isLogin ? t.login : t.signUp)}
              <ArrowRight className="w-5 h-5" />
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
