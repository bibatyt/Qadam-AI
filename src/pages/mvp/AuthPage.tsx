import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type Language = "ru" | "en" | "kk";
type UserType = "student" | "parent" | null;
type AuthMode = "login" | "signup";

const translations = {
  ru: {
    selectRole: "Я...",
    student: "Школьник",
    parent: "Родитель",
    login: "Войти",
    signup: "Регистрация",
    email: "Email",
    password: "Пароль",
    name: "Имя",
    loginButton: "Войти",
    signupButton: "Зарегистрироваться",
    switchToSignup: "Нет аккаунта? Зарегистрируйтесь",
    switchToLogin: "Уже есть аккаунт? Войдите",
    error: "Ошибка. Попробуйте снова.",
    emailExists: "Этот email уже зарегистрирован",
    invalidCredentials: "Неверный email или пароль",
  },
  en: {
    selectRole: "I am a...",
    student: "Student",
    parent: "Parent",
    login: "Login",
    signup: "Sign up",
    email: "Email",
    password: "Password",
    name: "Name",
    loginButton: "Login",
    signupButton: "Sign up",
    switchToSignup: "No account? Sign up",
    switchToLogin: "Already have an account? Login",
    error: "Error. Please try again.",
    emailExists: "This email is already registered",
    invalidCredentials: "Invalid email or password",
  },
  kk: {
    selectRole: "Мен...",
    student: "Оқушы",
    parent: "Ата-ана",
    login: "Кіру",
    signup: "Тіркелу",
    email: "Email",
    password: "Құпия сөз",
    name: "Аты",
    loginButton: "Кіру",
    signupButton: "Тіркелу",
    switchToSignup: "Аккаунт жоқ па? Тіркеліңіз",
    switchToLogin: "Аккаунт бар ма? Кіріңіз",
    error: "Қате. Қайтадан көріңіз.",
    emailExists: "Бұл email тіркелген",
    invalidCredentials: "Қате email немесе құпия сөз",
  },
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [language] = useState<Language>("ru");
  const t = translations[language];

  const [userType, setUserType] = useState<UserType>(null);
  const [mode, setMode] = useState<AuthMode>("signup");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) return;

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error(t.emailExists);
          } else {
            toast.error(error.message);
          }
          return;
        }
        // Navigate based on user type
        if (userType === "student") {
          navigate("/student-onboarding", { replace: true });
        } else {
          navigate("/parent-dashboard", { replace: true });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(t.invalidCredentials);
          return;
        }
        // After login, redirect to appropriate dashboard
        if (userType === "student") {
          navigate("/my-path", { replace: true });
        } else {
          navigate("/parent-dashboard", { replace: true });
        }
      }
    } catch (error) {
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full space-y-6"
        >
          <h1 className="text-2xl font-semibold text-center text-foreground">
            {t.selectRole}
          </h1>

          <div className="space-y-3">
            <button
              onClick={() => setUserType("student")}
              className="w-full p-5 bg-card border border-border rounded-xl flex items-center gap-4 hover:border-primary transition-colors"
            >
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="text-lg font-medium text-foreground">{t.student}</span>
            </button>

            <button
              onClick={() => setUserType("parent")}
              className="w-full p-5 bg-card border border-border rounded-xl flex items-center gap-4 hover:border-primary transition-colors"
            >
              <Users className="w-8 h-8 text-primary" />
              <span className="text-lg font-medium text-foreground">{t.parent}</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <button
          onClick={() => setUserType(null)}
          className="p-2 rounded-full hover:bg-muted transition-colors"
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
                <Users className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm font-medium text-foreground">
                {userType === "student" ? t.student : t.parent}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              {mode === "login" ? t.login : t.signup}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full h-12" disabled={loading}>
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
