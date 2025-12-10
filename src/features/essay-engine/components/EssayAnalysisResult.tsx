import { motion } from "framer-motion";
import { CheckCircle2, Lightbulb, Sparkles, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImpactScoreRing } from "./ImpactScoreRing";
import type { EssayAnalysis } from "../types";

interface EssayAnalysisResultProps {
  analysis: EssayAnalysis;
  essayTitle: string;
  onBack: () => void;
  onNewEssay: () => void;
}

export function EssayAnalysisResult({ 
  analysis, 
  essayTitle, 
  onBack, 
  onNewEssay 
}: EssayAnalysisResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-foreground truncate">{essayTitle}</h2>
          <p className="text-sm text-muted-foreground">Результаты анализа</p>
        </div>
      </div>

      {/* Impact Score Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="duolingo-card p-6 flex flex-col items-center"
      >
        <ImpactScoreRing score={analysis.impactScore} size={140} />
        
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold text-foreground">
            {analysis.impactScore >= 80 ? "Отлично! 🔥" :
             analysis.impactScore >= 60 ? "Хорошо! ✨" :
             analysis.impactScore >= 40 ? "Неплохо! 💪" :
             "Есть над чем работать 📝"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {analysis.impactScore >= 80 ? "Эссе готово произвести впечатление" :
             analysis.impactScore >= 60 ? "Небольшие правки сделают его сильнее" :
             "Следуй рекомендациям для улучшения"}
          </p>
        </div>
      </motion.div>

      {/* Voice Score */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="duolingo-card p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <span className="text-2xl">🎭</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">Твой голос</p>
            <p className="text-sm text-muted-foreground">Аутентичность: {analysis.voiceScore}%</p>
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold ${analysis.voiceScore >= 70 ? 'text-success' : 'text-accent'}`}>
              {analysis.voiceScore >= 70 ? "👍" : "🎯"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Сильные стороны
          </h3>
          <div className="space-y-2">
            {analysis.strengths.map((strength, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-success/10 border border-success/20"
              >
                <span className="text-success mt-0.5">✓</span>
                <p className="text-sm text-foreground">{strength}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Improvements */}
      {analysis.improvements.length > 0 && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-xp" />
            Рекомендации
          </h3>
          <div className="space-y-2">
            {analysis.improvements.map((improvement, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-xp/10 border border-xp/20"
              >
                <span className="text-xp mt-0.5">💡</span>
                <p className="text-sm text-foreground">{improvement}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Authenticity Tips */}
      {analysis.authenticityTips.length > 0 && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Сохрани свой голос
          </h3>
          <div className="space-y-2">
            {analysis.authenticityTips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20"
              >
                <span className="text-primary mt-0.5">✨</span>
                <p className="text-sm text-foreground">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="pt-4"
      >
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={onNewEssay}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Загрузить другое эссе
        </Button>
      </motion.div>
    </motion.div>
  );
}
