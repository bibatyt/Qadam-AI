import { useState, useEffect } from "react";
import { User, Upload, Shuffle, LogOut, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const languages = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "kk", label: "Қазақша" },
];

const Settings = () => {
  const { signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selectedLang, setSelectedLang] = useState("ru");
  const [satScore, setSatScore] = useState("");
  const [ieltsScore, setIeltsScore] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setSelectedLang(profile.language || "ru");
      setSatScore(profile.sat_score?.toString() || "");
      setIeltsScore(profile.ielts_score?.toString() || "");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ name });
    setSaving(false);
    
    if (error) {
      toast.error("Ошибка при сохранении");
    } else {
      toast.success("Настройки сохранены!");
    }
  };

  const handleLanguageChange = async (lang: string) => {
    setSelectedLang(lang);
    await updateProfile({ language: lang });
    toast.success("Язык изменён");
  };

  const handleSaveScores = async () => {
    setSaving(true);
    const updates: { sat_score?: number | null; ielts_score?: number | null } = {};
    
    if (satScore) {
      const sat = parseInt(satScore);
      if (sat >= 400 && sat <= 1600) {
        updates.sat_score = sat;
      } else {
        toast.error("SAT должен быть от 400 до 1600");
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
        toast.error("IELTS должен быть от 1 до 9");
        setSaving(false);
        return;
      }
    } else {
      updates.ielts_score = null;
    }

    const { error } = await updateProfile(updates);
    setSaving(false);
    
    if (error) {
      toast.error("Ошибка при сохранении");
    } else {
      toast.success("Результаты сохранены!");
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Вы вышли из аккаунта");
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
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container max-w-lg mx-auto">
          <h1 className="text-xl font-bold">Настройки</h1>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="gamification-card animate-slide-up">
          <h2 className="font-semibold mb-4">Профиль</h2>
          
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full rounded-2xl object-cover" 
                />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Загрузить
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Shuffle className="w-4 h-4" />
                Случайно
              </Button>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="h-12 rounded-xl"
            />
          </div>

          <Button 
            onClick={handleSave}
            className="w-full mt-4 bg-foreground text-background hover:bg-foreground/90"
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить"}
          </Button>
        </div>

        {/* Language Card */}
        <div className="gamification-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-semibold mb-4">Язык</h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`chip flex items-center gap-2 ${
                  selectedLang === lang.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {selectedLang === lang.code && <Check className="w-4 h-4" />}
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test Scores Card */}
        <div className="gamification-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <h2 className="font-semibold mb-4">Результаты тестов</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sat">SAT Score</Label>
              <Input
                id="sat"
                type="number"
                placeholder="1600"
                className="h-12 rounded-xl"
                max={1600}
                min={400}
                value={satScore}
                onChange={(e) => setSatScore(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ielts">IELTS Score</Label>
              <Input
                id="ielts"
                type="number"
                placeholder="9.0"
                className="h-12 rounded-xl"
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
            className="w-full mt-4"
            onClick={handleSaveScores}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить результаты"}
          </Button>
        </div>

        {/* Logout */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
