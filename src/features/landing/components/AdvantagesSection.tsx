import { motion } from "framer-motion";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function AdvantagesSection() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  const advantages = [
    { emoji: "🎯", title: t.advantage1Title, description: t.advantage1Desc },
    { emoji: "⏰", title: t.advantage2Title, description: t.advantage2Desc },
    { emoji: "🏛️", title: t.advantage3Title, description: t.advantage3Desc },
    { emoji: "🌟", title: t.advantage4Title, description: t.advantage4Desc },
    { emoji: "🤖", title: t.advantage5Title, description: t.advantage5Desc },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            {t.advantagesTitle}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.advantagesSubtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`
                bg-card rounded-2xl p-6 border border-border/50 
                shadow-sm hover:shadow-md transition-shadow
                ${index === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}
              `}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-4xl mb-4"
              >
                {advantage.emoji}
              </motion.div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {advantage.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {advantage.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}