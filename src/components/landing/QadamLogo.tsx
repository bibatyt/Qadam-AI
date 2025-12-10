import { motion } from "framer-motion";

interface QadamLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function QadamLogo({ size = 36, className = "", animated = false }: QadamLogoProps) {
  const LogoContent = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Minimalist path/step design */}
      <rect 
        x="4" 
        y="4" 
        width="32" 
        height="32" 
        rx="8" 
        className="fill-primary"
      />
      
      {/* Stylized "Q" with step accent */}
      <path
        d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C22.76 30 25.25 28.9 27.1 27.1L30 30L32 28L29.1 25.1C30.24 23.54 30.9 21.6 30.9 19.5C30.9 14.26 26.64 10 21.4 10H20ZM20 14C24.42 14 28 17.58 28 22C28 24.2 27.12 26.2 25.66 27.66L23 25V22C23 20.34 21.66 19 20 19C18.34 19 17 20.34 17 22C17 23.66 18.34 25 20 25V28C15.58 28 12 24.42 12 20C12 15.58 15.58 12 20 12V14Z"
        className="fill-primary-foreground"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      
      {/* Step dots */}
      <circle cx="32" cy="32" r="2.5" className="fill-primary-foreground/40" />
      <circle cx="26" cy="32" r="1.5" className="fill-primary-foreground/25" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      >
        <LogoContent />
      </motion.div>
    );
  }

  return <LogoContent />;
}
