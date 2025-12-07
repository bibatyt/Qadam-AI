import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";
import { toast } from "sonner";

type Language = "ru" | "en" | "kk";

interface Quest {
  id: string;
  quest_title: string;
  completed: boolean;
  xp_reward: number;
  quest_date: string;
}

interface QuestItem {
  title: { ru: string; en: string; kk: string };
  xp: number;
}

const IELTS_QUESTS: QuestItem[] = [
  { title: { ru: "Прослушать 1 аудио IELTS Listening", en: "Listen to 1 IELTS Listening audio", kk: "1 IELTS Listening аудио тыңдау" }, xp: 15 },
  { title: { ru: "Прочитать 1 текст IELTS Reading", en: "Read 1 IELTS Reading passage", kk: "1 IELTS Reading мәтін оқу" }, xp: 15 },
  { title: { ru: "Написать IELTS эссе (250 слов)", en: "Write an IELTS essay (250 words)", kk: "IELTS эссе жазу (250 сөз)" }, xp: 25 },
  { title: { ru: "Выучить 10 новых слов для IELTS", en: "Learn 10 new IELTS words", kk: "10 жаңа IELTS сөздерін үйрену" }, xp: 10 },
  { title: { ru: "Пройти Speaking практику", en: "Practice Speaking section", kk: "Speaking бөлімін жаттығу" }, xp: 20 },
];

const SAT_QUESTS: QuestItem[] = [
  { title: { ru: "Решить 5 задач SAT Math", en: "Solve 5 SAT Math problems", kk: "5 SAT Math есебін шығару" }, xp: 15 },
  { title: { ru: "Пройти SAT Reading тест", en: "Complete SAT Reading test", kk: "SAT Reading тестін өту" }, xp: 20 },
  { title: { ru: "Выполнить SAT Writing секцию", en: "Complete SAT Writing section", kk: "SAT Writing бөлімін орындау" }, xp: 15 },
  { title: { ru: "Разобрать ошибки SAT теста", en: "Review SAT test mistakes", kk: "SAT тест қателерін талдау" }, xp: 10 },
  { title: { ru: "Решить 3 задачи на алгебру", en: "Solve 3 algebra problems", kk: "3 алгебра есебін шығару" }, xp: 15 },
];

const GENERAL_QUESTS: QuestItem[] = [
  { title: { ru: "Прочитать статью об университетах", en: "Read an article about universities", kk: "Университеттер туралы мақала оқу" }, xp: 10 },
  { title: { ru: "Написать 100 слов для эссе", en: "Write 100 words for essay", kk: "Эссе үшін 100 сөз жазу" }, xp: 20 },
  { title: { ru: "Изучить требования 1 университета", en: "Research 1 university requirements", kk: "1 университеттің талаптарын зерттеу" }, xp: 15 },
];

const getRandomQuests = (language: Language) => {
  const getTitle = (quest: QuestItem) => quest.title[language] || quest.title.ru;
  
  const allQuests = [
    ...IELTS_QUESTS.sort(() => Math.random() - 0.5).slice(0, 1).map(q => ({ title: getTitle(q), xp: q.xp })),
    ...SAT_QUESTS.sort(() => Math.random() - 0.5).slice(0, 1).map(q => ({ title: getTitle(q), xp: q.xp })),
    ...GENERAL_QUESTS.sort(() => Math.random() - 0.5).slice(0, 1).map(q => ({ title: getTitle(q), xp: q.xp })),
  ];
  return allQuests;
};

export function useDailyQuests() {
  const { user } = useAuth();
  const { addXP, removeXP, profile } = useProfile();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const language = (profile?.language as Language) || "ru";

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
        // Create random quests for today in user's language
        const randomQuests = getRandomQuests(language);
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
      } else {
        await removeXP(quest.xp_reward);
        toast.info(`-${quest.xp_reward} XP`);
      }
    } catch (error) {
      console.error("Error toggling quest:", error);
      toast.error("Ошибка при обновлении задания");
    }
  };

  return { quests, loading, toggleQuest, refetch: fetchOrCreateQuests };
}
