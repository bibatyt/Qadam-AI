import { BarChart3, TrendingUp, Award, Flame, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";

const Statistics = () => {
  const { profile, loading } = useProfile();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-extrabold">{t("statistics")}</h1>
          <Button variant="secondary" size="sm" className="rounded-xl font-bold">
            {t("recentActivity")}
          </Button>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* XP Graph Card */}
        <div className="duolingo-card p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-extrabold">{t("xpLast7Days")}</h2>
          </div>
          <div className="h-48 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/20">
            {(profile?.xp || 0) > 0 ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-8 h-8 text-xp" />
                  <div className="text-5xl font-extrabold text-primary">{profile?.xp}</div>
                </div>
                <p className="text-sm text-muted-foreground font-semibold">{t("totalXPEarned")}</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">{t("startQuests")}</p>
                <p className="text-xs">{t("toSeeProgress")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="duolingo-card p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">SAT</span>
            </div>
            <div className="text-3xl font-extrabold">
              {profile?.sat_score ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {profile?.sat_score ? t("outOf1600") : t("addInSettings")}
            </p>
          </div>

          <div className="duolingo-card p-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">IELTS</span>
            </div>
            <div className="text-3xl font-extrabold">
              {profile?.ielts_score ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {profile?.ielts_score ? t("outOf9") : t("addInSettings")}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="duolingo-card p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-extrabold mb-4">{t("overallStats")}</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl text-center border border-primary/20">
              <div className="flex justify-center mb-1">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-extrabold text-primary">{profile?.xp || 0}</div>
              <div className="text-xs text-muted-foreground font-semibold">{t("totalXP")}</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-secondary to-secondary/50 rounded-xl text-center border border-primary/20">
              <div className="flex justify-center mb-1">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-extrabold text-primary">{profile?.level || 1}</div>
              <div className="text-xs text-muted-foreground font-semibold">{t("level")}</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl text-center border border-accent/20">
              <div className="flex justify-center mb-1">
                <Flame className="w-5 h-5 text-accent" />
              </div>
              <div className="text-2xl font-extrabold text-accent">{profile?.streak || 0}</div>
              <div className="text-xs text-muted-foreground font-semibold">{t("dayStreak")}</div>
            </div>
          </div>
        </div>

        {/* Add Score CTA */}
        {(!profile?.sat_score && !profile?.ielts_score) && (
          <div className="text-center py-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <p className="text-sm text-muted-foreground font-medium mb-3">
              {t("addTestResults")}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl font-bold" 
              onClick={() => navigate("/settings")}
            >
              {t("addResults")}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Statistics;