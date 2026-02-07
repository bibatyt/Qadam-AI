import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, ChevronRight, AlertCircle, Clock, Target, Flame, Award, Trophy, Upload, Loader2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAdaptivePhaseDefinitions } from "./getAdaptivePhases";
import { AdmissionPhase, PhaseProgress, PhaseRequirement, PhaseSubmission } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Language = "ru" | "kk" | "en";

interface UserBaseline {
  targetCountry?: string;
  targetMarket?: string;
  exams?: string[];
  goal?: string;
  grade?: string;
  specificGoal?: string;
  academicSnapshot?: {
    sat?: string | number;
    ielts?: string | number;
    gpa?: string | number;
    ent?: string | number;
    toefl?: string | number;
  };
}

interface PhaseProgressionSystemProps {
  userId: string;
  language: Language;
  userBaseline?: UserBaseline;
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
    submitProof: "Отправить доказательство",
    proofLink: "Ссылка на доказательство",
    proofLinkHint: "Bluebook, Khan Academy, GitHub, Google Doc",
    score: "Балл",
    description: "Описание",
    cancel: "Отмена",
    sending: "Отправка...",
    successSubmit: "Отправлено на проверку AI",
    errorSubmit: "Ошибка отправки",
    waitCooldown: "Подождите перед повторной отправкой",
    phaseUnlocked: "Новая фаза разблокирована!",
    requirementApproved: "Требование выполнено!",
    requirementRejected: "Требование отклонено",
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
    submitProof: "Дәлел жіберу",
    proofLink: "Дәлел сілтемесі",
    proofLinkHint: "Bluebook, Khan Academy, GitHub, Google Doc",
    score: "Ұпай",
    description: "Сипаттама",
    cancel: "Бас тарту",
    sending: "Жіберілуде...",
    successSubmit: "AI тексеруіне жіберілді",
    errorSubmit: "Жіберу қатесі",
    waitCooldown: "Қайта жібермес бұрын күтіңіз",
    phaseUnlocked: "Жаңа фаза ашылды!",
    requirementApproved: "Талап орындалды!",
    requirementRejected: "Талап қабылданбады",
  },
  en: {
    title: "Progression System",
    locked: "Locked",
    unlocked: "Unlocked",
    completed: "Completed",
    requirements: "Requirements",
    submit: "Submit for review",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    cooldown: "Retry in",
    hours: "h",
    unlockConditions: "Unlock conditions",
    verifying: "AI is verifying...",
    submitProof: "Submit proof",
    proofLink: "Proof link",
    proofLinkHint: "Bluebook, Khan Academy, GitHub, Google Doc",
    score: "Score",
    description: "Description",
    cancel: "Cancel",
    sending: "Sending...",
    successSubmit: "Submitted for AI review",
    errorSubmit: "Submission error",
    waitCooldown: "Please wait before resubmitting",
    phaseUnlocked: "New phase unlocked!",
    requirementApproved: "Requirement completed!",
    requirementRejected: "Requirement rejected",
  },
};

export function PhaseProgressionSystem({ userId, language, userBaseline = {} }: PhaseProgressionSystemProps) {
  const t = translations[language];
  
  // Generate adaptive phases based on user baseline
  const phases = useMemo(() => 
    getAdaptivePhaseDefinitions(language, userBaseline), 
    [language, userBaseline]
  );
  
  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress | null>(null);
  const [requirements, setRequirements] = useState<PhaseRequirement[]>([]);
  const [submissions, setSubmissions] = useState<PhaseSubmission[]>([]);
  const [expandedPhase, setExpandedPhase] = useState<AdmissionPhase | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<{ phaseId: AdmissionPhase; reqKey: string; label: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [proofLink, setProofLink] = useState("");
  const [proofScore, setProofScore] = useState("");
  const [proofDescription, setProofDescription] = useState("");

  useEffect(() => {
    fetchProgress();
  }, [userId]);

  const fetchProgress = async () => {
    try {
      // Fetch or create phase progress
      let { data: progress, error: progressError } = await supabase
        .from("phase_progress")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (!progress) {
        const { data: newProgress, error: insertError } = await supabase
          .from("phase_progress")
          .insert([{ 
            user_id: userId, 
            user_baseline: JSON.parse(JSON.stringify(userBaseline)),
            foundation_unlocked: true,
            current_phase: "foundation" as const
          }])
          .select()
          .single();
        
        if (insertError) {
          console.error("Error creating phase progress:", insertError);
        } else {
          progress = newProgress;
        }
      }

      setPhaseProgress(progress as unknown as PhaseProgress);

      // Fetch requirements
      const { data: reqs } = await supabase
        .from("phase_requirements")
        .select("*")
        .eq("user_id", userId);

      setRequirements((reqs || []) as unknown as PhaseRequirement[]);

      // Fetch recent submissions
      const { data: subs } = await supabase
        .from("phase_submissions")
        .select("*")
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false })
        .limit(20);

      setSubmissions((subs || []) as unknown as PhaseSubmission[]);
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

  const getLatestSubmission = (phaseId: AdmissionPhase, reqKey: string) => {
    return submissions.find(s => s.phase === phaseId && s.submission_type === reqKey);
  };

  const openSubmitModal = (phaseId: AdmissionPhase, reqKey: string, label: string) => {
    const submission = getLatestSubmission(phaseId, reqKey);
    if (submission?.cooldown_until && new Date(submission.cooldown_until) > new Date()) {
      const hoursLeft = Math.ceil((new Date(submission.cooldown_until).getTime() - Date.now()) / (1000 * 60 * 60));
      toast.error(`${t.waitCooldown}: ${hoursLeft}${t.hours}`);
      return;
    }
    
    setSelectedRequirement({ phaseId, reqKey, label });
    setProofLink("");
    setProofScore("");
    setProofDescription("");
    setSubmitModalOpen(true);
  };

  const handleSubmitProof = async () => {
    if (!selectedRequirement || !proofLink) return;
    
    setSubmitting(true);
    
    try {
      // Create submission record
      const { data: submission, error: subError } = await supabase
        .from("phase_submissions")
        .insert({
          user_id: userId,
          phase: selectedRequirement.phaseId,
          submission_type: selectedRequirement.reqKey,
          submission_data: {
            proofLink,
            score: proofScore ? parseInt(proofScore) : undefined,
            description: proofDescription,
          },
          status: "pending" as const,
        })
        .select()
        .single();

      if (subError) throw subError;

      // Call AI verification
      const { data: result, error: verifyError } = await supabase.functions.invoke("verify-phase-submission", {
        body: {
          submissionId: submission.id,
          userId,
          phase: selectedRequirement.phaseId,
          submissionType: selectedRequirement.reqKey,
          data: {
            proofLink,
            score: proofScore ? parseInt(proofScore) : undefined,
            description: proofDescription,
          },
          userBaseline,
          language,
        },
      });

      if (verifyError) throw verifyError;

      if (result.approved) {
        toast.success(t.requirementApproved);
        if (result.unlockNextPhase) {
          toast.success(t.phaseUnlocked, { duration: 5000 });
        }
      } else {
        toast.error(t.requirementRejected);
        toast(result.reason, { duration: 8000 });
      }

      // Refresh data
      await fetchProgress();
      setSubmitModalOpen(false);
    } catch (error) {
      console.error("Error submitting proof:", error);
      toast.error(t.errorSubmit);
    } finally {
      setSubmitting(false);
    }
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
    <>
      <div className="space-y-3">
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
              <AnimatePresence>
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
                        const latestSubmission = getLatestSubmission(phase.id, req.key);
                        const isPending = latestSubmission?.status === "pending";
                        const isRejected = latestSubmission?.status === "rejected";
                        const hasCooldown = latestSubmission?.cooldown_until && 
                          new Date(latestSubmission.cooldown_until) > new Date();
                        
                        return (
                          <div 
                            key={req.key}
                            className={cn(
                              "p-3 rounded-lg border transition-colors",
                              isCompleted ? "border-emerald-500 bg-emerald-500/5" : 
                              isPending ? "border-amber-500 bg-amber-500/5" :
                              isRejected ? "border-red-500 bg-red-500/5" :
                              "border-border bg-card"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                isCompleted ? "bg-emerald-500 text-white" : 
                                isPending ? "bg-amber-500 text-white" :
                                "border-2 border-muted-foreground/30"
                              )}>
                                {isCompleted && <Check className="w-3 h-3" />}
                                {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                              </div>
                              <span className={cn(
                                "font-medium text-sm flex-1",
                                isCompleted && "text-emerald-600"
                              )}>
                                {req.label}
                              </span>
                              
                              {/* Action Button */}
                              {!isCompleted && !isPending && (
                                <Button
                                  size="sm"
                                  variant={hasCooldown ? "ghost" : "outline"}
                                  disabled={hasCooldown}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openSubmitModal(phase.id, req.key, req.label);
                                  }}
                                  className="h-7 text-xs"
                                >
                                  {hasCooldown ? (
                                    <>
                                      <Clock className="w-3 h-3 mr-1" />
                                      {Math.ceil((new Date(latestSubmission!.cooldown_until!).getTime() - Date.now()) / (1000 * 60 * 60))}{t.hours}
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3 h-3 mr-1" />
                                      {t.submit}
                                    </>
                                  )}
                                </Button>
                              )}
                              
                              {isPending && (
                                <span className="text-xs text-amber-600 font-medium">
                                  {t.pending}
                                </span>
                              )}
                            </div>
                            
                            {/* Rejection feedback */}
                            {isRejected && latestSubmission?.ai_feedback && (
                              <div className="mt-2 p-2 bg-red-500/10 rounded text-xs text-red-600">
                                {latestSubmission.ai_feedback}
                              </div>
                            )}
                            
                            {!isCompleted && req.description && !isRejected && (
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
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Submit Proof Modal */}
      <Dialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.submitProof}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {selectedRequirement?.label}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.proofLink} *</label>
              <Input
                placeholder={t.proofLinkHint}
                value={proofLink}
                onChange={(e) => setProofLink(e.target.value)}
              />
            </div>
            
            {selectedRequirement?.reqKey.includes("sat") && (
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.score}</label>
                <Input
                  type="number"
                  placeholder="1480"
                  value={proofScore}
                  onChange={(e) => setProofScore(e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.description}</label>
              <Textarea
                placeholder="..."
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSubmitModalOpen(false)}
                disabled={submitting}
              >
                {t.cancel}
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitProof}
                disabled={submitting || !proofLink}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {t.submit}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
