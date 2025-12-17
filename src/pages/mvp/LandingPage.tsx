import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

type Language = "ru" | "en" | "kk";

const translations = {
  ru: {
    heroTitle: "Qadam AI",
    heroSubtitle: "Пошаговый путь к поступлению в университет",
    heroDescription: "Понятный план для школьников 9–11 классов и их родителей",
    startButton: "Построить мой путь",
    feature1Title: "Выбор университета",
    feature1Desc: "Определите цель и страну обучения",
    feature2Title: "Требования и дедлайны",
    feature2Desc: "Узнайте что нужно и когда",
    feature3Title: "Персональный план",
    feature3Desc: "Пошаговые действия под ваш профиль",
    forStudents: "Для школьников",
    forParents: "Для родителей",
    studentDesc: "Понятный чеклист задач с отслеживанием прогресса",
    parentDesc: "Спокойный просмотр прогресса ребёнка без редактирования",
  },
  en: {
    heroTitle: "Qadam AI",
    heroSubtitle: "Step-by-step path to university admission",
    heroDescription: "Clear plan for high school students (grades 9-11) and their parents",
    startButton: "Build my path",
    feature1Title: "Choose university",
    feature1Desc: "Define your goal and target country",
    feature2Title: "Requirements & deadlines",
    feature2Desc: "Know what you need and when",
    feature3Title: "Personal plan",
    feature3Desc: "Step-by-step actions for your profile",
    forStudents: "For students",
    forParents: "For parents",
    studentDesc: "Clear task checklist with progress tracking",
    parentDesc: "Calm view of child's progress without editing",
  },
  kk: {
    heroTitle: "Qadam AI",
    heroSubtitle: "Университетке түсудің қадамдық жолы",
    heroDescription: "9-11 сынып оқушылары мен ата-аналар үшін түсінікті жоспар",
    startButton: "Жолымды құру",
    feature1Title: "Университет таңдау",
    feature1Desc: "Мақсат пен елді анықтаңыз",
    feature2Title: "Талаптар мен мерзімдер",
    feature2Desc: "Не керек және қашан екенін біліңіз",
    feature3Title: "Жеке жоспар",
    feature3Desc: "Сіздің профиліңізге арналған қадамдар",
    forStudents: "Оқушыларға",
    forParents: "Ата-аналарға",
    studentDesc: "Прогресті бақылаумен түсінікті тапсырмалар тізімі",
    parentDesc: "Баланың прогресін тыныш көру режимі",
  },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("ru");
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-semibold text-foreground">Qadam</span>
          <div className="flex gap-1 bg-muted rounded-lg p-0.5">
            {(["ru", "en", "kk"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  language === lang
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-primary font-medium mb-3">
              {t.heroSubtitle}
            </p>
            <p className="text-muted-foreground mb-8">
              {t.heroDescription}
            </p>
            <Button
              size="lg"
              className="h-14 px-8 text-lg"
              onClick={() => navigate("/auth")}
            >
              {t.startButton}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-4">
            {[
              { icon: CheckCircle2, title: t.feature1Title, desc: t.feature1Desc },
              { icon: CheckCircle2, title: t.feature2Title, desc: t.feature2Desc },
              { icon: CheckCircle2, title: t.feature3Title, desc: t.feature3Desc },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-card border border-border rounded-xl p-4"
              >
                <feature.icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6 text-center"
          >
            <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t.forStudents}
            </h3>
            <p className="text-muted-foreground text-sm">{t.studentDesc}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6 text-center"
          >
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t.forParents}
            </h3>
            <p className="text-muted-foreground text-sm">{t.parentDesc}</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-xl mx-auto text-center">
          <Button
            size="lg"
            className="h-14 px-8 text-lg"
            onClick={() => navigate("/auth")}
          >
            {t.startButton}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
