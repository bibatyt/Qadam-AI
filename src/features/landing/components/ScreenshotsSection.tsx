import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, ChevronLeft, ChevronRight } from "lucide-react";
import { landingContent } from "../content";

// Import real screenshots
import wizardImg from "@/assets/screenshots/wizard.png";
import essayImg from "@/assets/screenshots/essay.png";
import aiMentorImg from "@/assets/screenshots/ai-mentor.png";
import pathImg from "@/assets/screenshots/path.png";
import aiPlanImg from "@/assets/screenshots/ai-plan.png";
import academicImg from "@/assets/screenshots/academic.png";
import financialImg from "@/assets/screenshots/financial.png";

const screenshots = [
  { id: "wizard", title: "Onboarding Wizard", description: "6 простых шагов", image: wizardImg },
  { id: "academic", title: "Academic Profile", description: "SAT, IELTS, GPA", image: academicImg },
  { id: "financial", title: "Financial Info", description: "EFC калькуляция", image: financialImg },
  { id: "aiPlan", title: "AI Analysis", description: "Персональный план", image: aiPlanImg },
  { id: "path", title: "My Path", description: "Ваш путь к цели", image: pathImg },
  { id: "essay", title: "Essay Engine", description: "Impact Score", image: essayImg },
  { id: "aiMentor", title: "AI Mentor", description: "24/7 поддержка", image: aiMentorImg },
];

function PhoneMockup({ image, title, isActive }: { image: string; title: string; isActive: boolean }) {
  return (
    <motion.div
      animate={{ scale: isActive ? 1 : 0.85, opacity: isActive ? 1 : 0.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative mx-auto"
      style={{ width: 220 }}
    >
      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border-[6px] border-foreground/80 bg-foreground/5 shadow-2xl overflow-hidden">
        {/* Status bar */}
        <div className="relative h-7 bg-foreground/90 flex items-center justify-center">
          <div className="w-20 h-4 bg-foreground rounded-b-xl" />
        </div>
        
        {/* Screen */}
        <div className="aspect-[9/19] overflow-hidden bg-background">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
        
        {/* Bottom bar */}
        <div className="h-4 bg-foreground/5 flex items-center justify-center">
          <div className="w-24 h-1 bg-foreground/30 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

export function ScreenshotsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => {
    setActiveIndex((index + screenshots.length) % screenshots.length);
  };

  // Show 3 phones: prev, active, next
  const prevIndex = (activeIndex - 1 + screenshots.length) % screenshots.length;
  const nextIndex = (activeIndex + 1) % screenshots.length;
  const visibleIndices = [prevIndex, activeIndex, nextIndex];

  return (
    <section className="py-20 px-4 overflow-hidden bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Smartphone className="w-4 h-4" />
            Демо приложения
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
            {landingContent.screenshots.title}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Реальные экраны приложения — всё работает на вашем телефоне
          </p>
        </motion.div>

        {/* Phone carousel */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-6 min-h-[420px]">
          {/* Prev button */}
          <button
            onClick={() => goTo(activeIndex - 1)}
            className="z-10 p-2 rounded-full bg-background border border-border shadow-md hover:bg-muted transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* 3 phones */}
          <div className="flex items-center gap-3 sm:gap-6">
            {visibleIndices.map((idx) => (
              <div
                key={screenshots[idx].id}
                className={`cursor-pointer transition-all ${idx !== activeIndex ? "hidden sm:block" : ""}`}
                onClick={() => setActiveIndex(idx)}
              >
                <PhoneMockup
                  image={screenshots[idx].image}
                  title={screenshots[idx].title}
                  isActive={idx === activeIndex}
                />
              </div>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => goTo(activeIndex + 1)}
            className="z-10 p-2 rounded-full bg-background border border-border shadow-md hover:bg-muted transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Active label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={screenshots[activeIndex].id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mt-6"
          >
            <h3 className="text-lg font-bold text-foreground">{screenshots[activeIndex].title}</h3>
            <p className="text-sm text-muted-foreground">{screenshots[activeIndex].description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
