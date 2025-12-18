import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const translations = {
  ru: {
    title: "Новый пароль",
    description: "Введите новый пароль для вашего аккаунта",
    password: "Новый пароль",
    confirmPassword: "Подтвердите пароль",
    submit: "Сохранить пароль",
    success: "Пароль изменён!",
    successDesc: "Теперь вы можете войти с новым паролем",
    backToLogin: "Войти",
    passwordMismatch: "Пароли не совпадают",
    error: "Произошла ошибка. Попробуйте снова.",
    passwordRequirements: "Минимум 6 символов",
  },
  en: {
    title: "New Password",
    description: "Enter a new password for your account",
    password: "New Password",
    confirmPassword: "Confirm Password",
    submit: "Save Password",
    success: "Password Changed!",
    successDesc: "You can now login with your new password",
    backToLogin: "Login",
    passwordMismatch: "Passwords don't match",
    error: "An error occurred. Please try again.",
    passwordRequirements: "At least 6 characters",
  },
  kz: {
    title: "Жаңа құпия сөз",
    description: "Аккаунтыңыз үшін жаңа құпия сөз енгізіңіз",
    password: "Жаңа құпия сөз",
    confirmPassword: "Құпия сөзді растаңыз",
    submit: "Құпия сөзді сақтау",
    success: "Құпия сөз өзгертілді!",
    successDesc: "Енді жаңа құпия сөзбен кіре аласыз",
    backToLogin: "Кіру",
    passwordMismatch: "Құпия сөздер сәйкес келмейді",
    error: "Қате болды. Қайтадан көріңіз.",
    passwordRequirements: "Кемінде 6 таңба",
  },
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [language] = useState<"ru" | "en" | "kz">("ru");
  const t = translations[language];

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Check if user came from reset link
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (accessToken && type === 'recovery') {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get('refresh_token') || '',
      });
    }
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) return;

    if (password !== confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast.success(t.success);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t.success}
          </h1>
          <p className="text-muted-foreground">
            {t.successDesc}
          </p>
          <Button
            className="w-full h-11"
            onClick={() => navigate("/auth")}
          >
            {t.backToLogin}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full space-y-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t.title}
          </h1>
          <p className="text-muted-foreground">
            {t.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">{t.password}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
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
            {!passwordError && (
              <p className="text-xs text-muted-foreground">{t.passwordRequirements}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t.submit
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}