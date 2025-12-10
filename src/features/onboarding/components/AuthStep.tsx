import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthStepProps {
  onSubmit: (email: string, password: string, name: string) => Promise<void>;
  loading: boolean;
  language: 'ru' | 'en' | 'kk';
}

export function AuthStep({ onSubmit, loading, language }: AuthStepProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, name);
  };

  const t = {
    title: {
      ru: 'Последний шаг!',
      en: 'Last step!',
      kk: 'Соңғы қадам!'
    },
    subtitle: {
      ru: 'Создай аккаунт, чтобы сохранить свой прогресс',
      en: 'Create an account to save your progress',
      kk: 'Прогресіңді сақтау үшін аккаунт жаса'
    },
    name: {
      ru: 'Как тебя зовут?',
      en: 'What\'s your name?',
      kk: 'Сенің атың кім?'
    },
    email: {
      ru: 'Email',
      en: 'Email',
      kk: 'Email'
    },
    password: {
      ru: 'Придумай пароль',
      en: 'Create a password',
      kk: 'Құпия сөз ойлап тап'
    },
    button: {
      ru: 'Начать путь',
      en: 'Start your journey',
      kk: 'Жолды бастау'
    },
    buttonLoading: {
      ru: 'Создаём...',
      en: 'Creating...',
      kk: 'Жасауда...'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25"
        >
          <span className="text-4xl">🚀</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-extrabold text-foreground"
        >
          {t.title[language]}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground"
        >
          {t.subtitle[language]}
        </motion.p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onSubmit={handleSubmit} 
        className="space-y-4 mt-8"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">
            {t.name[language]}
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-12 h-14 rounded-xl text-lg"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">
            {t.email[language]}
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 rounded-xl text-lg"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">
            {t.password[language]}
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 h-14 rounded-xl text-lg"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          variant="hero" 
          size="lg" 
          className="w-full h-14 text-lg mt-6"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.buttonLoading[language]}
            </>
          ) : (
            <>
              {t.button[language]}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </motion.form>
    </motion.div>
  );
}
