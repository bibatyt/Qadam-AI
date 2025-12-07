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

const IELTS_QUESTS = [
  { title: "Прослушать 1 аудио IELTS Listening", xp: 15 },
  { title: "Прочитать 1 текст IELTS Reading", xp: 15 },
  { title: "Написать IELTS эссе (250 слов)", xp: 25 },
  { title: "Выучить 10 новых слов для IELTS", xp: 10 },
  { title: "Пройти Speaking практику", xp: 20 },
];

const SAT_QUESTS = [
  { title: "Решить 5 задач SAT Math", xp: 15 },
  { title: "Пройти SAT Reading тест", xp: 20 },
  { title: "Выполнить SAT Writing секцию", xp: 15 },
  { title: "Разобрать ошибки SAT теста", xp: 10 },
  { title: "Решить 3 задачи на алгебру", xp: 15 },
];

const GENERAL_QUESTS = [
  { title: "Прочитать статью об университетах", xp: 10 },
  { title: "Написать 100 слов для эссе", xp: 20 },
  { title: "Изучить требования 1 университета", xp: 15 },
];

const getRandomQuests = () => {
  const allQuests = [
    ...IELTS_QUESTS.sort(() => Math.random() - 0.5).slice(0, 1),
    ...SAT_QUESTS.sort(() => Math.random() - 0.5).slice(0, 1),
    ...GENERAL_QUESTS.sort(() => Math.random() - 0.5).slice(0, 1),
  ];
  return allQuests;
};

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
        // Create random quests for today
        const randomQuests = getRandomQuests();
        const newQuests = randomQuests.map((q) => ({
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
