import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    loginButton: "Кіру",
    signupButton: "Тіркелу",
    switchToSignup: "Аккаунт жоқ па? Тіркеліңіз",
    switchToLogin: "Аккаунт бар ма? Кіріңіз",
    error: "Қате болды. Қайтадан көріңіз.",
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
          <div className="max-w-sm w-full space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {t.selectRole}
              </h1>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setUserType("student")}
                className="w-full p-4 bg-card border border-border rounded-lg flex items-start gap-4 hover:border-primary/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-medium text-foreground block">{t.student}</span>
                  <span className="text-sm text-muted-foreground">{t.studentDesc}</span>
                </div>
              </button>

              <button
                onClick={() => setUserType("parent")}
                className="w-full p-4 bg-card border border-border rounded-lg flex items-start gap-4 hover:border-primary/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="font-medium text-foreground block">{t.parent}</span>
                  <span className="text-sm text-muted-foreground">{t.parentDesc}</span>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 flex items-center px-4 border-b border-border">
        <button
          onClick={() => setUserType(null)}
          className="p-2 -ml-2 rounded hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-6">
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
            <h1 className="text-2xl font-semibold text-foreground">
              {mode === "login" ? t.login : t.signup}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">{t.name}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11"
              />
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
        </div>
      </main>
    </div>
  );
}
