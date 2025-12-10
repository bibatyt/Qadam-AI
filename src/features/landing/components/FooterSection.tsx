import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { landingContent } from "../content";
import { QadamLogo } from "@/components/landing/QadamLogo";

export function FooterSection() {
  const { footer } = landingContent;

  return (
    <>
      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 bg-muted/30">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-card to-card/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-border/50 shadow-xl relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <span className="text-2xl sm:text-3xl">🚀</span>
              </motion.div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-4">
                {footer.cta.title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto">
                {footer.cta.subtitle}
              </p>
              <Link to="/onboarding">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-bold group"
                >
                  {footer.cta.button}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 px-4 border-t border-border bg-card/50">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <QadamLogo size={40} animated />
              <div>
                <span className="font-bold text-foreground text-lg">Qadam AI</span>
                <p className="text-xs text-muted-foreground">Твой путь к поступлению</p>
              </div>
            </div>

            {/* Contact - Gmail only */}
            <div className="flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:beybaris.tanbayev.business@gmail.com"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">beybaris.tanbayev.business@gmail.com</span>
              </motion.a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-sm">
            <Link to="/onboarding" className="text-muted-foreground hover:text-foreground transition-colors">
              Начать
            </Link>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Как это работает
            </a>
            <a href="#efc" className="text-muted-foreground hover:text-foreground transition-colors">
              Что такое EFC
            </a>
          </div>

          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
            {footer.copyright}
          </div>
        </div>
      </footer>
    </>
  );
}
