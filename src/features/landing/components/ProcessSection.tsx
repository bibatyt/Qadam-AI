import { motion } from "framer-motion";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function ProcessSection() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  const steps = [
    { number: "01", emoji: "📝", title: t.step1Title, description: t.step1Desc },
    { number: "02", emoji: "📊", title: t.step2Title, description: t.step2Desc },
    { number: "03", emoji: "🚀", title: t.step3Title, description: t.step3Desc },
  ];

  const stepLabel = language === 'ru' ? 'Шаг' : language === 'kk' ? 'Қадам' : 'Step';

  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            {t.howItWorks}
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              <div className="flex items-start gap-6 p-6 sm:p-8 rounded-3xl bg-card border border-border/50 shadow-card">
                {/* Step number */}
                <div className="shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-primary"
                  >
                    <span className="text-3xl sm:text-4xl">{step.emoji}</span>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-primary">
                      {stepLabel} {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[2.5rem] sm:left-[3rem] top-full w-0.5 h-6 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}