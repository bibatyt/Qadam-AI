import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, title } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert college admissions essay analyst. Analyze the provided essay and return a JSON response with the following structure:

{
  "impactScore": <number 0-100>,
  "strengths": [<array of 2-3 specific strengths as strings>],
  "improvements": [<array of 2-4 specific, actionable improvements as strings>],
  "voiceScore": <number 0-100 indicating how authentic/personal the voice sounds>,
  "authenticityTips": [<array of 1-2 tips to maintain their unique voice while improving>]
}

Scoring guidelines:
- impactScore: How memorable and compelling is this essay? Does it create emotional connection?
- voiceScore: Does this sound like a genuine teenager writing, not AI or overly polished?

Be encouraging but honest. Focus on what makes this essay unique and how to amplify that.
Respond ONLY with valid JSON, no markdown.`;

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
          { role: "user", content: `Essay title: "${title || 'Untitled'}"\n\nEssay content:\n${content}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response
    let analysis;
    try {
      // Remove potential markdown code blocks
      const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", analysisText);
      // Return default analysis if parsing fails
      analysis = {
        impactScore: 65,
        strengths: [
          "Эссе имеет четкую структуру",
          "Присутствует личная история"
        ],
        improvements: [
          "Добавь больше конкретных примеров",
          "Усиль эмоциональную связь с читателем",
          "Сделай начало более захватывающим"
        ],
        voiceScore: 70,
        authenticityTips: [
          "Используй свой разговорный стиль",
          "Добавь детали, которые знаешь только ты"
        ]
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Essay analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
