import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, User, Check, LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";


type Language = "ru" | "en" | "kk";

const translations = {
  ru: {
    title: "Настройки",
    profile: "Профиль",
    name: "Имя",
    namePlaceholder: "Введите ваше имя",
    avatar: "Фото профиля",
    changeAvatar: "Изменить фото",
    save: "Сохранить",
    saving: "Сохранение...",
    saved: "Сохранено",
    error: "Ошибка",
    back: "Назад",
    logout: "Выйти из аккаунта",
    logoutConfirm: "Вы уверены, что хотите выйти?",
    logoutCancel: "Отмена",
    logoutAction: "Выйти",
    generateAvatar: "Случайный аватар",
    leaveFeedback: "Оставить отзыв",
  },
  en: {
    title: "Settings",
    profile: "Profile",
    name: "Name",
    namePlaceholder: "Enter your name",
    avatar: "Profile photo",
    changeAvatar: "Change photo",
    save: "Save",
    saving: "Saving...",
    saved: "Saved",
    error: "Error",
    back: "Back",
    logout: "Log out",
    logoutConfirm: "Are you sure you want to log out?",
    logoutCancel: "Cancel",
    logoutAction: "Log out",
    generateAvatar: "Random avatar",
    leaveFeedback: "Leave feedback",
  },
  kk: {
    title: "Баптаулар",
    profile: "Профиль",
    name: "Аты",
    namePlaceholder: "Атыңызды енгізіңіз",
    avatar: "Профиль суреті",
    changeAvatar: "Суретті өзгерту",
    save: "Сақтау",
    saving: "Сақталуда...",
    saved: "Сақталды",
    error: "Қате",
    back: "Артқа",
    logout: "Аккаунттан шығу",
    logoutConfirm: "Шығуды қалайсыз ба?",
    logoutCancel: "Болдырмау",
    logoutAction: "Шығу",
    generateAvatar: "Кездейсоқ аватар",
    leaveFeedback: "Пікір қалдыру",
  },
};

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setName(data.name || "");
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ name, avatar_url: avatarUrl })
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success(t.saved);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(t.error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Только изображения");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Макс. размер 2MB");
      return;
    }

    setSaving(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(urlData.publicUrl + `?t=${Date.now()}`);
      toast.success(t.saved);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(t.error);
    } finally {
      setSaving(false);
    }
  };

  const generateRandomAvatar = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const seed = Math.random().toString(36).substring(7);
      const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
      setAvatarUrl(newAvatarUrl);
      toast.success(t.saved);
    } catch (error) {
      console.error("Error generating avatar:", error);
      toast.error(t.error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{t.title}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            {t.avatar}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/20">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl"
              >
                {t.changeAvatar}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateRandomAvatar}
                className="rounded-xl text-muted-foreground"
              >
                {t.generateAvatar}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Name Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            {t.name}
          </h2>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="rounded-xl h-12"
          />
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            className="w-full h-12 rounded-xl text-base font-medium"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.saving}
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t.save}
              </>
            )}
          </Button>
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl text-base font-medium"
            onClick={() => navigate("/feedback?return=/settings")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t.leaveFeedback}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl text-base font-medium text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t.logout}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.logout}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.logoutConfirm}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.logoutCancel}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await signOut();
                    navigate("/student-onboarding", { replace: true });
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t.logoutAction}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </main>
    </div>
  );
}
