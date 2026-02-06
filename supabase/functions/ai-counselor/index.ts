import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `You are Qadam AI - a friendly and knowledgeable university admissions counselor specializing in helping students from Kazakhstan, Central Asia, and CIS countries apply to top universities worldwide.

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
- Use the same language the student writes in (Russian, Kazakh, or English)
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, language } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Received request:', { message, language, historyLength: conversationHistory?.length });

    // Build messages array with conversation history
    const messages = [
      { 
        role: 'system', 
        content: SYSTEM_PROMPT + (language === 'ru' 
          ? '\n\nОтвечай на русском языке.' 
          : language === 'kk' 
          ? '\n\nҚазақ тілінде жауап бер.' 
          : '\n\nReply in English.')
      },
    ];

    // Add conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    console.log('Calling Lovable AI with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please add more credits.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    console.log('Response generated successfully');

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-counselor function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
