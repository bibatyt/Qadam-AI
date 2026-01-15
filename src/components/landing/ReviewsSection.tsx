import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";

const reviewTranslations = {
  en: {
    sectionTitle: "Leave Your Feedback",
    sectionDesc: "Your opinion helps us improve Qadam",
  },
  ru: {
    sectionTitle: "Оставьте отзыв",
    sectionDesc: "Ваше мнение помогает нам улучшать Qadam",
  },
  kz: {
    sectionTitle: "Пікір қалдырыңыз",
    sectionDesc: "Сіздің пікіріңіз Qadam-ды жақсартуға көмектеседі",
  },
};

export const ReviewsSection = () => {
  const { language } = useLandingLanguage();
  const t = reviewTranslations[language];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <MessageSquare className="w-4 h-4" />
            Feedback
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t.sectionTitle}</h2>
          <p className="text-muted-foreground">{t.sectionDesc}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/50 shadow-elevated overflow-hidden"
          style={{ height: "600px" }}
        >
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
        </motion.div>
      </div>
    </section>
  );
};
