import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, GraduationCap, ClipboardList, BarChart3, Quote, Star, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
type Language = "ru" | "en" | "kk";
const translations = {
  ru: {
    heroTitle: "Понятный путь к поступлению",
    heroSubtitle: "Пошаговый план для школьников 9–11 классов. AI создаёт персональный план поступления.",
    cta: "Создать мой план",
    howItWorks: "Как это работает",
    step1Title: "Расскажите о себе",
    step1Desc: "Класс, баллы, цель, специальность",
    step2Title: "AI создаёт план",
    step2Desc: "Персональный чеклист шагов",
    step3Title: "Следите за прогрессом",
    step3Desc: "Отмечайте выполненное",
    forStudentsTitle: "Для школьников",
    forStudents: ["Понятный список задач", "Ясные приоритеты на каждом этапе", "Ничего не забудете и не упустите"],
    forParentsTitle: "Для родителей",
    forParents: ["Видите реальный прогресс ребёнка", "Понимаете что уже сделано", "Знаете какие шаги впереди"],
    previewTitle: "Ваш личный план",
    previewProgress: "Прогресс поступления",
    previewStage: "Текущий этап",
    previewSteps: "Следующие шаги",
    footerText: "Qadam помогает структурировать путь к поступлению",
    reviewsTitle: "Отзывы пользователей",
    // Feedback section
    feedbackTitle: "Помогите нам стать лучше — это займёт 2–3 минуты",
    feedbackSubtitle: "Ваш отзыв помогает улучшить качество рекомендаций для студентов.",
    feedbackAnonymous: "Регистрация не требуется. Ваш ответ анонимен.",
    feedbackGrade: "Класс",
    feedbackCountry: "Страна",
    feedbackCountryPlaceholder: "Введите страну",
    feedbackGoal: "Твоя цель сейчас",
    feedbackGoalOptions: ["IELTS", "SAT", "Поступление за границу", "Поступить на грант", "Пока не знаю"],
    feedbackAction: "Сделал ли ты какое-либо реальное действие после использования Qadam AI?",
    feedbackSubmit: "Отправить",
    feedbackSending: "Отправка...",
    feedbackSuccess: "Спасибо за ваш отзыв!",
    feedbackError: "Ошибка при отправке"
  },
  en: {
    heroTitle: "Clear path to university admission",
    heroSubtitle: "Step-by-step plan for high school students (grades 9-11). AI creates your personal admission plan.",
    cta: "Create my plan",
    howItWorks: "How it works",
    step1Title: "Tell us about yourself",
    step1Desc: "Grade, scores, goal, specialty",
    step2Title: "AI creates your plan",
    step2Desc: "Personal checklist of steps",
    step3Title: "Track your progress",
    step3Desc: "Mark completed items",
    forStudentsTitle: "For students",
    forStudents: ["Clear task checklist", "Obvious priorities at each stage", "Nothing forgotten or missed"],
    forParentsTitle: "For parents",
    forParents: ["See your child's real progress", "Understand what's already done", "Know what steps are ahead"],
    previewTitle: "Your personal plan",
    previewProgress: "Admission progress",
    previewStage: "Current stage",
    previewSteps: "Next steps",
    footerText: "Qadam helps structure your path to admission",
    reviewsTitle: "User reviews",
    // Feedback section
    feedbackTitle: "Help us improve — it takes only 2–3 minutes",
    feedbackSubtitle: "Your feedback helps us improve guidance quality for students.",
    feedbackAnonymous: "No sign-up required. Your response is anonymous.",
    feedbackGrade: "Grade",
    feedbackCountry: "Country",
    feedbackCountryPlaceholder: "Enter your country",
    feedbackGoal: "Your current goal",
    feedbackGoalOptions: ["IELTS", "SAT", "Study abroad", "Get a scholarship", "Not sure yet"],
    feedbackAction: "Did you take any real action after using Qadam AI?",
    feedbackSubmit: "Submit",
    feedbackSending: "Sending...",
    feedbackSuccess: "Thank you for your feedback!",
    feedbackError: "Error submitting feedback"
  },
  kk: {
    heroTitle: "Түсудің түсінікті жолы",
    heroSubtitle: "9-11 сынып оқушыларына арналған қадамдық жоспар. AI жеке жоспарды құрады.",
    cta: "Жоспарымды құру",
    howItWorks: "Қалай жұмыс істейді",
    step1Title: "Өзіңіз туралы айтыңыз",
    step1Desc: "Сынып, балл, мақсат, мамандық",
    step2Title: "AI жоспар құрады",
    step2Desc: "Жеке тапсырмалар тізімі",
    step3Title: "Прогресті бақылаңыз",
    step3Desc: "Орындалғандарды белгілеу",
    forStudentsTitle: "Оқушыларға",
    forStudents: ["Түсінікті тапсырмалар тізімі", "Әр кезеңдегі басымдықтар", "Ештеңе ұмытылмайды"],
    forParentsTitle: "Ата-аналарға",
    forParents: ["Баланың нақты прогресін көру", "Не істелгенін түсіну", "Алдағы қадамдарды білу"],
    previewTitle: "Сіздің жеке жоспарыңыз",
    previewProgress: "Түсу прогресі",
    previewStage: "Ағымдағы кезең",
    previewSteps: "Келесі қадамдар",
    footerText: "Qadam түсу жолын құрылымдауға көмектеседі",
    reviewsTitle: "Пайдаланушы пікірлері",
    // Feedback section
    feedbackTitle: "Бізге жақсаруға көмектесіңіз — бұл тек 2–3 минут алады",
    feedbackSubtitle: "Сіздің пікіріңіз студенттерге арналған нұсқаулық сапасын жақсартуға көмектеседі.",
    feedbackAnonymous: "Тіркелу қажет емес. Сіздің жауабыңыз анонимді.",
    feedbackGrade: "Сынып",
    feedbackCountry: "Ел",
    feedbackCountryPlaceholder: "Еліңізді енгізіңіз",
    feedbackGoal: "Қазіргі мақсатыңыз",
    feedbackGoalOptions: ["IELTS", "SAT", "Шетелде оқу", "Грант алу", "Әлі білмеймін"],
    feedbackAction: "Qadam AI қолданғаннан кейін нақты әрекет жасадыңыз ба?",
    feedbackSubmit: "Жіберу",
    feedbackSending: "Жіберілуде...",
    feedbackSuccess: "Пікіріңіз үшін рахмет!",
    feedbackError: "Жіберу қатесі"
  }
};
const reviews = {
  ru: [{
    name: "Сырым",
    role: "Студент",
    text: "Честно, очень понятный, предельно дружелюбный UI, реально буду использовать его для целей поступления, топ!",
    rating: 5
  }, {
    name: "Владислав",
    role: "Студент",
    text: "Интерфейс крутой, все приятно, идея с планом вообще круто!",
    rating: 5
  }, {
    name: "Диляра",
    role: "Родитель",
    text: "В целом, интересное приложение. Очень понравилась функция AI. Даже не ожидала. Дает хорошие советы.",
    rating: 5
  }],
  en: [{
    name: "Syrym",
    role: "Student",
    text: "Honestly, a very clear and extremely user-friendly UI. I'll definitely use it for my admissions process!",
    rating: 5
  }, {
    name: "Vladislav",
    role: "Student",
    text: "The interface is great, everything feels smooth. The plan idea is really cool!",
    rating: 5
  }, {
    name: "Dilyara",
    role: "Parent",
    text: "Overall, an interesting app. I really liked the AI feature. Didn't expect it. Gives great advice.",
    rating: 5
  }],
  kk: [{
    name: "Сырым",
    role: "Студент",
    text: "Шынымды айтсам, өте түсінікті, керемет ыңғайлы интерфейс. Түсу үшін міндетті түрде қолданамын!",
    rating: 5
  }, {
    name: "Владислав",
    role: "Студент",
    text: "Интерфейс керемет, барлығы жағымды. Жоспар идеясы өте тамаша!",
    rating: 5
  }, {
    name: "Диляра",
    role: "Ата-ана",
    text: "Жалпы, қызықты қолданба. AI функциясы өте ұнады. Күтпедім. Жақсы кеңестер береді.",
    rating: 5
  }]
};
const previewSteps = {
  ru: [{
    title: "Зарегистрироваться на IELTS",
    done: true
  }, {
    title: "Подготовить мотивационное письмо",
    done: true
  }, {
    title: "Сдать IELTS",
    done: false,
    current: true
  }, {
    title: "Собрать документы",
    done: false
  }, {
    title: "Подать заявку",
    done: false
  }],
  en: [{
    title: "Register for IELTS",
    done: true
  }, {
    title: "Prepare motivation letter",
    done: true
  }, {
    title: "Take IELTS exam",
    done: false,
    current: true
  }, {
    title: "Collect documents",
    done: false
  }, {
    title: "Submit application",
    done: false
  }],
  kk: [{
    title: "IELTS-ке тіркелу",
    done: true
  }, {
    title: "Мотивациялық хат дайындау",
    done: true
  }, {
    title: "IELTS тапсыру",
    done: false,
    current: true
  }, {
    title: "Құжаттарды жинау",
    done: false
  }, {
    title: "Өтінішті жіберу",
    done: false
  }]
};
const fadeInUp = {
  initial: {
    opacity: 0,
    y: 30
  },
  animate: {
    opacity: 1,
    y: 0
  },
  transition: {
    duration: 0.5
  }
};
const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Feedback Section Component - Embedded Typeform
function FeedbackSection({
  language,
  t
}: {
  language: Language;
  t: typeof translations.ru;
}) {
  return <section className="section bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <MessageSquare className="w-4 h-4" />
            Feedback
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t.feedbackTitle}
          </h2>
          <p className="text-muted-foreground">
            {t.feedbackSubtitle}
          </p>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.1
      }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="px-4 py-3 bg-muted/50 border-b border-border text-center">
            <p className="text-sm text-muted-foreground">
              {t.feedbackAnonymous}
            </p>
          </div>

          <div className="w-full" style={{
          height: "600px"
        }}>
            <iframe src="https://form.typeform.com/to/VoSk3S3r" width="100%" height="100%" frameBorder="0" allow="camera; microphone; autoplay; encrypted-media;" className="w-full h-full border-0" style={{
            border: "none"
          }} title="Feedback Form" />
          </div>
        </motion.div>
      </div>
    </section>;
}
export default function LandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("ru");
  const t = translations[language];
  const steps = previewSteps[language];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <motion.span initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} className="text-xl font-bold text-primary">Qadam</motion.span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-muted rounded-full p-1">
              {(["ru", "en", "kk"] as Language[]).map(lang => <button key={lang} onClick={() => setLanguage(lang)} className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${language === lang ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                  {lang.toUpperCase()}
                </button>)}
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="font-medium">
              {language === "ru" ? "Войти" : language === "kk" ? "Кіру" : "Log in"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <motion.div initial="initial" animate="animate" variants={stagger} className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 fill-primary" />
            AI-powered планирование
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-foreground mb-6 text-4xl md:text-5xl">
            {t.heroTitle}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" onClick={() => navigate("/auth")}>
              {t.cta}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="section-tight bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12 text-2xl">
            {t.howItWorks}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{
            icon: ClipboardList,
            title: t.step1Title,
            desc: t.step1Desc,
            num: "1",
            color: "primary"
          }, {
            icon: BarChart3,
            title: t.step2Title,
            desc: t.step2Desc,
            num: "2",
            color: "accent"
          }, {
            icon: CheckCircle,
            title: t.step3Title,
            desc: t.step3Desc,
            num: "3",
            color: "primary"
          }].map((step, i) => <motion.div key={step.num} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.15
          }} className="text-center bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elevated hover:scale-105 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-${step.color}/10 text-${step.color} flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-10 text-2xl">
            {t.reviewsTitle}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-5">
            {(reviews[language] || reviews.en).map((review, i) => <motion.div key={review.name} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.1
          }} className="review-card hover:scale-105 transition-transform duration-300">
                <Quote className="w-8 h-8 text-primary/30 mb-3" />
                <p className="text-sm text-foreground mb-4 italic">"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-warning text-warning" />)}
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* For students / parents */}
      <section className="section-tight bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Students */}
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="p-6 rounded-2xl border border-border bg-card shadow-card hover:shadow-elevated transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold">{t.forStudentsTitle}</h3>
              </div>
              <ul className="space-y-3">
                {t.forStudents.map((item, i) => <motion.li key={i} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: i * 0.1
              }} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {item}
                  </motion.li>)}
              </ul>
            </motion.div>

            {/* Parents */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="p-6 rounded-2xl border border-border bg-card shadow-card hover:shadow-elevated transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold">{t.forParentsTitle}</h3>
              </div>
              <ul className="space-y-3">
                {t.forParents.map((item, i) => <motion.li key={i} initial={{
                opacity: 0,
                x: 20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: i * 0.1
              }} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    {item}
                  </motion.li>)}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="section">
        <div className="max-w-md mx-auto px-4">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-8 text-2xl">
            {t.previewTitle}
          </motion.h2>
          
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="bg-card rounded-3xl border border-border shadow-elevated overflow-hidden">
            {/* Progress header */}
            <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{t.previewProgress}</span>
                <span className="text-2xl font-bold text-primary">40%</span>
              </div>
              <div className="progress-track">
                <motion.div initial={{
                width: 0
              }} whileInView={{
                width: "40%"
              }} viewport={{
                once: true
              }} transition={{
                duration: 1,
                delay: 0.3
              }} className="progress-fill" />
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">{t.previewStage}</span>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {steps.find(s => s.current)?.title}
                </p>
              </div>
            </div>

            {/* Steps list */}
            <div className="p-5">
              <span className="text-xs font-medium text-muted-foreground mb-4 block">{t.previewSteps}</span>
              <div className="space-y-1">
                {steps.map((step, i) => <motion.div key={i} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: i * 0.1
              }} className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${step.done ? "bg-primary text-primary-foreground" : step.current ? "border-2 border-primary bg-primary/10 animate-pulse-glow" : "border-2 border-border"}`}>
                      {step.done && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm ${step.done ? "text-muted-foreground line-through" : step.current ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                      {step.title}
                    </span>
                  </motion.div>)}
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* CTA */}
      <section className="section-tight">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="max-w-xl mx-auto px-4 text-center">
          <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" onClick={() => navigate("/auth")}>
            {t.cta}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">{t.footerText}</p>
          <p className="text-xs text-muted-foreground/70 mt-2">© 2024 Qadam</p>
        </div>
      </footer>
    </div>;
}