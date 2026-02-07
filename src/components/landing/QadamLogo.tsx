import { motion } from "framer-motion";
import qadamLogo from "@/assets/qadam-logo.png";

interface QadamLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function QadamLogo({ size = 36, className = "", animated = false }: QadamLogoProps) {
  const LogoContent = () => (
    <img
      src={qadamLogo}
      alt="Qadam"
      className={className}
      style={{
        height: `${size}px`,
        width: "auto",
        objectFit: "contain"
      }}
    />
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
