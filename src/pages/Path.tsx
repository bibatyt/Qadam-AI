import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Sparkles, 
  GraduationCap, FileText, DollarSign, ClipboardList,
  BookOpen, Target, Loader2, User, RefreshCw, ChevronRight,
  Star, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  completed: boolean;
  order_index: number;
  efc_specific: boolean;
  metadata?: any;
}

interface UniversityRecommendation {
  name: string;
  country: string;
  countryCode?: string;
  matchScore: number;
  scholarshipType: string;
  reason: string;
  annualCost?: number;
}

interface EFCData {
  role: string;
  efc_segment: string;
  residence_country: string;
  budget_range: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  exam: <BookOpen className="w-4 h-4" />,
  essay: <FileText className="w-4 h-4" />,
  application: <ClipboardList className="w-4 h-4" />,
  financial: <DollarSign className="w-4 h-4" />,
  document: <ClipboardList className="w-4 h-4" />,
  general: <Target className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  exam: "bg-blue-500/10 text-blue-500",
  essay: "bg-purple-500/10 text-purple-500",
  application: "bg-green-500/10 text-green-500",
  financial: "bg-amber-500/10 text-amber-500",
  document: "bg-slate-500/10 text-slate-500",
  general: "bg-primary/10 text-primary",
};

export default function Path() {
  const { user } = useAuth();
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [efcData, setEfcData] = useState<EFCData | null>(null);
  const [efcExplanation, setEfcExplanation] = useState("");
  const [universities, setUniversities] = useState<UniversityRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);
  const [totalParts, setTotalParts] = useState(5);

  useEffect(() => {
    if (user) {
      fetchPathData();
    }
  }, [user]);

  const fetchPathData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: efcResult } = await supabase
        .from('user_efc_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (efcResult) {
        setEfcData(efcResult);
        
        const { data: milestonesResult } = await supabase
          .from('path_milestones')
          .select('*')
          .eq('user_id', user.id)
          .order('order_index');

        if (milestonesResult && milestonesResult.length > 0) {
          setMilestones(milestonesResult);
          calculateCurrentPart(milestonesResult);
        } else {
          await generatePath(efcResult);
        }

        // Fetch university recommendations
        const { data: uniResult } = await supabase
          .from('university_recommendations')
          .select('*')
          .eq('user_id', user.id)
          .order('match_score', { ascending: false })
          .limit(5);

        if (uniResult && uniResult.length > 0) {
          setUniversities(uniResult.map(u => ({
            name: u.university_name,
            country: u.country,
            matchScore: u.match_score,
            scholarshipType: u.scholarship_type || '',
            reason: u.reason || '',
          })));
        }

        updateEfcExplanation(efcResult.efc_segment, efcResult.role);
      }
    } catch (error) {
      console.error('Error fetching path data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentPart = (ms: Milestone[]) => {
    // Find the first incomplete milestone's part
    const firstIncomplete = ms.find(m => !m.completed);
    if (firstIncomplete) {
      const part = Math.ceil(firstIncomplete.order_index / 10);
      setCurrentPart(Math.min(part, totalParts));
    } else {
      setCurrentPart(totalParts);
    }
  };

  const updateEfcExplanation = (segment: string, role: string) => {
    if (role === 'parent') {
      setEfcExplanation(t.planForParent);
      return;
    }

    switch (segment) {
      case 'low':
        setEfcExplanation(t.planOptimizedForScholarships);
        break;
      case 'medium':
        setEfcExplanation(t.combinationStrategy);
        break;
      case 'high':
        setEfcExplanation(t.focusOnMerit);
        break;
    }
  };

  const generatePath = async (efc: EFCData) => {
    if (!user) return;
    
    setGenerating(true);
    try {
      const { data: roadmap } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase.functions.invoke('generate-path', {
        body: {
          role: efc.role,
          efcSegment: efc.efc_segment,
          targetCountry: roadmap?.target_country || 'usa',
          currentGrade: roadmap?.current_grade || '11',
          mainGoal: roadmap?.main_goal || 'top_uni',
          targetUniversities: [],
          satScore: roadmap?.sat_score,
          ieltsScore: roadmap?.ielts_score,
          gpa: roadmap?.gpa,
          desiredMajor: roadmap?.desired_major,
          budgetRange: efc.budget_range || 'under_10k',
          language: language,
        }
      });

      if (error) throw error;

      if (data.totalParts) {
        setTotalParts(data.totalParts);
      }

      // Save milestones
      const milestonesToInsert = data.milestones.map((m: any, index: number) => ({
        user_id: user.id,
        title: m.title,
        description: m.description,
        category: m.category,
        priority: m.priority,
        order_index: index + 1,
        efc_specific: m.efc_specific,
        metadata: { ...m.metadata, part: m.part },
      }));

      const { data: insertedMilestones, error: insertError } = await supabase
        .from('path_milestones')
        .insert(milestonesToInsert)
        .select();

      if (insertError) throw insertError;

      setMilestones(insertedMilestones || []);
      setEfcExplanation(data.efcExplanation);

      // Save university recommendations
      if (data.universityRecommendations?.length > 0) {
        const unisToInsert = data.universityRecommendations.map((u: any) => ({
          user_id: user.id,
          university_name: u.name,
          country: u.country,
          match_score: u.matchScore,
          scholarship_type: u.scholarshipType,
          reason: u.reason,
          financial_aid_available: u.needBlind || false,
        }));

        await supabase.from('university_recommendations').delete().eq('user_id', user.id);
        await supabase.from('university_recommendations').insert(unisToInsert);
        
        setUniversities(data.universityRecommendations);
      }

      toast.success(t.personalPathCreated);
    } catch (error) {
      console.error('Error generating path:', error);
      toast.error(t.errorGeneratingPath);
    } finally {
      setGenerating(false);
    }
  };

  const toggleMilestone = async (milestone: Milestone) => {
    try {
      const newCompleted = !milestone.completed;
      
      const { error } = await supabase
        .from('path_milestones')
        .update({ 
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null
        })
        .eq('id', milestone.id);

      if (error) throw error;

      const updated = milestones.map(m => 
        m.id === milestone.id ? { ...m, completed: newCompleted } : m
      );
      setMilestones(updated);
      calculateCurrentPart(updated);

      if (newCompleted) {
        toast.success(t.stepCompleted);
      }
    } catch (error) {
      console.error('Error toggling milestone:', error);
      toast.error(t.errorUpdating);
    }
  };

  const resetPath = async () => {
    if (!user || !efcData) return;
    
    try {
      await supabase.from('path_milestones').delete().eq('user_id', user.id);
      await generatePath(efcData);
    } catch (error) {
      console.error('Error resetting path:', error);
      toast.error(t.errorResetting);
    }
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Get milestones for current part
  const currentPartMilestones = milestones.filter(m => {
    const part = m.metadata?.part || Math.ceil(m.order_index / 10);
    return part === currentPart;
  });
  
  const nextMilestone = currentPartMilestones.find(m => !m.completed) || milestones.find(m => !m.completed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!efcData) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 py-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-3">{t.pathNotCreated}</h1>
          <p className="text-muted-foreground mb-6">
            {t.goThroughOnboarding}
          </p>
          <Button variant="hero" onClick={() => window.location.href = '/onboarding'}>
            {t.start}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                {efcData.role === 'parent' ? (
                  <User className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-foreground">{t.myPath}</h1>
                <p className="text-xs text-muted-foreground">
                  {t.partOf} {currentPart} {t.of} {totalParts}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={resetPath}
              disabled={generating}
            >
              <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalParts }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-2 rounded-full transition-colors ${
                  i + 1 <= currentPart ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {completedCount} {t.of} {totalCount} {t.stepsCompleted}
          </p>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* EFC Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-3"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">{efcExplanation}</p>
          </div>
        </motion.div>

        {/* University Recommendations */}
        {universities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
              <Star className="w-3.5 h-3.5" />
              {t.recommendedUniversities}
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {universities.map((uni, index) => {
                const countryFlags: Record<string, string> = {
                  'USA': '🇺🇸',
                  'UK': '🇬🇧',
                  'Canada': '🇨🇦',
                  'Germany': '🇩🇪',
                  'Netherlands': '🇳🇱',
                  'Switzerland': '🇨🇭',
                  'France': '🇫🇷',
                  'Belgium': '🇧🇪',
                  'Denmark': '🇩🇰',
                  'Singapore': '🇸🇬',
                  'Hong Kong': '🇭🇰',
                  'South Korea': '🇰🇷',
                  'Japan': '🇯🇵',
                  'Kazakhstan': '🇰🇿',
                  'Czech Republic': '🇨🇿',
                  'Poland': '🇵🇱',
                  'Qatar': '🇶🇦',
                  'UAE': '🇦🇪',
                  'Saudi Arabia': '🇸🇦',
                  'Egypt': '🇪🇬',
                };
                const flag = countryFlags[uni.country] || '🌍';
                
                return (
                  <motion.div
                    key={uni.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="shrink-0 w-52 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        uni.matchScore >= 90 ? 'bg-green-500/10 text-green-600' :
                        uni.matchScore >= 80 ? 'bg-primary/10 text-primary' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        {uni.matchScore}% match
                      </span>
                      <span className="text-sm flex items-center gap-1">
                        {flag}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground mb-1.5 line-clamp-2 min-h-[2.5rem]">
                      {uni.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2 min-h-[2rem]">
                      {uni.reason || t.fitsYourProfile}
                    </p>
                    <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-[10px] font-semibold rounded-md">
                      {uni.scholarshipType}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Current Part Tasks */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
            {t.partOf} {currentPart}: {t.partTasks}
          </h3>
          
          <AnimatePresence>
            {currentPartMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`
                  bg-card border rounded-xl p-3 transition-all
                  ${milestone.completed ? 'opacity-60 border-border' : 'border-primary/20'}
                `}
              >
                <button
                  onClick={() => toggleMilestone(milestone)}
                  className="w-full flex items-start gap-3 text-left"
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5
                    ${milestone.completed 
                      ? 'gradient-primary' 
                      : 'border-2 border-muted-foreground/30'
                    }
                  `}>
                    {milestone.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-muted-foreground/30" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className={`font-semibold text-sm text-foreground ${milestone.completed ? 'line-through' : ''}`}>
                        {milestone.title}
                      </h4>
                      {milestone.efc_specific && (
                        <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded">
                          EFC
                        </span>
                      )}
                    </div>
                    {milestone.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {milestone.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${categoryColors[milestone.category] || categoryColors.general}`}>
                        {categoryIcons[milestone.category]} {milestone.category}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Next Part Navigation */}
        {currentPart < totalParts && currentPartMilestones.every(m => m.completed) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="hero"
              className="w-full"
              onClick={() => setCurrentPart(prev => Math.min(prev + 1, totalParts))}
            >
              {language === 'ru' ? `Перейти к части ${currentPart + 1}` : 
               language === 'kk' ? `${currentPart + 1}-бөлімге өту` : 
               `Go to part ${currentPart + 1}`}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Part Navigation */}
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: totalParts }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPart(i + 1)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                i + 1 === currentPart 
                  ? 'gradient-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
