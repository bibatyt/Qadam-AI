import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  streak: number;
  last_active_date: string;
  sat_score: number | null;
  ielts_score: number | null;
  target_university: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: new Error("No user or profile") };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;
      
      setProfile({ ...profile, ...updates });
      return { error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error };
    }
  };

  const addXP = async (amount: number) => {
    if (!profile) return;

    const newXP = profile.xp + amount;
    const xpPerLevel = 100;
    const newLevel = Math.floor(newXP / xpPerLevel) + 1;

    const { error } = await updateProfile({
      xp: newXP,
      level: newLevel,
    });

    if (!error && newLevel > profile.level) {
      toast.success(`🎉 Уровень ${newLevel}!`);
    }
  };

  const removeXP = async (amount: number) => {
    if (!profile) return;

    const newXP = Math.max(0, profile.xp - amount);
    const xpPerLevel = 100;
    const newLevel = Math.floor(newXP / xpPerLevel) + 1;

    await updateProfile({
      xp: newXP,
      level: newLevel,
    });
  };

  const updateStreak = async () => {
    if (!profile) return;

    const today = new Date().toISOString().split("T")[0];
    const lastActive = profile.last_active_date;

    if (lastActive === today) return; // Already updated today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const newStreak = lastActive === yesterdayStr ? profile.streak + 1 : 1;

    await updateProfile({
      streak: newStreak,
      last_active_date: today,
    });

    if (newStreak > profile.streak) {
      toast.success(`🔥 ${newStreak} дней подряд!`);
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    addXP,
    removeXP,
    updateStreak,
    refetch: fetchProfile,
  };
}
