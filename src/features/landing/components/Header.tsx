import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QadamLogo } from "@/components/landing/QadamLogo";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50 py-2 sm:py-3" 
          : "bg-transparent py-3 sm:py-5"
      }`}
    >
      <div className="container max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <QadamLogo size={36} animated />
          <span className="font-black text-lg sm:text-xl text-foreground">Qadam</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="#how-it-works" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            {t.howItWorks}
          </a>
          <LanguageSwitcher />
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="font-medium">
              {t.signIn}
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button variant="hero" size="sm" className="font-bold">
              {t.startFree}
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container px-4 py-6 space-y-4">
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-foreground"
              >
                {t.howItWorks}
              </a>
              <div className="flex justify-center py-2">
                <LanguageSwitcher />
              </div>
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full font-medium">
                  {t.signIn}
                </Button>
              </Link>
              <Link to="/onboarding" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="hero" className="w-full font-bold">
                  {t.startFree}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
