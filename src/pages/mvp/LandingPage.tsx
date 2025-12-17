import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, GraduationCap, ClipboardList, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Language = "ru" | "en" | "kk";

const translations = {
  ru: {
    heroTitle: "Понятный путь к поступлению в университет",
    heroSubtitle: "Пошаговый план для школьников 9–11 классов. Прозрачный прогресс для родителей.",
    cta: "Создать план поступления",
    howItWorks: "Как это работает",
    step1Title: "Расскажите о себе",
    step1Desc: "Класс, цель, экзамены, год поступления",
    step2Title: "Получите план",
    step2Desc: "Персональный чеклист шагов к поступлению",
    step3Title: "Следите за прогрессом",
    step3Desc: "Отмечайте выполненное, видите что дальше",
    forStudentsTitle: "Для школьников",
    forStudents: [
      "Понятный список задач",
      "Ясные приоритеты на каждом этапе",
      "Ничего не забудете и не упустите",
    ],
    forParentsTitle: "Для родителей",
    forParents: [
      "Видите реальный прогресс ребёнка",
      "Понимаете что уже сделано",
      "Знаете какие шаги впереди",
    ],
    previewTitle: "Ваш личный план",
    previewProgress: "Прогресс поступления",
    previewStage: "Текущий этап",
    previewSteps: "Следующие шаги",
    footerText: "Qadam помогает структурировать путь к поступлению",
  },
  en: {
    heroTitle: "Clear path to university admission",
    heroSubtitle: "Step-by-step plan for high school students (grades 9-11). Transparent progress for parents.",
    cta: "Create admission plan",
    howItWorks: "How it works",
    step1Title: "Tell us about yourself",
    step1Desc: "Grade, goal, exams, target year",
    step2Title: "Get your plan",
    step2Desc: "Personal checklist of admission steps",
    step3Title: "Track your progress",
    step3Desc: "Mark completed items, see what's next",
    forStudentsTitle: "For students",
    forStudents: [
      "Clear task checklist",
      "Obvious priorities at each stage",
      "Nothing forgotten or missed",
    ],
    forParentsTitle: "For parents",
    forParents: [
      "See your child's real progress",
      "Understand what's already done",
      "Know what steps are ahead",
    ],
    previewTitle: "Your personal plan",
    previewProgress: "Admission progress",
    previewStage: "Current stage",
    previewSteps: "Next steps",
    footerText: "Qadam helps structure your path to admission",
  },
  kk: {
    heroTitle: "Университетке түсудің түсінікті жолы",
    heroSubtitle: "9-11 сынып оқушыларына арналған қадамдық жоспар. Ата-аналар үшін ашық прогресс.",
    cta: "Түсу жоспарын құру",
    howItWorks: "Қалай жұмыс істейді",
    step1Title: "Өзіңіз туралы айтыңыз",
    step1Desc: "Сынып, мақсат, емтихандар, түсу жылы",
    step2Title: "Жоспар алыңыз",
    step2Desc: "Түсуге арналған жеке тапсырмалар тізімі",
    step3Title: "Прогресті бақылаңыз",
    step3Desc: "Орындалғандарды белгілеп, келесіні көріңіз",
    forStudentsTitle: "Оқушыларға",
    forStudents: [
      "Түсінікті тапсырмалар тізімі",
      "Әр кезеңдегі басымдықтар",
      "Ештеңе ұмытылмайды",
    ],
    forParentsTitle: "Ата-аналарға",
    forParents: [
      "Баланың нақты прогресін көру",
      "Не істелгенін түсіну",
      "Алдағы қадамдарды білу",
    ],
    previewTitle: "Сіздің жеке жоспарыңыз",
    previewProgress: "Түсу прогресі",
    previewStage: "Ағымдағы кезең",
    previewSteps: "Келесі қадамдар",
    footerText: "Qadam түсу жолын құрылымдауға көмектеседі",
  },
};

const previewSteps = {
  ru: [
    { title: "Зарегистрироваться на IELTS", done: true },
    { title: "Подготовить мотивационное письмо", done: true },
    { title: "Сдать IELTS", done: false, current: true },
    { title: "Собрать документы", done: false },
    { title: "Подать заявку", done: false },
  ],
  en: [
    { title: "Register for IELTS", done: true },
    { title: "Prepare motivation letter", done: true },
    { title: "Take IELTS exam", done: false, current: true },
    { title: "Collect documents", done: false },
    { title: "Submit application", done: false },
  ],
  kk: [
    { title: "IELTS-ке тіркелу", done: true },
    { title: "Мотивациялық хат дайындау", done: true },
    { title: "IELTS тапсыру", done: false, current: true },
    { title: "Құжаттарды жинау", done: false },
    { title: "Өтінішті жіберу", done: false },
  ],
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("ru");
  const t = translations[language];
  const steps = previewSteps[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex justify-between items-center">
          <span className="text-lg font-semibold text-foreground">Qadam</span>
          <div className="flex items-center gap-1">
            {(["ru", "en", "kk"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-sm rounded transition-colors ${
                  language === lang
                    ? "bg-primary text-primary-foreground"
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
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-foreground mb-4">{t.heroTitle}</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
          <Button
            size="lg"
            className="h-12 px-6"
            onClick={() => navigate("/auth")}
          >
            {t.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="section-tight bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center mb-10 text-2xl">{t.howItWorks}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ClipboardList, title: t.step1Title, desc: t.step1Desc, num: "1" },
              { icon: BarChart3, title: t.step2Title, desc: t.step2Desc, num: "2" },
              { icon: CheckCircle, title: t.step3Title, desc: t.step3Desc, num: "3" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For students / parents */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Students */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{t.forStudentsTitle}</h3>
              </div>
              <ul className="space-y-3">
                {t.forStudents.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Parents */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">{t.forParentsTitle}</h3>
              </div>
              <ul className="space-y-3">
                {t.forParents.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="section-tight bg-muted/50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-center mb-8 text-2xl">{t.previewTitle}</h2>
          
          <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
            {/* Progress header */}
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{t.previewProgress}</span>
                <span className="text-lg font-semibold text-primary">40%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "40%" }} />
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">{t.previewStage}</span>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {steps.find(s => s.current)?.title}
                </p>
              </div>
            </div>

            {/* Steps list */}
            <div className="p-5">
              <span className="text-xs text-muted-foreground mb-3 block">{t.previewSteps}</span>
              <div className="space-y-0">
                {steps.map((step, i) => (
                  <div key={i} className="list-item">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      step.done 
                        ? "bg-accent text-accent-foreground" 
                        : step.current 
                          ? "border-2 border-primary bg-primary/10" 
                          : "border-2 border-border"
                    }`}>
                      {step.done && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm ${
                      step.done 
                        ? "text-muted-foreground line-through" 
                        : step.current 
                          ? "text-foreground font-medium" 
                          : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="max-w-xl mx-auto px-4 text-center">
          <Button
            size="lg"
            className="h-12 px-6"
            onClick={() => navigate("/auth")}
          >
            {t.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">{t.footerText}</p>
          <p className="text-xs text-muted-foreground/70 mt-2">© 2024 Qadam</p>
        </div>
      </footer>
    </div>
  );
}
