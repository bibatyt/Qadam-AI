import { motion } from "framer-motion";

interface ImpactScoreRingProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export function ImpactScoreRing({ score, size = 120, showLabel = true }: ImpactScoreRingProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "hsl(var(--success))";
    if (score >= 60) return "hsl(var(--xp))";
    if (score >= 40) return "hsl(var(--accent))";
    return "hsl(var(--destructive))";
  };

  const getEmoji = () => {
    if (score >= 80) return "🔥";
    if (score >= 60) return "✨";
    if (score >= 40) return "💪";
    return "📝";
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-2xl"
        >
          {getEmoji()}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-2xl font-bold text-foreground"
        >
          {score}
        </motion.span>
        {showLabel && (
          <span className="text-xs text-muted-foreground">Impact</span>
        )}
      </div>
    </div>
  );
}
