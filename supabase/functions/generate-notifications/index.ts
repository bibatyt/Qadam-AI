import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const motivationalMessages = {
  ru: [
    { title: "Ты справишься! 💪", message: "Каждый день — это шаг к твоей мечте. Продолжай двигаться вперёд!" },
    { title: "Верь в себя! ⭐", message: "Великие достижения начинаются с веры в свои силы. Ты можешь больше, чем думаешь!" },
    { title: "Не сдавайся! 🚀", message: "Сложности — это возможности для роста. Каждое препятствие делает тебя сильнее!" },
    { title: "Ты на верном пути! 🎯", message: "Твоя цель становится ближе с каждым выполненным заданием!" },
    { title: "Вдохновение дня! ✨", message: "Успех приходит к тем, кто не боится пробовать. Сегодня твой день!" },
  ],
  en: [
    { title: "You've got this! 💪", message: "Every day is a step towards your dream. Keep moving forward!" },
    { title: "Believe in yourself! ⭐", message: "Great achievements start with believing in your abilities. You can do more than you think!" },
    { title: "Don't give up! 🚀", message: "Challenges are opportunities for growth. Every obstacle makes you stronger!" },
    { title: "You're on the right track! 🎯", message: "Your goal is getting closer with each completed task!" },
    { title: "Inspiration of the day! ✨", message: "Success comes to those who aren't afraid to try. Today is your day!" },
  ]
};

const microTasks = {
  ru: [
    { title: "Мини-задача", message: "Потрать 5 минут на повторение 10 новых английских слов 📚" },
    { title: "Быстрое задание", message: "Напиши один абзац своего эссе — всего 5 предложений! ✍️" },
    { title: "Маленький шаг", message: "Изучи требования одного университета из твоего списка 🎓" },
    { title: "Практика", message: "Реши 3 задачи по математике SAT — займёт 10 минут ⏱️" },
    { title: "Исследование", message: "Найди информацию об одной стипендии сегодня 💰" },
  ],
  en: [
    { title: "Mini-task", message: "Spend 5 minutes reviewing 10 new English words 📚" },
    { title: "Quick task", message: "Write one paragraph of your essay — just 5 sentences! ✍️" },
    { title: "Small step", message: "Study the requirements of one university from your list 🎓" },
    { title: "Practice", message: "Solve 3 SAT math problems — takes 10 minutes ⏱️" },
    { title: "Research", message: "Find information about one scholarship today 💰" },
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get user profile for language
    const { data: profile } = await supabase
      .from('profiles')
      .select('language')
      .eq('user_id', user_id)
      .single();

    const lang = profile?.language === 'en' ? 'en' : 'ru';

    // Get user's roadmap tasks for deadline notifications
    const { data: tasks } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .eq('user_id', user_id)
      .eq('completed', false)
      .order('month_index', { ascending: true })
      .limit(5);

    // Get user's progress stats
    const { data: completedTasks } = await supabase
      .from('roadmap_tasks')
      .select('id')
      .eq('user_id', user_id)
      .eq('completed', true);

    const { data: totalTasks } = await supabase
      .from('roadmap_tasks')
      .select('id')
      .eq('user_id', user_id);

    const completedCount = completedTasks?.length || 0;
    const totalCount = totalTasks?.length || 0;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Generate AI-powered personalized notification if API key available
    let aiNotification = null;
    if (LOVABLE_API_KEY && tasks && tasks.length > 0) {
      try {
        const prompt = lang === 'ru' 
          ? `Создай короткое мотивационное уведомление для студента, который готовится к поступлению в университет. 
             Его ближайшая задача: "${tasks[0].task_title}". 
             Прогресс: ${progressPercent}% выполнено.
             Ответь в формате JSON: {"title": "заголовок до 30 символов", "message": "сообщение до 100 символов"}`
          : `Create a short motivational notification for a student preparing for university admission.
             Their next task: "${tasks[0].task_title}".
             Progress: ${progressPercent}% completed.
             Reply in JSON format: {"title": "title up to 30 chars", "message": "message up to 100 chars"}`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are a helpful assistant that creates motivational notifications. Always respond with valid JSON." },
              { role: "user", content: prompt }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content;
          if (content) {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              aiNotification = JSON.parse(jsonMatch[0]);
            }
          }
        }
      } catch (e) {
        console.error("AI notification generation failed:", e);
      }
    }

    const notifications = [];

    // Add AI notification or random motivation
    if (aiNotification) {
      notifications.push({
        user_id,
        type: 'motivation',
        title: aiNotification.title,
        message: aiNotification.message,
      });
    } else {
      const randomMotivation = motivationalMessages[lang][Math.floor(Math.random() * motivationalMessages[lang].length)];
      notifications.push({
        user_id,
        type: 'motivation',
        title: randomMotivation.title,
        message: randomMotivation.message,
      });
    }

    // Add deadline notification if there are tasks
    if (tasks && tasks.length > 0) {
      const nextTask = tasks[0];
      notifications.push({
        user_id,
        type: 'deadline',
        title: lang === 'ru' ? '⏰ Ближайшая задача' : '⏰ Upcoming Task',
        message: nextTask.task_title,
        action_url: '/path',
        metadata: { task_id: nextTask.id }
      });
    }

    // Add micro-task
    const randomMicroTask = microTasks[lang][Math.floor(Math.random() * microTasks[lang].length)];
    notifications.push({
      user_id,
      type: 'micro_task',
      title: randomMicroTask.title,
      message: randomMicroTask.message,
    });

    // Add progress notification
    if (totalCount > 0) {
      notifications.push({
        user_id,
        type: 'progress',
        title: lang === 'ru' ? '📊 Твой прогресс' : '📊 Your Progress',
        message: lang === 'ru' 
          ? `Ты выполнил ${completedCount} из ${totalCount} задач (${progressPercent}%). Отлично!`
          : `You completed ${completedCount} of ${totalCount} tasks (${progressPercent}%). Great!`,
        action_url: '/path',
        metadata: { completed: completedCount, total: totalCount, percent: progressPercent }
      });
    }

    // Insert notifications
    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('Error inserting notifications:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generated ${notifications.length} notifications for user ${user_id}`);

    return new Response(
      JSON.stringify({ success: true, count: notifications.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-notifications:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
