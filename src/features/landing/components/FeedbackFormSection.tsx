import { motion } from "framer-motion";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";

const feedbackText = {
  en: {
    title: "Help us improve — it takes only 2–3 minutes",
    subtitle: "Your feedback helps us improve guidance quality for students.",
    reassurance: "No sign-up required. Your response is anonymous.",
  },
  ru: {
    title: "Помогите нам стать лучше — это займёт 2–3 минуты",
    subtitle: "Ваш отзыв помогает улучшить качество рекомендаций для студентов.",
    reassurance: "Регистрация не требуется. Ваш ответ анонимен.",
  },
  kz: {
    title: "Бізге жақсаруға көмектесіңіз — бұл тек 2–3 минут алады",
    subtitle: "Сіздің пікіріңіз студенттерге арналған нұсқаулық сапасын жақсартуға көмектеседі.",
    reassurance: "Тіркелу қажет емес. Сіздің жауабыңыз анонимді.",
  },
};

export const FeedbackFormSection = () => {
  const { language } = useLandingLanguage();
  const t = feedbackText[language];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
        >
          <p className="text-sm text-muted-foreground text-center py-4 px-4 bg-muted/50 border-b border-border/50">
            {t.reassurance}
          </p>
          
          <div className="w-full" style={{ height: "600px" }}>
            <iframe
              src="https://form.typeform.com/to/VoSk3S3r"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="camera; microphone; autoplay; encrypted-media;"
              className="w-full h-full"
              style={{ border: "none" }}
              title="Feedback Form"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
