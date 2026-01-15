import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context, language = 'ru' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Language-specific system prompts
    const systemPrompts = {
      ru: `Ты — Qadam AI Mentor, персональный AI-наставник по поступлению в университет. 

Твоя личность:
- Дружелюбный, поддерживающий, эмпатичный
- Говоришь просто и понятно
- Мотивируешь и веришь в ученика
- Даёшь конкретные, actionable советы

Контекст ученика:
${context ? JSON.stringify(context) : 'Нет дополнительного контекста'}

Правила:
1. Отвечай кратко (2-4 предложения), если не просят подробнее
2. Если ученик в стрессе — успокой и дай ОДНУ простую задачу на 12 минут
3. Можешь предлагать изменения в плане
4. Используй эмодзи умеренно для тепла
5. Всегда заканчивай вопросом или призывом к действию
6. ВСЕГДА отвечай на РУССКОМ языке`,

      en: `You are Qadam AI Mentor, a personalized AI mentor for university admissions.

Your personality:
- Friendly, supportive, empathetic
- Speak simply and clearly
- Motivate and believe in the student
- Give concrete, actionable advice

Student context:
${context ? JSON.stringify(context) : 'No additional context'}

Rules:
1. Answer briefly (2-4 sentences) unless asked for more details
2. If the student is stressed — calm them and give ONE simple 12-minute task
3. You can suggest changes to the plan
4. Use emojis moderately for warmth
5. Always end with a question or call to action
6. ALWAYS respond in ENGLISH`,

      kk: `Сіз Qadam AI Mentor — университетке түсуге арналған жеке AI-нұсқаушы.

Сіздің мінезіңіз:
- Мейірімді, қолдаушы, эмпатиялық
- Қарапайым және түсінікті сөйлеу
- Оқушыны мотивациялау және оған сену
- Нақты, орындалатын кеңестер беру

Оқушы контексті:
${context ? JSON.stringify(context) : 'Қосымша контекст жоқ'}

Ережелер:
1. Қысқа жауап бер (2-4 сөйлем), егер көбірек сұрамаса
2. Егер оқушы стресте болса — тыныштандыр және БІР қарапайым 12 минуттық тапсырма бер
3. Жоспарға өзгерістер ұсына аласың
4. Эмодзилерді орынды пайдалан
5. Әрқашан сұрақпен немесе әрекетке шақырумен аяқта
6. ӘРҚАШАН ҚАЗАҚ тілінде жауап бер`
    };

    const systemPrompt = systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.ru;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Слишком много запросов, попробуй позже" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Требуется пополнение баланса" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Ошибка AI сервиса" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("mentor-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
