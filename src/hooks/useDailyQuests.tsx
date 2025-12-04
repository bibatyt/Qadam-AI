import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";
import { toast } from "sonner";

interface Quest {
  id: string;
  quest_title: string;
  completed: boolean;
  xp_reward: number;
  quest_date: string;
}

const DEFAULT_QUESTS = [
  { title: "Прочитать 1 статью об университетах", xp: 10 },
  { title: "Пройти мини-тест по английскому", xp: 15 },
  { title: "Написать 100 слов для эссе", xp: 20 },
];

export function useDailyQuests() {
  const { user } = useAuth();
  const { addXP } = useProfile();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrCreateQuests = async () => {
    if (!user) {
      setQuests([]);
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      // Fetch today's quests
      const { data: existingQuests, error: fetchError } = await supabase
        .from("daily_quests")
        .select("*")
        .eq("user_id", user.id)
        .eq("quest_date", today);

      if (fetchError) throw fetchError;

      if (existingQuests && existingQuests.length > 0) {
        setQuests(existingQuests);
      } else {
        // Create default quests for today
        const newQuests = DEFAULT_QUESTS.map((q) => ({
          user_id: user.id,
          quest_title: q.title,
          xp_reward: q.xp,
          quest_date: today,
          completed: false,
        }));

        const { data: createdQuests, error: createError } = await supabase
          .from("daily_quests")
          .insert(newQuests)
          .select();

        if (createError) throw createError;
        setQuests(createdQuests || []);
      }
    } catch (error) {
      console.error("Error fetching quests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrCreateQuests();
  }, [user]);

  const toggleQuest = async (questId: string, currentCompleted: boolean) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    try {
      const newCompleted = !currentCompleted;
      
      const { error } = await supabase
        .from("daily_quests")
        .update({ completed: newCompleted })
        .eq("id", questId);

      if (error) throw error;

      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId ? { ...q, completed: newCompleted } : q
        )
      );

      if (newCompleted) {
        await addXP(quest.xp_reward);
        toast.success(`+${quest.xp_reward} XP! 🎉`);
      }
    } catch (error) {
      console.error("Error toggling quest:", error);
      toast.error("Ошибка при обновлении задания");
    }
  };

  return { quests, loading, toggleQuest, refetch: fetchOrCreateQuests };
}
