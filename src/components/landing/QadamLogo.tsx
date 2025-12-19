import { motion } from "framer-motion";

interface QadamLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function QadamLogo({ size = 36, className = "", animated = false }: QadamLogoProps) {
  const LogoContent = () => (
    <span
      className={`text-primary font-bold ${className}`}
      style={{
        fontSize: `${size}px`,
        fontFamily: 'system-ui, sans-serif',
        lineHeight: 1
      }}
    >
      Q
    </span>
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
