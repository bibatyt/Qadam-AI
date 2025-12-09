import { useState, useEffect, useRef } from "react";
import { User, Shuffle, LogOut, Check, Loader2, Camera, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "kk", label: "Қазақша", flag: "🇰🇿" },
];

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [satScore, setSatScore] = useState("");
  const [ieltsScore, setIeltsScore] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setSatScore(profile.sat_score?.toString() || "");
      setIeltsScore(profile.ielts_score?.toString() || "");
    }
  }, [profile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl + "?t=" + Date.now() });
      toast.success(t("avatarUpdated"));
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(t("avatarError"));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const generateRandomAvatar = async () => {
    if (!user) return;
    setUploadingAvatar(true);
    try {
      const seed = Math.random().toString(36).substring(7);
      const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
      await updateProfile({ avatar_url: avatarUrl });
      toast.success(t("avatarUpdated"));
    } catch (error) {
      console.error("Error generating avatar:", error);
      toast.error(t("avatarError"));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ name });
    setSaving(false);
    
    if (error) {
      toast.error(t("errorSaving"));
    } else {
      toast.success(t("settingsSaved"));
    }
  };

  const handleLanguageChange = async (lang: string) => {
    await setLanguage(lang as "ru" | "en" | "kk");
    toast.success(t("languageChanged"));
  };

  const handleSaveScores = async () => {
    setSaving(true);
    const updates: { sat_score?: number | null; ielts_score?: number | null } = {};
    
    if (satScore) {
      const sat = parseInt(satScore);
      if (sat >= 400 && sat <= 1600) {
        updates.sat_score = sat;
      } else {
        toast.error(t("satError"));
        setSaving(false);
        return;
      }
    } else {
      updates.sat_score = null;
    }

    if (ieltsScore) {
      const ielts = parseFloat(ieltsScore);
      if (ielts >= 1 && ielts <= 9) {
        updates.ielts_score = ielts;
      } else {
        toast.error(t("ieltsError"));
        setSaving(false);
        return;
      }
    } else {
      updates.ielts_score = null;
    }

    const { error } = await updateProfile(updates);
    setSaving(false);
    
    if (error) {
      toast.error(t("errorSaving"));
    } else {
      toast.success(t("resultsSaved"));
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success(t("loggedOut"));
    navigate("/");
  };

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
        <div className="container max-w-lg mx-auto">
          <h1 className="text-xl font-extrabold">{t("settings")}</h1>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Profile Card */}
        <div className="duolingo-card p-5 animate-fade-in">
          <h2 className="font-extrabold mb-4">{t("profile")}</h2>
          
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <Avatar className="w-20 h-20 border-[3px] border-primary">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || <User className="w-10 h-10" />}
                </AvatarFallback>
              </Avatar>
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-xl font-semibold"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                <Camera className="w-4 h-4" />
                {t("upload")}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 rounded-xl font-semibold"
                onClick={generateRandomAvatar}
                disabled={uploadingAvatar}
              >
                <Shuffle className="w-4 h-4" />
                {t("random")}
              </Button>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold">{t("name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("yourName")}
              className="h-12 rounded-xl font-medium"
            />
          </div>

          <Button 
            onClick={handleSave}
            className="w-full mt-4 h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold"
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t("save")}
          </Button>
        </div>

        {/* Language Card */}
        <div className="duolingo-card p-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-extrabold mb-4">{t("language")}</h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 touch-target ${
                  language === lang.code
                    ? "bg-primary text-primary-foreground shadow-primary"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                {lang.label}
                {language === lang.code && <Check className="w-4 h-4 ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Test Scores Card */}
        <div className="duolingo-card p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <h2 className="font-extrabold mb-4">{t("testResults")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sat" className="font-semibold">SAT Score</Label>
              <Input
                id="sat"
                type="number"
                placeholder="1600"
                className="h-12 rounded-xl font-medium"
                max={1600}
                min={400}
                value={satScore}
                onChange={(e) => setSatScore(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ielts" className="font-semibold">IELTS Score</Label>
              <Input
                id="ielts"
                type="number"
                placeholder="9.0"
                className="h-12 rounded-xl font-medium"
                max={9}
                min={1}
                step={0.5}
                value={ieltsScore}
                onChange={(e) => setIeltsScore(e.target.value)}
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 h-12 rounded-xl font-bold"
            onClick={handleSaveScores}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t("saveResults")}
          </Button>
        </div>

        {/* Leave Review */}
        <div className="duolingo-card p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Link to="/reviews" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquareHeart className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground">{t("leaveReview")}</h3>
              <p className="text-sm text-muted-foreground">{t("helpUsImprove")}</p>
            </div>
          </Link>
        </div>

        {/* Logout */}
        <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-bold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;