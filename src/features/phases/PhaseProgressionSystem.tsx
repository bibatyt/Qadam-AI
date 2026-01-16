import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Check, ChevronRight, AlertCircle, Clock, Target, Flame, Award, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getPhaseDefinitions } from "./phaseDefinitions";
import { AdmissionPhase, PhaseProgress, PhaseRequirement } from "./types";

type Language = "ru" | "kk";

interface PhaseProgressionSystemProps {
  userId: string;
  language: Language;
  userBaseline?: Record<string, any>;
}

const phaseIcons = {
  foundation: <Target className="w-5 h-5" />,
  differentiation: <Flame className="w-5 h-5" />,
  proof: <Award className="w-5 h-5" />,
  leverage: <Trophy className="w-5 h-5" />,
};

const translations = {
  ru: {
    title: "Система прогрессии",
    locked: "Заблокировано",
    unlocked: "Открыто",
    completed: "Завершено",
    requirements: "Требования",
    submit: "Отправить на проверку",
    pending: "На проверке",
    approved: "Одобрено",
    rejected: "Отклонено",
    cooldown: "Повторная отправка через",
    hours: "ч",
    unlockConditions: "Условия разблокировки",
    verifying: "AI проверяет...",
  },
  kk: {
    title: "Прогрессия жүйесі",
    locked: "Құлыпталған",
    unlocked: "Ашық",
    completed: "Аяқталды",
    requirements: "Талаптар",
    submit: "Тексеруге жіберу",
    pending: "Тексерілуде",
    approved: "Мақұлданды",
    rejected: "Қабылданбады",
    cooldown: "Қайта жіберу",
    hours: "сағ",
    unlockConditions: "Ашу шарттары",
    verifying: "AI тексеруде...",
  },
};

export function PhaseProgressionSystem({ userId, language, userBaseline = {} }: PhaseProgressionSystemProps) {
  const t = translations[language];
  const phases = getPhaseDefinitions(language);
  
  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress | null>(null);
  const [requirements, setRequirements] = useState<PhaseRequirement[]>([]);
  const [expandedPhase, setExpandedPhase] = useState<AdmissionPhase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [userId]);

  const fetchProgress = async () => {
    try {
      // Fetch or create phase progress
      let { data: progress } = await supabase
        .from("phase_progress")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!progress) {
        const { data: newProgress } = await supabase
          .from("phase_progress")
          .insert({ user_id: userId, user_baseline: userBaseline })
          .select()
          .single();
        progress = newProgress;
      }

      setPhaseProgress(progress as unknown as PhaseProgress);

      // Fetch requirements
      const { data: reqs } = await supabase
        .from("phase_requirements")
        .select("*")
        .eq("user_id", userId);

      setRequirements((reqs || []) as unknown as PhaseRequirement[]);
    } catch (error) {
      console.error("Error fetching phase progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const isPhaseUnlocked = (phaseId: AdmissionPhase): boolean => {
    if (!phaseProgress) return phaseId === "foundation";
    return phaseProgress[`${phaseId}_unlocked` as keyof PhaseProgress] as boolean;
  };

  const isPhaseCompleted = (phaseId: AdmissionPhase): boolean => {
    if (!phaseProgress) return false;
    return phaseProgress[`${phaseId}_completed` as keyof PhaseProgress] as boolean;
  };

  const getRequirementStatus = (phaseId: AdmissionPhase, reqKey: string) => {
    return requirements.find(r => r.phase === phaseId && r.requirement_key === reqKey);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-muted rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-foreground flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        {t.title}
      </h3>
      
      {phases.map((phase, index) => {
        const unlocked = isPhaseUnlocked(phase.id);
        const completed = isPhaseCompleted(phase.id);
        const isExpanded = expandedPhase === phase.id;
        const completedReqs = phase.requirements.filter(r => 
          getRequirementStatus(phase.id, r.key)?.completed
        ).length;
        
        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => unlocked && setExpandedPhase(isExpanded ? null : phase.id)}
              disabled={!unlocked}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all text-left",
                completed && "border-emerald-500 bg-emerald-500/5",
                unlocked && !completed && "border-primary/50 bg-primary/5 hover:border-primary",
                !unlocked && "border-muted bg-muted/30 opacity-60 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  completed && "bg-emerald-500 text-white",
                  unlocked && !completed && `bg-gradient-to-br ${phase.color} text-white`,
                  !unlocked && "bg-muted text-muted-foreground"
                )}>
                  {!unlocked ? <Lock className="w-5 h-5" /> : 
                   completed ? <Check className="w-5 h-5" /> : 
                   phaseIcons[phase.id]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">
                      Phase {phase.number}: {phase.name}
                    </span>
                    {completed && (
                      <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-600 rounded-full">
                        {t.completed}
                      </span>
                    )}
                    {!unlocked && (
                      <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                        {t.locked}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{phase.subtitle}</p>
                  {unlocked && !completed && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full bg-gradient-to-r", phase.color)}
                          style={{ width: `${(completedReqs / phase.requirements.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {completedReqs}/{phase.requirements.length}
                      </span>
                    </div>
                  )}
                </div>
                
                {unlocked && (
                  <ChevronRight className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    isExpanded && "rotate-90"
                  )} />
                )}
              </div>
            </button>

            {/* Expanded Phase Details */}
            {isExpanded && unlocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 ml-4 pl-4 border-l-2 border-primary/30 space-y-2"
              >
                <p className="text-sm text-muted-foreground">{phase.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">{t.requirements}</p>
                  {phase.requirements.map(req => {
                    const status = getRequirementStatus(phase.id, req.key);
                    const isCompleted = status?.completed;
                    
                    return (
                      <div 
                        key={req.key}
                        className={cn(
                          "p-3 rounded-lg border transition-colors",
                          isCompleted ? "border-emerald-500 bg-emerald-500/5" : "border-border bg-card"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                            isCompleted ? "bg-emerald-500 text-white" : "border-2 border-muted-foreground/30"
                          )}>
                            {isCompleted && <Check className="w-3 h-3" />}
                          </div>
                          <span className={cn(
                            "font-medium text-sm",
                            isCompleted && "text-emerald-600 line-through"
                          )}>
                            {req.label}
                          </span>
                        </div>
                        {!isCompleted && req.description && (
                          <p className="text-xs text-muted-foreground mt-1 ml-7">
                            {req.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!completed && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t.unlockConditions}</p>
                    <ul className="space-y-1">
                      {phase.unlockConditions.map((cond, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0 text-amber-500" />
                          {cond}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
