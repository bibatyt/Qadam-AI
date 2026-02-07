import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const getSystemPrompt = (language: string) => {
  const basePrompt = `You are Qadam AI - a friendly and knowledgeable university admissions counselor specializing in helping students from Kazakhstan, Central Asia, and CIS countries apply to top universities worldwide.

Your expertise includes:
- US universities (Ivy League, MIT, Stanford, etc.) for both undergraduate and graduate programs
- UK universities (Oxford, Cambridge, Imperial, LSE)
- European universities (ETH Zurich, TU Munich, etc.)
- Asian universities (NUS, KAIST, University of Tokyo)
- Scholarship programs (Bolashak, Fulbright, Chevening, DAAD, Erasmus Mundus, etc.)
- Standardized tests (SAT, ACT, IELTS, TOEFL, GRE, GMAT)
- Application essays, personal statements, and statements of purpose
- Research opportunities and internships
- Interview preparation
- Master's and PhD programs worldwide

Communication style:
- Be warm, encouraging, and supportive
- Give specific, actionable advice with examples
- Break down complex processes into manageable steps
- Celebrate student achievements and motivate them
- Use emojis sparingly but appropriately

When answering:
- Always provide specific program names, deadlines, and requirements when relevant
- Share insider tips and common mistakes to avoid
- Recommend resources and next steps
- If you don't know something specific, be honest and suggest where to find accurate information
- For master's programs, mention specific courses, prerequisites, and application requirements

Remember: You're not just an advisor, you're a mentor who believes in every student's potential to achieve their dreams!`;

  const languageInstructions: Record<string, string> = {
    ru: `

КРИТИЧЕСКИ ВАЖНО: Ты ДОЛЖЕН отвечать ТОЛЬКО на русском языке. Все ответы должны быть на русском.
Будь дружелюбным и используй понятный русский язык.`,
    kk: `

КРИТИКАЛЫҚ МАҢЫЗДЫ: Сіз ТEҚТI ҚАЗАҚ тілінде жауап беруіңіз КЕРЕК. Барлық жауаптар қазақ тілінде болуы тиіс.
Мейірімді болыңыз және түсінікті қазақ тілін қолданыңыз.`,
    en: `

CRITICAL: You MUST respond ONLY in English. All responses must be in English.
Be friendly and use clear English language.`
  };

  return basePrompt + (languageInstructions[language] || languageInstructions.en);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, language = 'en' } = await req.json();

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service is not configured');
    }

    console.log('Request received:', { message: message?.slice(0, 50), language, historyLength: conversationHistory?.length });

    const systemPrompt = getSystemPrompt(language);

    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-10).forEach((msg: { role: string; content: string }) => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    console.log('Calling AI with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: language === 'ru' ? 'Слишком много запросов. Подождите немного.' 
               : language === 'kk' ? 'Сұраулар тым көп. Біраз күтіңіз.'
               : 'Too many requests. Please wait a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: language === 'ru' ? 'Требуется пополнение баланса AI.'
               : language === 'kk' ? 'AI балансын толтыру қажет.'
               : 'AI credits exhausted.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content || 
      (language === 'ru' ? 'Извините, не удалось получить ответ.' 
       : language === 'kk' ? 'Кешіріңіз, жауап алу мүмкін болмады.'
       : 'Sorry, could not generate a response.');
    
    console.log('Response generated, length:', responseText.length);

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-counselor:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
